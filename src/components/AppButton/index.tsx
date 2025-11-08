import React, {useEffect, useRef, useState} from "react";
import {
    ActivityIndicator,
    Animated,
    Easing,
    ImageBackground,
    ImageResizeMode,
    TouchableOpacity,
    ViewStyle,
} from "react-native";

import {colors, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {BotCheckerModal} from "@components/index";
import {AppImage, AppText, Prompt} from "@components/index.ts";
import {helperFunctions, scaledValue} from "@utils/index.ts";

type Props = {
    text?: string;
    type?:
        | "primary"
        | "secondary"
        | "primarySmall"
        | "secondarySmall"
        | "redSmall"
        | "transparent";
    onPress?: () => void;
    onLongPress?: () => void;
    style?: ViewStyle;
    width?: number;
    height?: number;
    fontSize?: number;
    resizeMode?: ImageResizeMode;
    loading?: boolean;
    disabled?: boolean;
    minifyLength?: number;
    icon?: string;
    timeoutDuration?: number | undefined; // Single prop for cooldown
    promptTitle?: string;
    promptText?: string;
    textFont?: TextTypes;
    botRestrictionCheckFrequency?: number;
    rightIcon?: string;
    onRightIconPress?: () => void;
};

const AppButton = ({
    text,
    type = "primary",
    width,
    height,
    style,
    fontSize,
    onPress,
    onLongPress,
    resizeMode = "stretch",
    loading,
    disabled: propDisabled,
    minifyLength,
    icon,
    timeoutDuration,
    promptTitle,
    promptText,
    textFont = TextTypes.ButtonLarge,
    botRestrictionCheckFrequency,
    rightIcon,
    onRightIconPress,
}: Props) => {
    const [isDisabled, setIsDisabled] = useState(false);
    const [cooldownActive, setCooldownActive] = useState(false);
    const [isPromptVisible, setIsPromptVisible] = useState(false);
    const [showBotRestrictionCheck, setShowBotRestrictionCheck] =
        useState(false);
    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (timeoutDuration) {
            progress.setValue(0);
        }
    }, [timeoutDuration]);

    function animateTimeout() {
        setIsDisabled(true);
        setCooldownActive(true);
        progress.setValue(0);
        Animated.timing(progress, {
            toValue: 1,
            duration: timeoutDuration,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start(() => {
            setIsDisabled(false);
            setCooldownActive(false);
        });
    }

    const handlePress = (skipBotRestrictionCheck: boolean = false) => {
        if (botRestrictionCheckFrequency && !skipBotRestrictionCheck) {
            const randomNumber = helperFunctions.getRandomNumber(
                1,
                botRestrictionCheckFrequency,
            );
            if (randomNumber === botRestrictionCheckFrequency) {
                return setShowBotRestrictionCheck(true);
            }
        }
        if (promptTitle) {
            setIsPromptVisible(true);
        } else {
            if (!loading && !isDisabled && onPress) {
                onPress();
                if (timeoutDuration) {
                    animateTimeout();
                }
            }
        }
    };

    const getStyle = () => ({
        width: scaledValue(width ?? 160),
        height: scaledValue(height ?? 56),
    });

    const getSource = () => {
        switch (type) {
            case "primary":
                return images.containers.button;
            case "primarySmall":
                return images.containers.smallButton;
            case "secondarySmall":
                return images.containers.smallButtonTransparent;
            case "redSmall":
                return images.containers.smallButtonRed;
            case "transparent":
                return images.containers.buttonTransparent;
            default:
                return images.containers.button;
        }
    };

    // Centered Horizontal Bar Animation
    const animatedBarStyle = {
        width: progress.interpolate({
            inputRange: [0, 1],
            outputRange: ["0%", "95%"],
        }),
        backgroundColor: "rgba(255,255,255,0.5)",
        height: "84%", // Slightly smaller height for centered look
        position: "absolute",
        left: 5, // Adds a margin to avoid touching sharp corners
        right: 5, // Prevents full width extension
        top: "9%", // Centers it vertically inside the button
    };

    return (
        <>
            {promptTitle && (
                <Prompt
                    onConfirm={() => {
                        setIsPromptVisible(false);
                        onPress?.();
                    }}
                    title={promptTitle}
                    text={promptText}
                    isVisible={isPromptVisible}
                    onClose={() => setIsPromptVisible(false)}
                />
            )}
            <BotCheckerModal
                isVisible={showBotRestrictionCheck}
                onClose={() => setShowBotRestrictionCheck(false)}
                onSuccess={() => {
                    handlePress(true);
                }}
            />
            <TouchableOpacity
                disabled={isDisabled || propDisabled}
                style={style}
                onPress={() => handlePress()}
                onLongPress={onLongPress}
                hitSlop={{top: 5, left: 5, right: 5, bottom: 5}}>
                <ImageBackground
                    resizeMode={resizeMode}
                    source={getSource()}
                    style={[
                        getStyle(),
                        {
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: isDisabled || propDisabled ? 0.5 : 1,
                            overflow: "hidden", // Keeps animation inside button
                            borderRadius: scaledValue(6), // Matches button design
                        },
                    ]}>
                    {/* Show Progress Animation Only When Cooldown is Active */}
                    {cooldownActive && (
                        <Animated.View style={animatedBarStyle} />
                    )}

                    {icon && <AppImage source={icon} size={21} />}
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <AppText
                            minifyLength={minifyLength}
                            text={text}
                            type={textFont}
                            color={
                                type === "redSmall"
                                    ? "#FF4B55"
                                    : colors.secondary500
                            }
                            fontSize={fontSize}
                        />
                    )}
                    {rightIcon && (
                        <AppImage
                            source={rightIcon}
                            size={20}
                            onPress={onRightIconPress}
                            containerStyle={{
                                position: "absolute",
                                right: 15,
                                top: 19,
                            }}
                        />
                    )}
                </ImageBackground>
            </TouchableOpacity>
        </>
    );
};

export default AppButton;
