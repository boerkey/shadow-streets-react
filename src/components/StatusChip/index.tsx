import React from "react";
import {View} from "react-native";

import {colors} from "@assets/index";
import {AppImage, AppText} from "@components/index";
import {commonStyles, scaledValue} from "@utils/index";

const StatusChip = ({
    status,
    text,
    width = 66,
    rightIcon,
    rightIconSize = 15,
}: {
    status: "Green" | "Yellow" | "Grey";
    text: string;
    width?: number;
    rightIcon?: string;
    rightIconSize?: number;
}) => {
    function getContainerStyle() {
        switch (status) {
            case "Green":
                return {
                    backgroundColor: "#1D2D23",
                    borderWidth: 1,
                    borderColor: "#3B4846",
                };
            case "Yellow":
                return {
                    backgroundColor: "#3C3A1A",
                    borderWidth: 1,
                    borderColor: "#3C3A1A",
                };
            case "Grey":
                return {
                    backgroundColor: "#5E5E5E",
                    borderWidth: 1,
                    borderColor: "#4A4A4A",
                };
        }
    }

    function getTextColor() {
        switch (status) {
            case "Green":
                return colors.green;
            case "Yellow":
                return colors.yellow;
            case "Grey":
                return colors.white;
        }
    }
    return (
        <View
            style={[
                commonStyles.alignAllCenter,
                getContainerStyle(),
                {width: scaledValue(width), height: scaledValue(30)},
            ]}>
            <View style={commonStyles.flexRowAlignCenter}>
                <AppText text={text} color={getTextColor()} />
                {rightIcon && (
                    <AppImage
                        source={rightIcon}
                        size={rightIconSize}
                        style={{
                            marginLeft: scaledValue(2),
                        }}
                    />
                )}
            </View>
        </View>
    );
};

export default StatusChip;
