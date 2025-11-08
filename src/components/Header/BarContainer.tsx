import React, {useEffect, useRef, useState} from "react";
import {StyleSheet, View} from "react-native";

import * as Progress from "react-native-progress";
import {useSelector} from "react-redux";

import {colors, gapSize} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {AppText} from "@components/index.ts";
import {RootState} from "@redux/index.ts";
import {getHealthBarColor, renderNumber} from "@utils/helperFunctions.ts";
import {
    commonStyles,
    moderateScale,
    scaledValue,
    strings,
} from "@utils/index.ts";

// Custom hook to get the previous value
function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

const CHANGE_DISPLAY_DURATION = 1500; // Duration to display the change amount in ms

const BarContainer = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const userBonuses = useSelector(
        (state: RootState) => state.auth.userBonuses,
    );

    const previousHealth = usePrevious(user.health);
    const previousEnergy = usePrevious(user.energy);

    // State for showing the change amount
    const [healthChange, setHealthChange] = useState<number | null>(null);
    const [energyChange, setEnergyChange] = useState<number | null>(null);
    const [showHealthChange, setShowHealthChange] = useState(false);
    const [showEnergyChange, setShowEnergyChange] = useState(false);

    // Refs to store timer IDs
    const healthTimerRef = useRef<NodeJS.Timeout | null>(null);
    const energyTimerRef = useRef<NodeJS.Timeout | null>(null);

    const maxEnergy = userBonuses.max_energy;
    const maxHealth = userBonuses.max_health;

    const healthRate = maxHealth > 0 ? user.health / maxHealth : 0;
    const energyRate = maxEnergy > 0 ? user.energy / maxEnergy : 0;

    // Combined effect for health and energy changes
    useEffect(() => {
        // Check health change
        if (previousHealth !== undefined && user.health !== previousHealth) {
            const diff = user.health - previousHealth;
            setHealthChange(diff);
            setShowHealthChange(true);

            // Clear existing timer before setting a new one
            if (healthTimerRef.current) {
                clearTimeout(healthTimerRef.current);
            }

            healthTimerRef.current = setTimeout(() => {
                setShowHealthChange(false);
                healthTimerRef.current = null; // Clear the ref after timeout finishes
            }, CHANGE_DISPLAY_DURATION);
        }

        // Check energy change
        if (previousEnergy !== undefined && user.energy !== previousEnergy) {
            const diff = user.energy - previousEnergy;
            setEnergyChange(diff);
            setShowEnergyChange(true);

            // Clear existing timer before setting a new one
            if (energyTimerRef.current) {
                clearTimeout(energyTimerRef.current);
            }

            energyTimerRef.current = setTimeout(() => {
                setShowEnergyChange(false);
                energyTimerRef.current = null; // Clear the ref after timeout finishes
            }, CHANGE_DISPLAY_DURATION);
        }

        // Cleanup function for component unmount
        return () => {
            if (healthTimerRef.current) {
                clearTimeout(healthTimerRef.current);
            }
            if (energyTimerRef.current) {
                clearTimeout(energyTimerRef.current);
            }
        };
    }, [user.health, user.energy]);

    const renderChangeText = (change: number | null, show: boolean) => {
        if (!show || change === null || change === 0) return null;
        const sign = change > 0 ? "+" : "";
        const color = change > 0 ? colors.green : colors.red;
        return (
            <AppText
                text={` ${sign}${renderNumber(change, 0)}`}
                type={TextTypes.H7}
                fontSize={moderateScale(10)}
                color={color}
                style={styles.changeText}
            />
        );
    };

    return (
        <View style={styles.statsContainer}>
            <View style={styles.barSectionWrapper}>
                <View
                    style={[commonStyles.flexRowSpaceBetween, styles.statRow]}>
                    <View
                        style={[commonStyles.flexRow, {alignItems: "center"}]}>
                        <AppText
                            text={strings.gameKeys.hp}
                            type={TextTypes.H7}
                            fontSize={moderateScale(12)}
                            color={colors.white}
                        />
                        {renderChangeText(healthChange, showHealthChange)}
                    </View>
                    <AppText
                        text={`${renderNumber(user.health, 1)}/${renderNumber(
                            maxHealth,
                            1,
                        )}`}
                        type={TextTypes.H1}
                        fontSize={moderateScale(12)}
                        color={colors.white}
                    />
                </View>
                <Progress.Bar
                    height={4}
                    progress={healthRate}
                    width={scaledValue(130)}
                    borderRadius={1}
                    borderColor={colors.special}
                    unfilledColor={colors.secondaryTwo500}
                    color={getHealthBarColor(healthRate)}
                    style={styles.progressBar}
                />
            </View>

            <View
                style={[styles.barSectionWrapper, {marginTop: gapSize.sizeS}]}>
                <View
                    style={[commonStyles.flexRowSpaceBetween, styles.statRow]}>
                    <View
                        style={[commonStyles.flexRow, {alignItems: "center"}]}>
                        <AppText
                            text={strings.gameKeys.energy}
                            type={TextTypes.H7}
                            color={colors.white}
                        />
                        {renderChangeText(energyChange, showEnergyChange)}
                    </View>
                    <AppText
                        text={`${renderNumber(user.energy, 0)}/${renderNumber(
                            maxEnergy,
                            0,
                        )}`}
                        type={TextTypes.H1}
                        fontSize={moderateScale(12)}
                        color={colors.white}
                    />
                </View>
                <Progress.Bar
                    height={4}  
                    progress={energyRate}
                    width={scaledValue(130)}
                    borderRadius={1}
                    borderColor={colors.special}
                    unfilledColor={colors.grey900}
                    color={colors.orange}
                    style={styles.progressBar}
                />
            </View>
        </View>
    );
};

export default BarContainer;

const styles = StyleSheet.create({
    statsContainer: {
        marginLeft: gapSize.sizeL,
    },
    barSectionWrapper: {
        paddingHorizontal: gapSize.sizeS / 2,
        paddingVertical: gapSize.sizeS / 4,
        borderRadius: 4,
    },
    statRow: {
        // Removed marginTop as it's handled by the wrapper now
    },
    progressBar: {
        padding: 2,
        backgroundColor: colors.grey900,
        marginTop: gapSize.sizeS / 2,
    },
    changeText: {
        marginLeft: gapSize.sizeS / 2, // Space between label and change amount
    },
});
