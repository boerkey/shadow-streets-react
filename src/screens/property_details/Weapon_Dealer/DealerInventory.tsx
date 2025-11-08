import React, {useEffect, useState} from "react";
import {FlatList, TouchableOpacity, View} from "react-native";

import {useDispatch, useSelector} from "react-redux";

import {propertyApis} from "@apis/index.ts";
import {gapSize, images} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {
    AppImage,
    AppText,
    CheckBox,
    RequiredMaterialsView,
} from "@components/index";
import {ArmorItem, WeaponItem} from "@interfaces/GameInterface";
import {authActions} from "@redux/actions";
import {RootState} from "@redux/index";
import Item from "@screens/inventory/Item";
import ItemDetails from "@screens/inventory/ItemDetails";
import {showToast} from "@utils/helperFunctions";
import {
    commonStyles,
    helperFunctions,
    itemHelpers,
    SCREEN_HEIGHT,
    strings,
} from "@utils/index";

import styles from "../styles";

const DealerInventory = ({
    preSelectedItem,
}: {
    preSelectedItem: WeaponItem | ArmorItem | null;
}) => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const gameItems = useSelector((state: RootState) => state.game.gameItems);
    const [selectedItem, setSelectedItem] = useState<
        WeaponItem | ArmorItem | null
    >(null);
    const [moneyPrice, setMoneyPrice] = useState<number>(0);
    const [shadowCoinPrice, setShadowCoinPrice] = useState<number>(0);
    const [selectedItems, setSelectedItems] = useState<
        (WeaponItem | ArmorItem)[]
    >([]);
    const favoriteItems = useSelector(
        (state: RootState) => state.auth.favoriteItems,
    );
    const [isBatchSellEnabled, setIsBatchSellEnabled] =
        useState<boolean>(false);
    const [isBatchDisassembleEnabled, setIsBatchDisassembleEnabled] =
        useState<boolean>(false);

    const dbItem = itemHelpers.getItemByTypeAndId(gameItems, selectedItem);

    useEffect(() => {
        if (preSelectedItem) {
            setSelectedItem(
                getWeaponAndArmorItems().find(
                    item =>
                        item.id === preSelectedItem.id &&
                        item.type === preSelectedItem.type,
                ),
            );
        }
    }, [preSelectedItem]);

    useEffect(() => {
        if (!isBatchDisassembleEnabled) {
            getPriceFromDealer();
        }
    }, [selectedItem]);

    function getPriceFromDealer() {
        if (!selectedItem) return;
        propertyApis
            .getPriceFromDealer(selectedItem?.id, selectedItem?.type)
            .then(res => {
                setMoneyPrice(res.data.money);
                setShadowCoinPrice(res.data.shadow_coin);
            });
    }

    function sellItems() {
        if (!selectedItem) return;
        propertyApis
            .sellItemToDealer(
                isBatchSellEnabled
                    ? selectedItems.map(each => ({
                          user_item_id: each.id,
                          type: each.type,
                      }))
                    : [
                          {
                              user_item_id: selectedItem?.id,
                              type: selectedItem?.type,
                          },
                      ],
            )
            .then(res => {
                setSelectedItem(null);
                setSelectedItems([]);
                showToast(res.data.message);
                dispatch(authActions.getUser());
            });
    }

    function disassembleItems() {
        if (!selectedItem) return;
        propertyApis
            .disassembleItems(
                selectedItems.map(each => ({
                    user_item_id: each.id,
                    type: each.type,
                })),
            )
            .then(res => {
                setSelectedItem(null);
                setSelectedItems([]);
                showToast(res.data.message);
                dispatch(authActions.getUser());
            });
    }

    function getWeaponAndArmorItems() {
        if (isBatchDisassembleEnabled) {
            return [
                ...user?.items_weapons.filter(
                    each => each.is_equipped === false,
                ),
                ...user?.items_armors.filter(
                    each => each.is_equipped === false,
                ),
                ...user?.items_helmets.filter(
                    each => each.is_equipped === false,
                ),
                ...user?.items_goods,
                ...user?.items_materials.filter(
                    each => each.materials_to_yield_on_destroy?.length > 0,
                ),
            ]
                .sort((a, b) => b.item_id - a.item_id)
                .filter(each => {
                    return !favoriteItems.some(
                        item => item.id === each.id && item.type === each.type,
                    );
                });
        }
        return [
            ...user?.items_weapons,
            ...user?.items_armors,
            ...user?.items_helmets,
        ]
            .filter(each => each.is_equipped === false)
            .sort((a, b) => b.item_id - a.item_id)
            .filter(each => {
                return !favoriteItems.some(
                    item => item.id === each.id && item.type === each.type,
                );
            });
    }

    function selectSingleItem(item: WeaponItem | ArmorItem) {
        if (selectedItem?.id === item.id && selectedItem?.type === item.type) {
            return setSelectedItem(null);
        }
        setSelectedItem(item);
    }

    function _renderItem({item}: {item: WeaponItem | ArmorItem}) {
        let isSelected =
            selectedItem?.id === item.id && selectedItem?.type === item.type;
        if (isBatchSellEnabled || isBatchDisassembleEnabled) {
            isSelected = selectedItems.some(
                each => each.id === item.id && each.type === item.type,
            );
        }
        return (
            <Item
                item={item}
                onPress={() => {
                    if (isBatchSellEnabled || isBatchDisassembleEnabled) {
                        if (isSelected) {
                            setSelectedItems(
                                selectedItems.filter(
                                    each =>
                                        !(
                                            each.id === item.id &&
                                            each.type === item.type
                                        ),
                                ),
                            );
                            setSelectedItem(null);
                        } else {
                            setSelectedItem(item);
                            setSelectedItems([...selectedItems, item]);
                        }
                        return;
                    }
                    selectSingleItem(item);
                }}
                isSelected={isSelected}
            />
        );
    }

    return (
        <View style={styles.sectionContainer}>
            <FlatList
                numColumns={3}
                keyExtractor={item => item.id.toString() + item.type}
                data={getWeaponAndArmorItems()}
                renderItem={_renderItem}
                style={{
                    height: selectedItem
                        ? SCREEN_HEIGHT * 0.53
                        : SCREEN_HEIGHT * 0.72,
                }}
                ListHeaderComponent={() => (
                    <View
                        style={[
                            commonStyles.flexRowSpaceBetween,
                            {marginBottom: gapSize.sizeM},
                        ]}>
                        <View>
                            <CheckBox
                                isChecked={isBatchSellEnabled}
                                onPress={() => {
                                    setIsBatchSellEnabled(!isBatchSellEnabled);
                                    setIsBatchDisassembleEnabled(false);
                                    if (isBatchSellEnabled) {
                                        setSelectedItems([]);
                                    }
                                }}
                                text={strings.propertyDetails.batchSell}
                            />
                            <CheckBox
                                isChecked={isBatchDisassembleEnabled}
                                onPress={() => {
                                    setIsBatchDisassembleEnabled(
                                        !isBatchDisassembleEnabled,
                                    );
                                    setSelectedItem(null);
                                    setIsBatchSellEnabled(false);
                                    if (isBatchDisassembleEnabled) {
                                        setSelectedItems([]);
                                    }
                                }}
                                text={strings.propertyDetails.batchDisassemble}
                                style={{marginTop: gapSize.sizeM}}
                            />
                        </View>
                        {(isBatchSellEnabled || isBatchDisassembleEnabled) && (
                            <TouchableOpacity
                                style={[commonStyles.flexRowAlignCenter]}
                                onPress={() => {
                                    const allItems = getWeaponAndArmorItems();
                                    setSelectedItems(allItems);
                                    setSelectedItem(allItems[0]);
                                }}>
                                <AppText
                                    text={strings.propertyDetails.chooseAll}
                                    type={TextTypes.H5}
                                />
                                <AppImage
                                    source={images.icons.blueDot}
                                    size={12}
                                    style={{marginLeft: gapSize.sizeS}}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            />
            {selectedItem && (
                <ItemDetails
                    item={selectedItem}
                    actionButtonText={
                        isBatchSellEnabled
                            ? strings.propertyDetails.sellAll
                            : isBatchDisassembleEnabled
                            ? strings.common.disassemble
                            : strings.common.sell
                    }
                    actionButtonWidth={isBatchDisassembleEnabled ? 150 : 100}
                    onActionButtonPressed={
                        isBatchDisassembleEnabled ? disassembleItems : sellItems
                    }
                    leftComponent={
                        dbItem &&
                        isBatchDisassembleEnabled && (
                            <RequiredMaterialsView
                                requiredMaterials={
                                    dbItem.materials_to_yield_on_destroy
                                }
                                containerStyle={{
                                    top: gapSize.size2L,
                                    left: gapSize.sizeL,
                                }}
                                onlyShowMaterialsInList
                                selectedAmount={selectedItem?.amount ?? 1}
                            />
                        )
                    }
                    leftBottomComponent={
                        !isBatchDisassembleEnabled && (
                            <View
                                style={{
                                    position: "absolute",
                                    bottom: 10,
                                    left: 15,
                                }}>
                                <View style={commonStyles.flexRow}>
                                    <AppImage
                                        source={images.icons.money}
                                        size={20}
                                    />
                                    <AppText
                                        text={`${helperFunctions.renderNumber(
                                            moneyPrice,
                                            1,
                                        )} $`}
                                        style={{marginLeft: gapSize.sizeS}}
                                        type={TextTypes.H5}
                                    />
                                </View>
                                {shadowCoinPrice > 0 && (
                                    <View style={commonStyles.flexRow}>
                                        <AppImage
                                            source={images.icons.shadowCoin}
                                            size={18}
                                        />
                                        <AppText
                                            text={`${shadowCoinPrice} `}
                                            style={{marginLeft: gapSize.sizeS}}
                                            type={TextTypes.H5}
                                        />
                                    </View>
                                )}
                            </View>
                        )
                    }
                />
            )}
        </View>
    );
};

export default DealerInventory;
