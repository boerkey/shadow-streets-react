import React, {useEffect, useRef, useState} from "react";
import {Modal, Pressable, TextInput, TextStyle, View} from "react-native";

import {colors, gapSize} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {AppButton, AppInput, AppText} from "@components/index.ts";
import {removeCommas} from "@utils/helperFunctions.ts";
import {
    commonStyles,
    helperFunctions,
    scaledValue,
    strings,
} from "@utils/index.ts";

interface PromptProps {
    isVisible: boolean;
    onClose(): void;
    title: string;
    text?: string;
    confirmButtonText?: string;
    placeholder?: string;
    inputValidation?: "number-only" | "any";
    formatNumber?: boolean;
    maxLength?: number;
    onConfirm?: (text: string | number) => void;
    highlightStyle?: TextStyle;
    wordsToHighlight?: string[];
}

const Prompt = ({
    isVisible,
    onClose,
    title,
    text,
    confirmButtonText = strings.common.confirm,
    placeholder = "...",
    inputValidation,
    formatNumber,
    maxLength,
    onConfirm,
    highlightStyle,
    wordsToHighlight,
}: PromptProps) => {
    const [inputMessage, setInputMessage] = useState("");
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (!isVisible) {
            setTimeout(() => {
                setInputMessage("");
            }, 200);
        }
        if (isVisible) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 200);
        }
    }, [isVisible]);

    return (
        <Modal
            transparent={true}
            animationType={"fade"}
            visible={isVisible}
            onRequestClose={onClose}>
            <Pressable
                onPress={onClose}
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 1,
                }}>
                <Pressable
                    style={{
                        width: scaledValue(345),
                        maxHeight: scaledValue(600),
                        paddingHorizontal: gapSize.size2L,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 1,
                        borderColor: colors.secondary500,
                        backgroundColor: "black",
                        paddingVertical: gapSize.size2L,
                        zIndex: 2,
                    }}>
                    <AppText
                        text={title}
                        type={TextTypes.TitleSmall}
                        style={{marginBottom: gapSize.sizeM}}
                    />
                    {text && (
                        <AppText
                            text={text}
                            style={{marginVertical: gapSize.size2L}}
                            highlightStyle={highlightStyle}
                            wordsToHighlight={wordsToHighlight}
                        />
                    )}
                    {inputValidation && (
                        <AppInput
                            keyboardType={
                                inputValidation === "number-only"
                                    ? "number-pad"
                                    : undefined
                            }
                            onRef={inputRef}
                            value={inputMessage}
                            maxLength={maxLength}
                            placeholder={placeholder}
                            width={"100%"}
                            style={{marginVertical: gapSize.sizeL}}
                            onChangeText={val => {
                                if (
                                    formatNumber &&
                                    inputValidation === "number-only"
                                ) {
                                    return setInputMessage(
                                        helperFunctions.formatInputNumber(val),
                                    );
                                }
                                setInputMessage(val);
                            }}
                        />
                    )}
                    <View
                        style={[
                            commonStyles.flexRowSpaceEvenly,
                            {width: "100%", marginTop: gapSize.size3L},
                        ]}>
                        <AppButton
                            resizeMode={"stretch"}
                            onPress={onClose}
                            text={strings.common.close}
                            type={"redSmall"}
                            width={100}
                        />
                        <AppButton
                            disabled={
                                inputValidation && inputMessage.length < 1
                            }
                            text={confirmButtonText}
                            onPress={() => {
                                if (onConfirm) {
                                    onConfirm(
                                        inputValidation === "number-only"
                                            ? parseInt(
                                                  removeCommas(inputMessage),
                                              )
                                            : inputMessage,
                                    );
                                    onClose();
                                }
                            }}
                        />
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default Prompt;
