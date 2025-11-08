import React from "react";

import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {
    AppButton,
    AppImage,
    AppText,
    RequiredMaterialsView,
} from "@components/index.ts";
import {GamePropertyUpgrade} from "@interfaces/GameInterface.ts";
import {RootState} from "@redux/index";
import {renderNumber} from "@utils/helperFunctions.ts";
import {SCREEN_HEIGHT, SCREEN_WIDTH, strings} from "@utils/index.ts";
import {Platform, View} from "react-native";
import {useSelector} from "react-redux";

interface UpgradeDetailOverlayProps {
    upgrade: GamePropertyUpgrade | null;
    onUpgrade: () => void;
    canUpgrade: boolean;
    upgradeType: "Property" | "Gang";
}

const UpgradeDetailOverlay = ({
    upgrade,
    onUpgrade,
    upgradeType,
}: UpgradeDetailOverlayProps) => {
    const user = useSelector((state: RootState) => state.auth.user);
    if (!upgrade) {
        return <></>;
    }
    const {index, isUpgradeable} = upgrade;

    function getBonuses() {
        if (upgrade?.bonus[index]) {
            return `${strings.common.bonus}: ${
                upgrade?.bonus_indicator_start_character ?? ""
            }${renderNumber(
                upgrade.bonus[index] * (upgrade?.normalizer_multiplier ?? 1),
            )}${upgrade?.bonus_indicator_end_character}`;
        }
        if (upgrade?.bonuses[index]) {
            let str = "";
            const keys = Object.keys(upgrade?.bonuses[index] || {});
            keys.forEach((key, i) => {
                const val = upgrade.bonuses[index][key];
                str +=
                    strings.common.gameKeys[key] +
                    ": " +
                    val +
                    upgrade?.bonus_indicator_end_character;
                if (i < keys.length - 1) {
                    str += "\n"; // only add newline if not the last item
                }
            });
            return str;
        }
    }

    function getCost() {
        return upgrade?.cost[index];
    }

    function renderExtraCost() {
        if (upgrade?.bounty_point_cost) {
            return (
                <AppText
                    text={strings.common.bountyPointCost + ": "}
                    postText={upgrade?.bounty_point_cost[index]}
                    style={{marginTop: gapSize.sizeS}}
                    type={TextTypes.H4}
                />
            );
        }
    }

    function renderRequiredMaterials() {
        if (!upgrade?.required_materials_to_upgrade || !isUpgradeable) {
            return null;
        }
        const requiredMaterials = upgrade.required_materials_to_upgrade[index];
        return (
            <RequiredMaterialsView
                requiredMaterials={requiredMaterials}
                containerStyle={{
                    marginVertical: gapSize.sizeL,
                }}
            />
        );
    }

    return (
        <View
            style={{
                height: SCREEN_HEIGHT,
                width: SCREEN_WIDTH,
                position: "absolute",
                left: -gapSize.sizeL,
                bottom: -gapSize.sizeL,
                alignItems: "center",
            }}>
            <View style={{height: Platform.OS === "ios" ? "40%" : "41%"}} />
            <AppText
                text={upgrade.name + ` (${index + 1})`}
                type={TextTypes.H2}
                style={{marginTop: gapSize.sizeM, width: "85%"}}
                centered
                fontSize={Platform.OS === "ios" ? 21 : 19}
            />
            <AppImage
                source={
                    upgradeType === "Property"
                        ? images.propertyUpgrades[upgrade.id]
                        : images.gangUpgrades[upgrade.id]
                }
                size={Platform.OS === "ios" ? 135 : 110}
                style={{marginBottom: gapSize.sizeM}}
            />
            <View
                style={{
                    width: "80%",
                    borderWidth: 1,
                    borderColor: colors.secondary500,
                    padding: gapSize.sizeL,
                    alignItems: "center",
                    zIndex: 5,
                }}>
                <View style={{alignItems: "center"}}>
                    <AppText text={upgrade.description} />
                    <AppText
                        text={getBonuses()}
                        style={{marginTop: gapSize.sizeM}}
                        type={TextTypes.H4}
                        color={colors.borderColor}
                    />
                    <AppText
                        text={`${strings.common.cost}: `}
                        postText={"$" + renderNumber(getCost())}
                        style={{marginTop: gapSize.sizeS}}
                        type={TextTypes.H4}
                        color={
                            getCost() > user?.money && isUpgradeable
                                ? colors.red
                                : isUpgradeable
                                ? colors.green
                                : colors.white
                        }
                    />
                    {renderExtraCost()}
                    {renderRequiredMaterials()}
                </View>
                {isUpgradeable && (
                    <AppButton
                        onPress={onUpgrade}
                        style={{marginTop: gapSize.sizeS}}
                        text={strings.common.upgrade}
                    />
                )}
            </View>
        </View>
    );
};

export default UpgradeDetailOverlay;
