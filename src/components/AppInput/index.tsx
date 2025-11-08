import React, {useState} from "react";
import {
    ActivityIndicator,
    ImageBackground,
    KeyboardType,
    TextInput,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

import {colors, fonts, gapSize, images} from "@assets/index.ts";
import AppImage from "@components/AppImage";
import {TextTypes} from "@components/AppText";
import {AppText} from "@components/index.ts";
import {commonStyles, scaledValue} from "@utils/index.ts";

interface Props {
    placeholder?: string;
    label?: string;
    invalid?: boolean;
    invalidText?: string;
    isRequired?: boolean;
    rightIconSource?: string;
    secureTextEntry?: boolean;
    style?: ViewStyle;
    maxLength?: number;
    onChangeText?: (text: string) => void;
    onRightIconPress?: () => void;
    onSubmitEditing?: () => void;
    onRef?: any;
    onFocus?: () => void;
    loading?: boolean;
    width?: number | string;
    keyboardType?: KeyboardType;
    leftIconSource?: string;
    leftIconSize?: number;
    value?: string | undefined;
    fontSize?: number;
    editable?: boolean;
}

const AppInput = ({
    label = "",
    invalid = false,
    invalidText,
    isRequired = false,
    rightIconSource,
    placeholder,
    secureTextEntry,
    style,
    maxLength,
    onChangeText,
    onRightIconPress,
    onSubmitEditing,
    onRef,
    onFocus,
    loading,
    width = 345,
    keyboardType = "default",
    leftIconSource,
    leftIconSize = 15,
    value,
    fontSize = 14,
    editable,
}: Props) => {
    const [isSecure, setIsSecure] = useState(!!secureTextEntry);
    const togglePasswordVisibility = () => setIsSecure(!isSecure);

    return (
        <View style={style}>
            {label && (
                <View style={commonStyles.flexRow}>
                    <AppText
                        text={label}
                        type={TextTypes.BodyBold}
                        style={{textAlign: "left", marginBottom: 12}}
                        color={colors.white}
                    />
                    {isRequired && (
                        <AppText
                            text={"*"}
                            type={TextTypes.BodyBold}
                            color={"#F02323"}
                        />
                    )}
                </View>
            )}
            <ImageBackground
                resizeMode={"stretch"}
                source={
                    invalid
                        ? images.containers.inputInvalid
                        : images.containers.input
                }
                style={{
                    width:
                        typeof width === "string" ? width : scaledValue(width),
                    height: scaledValue(47),
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    paddingLeft: leftIconSource ? gapSize.sizeS : 0,
                }}>
                {leftIconSource && (
                    <AppImage
                        source={leftIconSource}
                        size={leftIconSize}
                        style={{marginHorizontal: gapSize.sizeM}}
                    />
                )}
                <TextInput
                    returnKeyType={"done"}
                    editable={editable}
                    keyboardType={keyboardType}
                    onFocus={onFocus}
                    ref={onRef}
                    onChangeText={onChangeText}
                    value={value}
                    onSubmitEditing={onSubmitEditing}
                    autoCorrect={false}
                    style={{
                        width: "90%",
                        height: scaledValue(40),
                        fontFamily: fonts.RalewayRegular,
                        paddingRight: rightIconSource ? gapSize.size4L : 0,
                        color: colors.white,
                        fontSize,
                    }}
                    maxLength={maxLength}
                    secureTextEntry={isSecure}
                    placeholderTextColor={colors.grey500}
                    placeholder={placeholder ? placeholder : label}
                />
                {(rightIconSource || secureTextEntry) && (
                    <TouchableOpacity
                        onPress={
                            onRightIconPress
                                ? onRightIconPress
                                : togglePasswordVisibility
                        }
                        style={{position: "absolute", right: gapSize.sizeM}}>
                        {loading ? (
                            <ActivityIndicator />
                        ) : (
                            <AppImage
                                source={
                                    secureTextEntry
                                        ? isSecure
                                            ? images.icons.hat
                                            : images.icons.hatBlocked
                                        : rightIconSource
                                }
                            />
                        )}
                    </TouchableOpacity>
                )}
            </ImageBackground>

            {invalidText && (
                <AppText
                    text={invalidText}
                    type={TextTypes.BodyBold}
                    color={"#F02323"}
                    style={{marginTop: gapSize.sizeS}}
                />
            )}
        </View>
    );
};

export default AppInput;
