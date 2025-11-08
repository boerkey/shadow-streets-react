import React from "react";
import {
    ImageSourcePropType,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from "react-native";

import {colors} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {AppImage, AppText} from "@components/index.ts";
import {scaledValue} from "@utils/index.ts";

type Props = {
    text: string;
    onPress?: () => void;
    icon?: string;
    width?: string | number;
    style?: ViewStyle;
    rightIcon?: ImageSourcePropType;
    rightIconSize?: number;
    textStyle?: TextStyle;
    disabled?: boolean;
    onLongPress?: () => void;
};

const SmallButton = ({
    text,
    onPress,
    rightIcon,
    rightIconSize = 12,
    style,
    width = "100%",
    textStyle,
    disabled = false,
    onLongPress,
}: Props) => {
    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
                width,
                height: scaledValue(38),
                padding: scaledValue(10),
                borderWidth: 1,
                borderColor: colors.borderColor,
                backgroundColor: "#1C1C1C",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                opacity: disabled ? 0.5 : 1,
                ...style,
            }}>
            <AppText text={text} type={TextTypes.H6} style={textStyle} />
            {rightIcon && (
                <AppImage
                    source={rightIcon}
                    size={rightIconSize}
                    style={{position: "absolute", right: 10}}
                />
            )}
        </TouchableOpacity>
    );
};

export default SmallButton;
