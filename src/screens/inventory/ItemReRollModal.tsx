import React, {useEffect, useState} from "react";
import {ActivityIndicator, View} from "react-native";

import {itemApis} from "@apis/index";
import {colors, gapSize, images} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {AppButton, AppImage, AppModal, AppText} from "@components/index.ts";
import {renderNumber} from "@utils/helperFunctions";
import {commonStyles, SCREEN_WIDTH, strings} from "@utils/index";

const ItemReRollModal = ({
    isVisible,
    onClose,
    selectedItem,
    onSuccess,
}: {
    isVisible: boolean;
    onClose: () => void;
    selectedItem: any;
    onSuccess: () => void;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [rerollCost, setRerollCost] = useState(0);

    useEffect(() => {
        if (isVisible) {
            fetchReRollCost();
        }
    }, [isVisible]);

    function fetchReRollCost() {
        setIsLoading(true);
        itemApis
            .getReRollCost(selectedItem.id, selectedItem.type)
            .then(res => {
                setRerollCost(res.data.shadow_coin_cost);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    function rerollItem() {
        if (isLoading) return;
        setIsLoading(true);
        itemApis
            .reRollItemProperties(selectedItem.id, selectedItem.type)
            .then(res => {
                console.warn(res.data);
                onSuccess();
            })
            .finally(() => {
                onClose();
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);
            });
    }

    return (
        <AppModal isVisible={isVisible} onClose={onClose}>
            <View
                style={{
                    width: SCREEN_WIDTH * 0.7,
                    alignItems: "center",
                    padding: gapSize.sizeL,
                    backgroundColor: colors.black,
                    borderWidth: 1,
                    borderColor: colors.secondary500,
                }}>
                <AppText
                    text={strings.upgradeItem.reroll}
                    type={TextTypes.H2}
                    color={colors.white}
                />
                <AppText
                    text={strings.upgradeItem.rerollDescription.replace(
                        "{cost}",
                        renderNumber(rerollCost),
                    )}
                    type={TextTypes.Body}
                    color={colors.white}
                />
                {!isLoading ? (
                    <View
                        style={[
                            commonStyles.flexRowAlignCenter,
                            {marginVertical: gapSize.sizeL},
                        ]}>
                        <AppImage source={images.icons.shadowCoin} size={25} />
                        <AppText
                            text={renderNumber(rerollCost)}
                            type={TextTypes.H4}
                            color={colors.orange}
                            style={{marginLeft: gapSize.sizeS}}
                        />
                    </View>
                ) : (
                    <ActivityIndicator size="small" color={colors.white} />
                )}
                <AppButton
                    text={strings.upgradeItem.reroll}
                    onPress={rerollItem}
                />
            </View>
        </AppModal>
    );
};

export default ItemReRollModal;
