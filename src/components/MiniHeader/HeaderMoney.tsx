import React from "react";
import {View} from "react-native";

import {helperFunctions, scaledValue} from "@utils/index.ts";
import {colors, gapSize, images} from "@assets/index.ts";
import {AppImage, AppText} from "@components/index.ts";
import {TextTypes} from "@components/AppText";

const HeaderMoney = ({
    money = 0,
    width = 113,
    iconSize = 36,
    paddingHorizontal = gapSize.sizeM,
    noBackgroundStyle = false,
    fontSize = undefined,
}) => {
    function getContainerStyle() {
        return {
            width: scaledValue(width),
            height: scaledValue(40),
            backgroundColor: noBackgroundStyle
                ? "transparent"
                : colors.secondaryTwo700,
            borderWidth: scaledValue(noBackgroundStyle ? 0 : 0.5),
            borderColor: colors.secondary500,
            paddingHorizontal,
            paddingVertical: gapSize.sizeS,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
        };
    }
    return (
        <View style={getContainerStyle()}>
            <AppImage
                source={images.icons.money}
                size={scaledValue(iconSize)}
            />
            <AppText
                text={`$${helperFunctions.renderNumber(money) || 0}`}
                type={TextTypes.BodyBold}
                color={colors.white}
                style={{marginLeft: gapSize.sizeS}}
                fontSize={fontSize}
            />
        </View>
    );
};

export default HeaderMoney;
