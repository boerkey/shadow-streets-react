import React, {useRef, useState} from "react";
import {FlatList, Platform, View} from "react-native";

import {useDispatch, useSelector} from "react-redux";

import {itemApis, propertyApis} from "@apis/index.ts";
import {colors, gapSize} from "@assets/index.ts";
import {
    Header,
    Prompt,
    ScreenContainer,
    TabSelector,
    TitleHeader,
} from "@components/index.ts";
import {
    ArmorItem,
    ConsumableItem,
    GoodsItem,
    HelmetItem,
    ItemType,
    MaterialItem,
    WeaponItem,
} from "@interfaces/GameInterface.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {authActions} from "@redux/actions";
import {RootState} from "@redux/index.ts";
import Item from "@screens/inventory/Item.tsx";
import ItemDetails from "@screens/inventory/ItemDetails.tsx";
import {showToast} from "@utils/helperFunctions.ts";
import {scaledValue, SCREEN_HEIGHT, strings} from "@utils/index.ts";
import {navigate, SCREEN_NAMES} from "../../router.tsx";
import ItemDisassembleModal from "./ItemDisassembleModal.tsx";
import ItemRepairModal from "./ItemRepairModal.tsx";
import ItemReRollModal from "./ItemReRollModal.tsx";

enum DropdownOptions {
    Upgrade = 1,
    Sell = 2,
    Delete = 3,
    Repair = 4,
    Favorite = 5,
    Reroll = 6,
}

const Inventory = () => {
    const dispatch = useDispatch();
    const gameItems = useSelector((state: RootState) => state.game.gameItems);
    const user = useSelector((state: RootState) => state.auth.user);
    const favoriteItems = useSelector(
        (state: RootState) => state.auth.favoriteItems,
    );
    const [selectedItemId, setSelectedItemId] = useState(getItemUniqueId(null));
    const [selectedFilter, setSelectedFilter] = useState(0);
    const [selectedFilterIndex, setSelectedFilterIndex] = useState(0);
    const [deletePromptVisible, setDeletePromptVisible] = useState(false);
    const [
        repairOrDisassembleModalVisible,
        setRepairOrDisassembleModalVisible,
    ] = useState(0);
    const [rerollModalVisible, setRerollModalVisible] = useState(false);
    const flatlistRef = useRef<FlatList>(null);
    const selectedItem = getItemList().find(
        each => getItemUniqueId(each) === selectedItemId,
    );
    const selectedItemData = getItemData(selectedItem);

    // Function to generate a unique ID from item type and ID
    function getItemUniqueId(item: any): string {
        if (!item) return "";
        return `${item.type}_${item.id}`;
    }

    function getItemList() {
        const list = [
            ...user?.items_consumables,
            ...user?.items_goods,
            ...user?.items_weapons,
            ...user?.items_armors,
            ...user?.items_materials,
            ...user?.items_helmets,
        ];
        if (selectedFilter === 99) {
            const equippedWeapon = user?.items_weapons.find(
                each => each.is_equipped,
            );
            const equippedArmor = user?.items_armors.find(
                each => each.is_equipped,
            );
            const equippedHelmet = user?.items_helmets.find(
                each => each.is_equipped,
            );
            const filteredList = list.filter(each => {
                return favoriteItems.some(
                    item => item.id === each.id && item.type === each.type,
                );
            });

            // Create a set to track items we've already added to prevent duplicates
            const addedItems = new Set<string>();
            const result: any[] = [];

            // Add favorite items first
            filteredList.forEach(item => {
                const uniqueKey = `${item.id}-${item.type}`;
                if (!addedItems.has(uniqueKey)) {
                    result.push(item);
                    addedItems.add(uniqueKey);
                }
            });

            // Add equipped items only if they're not already in the list
            [equippedWeapon, equippedArmor, equippedHelmet].forEach(item => {
                if (item) {
                    const uniqueKey = `${item.id}-${item.type}`;
                    if (!addedItems.has(uniqueKey)) {
                        result.push(item);
                        addedItems.add(uniqueKey);
                    }
                }
            });

            return result;
        }

        if (selectedFilter == 0) {
            // For "All" filter: Sort by type first, then by item_id, then by instance id for stability
            return list.sort((a, b) => {
                // Primary sort: by type (to group similar items together)
                if (a.type !== b.type) {
                    return a.type - b.type;
                }

                // Secondary sort: by item_id (game item template) for consistent grouping
                if (a.item_id !== b.item_id) {
                    return b.item_id - a.item_id; // Higher item_id first (newer items)
                }

                // Tertiary sort: by instance id for stability when items have same template
                return b.id - a.id; // Higher id first (newer instances)
            });
        }

        // For specific type filters
        const filteredList = list.filter(each => each.type === selectedFilter);

        // Check if this item type can be equipped (weapons and armors)
        const canBeEquipped =
            selectedFilter === ItemType.Weapon ||
            selectedFilter === ItemType.Armor ||
            selectedFilter === ItemType.Helmet;

        if (canBeEquipped) {
            // For equippable items: Show equipped first, but maintain stable order within each group
            return filteredList.sort((a, b) => {
                // Primary sort: equipped status (equipped items first)
                const aEquipped = a.is_equipped || false;
                const bEquipped = b.is_equipped || false;

                if (aEquipped !== bEquipped) {
                    return bEquipped ? 1 : -1; // Equipped items first
                }

                // Secondary sort: by item_id for consistent grouping within equipped/unequipped
                if (a.item_id !== b.item_id) {
                    return b.item_id - a.item_id; // Higher item_id first
                }

                // Tertiary sort: by quality/grade for better organization
                if (a.quality !== b.quality) {
                    return b.quality - a.quality; // Higher quality first
                }

                if (a.grade !== b.grade) {
                    return b.grade - a.grade; // Higher grade first
                }

                // Final sort: by instance id for stability
                return b.id - a.id;
            });
        } else {
            // For non-equippable items: Sort by item_id, then by amount, then by instance id
            return filteredList.sort((a, b) => {
                // Primary sort: by item_id for consistent grouping
                if (a.item_id !== b.item_id) {
                    return b.item_id - a.item_id; // Higher item_id first
                }

                // Secondary sort: by amount (higher amounts first for stackable items)
                if (a.amount !== b.amount) {
                    return b.amount - a.amount;
                }

                // Final sort: by instance id for stability
                return b.id - a.id;
            });
        }
    }

    function renderItem(item) {
        const isSelected = selectedItemId === getItemUniqueId(item);
        return (
            <Item
                item={item}
                isSelected={isSelected}
                onPress={() => {
                    if (isSelected) {
                        return setSelectedItemId(getItemUniqueId(null));
                    }
                    setSelectedItemId(getItemUniqueId(item));
                    flatlistRef.current?.scrollToItem({
                        animated: true,
                        item,
                    });
                }}
            />
        );
    }

    const _itemRenderer = ({item, index}) => renderItem(item, index);
    const _keyExtractor = (item, index) => index.toString();

    function getItemData(item) {
        if (!item) return null;
        switch (item.type) {
            case ItemType.Weapon:
                return gameItems.weapons.find(
                    each => each.id === item.item_id,
                ) as WeaponItem;
            case ItemType.Armor:
                return gameItems?.armors?.find(
                    each => each.id === item.item_id,
                ) as ArmorItem;
            case ItemType.Consumable:
                return gameItems?.consumables?.find(
                    each => each.id === item.item_id,
                ) as ConsumableItem;
            case ItemType.Goods:
                return gameItems?.goods?.find(
                    each => each.id === item.item_id,
                ) as GoodsItem;
            case ItemType.Material:
                return gameItems?.materials?.find(
                    each => each.id === item.item_id,
                ) as MaterialItem;
            case ItemType.Helmet:
                return gameItems?.helmets?.find(
                    each => each.id === item.item_id,
                ) as HelmetItem;
            default:
                return null;
        }
    }

    function getDropdownOptions(item) {
        const canDisassemble =
            getItemData(item)?.materials_to_yield_on_destroy?.length > 0;
        const isFavorite = favoriteItems.some(
            each => each.id === item.id && each.type === item.type,
        );
        const isEquippableItem =
            item.type === ItemType.Weapon ||
            item.type === ItemType.Armor ||
            item.type === ItemType.Helmet;
        if (isEquippableItem) {
            return [
                {
                    name: strings.common.upgrade,
                    textColor: colors.green,
                    id: DropdownOptions.Upgrade,
                },
                {
                    name: isFavorite
                        ? strings.inventory.removeFromFavorite
                        : strings.inventory.addToFavorite,
                    id: DropdownOptions.Favorite,
                    textColor: isFavorite ? colors.orange : colors.green,
                },
                {
                    name: strings.common.repair,
                    id: DropdownOptions.Repair,
                },
                {
                    name: strings.common.sell,
                    id: DropdownOptions.Sell,
                },
                {
                    name: strings.common.reroll,
                    textColor: colors.orange,
                    id: DropdownOptions.Reroll,
                },
                {
                    name: canDisassemble
                        ? strings.common.disassemble
                        : strings.common.delete,
                    textColor: colors.red,
                    id: DropdownOptions.Delete,
                },
            ];
        }
        return [
            {
                name: isFavorite
                    ? strings.inventory.removeFromFavorite
                    : strings.inventory.addToFavorite,
                id: DropdownOptions.Favorite,
                textColor: isFavorite ? colors.orange : colors.green,
            },
            {
                name: strings.common.sell,
                id: DropdownOptions.Sell,
            },
            {
                name: canDisassemble
                    ? strings.common.disassemble
                    : strings.common.delete,
                textColor: colors.red,
                id: DropdownOptions.Delete,
            },
        ];
    }

    function handleSelectedDropdownOption(id: number) {
        const canDisassemble =
            selectedItemData?.materials_to_yield_on_destroy?.length > 0;
        if (id === DropdownOptions.Upgrade) {
            navigate(SCREEN_NAMES.UPGRADE_ITEM, {
                item: selectedItem,
            });
        } else if (id === DropdownOptions.Sell) {
            findPropertyToSellItem();
        } else if (id === DropdownOptions.Delete) {
            if (canDisassemble) {
                setRepairOrDisassembleModalVisible(2);
            } else {
                setDeletePromptVisible(true);
            }
        } else if (id === DropdownOptions.Repair) {
            setRepairOrDisassembleModalVisible(1);
        } else if (id === DropdownOptions.Favorite) {
            addOrRemoveFromFavorites(selectedItem.id, selectedItem.type);
        } else if (id === DropdownOptions.Reroll) {
            setRerollModalVisible(true);
        }
    }

    function addOrRemoveFromFavorites(id: number, type: ItemType) {
        const isFavorite = favoriteItems.some(
            (each: {id: number; type: ItemType}) =>
                each.id === id && each.type === type,
        );

        let updatedFavorites: {id: number; type: ItemType}[];

        if (isFavorite) {
            // Remove from favorites - filter out the item that matches both id AND type
            updatedFavorites = favoriteItems.filter(
                (each: {id: number; type: ItemType}) =>
                    !(each.id === id && each.type === type),
            );
        } else {
            // Add to favorites
            updatedFavorites = [...favoriteItems, {id, type}];
        }

        // Update Redux state
        dispatch(authActions.setFavoriteItems(updatedFavorites));

        // Save to AsyncStorage with the updated state
        AsyncStorage.setItem("favoriteItems", JSON.stringify(updatedFavorites));
    }

    function handleDeleteItem() {
        itemApis.deleteItem(selectedItem.id, selectedItem.type).then(res => {
            showToast(res.data.message);
            dispatch(authActions.getUser());
        });
    }

    function findPropertyToSellItem() {
        propertyApis
            .findPropertyToSellItem(selectedItem.item_id, selectedItem.type)
            .then(res => {
                navigate(SCREEN_NAMES.PROPERTY_DETAILS, {
                    id: res.data.property_id,
                    preSelectedItem: selectedItem,
                });
            });
    }

    return (
        <ScreenContainer>
            <ItemRepairModal
                isVisible={repairOrDisassembleModalVisible === 1}
                onClose={() => setRepairOrDisassembleModalVisible(0)}
                onRepairCompleted={() => dispatch(authActions.getUser())}
                selectedItem={selectedItem}
            />
            <ItemDisassembleModal
                isVisible={repairOrDisassembleModalVisible === 2}
                onClose={() => setRepairOrDisassembleModalVisible(0)}
                onPress={() => {
                    setRepairOrDisassembleModalVisible(0);
                    handleDeleteItem();
                }}
                requiredMaterials={
                    selectedItemData?.materials_to_yield_on_destroy?.map(
                        each => ({
                            ...each,
                            amount: each.amount * (selectedItem?.amount ?? 1),
                        }),
                    ) || []
                }
            />
            <View
                style={{
                    paddingHorizontal: gapSize.size3L,
                }}>
                <Header
                    isAbsolute={false}
                    showName={false}
                    allowRefresh={true}
                />
                <TitleHeader
                    title={strings.main.inventory}
                    style={{top: gapSize.sizeS, marginBottom: gapSize.sizeL}}
                />
                <TabSelector
                    onSelect={(i, item) => {
                        setSelectedFilter(item.id);
                        setSelectedFilterIndex(i);
                    }}
                    selectedIndex={selectedFilterIndex}
                    items={[
                        {name: strings.common.all, id: 0},
                        {
                            name: strings.inventory.favorites,
                            id: 99,
                        },
                        {
                            name: strings.common.itemTypeNames[
                                ItemType.Consumable
                            ],
                            id: ItemType.Consumable,
                        },
                        {
                            name: strings.common.itemTypeNames[ItemType.Goods],
                            id: ItemType.Goods,
                        },
                        {
                            name: strings.common.itemTypeNames[
                                ItemType.Material
                            ],
                            id: ItemType.Material,
                        },
                        {
                            name: strings.common.itemTypeNames[ItemType.Weapon],
                            id: ItemType.Weapon,
                        },
                        {
                            name: strings.common.itemTypeNames[ItemType.Armor],
                            id: ItemType.Armor,
                        },
                        {
                            name: strings.common.itemTypeNames[ItemType.Helmet],
                            id: ItemType.Helmet,
                        },
                    ]}
                />
                <Prompt
                    isVisible={deletePromptVisible}
                    onClose={() => setDeletePromptVisible(false)}
                    title={strings.common.warning}
                    text={strings.main.selectedItemWillBeDeleted}
                    onConfirm={() => handleDeleteItem()}
                />
                <FlatList
                    showsVerticalScrollIndicator={false}
                    ref={flatlistRef}
                    style={{
                        height:
                            SCREEN_HEIGHT *
                            (selectedItem
                                ? Platform.OS === "ios"
                                    ? 0.45
                                    : 0.42
                                : 0.75),
                    }}
                    contentContainerStyle={{
                        paddingBottom: gapSize.size6L,
                    }}
                    data={getItemList()}
                    renderItem={_itemRenderer}
                    keyExtractor={_keyExtractor}
                    numColumns={3}
                    getItemLayout={(data, index) => ({
                        length: scaledValue(115),
                        offset: scaledValue(115) * index,
                        index,
                    })}
                />
                {selectedItem && (
                    <ItemDetails
                        item={selectedItem}
                        onDropdownOptionSelected={(i, item) =>
                            handleSelectedDropdownOption(item.id)
                        }
                        dropdownOptions={getDropdownOptions(selectedItem)}
                        showAmountSelector={
                            selectedItem.amount > 1 &&
                            selectedItem.type === ItemType.Consumable
                        }
                    />
                )}
                <ItemReRollModal
                    isVisible={rerollModalVisible}
                    onClose={() => setRerollModalVisible(false)}
                    selectedItem={selectedItem}
                    onSuccess={() => {
                        dispatch(authActions.getUser());
                    }}
                />
            </View>
        </ScreenContainer>
    );
};

export default Inventory;
