import React from "react";
import {StyleProp, View, ViewStyle} from "react-native";

import {colors, gapSize} from "@assets/index.ts";
import AppText, {TextTypes} from "@components/AppText";

interface DividerProps {
    text?: string;
    marginVertical?: number;
    width?: number | string;
    style?: StyleProp<ViewStyle>;
    textType?: TextTypes;
}

const Divider = ({
    text = "",
    marginVertical = gapSize.size2L,
    width = 50,
    style = {},
    textType = TextTypes.BodyLarge,
}: DividerProps) => {
    if (!text)
        return (
            <View
                style={{
                    width,
                    height: 1,
                    backgroundColor: colors.lineColor,
                    marginVertical,
                    alignSelf: "center",
                }}
            />
        );

    return (
        <View
            style={{
                width,
                marginVertical,
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center",
                ...style,
            }}>
            <View
                style={{
                    height: 1,
                    width: width * 0.35,
                    backgroundColor: colors.grey400,
                }}
            />
            <AppText
                text={text}
                type={textType}
                color={colors.white}
                style={{
                    textAlign: "center",
                    paddingHorizontal: 12,
                }}
            />
            <View
                style={{
                    height: 1,
                    width: width * 0.35,
                    backgroundColor: colors.grey400,
                }}
            />
        </View>
    );
};

export default Divider;
