import React, {ReactNode, useState} from "react";
import {ScrollView, TouchableOpacity, View} from "react-native";

import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {AppImage, AppText} from "@components/index.ts";
import UpgradeDetailOverlay from "@components/UpgradeTree/UpgradeDetailOverlay.tsx";
import {GamePropertyUpgrade, PropertyType} from "@interfaces/GameInterface.ts";
import {PropertyUpgrade} from "@interfaces/PropertyInterface.ts";
import {getDarkBackground} from "@utils/helperFunctions.ts";
import {commonStyles, scaledValue} from "@utils/index.ts";

interface UpgradeTreeProps {
    upgradeTree: GamePropertyUpgrade[];
    availableUpgrades: {upgrade_id: number}[];
    filterType: PropertyType | -1;
    onUpgrade: (upgradeId: number) => void;
    upgradeType?: "Property" | "Gang";
    canUpgrade: boolean;
}

const UpgradeTree = ({
    upgradeTree = [],
    availableUpgrades = [],
    filterType,
    onUpgrade = () => {},
    upgradeType = "Property",
    canUpgrade = false,
}: UpgradeTreeProps) => {
    const [selectedUpgrade, setSelectedUpgrade] =
        useState<GamePropertyUpgrade | null>(null);

    function isThisUpgradeExists(upgrade: PropertyUpgrade) {
        return availableUpgrades.find(each => each.upgrade_id === upgrade.id);
    }

    function numberToRomanNumber(number: number) {
        const romanNumberList = [
            "I",
            "II",
            "III",
            "IV",
            "V",
            "VI",
            "VII",
            "VIII",
            "IX",
            "X",
        ];
        return romanNumberList[number];
    }

    function selectUpgrade(upgrade: PropertyUpgrade, index: number) {
        if (
            upgrade.id == selectedUpgrade?.id &&
            selectedUpgrade.index === index
        ) {
            return setSelectedUpgrade(null);
        }
        setSelectedUpgrade(upgrade);
    }

    function isUpgradeable(upgrade: PropertyUpgrade, level: number) {
        const existingUpgrade = isThisUpgradeExists(upgrade);
        if (existingUpgrade) {
            return level > existingUpgrade.level;
        }
        return true;
    }

    const UpgradeItem = ({item, index, isDisabled}) => {
        const {id, name} = item;
        const isSelected = selectedUpgrade?.index === index;
        return (
            <TouchableOpacity
                disabled={isDisabled}
                onPress={() => {
                    selectUpgrade(
                        {
                            ...item,
                            index,
                            isUpgradeable: isUpgradeable(item, index + 1),
                        },
                        index,
                    );
                }}
                style={{
                    alignItems: "center",
                }}>
                <AppText
                    text={numberToRomanNumber(index)}
                    type={TextTypes.H4}
                />
                <View
                    style={{
                        padding: scaledValue(8),
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 2,
                        borderColor: isSelected ? colors.secondary500 : "#555",
                        width: 100,
                        height: 100,
                        backgroundColor: getDarkBackground(9),
                        opacity: isDisabled ? 0.35 : 1,
                    }}>
                    <AppImage
                        source={
                            upgradeType === "Property"
                                ? images.propertyUpgrades[id]
                                : images.gangUpgrades[id]
                        }
                        size={isDisabled ? 65 : 75}
                    />
                    <AppImage
                        source={images.upgradeIcons[index + 1]}
                        style={{position: "absolute", right: 0}}
                    />
                    {isDisabled ? (
                        <AppImage source={images.icons.lock} size={20} />
                    ) : (
                        <AppText
                            text={name}
                            type={TextTypes.BodyBold}
                            style={{marginTop: -gapSize.sizeS}}
                            fontSize={12}
                            shortenLength={13}
                        />
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const _renderUpgradeTree = () => {
        const fullTree: ReactNode[] = [];
        upgradeTree
            .filter(each => {
                if (filterType !== -1) {
                    return each.type === filterType;
                }
                return true;
            })
            .filter(each => {
                if (selectedUpgrade) {
                    return each.id === selectedUpgrade.id;
                }
                return true;
            })
            .forEach(item => {
                const eachTree: ReactNode[] = [];
                item.cost.forEach((cost, i) => {
                    let currentUpgradeLevel = 0;
                    const hasNextItem = item.cost[i + 1];
                    const currentUpgrade = isThisUpgradeExists(item);
                    if (currentUpgrade) {
                        currentUpgradeLevel = currentUpgrade.level;
                    }
                    eachTree.push(
                        <View
                            key={item.id + i + item.name}
                            style={commonStyles.flexRowAlignCenter}>
                            <UpgradeItem
                                item={item}
                                index={i}
                                isDisabled={i > currentUpgradeLevel}
                            />
                            {hasNextItem && (
                                <View
                                    style={{
                                        width: 24,
                                        height: 1,
                                        backgroundColor: colors.secondary500,
                                        top: 10,
                                    }}
                                />
                            )}
                        </View>,
                    );
                });

                fullTree.push(
                    <ScrollView
                        key={item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={[
                            commonStyles.flexRowAlignCenter,
                            {marginBottom: gapSize.sizeL},
                        ]}>
                        {eachTree}
                    </ScrollView>,
                );
            });
        return fullTree;
    };

    return (
        <>
            <ScrollView style={{zIndex: 2}}>{_renderUpgradeTree()}</ScrollView>
            <UpgradeDetailOverlay
                onUpgrade={() => {
                    if (selectedUpgrade) {
                        onUpgrade(selectedUpgrade.id);
                        setTimeout(() => setSelectedUpgrade(null), 50);
                    }
                }}
                upgrade={selectedUpgrade}
                canUpgrade={canUpgrade}
                upgradeType={upgradeType}
            />
        </>
    );
};

export default UpgradeTree;
