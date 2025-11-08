import {useState} from "react";
import {FlatList, Platform, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";

import {propertyApis} from "@apis/index";
import {gapSize, images} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {AppImage, AppText, RequiredMaterialsView} from "@components/index";
import {GamePropertyUpgrade, MaterialItem} from "@interfaces/GameInterface.ts";
import {UserProperty} from "@interfaces/PropertyInterface.ts";
import {authActions} from "@redux/actions";
import {RootState} from "@redux/index.ts";
import Item from "@screens/inventory/Item";
import ItemDetails from "@screens/inventory/ItemDetails";
import {showToast} from "@utils/helperFunctions";
import {helperFunctions, SCREEN_HEIGHT, strings} from "@utils/index";

const craftingGradeUpgradeID = 20;

const Garage = ({property}: {property: UserProperty}) => {
    const dispatch = useDispatch();
    const gameItems = useSelector((state: RootState) => state.game.gameItems);
    const gamePropertyUpgrades = useSelector(
        (state: RootState) => state.game.gamePropertyUpgrades,
    );
    const user = useSelector((state: RootState) => state.auth.user);
    const [selectedItem, setSelectedItem] = useState<MaterialItem | null>(null);
    const [selectedAmount, setSelectedAmount] = useState<number>(1);

    const isOwner = property.user_id === user.id;
    const craftingCost = selectedItem?.crafting_cost * selectedAmount;
    const finalCraftingCost =
        craftingCost + (isOwner ? 0 : craftingCost * (property.usage_fee ?? 0));

    function craftItem() {
        propertyApis
            .craft(
                property.id,
                selectedItem?.id,
                selectedItem?.type,
                selectedAmount,
            )
            .then(res => {
                dispatch(authActions.getUser());
                showToast(res.data.message);
            });
    }

    function getItemList() {
        let maxGrade = 2;
        if (property?.upgrades) {
            const craftingGradeUpgrade = property.upgrades.find(
                each => each.upgrade_id === craftingGradeUpgradeID,
            );
            if (craftingGradeUpgrade) {
                const gameUpgrade = gamePropertyUpgrades.find(
                    (each: GamePropertyUpgrade) =>
                        each.id === craftingGradeUpgradeID,
                );
                maxGrade = gameUpgrade?.bonus[craftingGradeUpgrade.level - 1];
            }
        }

        return gameItems.materials.filter(
            each => each.grade <= maxGrade && each.grade > 1,
        );
    }

    const _renderItem = ({item}) => {
        return (
            <Item
                item={item}
                onPress={() => {
                    if (selectedItem?.id === item.id) {
                        return setSelectedItem(null);
                    }
                    setSelectedItem(item);
                }}
                noPriceAndAmount
                isSelected={selectedItem?.id === item.id}
            />
        );
    };

    function renderRequiredMaterials() {
        return (
            <RequiredMaterialsView
                selectedAmount={selectedAmount}
                requiredMaterials={selectedItem?.required_materials_to_craft}
                containerStyle={{
                    left: gapSize.sizeL,
                    top: gapSize.sizeL,
                }}
            />
        );
    }

    function renderCraftingCost() {
        return (
            <View
                style={{
                    position: "absolute",
                    bottom: -gapSize.sizeL,
                    flexDirection: "row",
                    alignItems: "center",
                    right: gapSize.sizeXS,
                }}>
                <AppImage
                    source={images.icons.money}
                    size={25}
                    style={{marginRight: gapSize.sizeS}}
                />
                <AppText
                    text={`${helperFunctions.renderNumber(
                        finalCraftingCost,
                        1,
                    )}$`}
                    type={TextTypes.H6}
                    fontSize={18}
                />
            </View>
        );
    }

    return (
        <View>
            <FlatList
                data={getItemList()}
                renderItem={_renderItem}
                numColumns={3}
                style={{
                    height: selectedItem
                        ? SCREEN_HEIGHT * 0.53
                        : SCREEN_HEIGHT * 0.72,
                }}
            />
            {selectedItem && (
                <ItemDetails
                    containerStyle={{
                        top: Platform.OS === "ios" ? -5 : -10,
                    }}
                    item={selectedItem}
                    showAmountSelector={true}
                    onAmountChange={amount => {
                        setSelectedAmount(amount);
                    }}
                    onActionButtonPressed={craftItem}
                    actionButtonText={strings.common.craft}
                    leftComponent={renderRequiredMaterials()}
                    underImageComponent={renderCraftingCost()}
                />
            )}
        </View>
    );
};

export default Garage;
