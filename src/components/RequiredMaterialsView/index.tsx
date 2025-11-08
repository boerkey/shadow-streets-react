import React from "react";

import {StyleProp, View, ViewStyle} from "react-native";
import {useSelector} from "react-redux";

import {colors, gapSize} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {AppImage, AppText} from "@components/index";
import {ItemType, MaterialToCraft} from "@interfaces/GameInterface";
import {RootState} from "@redux/index";
import {getItemImage} from "@utils/itemHelpers";

const RequiredMaterialsView = ({
    requiredMaterials,
    selectedAmount = 1,
    containerStyle,
    onlyShowMaterialsInList = false,
}: {
    requiredMaterials?: MaterialToCraft[];
    selectedAmount?: number;
    containerStyle?: StyleProp<ViewStyle>;
    onlyShowMaterialsInList?: boolean;
}) => {
    const user = useSelector((state: RootState) => state.auth.user);

    function renderRequiredMaterials() {
        return requiredMaterials.map(each => {
            const theAmountThatUserHas =
                user.items_materials?.find(
                    myEachItem => myEachItem.item_id === each.item_id,
                )?.amount ?? 0;
            const itemObj = {
                type: ItemType.Material,
                id: each.item_id,
                amount: each.amount,
            };
            const requiredAmount = each.amount * selectedAmount;
            const userHasEnough = theAmountThatUserHas >= requiredAmount;
            return (
                <View
                    key={each.item_id}
                    style={{
                        marginRight: gapSize.sizeM,
                        alignItems: "center",
                    }}>
                    <View
                        style={{
                            borderWidth: 1,
                            width: 55,
                            height: 55,
                            alignItems: "center",
                            justifyContent: "center",
                            borderColor:
                                userHasEnough || onlyShowMaterialsInList
                                    ? colors.green
                                    : colors.red,
                        }}>
                        <AppImage source={getItemImage(itemObj)} size={45} />
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: gapSize.sizeXS,
                        }}>
                        {!onlyShowMaterialsInList && (
                            <AppText
                                text={`${theAmountThatUserHas}`}
                                type={TextTypes.H6}
                                color={
                                    userHasEnough ? colors.green : colors.red
                                }
                            />
                        )}
                        <AppText
                            preText={!onlyShowMaterialsInList ? "/" : ""}
                            text={`${requiredAmount}`}
                            type={TextTypes.H6}
                        />
                    </View>
                </View>
            );
        });
    }

    if (!requiredMaterials || requiredMaterials?.length === 0) {
        return <></>;
    }

    return (
        <View style={[containerStyle, {flexDirection: "row"}]}>
            {renderRequiredMaterials()}
        </View>
    );
};

export default RequiredMaterialsView;
