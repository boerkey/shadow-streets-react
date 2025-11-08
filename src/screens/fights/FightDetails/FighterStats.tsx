import {AppText, Divider} from "@components/index.ts";
import {renderNumber} from "@utils/helperFunctions.ts";
import {scaledValue, strings} from "@utils/index.ts";
import React from "react";
import {StyleSheet, View} from "react-native";

interface FighterStatsProps {
    damage: number;
    defence: number;
    level: number;
    isAttacker: boolean;
}

const FighterStats = ({
    damage,
    defence,
    level,
    isAttacker,
}: FighterStatsProps) => {
    return (
        <View>
            <View
                style={
                    isAttacker
                        ? styles.attackerContainer
                        : styles.defenderContainer
                }>
                <AppText text={strings.common.dmg} />
                <AppText text={renderNumber(damage)} />
            </View>
            <Divider marginVertical={2} width={"100%"} />
            <View
                style={
                    isAttacker
                        ? styles.attackerContainer
                        : styles.defenderContainer
                }>
                <AppText text={strings.common.def} />
                <AppText text={renderNumber(defence)} />
            </View>
            <Divider marginVertical={2} width={"100%"} />
            <View
                style={
                    isAttacker
                        ? styles.attackerContainer
                        : styles.defenderContainer
                }>
                <AppText text={strings.common.lvl} />
                <AppText text={level} />
            </View>
            <Divider marginVertical={2} width={"100%"} />
        </View>
    );
};
export default FighterStats;

const styles = StyleSheet.create({
    attackerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: scaledValue(82),
    },
    defenderContainer: {
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        alignItems: "center",
        width: scaledValue(82),
    },
});
