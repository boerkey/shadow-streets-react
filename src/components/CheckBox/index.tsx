import React from "react";
import {TouchableOpacity, View, ViewStyle} from "react-native";

import {colors, gapSize, images} from "../../assets";
import {commonStyles} from "../../utils";
import AppImage from "../AppImage";
import AppText, {TextTypes} from "../AppText";

interface CheckBox {
    text: string;
    isChecked?: boolean;
    style?: ViewStyle;
    onPress?(): void;
    textColor?: string;
    disabled?: boolean;
}

const CheckBox = ({
    text = "Hey",
    onPress,
    isChecked,
    style,
    textColor = colors.white,
    disabled = false,
}: CheckBox) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[commonStyles.flexRowAlignCenter, style]}
            disabled={disabled}>
            <View
                style={{
                    backgroundColor: "#424447",
                    borderWidth: 1,
                    borderColor: colors.secondary500,
                    width: 16,
                    height: 16,
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: disabled ? 0.5 : 1,
                }}>
                {isChecked && <AppImage source={images.icons.tick} size={10} />}
            </View>
            <AppText
                text={text}
                type={TextTypes.BodyLarge}
                style={{marginLeft: gapSize.sizeS, opacity: disabled ? 0.5 : 1}}
                color={textColor}
            />
        </TouchableOpacity>
    );
};

export default CheckBox;
