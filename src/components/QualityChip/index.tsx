import React from "react";
import {View} from "react-native";
import {moderateScale, scaledValue, strings} from "@utils/index.ts";
import {colors} from "@assets/index.ts";
import {ItemQuality} from "@interfaces/GameInterface.ts";
import {AppText} from "@components/index.ts";

const QualityChip = ({quality = 0}) => {
    function getText() {
        return strings.common.qualities[quality];
    }

    function getColor() {
        switch (quality) {
            case ItemQuality.Common:
                return colors.grey300;
            case ItemQuality.Rare:
                return "#2587D1";
            case ItemQuality.Epic:
                return "#DC3962";
            case ItemQuality.Legendary:
                return "#FFBF00";
        }
    }

    return (
        <View
            style={{
                alignItems: "center",
                justifyContent: "center",
                height: scaledValue(20),
                width: scaledValue(60),
                backgroundColor: colors.secondaryTwo700,
                borderWidth: 1,
                borderColor: colors.borderColor,
            }}>
            <AppText
                text={getText()}
                color={getColor()}
                fontSize={moderateScale(10)}
            />
        </View>
    );
};

export default QualityChip;
