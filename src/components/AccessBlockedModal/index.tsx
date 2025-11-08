import React from "react";
import {Modal, View} from "react-native";

import {colors, gapSize} from "@assets/index.ts";
import {commonStyles, scaledValue, strings} from "@utils/index.ts";
import {AppButton, AppText} from "@components/index.ts";
import {navigate, SCREEN_NAMES} from "../../router.tsx";
import { getDarkBackground } from "@utils/helperFunctions.ts";

interface Props {
    isVisible?: boolean;
    onClose(): void;
}

const AccessBlockedModal = ({isVisible, onClose}: Props) => {
    return (
        <Modal
            visible={isVisible}
            onRequestClose={onClose}
            transparent={true}
            animationType={"fade"}>
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: getDarkBackground(5),
                }}>
                <View
                    style={{
                        paddingVertical: gapSize.size4L,
                        paddingHorizontal: gapSize.size2L,
                        width: scaledValue(360),
                        height: scaledValue(276),
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 1,
                        borderColor: colors.secondary500,
                        backgroundColor: "black",
                    }}>
                    <AppText
                        text={strings.common.warning}
                        type={"titleSmall"}
                    />
                    <AppText
                        text={strings.auth.registerModalWarning}
                        style={{marginVertical: gapSize.size4L}}
                        centered
                    />
                    <View
                        style={[
                            commonStyles.flexRowSpaceBetween,
                            {width: "100%"},
                        ]}>
                        <AppButton
                            onPress={onClose}
                            text={strings.common.close}
                            type={"redSmall"}
                            resizeMode={"contain"}
                        />
                        <AppButton
                            onPress={() => {
                                onClose();
                                setTimeout(
                                    () =>
                                        navigate(SCREEN_NAMES.AUTH, {
                                            authType: "register",
                                        }),
                                    300,
                                );
                            }}
                            text={strings.auth.register}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default AccessBlockedModal;
