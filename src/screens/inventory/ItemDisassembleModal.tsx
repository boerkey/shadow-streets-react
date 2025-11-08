import React from "react";
import {View} from "react-native";

import {colors, gapSize} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {
    AppButton,
    AppModal,
    AppText,
    RequiredMaterialsView,
} from "@components/index.ts";
import {SCREEN_WIDTH, strings} from "@utils/index";

const ItemDisassembleModal = ({
    isVisible,
    onClose,
    onPress,
    requiredMaterials,
}: {
    isVisible: boolean;
    onClose: () => void;
    onPress: () => void;
    requiredMaterials: any[];
}) => {
    return (
        <AppModal isVisible={isVisible} onClose={onClose}>
            <View
                style={{
                    width: SCREEN_WIDTH * 0.7,
                    alignItems: "center",
                    padding: gapSize.sizeL,
                    backgroundColor: colors.black,
                    borderWidth: 1,
                    borderColor: colors.secondary500,
                }}>
                <AppText
                    text={strings.common.disassemble}
                    type={TextTypes.H2}
                    color={colors.white}
                />
                <RequiredMaterialsView
                    requiredMaterials={requiredMaterials}
                    containerStyle={{
                        marginLeft: gapSize.sizeM,
                        marginVertical: gapSize.size2L,
                    }}
                    onlyShowMaterialsInList={true}
                />
                <AppButton
                    text={strings.common.disassemble}
                    onPress={onPress}
                    width={210}
                />
            </View>
        </AppModal>
    );
};

export default ItemDisassembleModal;
