import React, {ReactNode, useEffect, useState} from "react";
import {ActivityIndicator, View} from "react-native";

import {itemApis} from "@apis/index";
import {colors, gapSize, images} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {
    AppButton,
    AppImage,
    AppText,
    CheckBox,
    QualityChip,
} from "@components/index";
import RequiredMaterialsView from "@components/RequiredMaterialsView";
import useCooldownToRunFunction from "@hooks/useCooldownToRunFunction";
import {
    ArmorItem,
    HelmetItem,
    ItemType,
    UpgradeInfo,
    WeaponItem,
} from "@interfaces/GameInterface";
import VerticalDivider from "@screens/inventory/VerticalDivider";
import {renderNumber} from "@utils/helperFunctions";
import {commonStyles, scaledValue, strings} from "@utils/index";

interface SelectedItemViewProps {
    item: WeaponItem | ArmorItem | HelmetItem;
    onUpgrade: (useSafety: boolean) => void;
    isUpgrading: boolean;
}

const SelectedItemView = ({
    item,
    onUpgrade,
    isUpgrading,
}: SelectedItemViewProps) => {
    const [upgradeInfo, setUpgradeInfo] = useState<UpgradeInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [isSafeUpgrade, setIsSafeUpgrade] = useState(false);

    const triggerWithCooldown = useCooldownToRunFunction(2000);
    const isMaxLevel = upgradeInfo?.max_level;

    const hasRequiredMaterials =
        upgradeInfo?.required_upgrade_materials &&
        upgradeInfo?.required_upgrade_materials.length > 0;

    useEffect(() => {
        getUpgradeDetails();
    }, [item]);

    function getUpgradeDetails() {
        setLoading(true);
        setUpgradeInfo(null);
        itemApis
            .getUpgradeInfo(item.id, item.type)
            .then(res => {
                setUpgradeInfo(res.data);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function getNextValue(key: string, subName?: string) {
        if (isMaxLevel) {
            return 0;
        }
        if (subName) {
            return upgradeInfo?.projected_stats.properties[key];
        }
        return upgradeInfo?.projected_stats[key];
    }

    function renderSubProperties() {
        if ("properties" in item && item.properties) {
            const list: ReactNode[] = [];
            Object.entries(item.properties).map(([key, value], index) => {
                list.push(
                    <View
                        key={`sub-property-${index}`}
                        style={[
                            commonStyles.flexRow,
                            {marginTop: gapSize.sizeM},
                        ]}>
                        <AppText
                            preText="• "
                            text={`s-${strings.common.gameKeys[key]}: `}
                        />
                        <AppText
                            text={`${renderNumber(parseFloat(value), 3)} → `}
                            type={TextTypes.BodyBold}
                        />
                        {!isMaxLevel && (
                            <AppText
                                text={`${renderNumber(
                                    getNextValue(key, "sub"),
                                    3,
                                )}`}
                                type={TextTypes.BodyBold}
                                color={colors.green}
                            />
                        )}
                    </View>,
                );
            });
            return list;
        }
        return undefined;
    }

    function renderMainProperties() {
        let key = "";
        let value = 0;
        switch (item.type) {
            case ItemType.Weapon:
                key = "damage";
                value = item.damage;
                break;
            case ItemType.Armor:
                key = "defence";
                value = item.defence;
                break;
            case ItemType.Helmet:
                key = "health";
                value = item.health;
                break;
        }
        return (
            <View style={commonStyles.flexRow}>
                <AppText
                    preText="• "
                    text={strings.common.gameKeys[key]}
                    postText=": "
                />
                <AppText
                    text={`${renderNumber(value, 2)} → `}
                    type={TextTypes.BodyBold}
                />
                {!isMaxLevel && (
                    <AppText
                        text={`${renderNumber(getNextValue(key), 2)}`}
                        type={TextTypes.BodyBold}
                        color={colors.green}
                    />
                )}
            </View>
        );
    }

    function renderUpgradeChanceColor() {
        if (upgradeInfo?.success_chance) {
            if (upgradeInfo.success_chance >= 75) {
                return colors.green;
            } else if (upgradeInfo.success_chance >= 30) {
                return colors.orange;
            } else {
                return colors.red;
            }
        }
        return colors.white;
    }

    return (
        <View
            style={{
                height: scaledValue(hasRequiredMaterials ? 340 : 275),
                width: "100%",
                borderColor: colors.secondary500,
                borderWidth: 1,
                alignItems: "center",
                padding: gapSize.sizeM,
            }}>
            {loading ? (
                <ActivityIndicator
                    color={colors.white}
                    style={{marginTop: 100}}
                />
            ) : (
                <>
                    <View
                        style={{
                            width: "100%",
                            height: hasRequiredMaterials ? "44%" : "55%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}>
                        <View style={{width: "25%"}}>
                            <View style={commonStyles.flexRow}>
                                <AppText
                                    text={strings.upgradeItem.chance}
                                    postText=": "
                                />
                                <AppText
                                    text={renderNumber(
                                        upgradeInfo?.success_chance,
                                        1,
                                    )}
                                    postText="%"
                                    type={TextTypes.BodyBold}
                                    color={renderUpgradeChanceColor()}
                                />
                            </View>
                            <View
                                style={[
                                    commonStyles.flexRow,
                                    {marginTop: gapSize.sizeM},
                                ]}>
                                <AppText
                                    text={strings.common.grade}
                                    postText=": "
                                />
                                <AppText
                                    text={`${upgradeInfo?.current_grade} → `}
                                    type={TextTypes.BodyBold}
                                />
                                <AppText
                                    text={`${upgradeInfo?.next_grade}`}
                                    type={TextTypes.BodyBold}
                                    color={colors.green}
                                />
                            </View>
                            <View
                                style={[
                                    commonStyles.flexRow,
                                    {marginTop: gapSize.sizeM},
                                ]}>
                                <AppText
                                    text={strings.common.level}
                                    postText=": "
                                />
                                <AppText text={`${item.required_level}`} />
                            </View>
                            <View
                                style={[
                                    commonStyles.flexRow,
                                    {marginTop: gapSize.sizeM},
                                ]}>
                                <QualityChip quality={item.quality} />
                            </View>
                        </View>
                        <VerticalDivider
                            style={{height: "55%"}}
                            marginHorizontal={2}
                        />
                        <View style={{width: "62%"}}>
                            {upgradeInfo && renderMainProperties()}
                            {upgradeInfo && renderSubProperties()}
                        </View>
                    </View>
                    <RequiredMaterialsView
                        requiredMaterials={
                            upgradeInfo?.required_upgrade_materials ?? []
                        }
                        containerStyle={{top: -gapSize.sizeL}}
                    />
                    {!isMaxLevel && (
                        <View
                            style={[
                                commonStyles.flexRowAlignCenter,
                                {marginBottom: gapSize.sizeS},
                            ]}>
                            <AppImage source={images.icons.money} size={35} />
                            <AppText
                                text={renderNumber(
                                    isSafeUpgrade
                                        ? upgradeInfo?.total_safety_cost
                                        : upgradeInfo?.upgrade_cost,
                                    2,
                                )}
                                postText="$"
                                style={{
                                    marginLeft: gapSize.sizeS,
                                    marginRight: 10,
                                }}
                                type={TextTypes.H2}
                            />
                            {upgradeInfo?.needs_safety && (
                                <CheckBox
                                    text={strings.upgradeItem.safeUpgrade}
                                    isChecked={isSafeUpgrade}
                                    onPress={() =>
                                        setIsSafeUpgrade(!isSafeUpgrade)
                                    }
                                    style={{marginRight: "-25%"}}
                                />
                            )}
                        </View>
                    )}
                    {!isMaxLevel && (
                        <AppButton
                            text={strings.upgradeItem.title}
                            onPress={() => {
                                triggerWithCooldown(() => {
                                    onUpgrade(isSafeUpgrade);
                                });
                            }}
                            loading={loading || isUpgrading}
                            promptTitle={
                                !isSafeUpgrade && upgradeInfo?.needs_safety
                                    ? strings.common.warning
                                    : undefined
                            }
                            promptText={
                                !isSafeUpgrade
                                    ? strings.upgradeItem.safeUpgradeDescription
                                    : undefined
                            }
                        />
                    )}
                </>
            )}
        </View>
    );
};

export default SelectedItemView;
