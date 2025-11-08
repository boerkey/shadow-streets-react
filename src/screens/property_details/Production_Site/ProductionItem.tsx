import React from "react";
import {View} from "react-native";

import * as Progress from "react-native-progress";
import {useDispatch, useSelector} from "react-redux";

import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {AppButton, AppImage, AppText} from "@components/index.ts";
import useCountdown from "@hooks/useCountdown.ts";
import {
    PropertyProductionItem,
    PropertyProductionStatus,
} from "@interfaces/PropertyInterface.ts";
import {propertyActions} from "@redux/actions";
import {RootState} from "@redux/index.ts";
import {getDarkBackground, renderNumber} from "@utils/helperFunctions.ts";
import {commonStyles, itemHelpers, strings} from "@utils/index.ts";
import {getItemImage} from "@utils/itemHelpers.ts";

interface ProductionItemProps {
    item: PropertyProductionItem;
    onRefresh: () => void;
}

const ProductionItem = ({item, onRefresh}: ProductionItemProps) => {
    const dispatch = useDispatch();
    const gameItems = useSelector((state: RootState) => state.game.gameItems);
    const {
        itemProductionLoading,
        eachProductionCycleAsSeconds,
        maxProductionLimit,
    } = useSelector((state: RootState) => state.property);

    const ratio = item.produced_amount / maxProductionLimit;

    const dbItem = itemHelpers.getItemByTypeAndId(gameItems, item);
    const {seconds, formatted} = useCountdown(item.production_end_as_second, {
        onComplete: onRefresh,
    });

    const progress =
        (eachProductionCycleAsSeconds - seconds) / eachProductionCycleAsSeconds;

    function getRatioColor() {
        if (ratio <= 0.3) {
            return colors.green;
        }
        if (ratio > 0.5 && ratio < 0.75) {
            return colors.orange;
        }
        if (ratio >= 0.75) {
            return colors.red;
        }
    }

    function renderButtons() {
        if (item.status === PropertyProductionStatus.PASSIVE) {
            return (
                <View style={commonStyles.flexRowSpaceBetween}>
                    <AppButton
                        type={"redSmall"}
                        disabled={itemProductionLoading}
                        onPress={() => {
                            dispatch(
                                propertyActions.removeItemFromProduction(
                                    item.property_id,
                                    item.item_id,
                                    item.item_type,
                                ),
                            );
                        }}
                        text={"X"}
                        height={45}
                        width={75}
                        style={{marginRight: gapSize.sizeM}}
                    />
                    <AppButton
                        disabled={itemProductionLoading}
                        onPress={() => {
                            dispatch(
                                propertyActions.addItemToProduction(
                                    item.property_id,
                                    item.item_id,
                                    item.item_type,
                                ),
                            );
                        }}
                        text={strings.common.continue}
                        height={45}
                        width={155}
                    />
                </View>
            );
        }
        if (
            item.produced_amount === 0 &&
            item.status === PropertyProductionStatus.ACTIVE
        ) {
            return (
                <AppButton
                    onPress={() => {
                        dispatch(
                            propertyActions.stopItemProductionInProperty(
                                item.property_id,
                                item.item_id,
                                item.item_type,
                            ),
                        );
                    }}
                    text={strings.common.pause}
                    height={45}
                    width={125}
                    disabled={itemProductionLoading}
                />
            );
        }
        return (
            <AppButton
                onPress={() => {
                    dispatch(
                        propertyActions.takeProducedItemFromProperty(
                            item.property_id,
                            item.item_id,
                            item.item_type,
                        ),
                    );
                }}
                text={strings.common.take}
                height={45}
                width={125}
                disabled={itemProductionLoading}
            />
        );
    }

    return (
        <View style={[commonStyles.flexRow, {width: "100%"}]}>
            <View style={{alignItems: "center"}}>
                <Progress.Circle
                    formatText={num => (
                        <View
                            style={{
                                zIndex: 3,
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                            <AppImage source={getItemImage(item)} size={65} />
                            {progress > 0 && progress < 1 && (
                                <View
                                    style={{
                                        backgroundColor: getDarkBackground(45),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        position: "absolute",
                                        width: 83,
                                        height: 83,
                                        borderRadius: 42,
                                    }}>
                                    <AppText
                                        text={(progress * 100).toFixed(0) + "%"}
                                        type={TextTypes.H6}
                                        fontSize={18}
                                    />
                                </View>
                            )}
                        </View>
                    )}
                    unfilledColor={"#35434E"}
                    borderColor={"transparent"}
                    color={"#F1C95B"}
                    progress={progress}
                    size={93}
                    endAngle={0.5}
                    showsText={true}
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        width: 93,
                        height: 93,
                    }}
                />
                {item.status == PropertyProductionStatus.ACTIVE && (
                    <View
                        style={[
                            commonStyles.flexRowAlignCenter,
                            {marginTop: gapSize.sizeS, left: -3},
                        ]}>
                        <AppImage source={images.icons.time} size={15} />
                        <AppText
                            text={formatted}
                            type={TextTypes.H7}
                            style={{left: 3}}
                        />
                    </View>
                )}
            </View>
            <View style={{flex: 1, marginLeft: gapSize.sizeM}}>
                <View style={[commonStyles.flexRowSpaceBetween]}>
                    <AppText text={dbItem.name} type={TextTypes.H6} />
                    <AppText
                        color={getRatioColor()}
                        text={`${item.produced_amount}/${maxProductionLimit}`}
                        type={TextTypes.H6}
                    />
                </View>
                <View style={[commonStyles.flexRow, {top: gapSize.sizeM}]}>
                    <AppText text={strings.common.cost + ": "} />
                    <AppImage source={images.icons.money} size={20} />
                    <AppText
                        preText={"$"}
                        text={renderNumber(item.production_cost, 2)}
                        type={TextTypes.BodyBold}
                    />
                </View>
                <View
                    style={{
                        marginTop: gapSize.size4L,
                        alignSelf: "flex-end",
                    }}>
                    {renderButtons()}
                </View>
            </View>
        </View>
    );
};

export default ProductionItem;
