import React, {useState} from "react";
import {FlatList, View} from "react-native";

import {useDispatch, useSelector} from "react-redux";

import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {AppImage, AppText} from "@components/index.ts";
import {
    ConsumableItem,
    GamePropertyUpgrade,
} from "@interfaces/GameInterface.ts";
import {UserProperty} from "@interfaces/PropertyInterface.ts";
import {propertyActions} from "@redux/actions";
import {RootState} from "@redux/index.ts";
import Item from "@screens/inventory/Item.tsx";
import ItemDetails from "@screens/inventory/ItemDetails.tsx";
import {commonStyles, scaledValue, SCREEN_HEIGHT} from "@utils/index.ts";

interface WorkshopProps {
    property: UserProperty | null;
}

const Workshop = ({property}: WorkshopProps) => {
    const dispatch = useDispatch();
    const gamePropertyUpgrades = useSelector(
        (state: RootState) => state.game.gamePropertyUpgrades,
    );
    const gameItems = useSelector((state: RootState) => state.game.gameItems);
    const itemProductionList = useSelector(
        (state: RootState) => state.property.itemProductionList,
    );

    const [selectedItem, setSelectedItem] = useState<ConsumableItem | null>(
        null,
    );

    function getItemList() {
        let maxGrade = 1;
        const productionTechniquesUpgradeID = 11;
        if (property?.upgrades) {
            const productionTechniquesUpgrade = property.upgrades.find(
                each => each.upgrade_id === productionTechniquesUpgradeID,
            );
            if (productionTechniquesUpgrade) {
                const gameUpgrade = gamePropertyUpgrades.find(
                    (each: GamePropertyUpgrade) =>
                        each.id === productionTechniquesUpgradeID,
                );
                maxGrade =
                    gameUpgrade?.bonus[productionTechniquesUpgrade.level - 1];
            }
        }

        return gameItems.consumables
            .filter(each => each.grade <= maxGrade)
            .filter(each => {
                if (itemProductionList.length > 0) {
                    return !itemProductionList.some(
                        itemProduction => itemProduction.item_id === each.id,
                    );
                }
                return true;
            });
    }

    function renderProductionCost() {
        return (
            selectedItem.production_cost -
            selectedItem.production_cost * property?.production_cost_multiplier
        ).toFixed(2);
    }

    function startProduction(item: ConsumableItem) {
        dispatch(
            propertyActions.addItemToProduction(
                property?.id,
                item.id,
                item.type,
            ),
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
                    item={selectedItem}
                    showAmountSelector={false}
                    actionButtonText={"Produce"}
                    onActionButtonPressed={() => {
                        startProduction(selectedItem);
                        setSelectedItem(null);
                    }}
                    actionButtonWidth={120}
                    rightComponent={
                        <View style={{top: -scaledValue(15)}}>
                            <View style={[commonStyles.flexRowAlignCenter]}>
                                <AppImage
                                    source={images.icons.money}
                                    size={30}
                                    style={{marginRight: gapSize.sizeS}}
                                />
                                <AppText
                                    preText={"$"}
                                    text={renderProductionCost()}
                                    type={TextTypes.H6}
                                />
                            </View>
                            <View
                                style={[
                                    commonStyles.flexRowAlignCenter,
                                    {left: 12},
                                ]}>
                                <View
                                    style={{
                                        width: 10,
                                        height: 10,
                                        marginHorizontal: gapSize.sizeS,
                                        borderRadius: 5,
                                        backgroundColor: colors.green,
                                    }}
                                />
                                <AppText
                                    text={` %${(
                                        property?.production_cost_multiplier *
                                        100
                                    ).toFixed(2)}`}
                                />
                            </View>
                        </View>
                    }
                />
            )}
        </View>
    );
};

export default Workshop;
