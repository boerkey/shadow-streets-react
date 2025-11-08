import React, {useEffect, useState} from "react";
import {View} from "react-native";

import {itemApis} from "@apis/index";
import {colors, gapSize} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {
    AppButton,
    AppModal,
    AppText,
    RequiredMaterialsView,
} from "@components/index.ts";
import {ItemType} from "@interfaces/GameInterface";
import {showToast} from "@utils/helperFunctions";
import {SCREEN_WIDTH, strings} from "@utils/index";

const ItemRepairModal = ({
    isVisible,
    selectedItem,
    onClose,
    onRepairCompleted,
}: {
    isVisible: boolean;
    selectedItem: any;
    onClose: () => void;
    onRepairCompleted: () => void;
}) => {
    const [requiredMaterials, setRequiredMaterials] = useState<any[]>([]);
    const isEquippableItem =
        selectedItem?.type === ItemType.Weapon ||
        selectedItem?.type === ItemType.Armor ||
        selectedItem?.type === ItemType.Helmet;

    console.log(selectedItem);

    useEffect(() => {
        if (selectedItem && isEquippableItem) {
            itemApis
                .getRequiredMaterialsToRepairItem(
                    selectedItem?.id,
                    selectedItem.item_id,
                    selectedItem.type,
                )
                .then(res => {
                    setRequiredMaterials(res.data.required_materials_to_repair);
                });
        }
    }, [selectedItem]);

    function repairItem() {
        if (!selectedItem) return;
        itemApis.repairItem(selectedItem?.id, selectedItem.type).then(res => {
            showToast(res.data.message);
            onClose();
            onRepairCompleted();
        });
    }

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
                    text={strings.common.repair}
                    type={TextTypes.H2}
                    color={colors.white}
                />
                <RequiredMaterialsView
                    requiredMaterials={requiredMaterials}
                    containerStyle={{
                        marginLeft: gapSize.sizeM,
                        marginVertical: gapSize.size2L,
                    }}
                />
                <AppButton text={strings.common.repair} onPress={repairItem} />
            </View>
        </AppModal>
    );
};

export default ItemRepairModal;
