import React from "react";
import {ImageBackground, Platform, View} from "react-native";

import {colors, gapSize, images} from "@assets/index.ts";
import {AppImage, AppText} from "@components/index.ts";
import {Classes} from "@interfaces/GameInterface.ts";
import {commonStyles, scaledValue, strings} from "@utils/index.ts";

const ClassCard = ({classId = 1}) => {
    function getRiskCircle(risk: number) {
        let color = "";
        switch (risk) {
            case Classes.BUSINESSMAN:
                color = colors.green;
                break;
            case Classes.DETECTIVE:
                color = colors.orange;
                break;
            case Classes.GANGSTER:
                color = colors.red;
                break;
        }
        return (
            <View
                style={{
                    width: scaledValue(10),
                    height: scaledValue(10),
                    backgroundColor: color,
                    borderRadius: 5,
                }}
            />
        );
    }

    const RiskLevel = () => {
        return (
            <View
                style={{
                    backgroundColor: "#191717",
                    borderWidth: 1,
                    borderColor: colors.borderColor,
                    height: scaledValue(Platform.OS === "ios" ? 33 : 38),
                    width: scaledValue(87),
                    position: "absolute",
                    bottom: "33%",
                    left: "7%",
                    paddingVertical: 3,
                    paddingHorizontal: 6,
                }}>
                <AppText text={"Risk Level"} type={"bodySmall"} />
                <View
                    style={{
                        top: -2,
                        flexDirection: "row",
                        alignItems: "center",
                    }}>
                    {getRiskCircle(classId)}
                    <AppText
                        text={strings.selectClass.riskRates[classId]}
                        style={{marginLeft: 4}}
                    />
                </View>
            </View>
        );
    };

    const Stats = () => {
        const mainStats = [];
        switch (classId) {
            case Classes.GANGSTER:
                mainStats.push(strings.common.strength);
                mainStats.push(strings.common.intelligence);
                break;
            case Classes.DETECTIVE:
                mainStats.push(strings.common.dexterity);
                mainStats.push(strings.common.intelligence);
                break;
            case Classes.BUSINESSMAN:
                mainStats.push(strings.common.intelligence);
                mainStats.push(strings.common.charisma);
                break;
        }
        return (
            <View
                style={{
                    position: "absolute",
                    bottom: "33%",
                    right: "7%",
                }}>
                {mainStats.map((each, i) => (
                    <AppImage
                        key={i}
                        source={images.icons[each.toLowerCase()]}
                        size={44}
                        style={{
                            marginBottom: scaledValue(3),
                        }}
                    />
                ))}
            </View>
        );
    };

    function getMoneyGainRates() {
        switch (classId) {
            case Classes.GANGSTER:
                return "2x";
            case Classes.DETECTIVE:
                return "1.5x";
            case Classes.BUSINESSMAN:
                return "1x";
        }
    }

    function getMainStats() {
        switch (classId) {
            case Classes.GANGSTER:
                return (
                    strings.common.strength + ", " + strings.common.intelligence
                );
            case Classes.DETECTIVE:
                return (
                    strings.common.dexterity +
                    ", " +
                    strings.common.intelligence
                );
            case Classes.BUSINESSMAN:
                return (
                    strings.common.intelligence + ", " + strings.common.charisma
                );
        }
    }

    function getTraits() {
        switch (classId) {
            case Classes.GANGSTER:
        }

        return (
            <>
                <View style={commonStyles.flexRow}>
                    <AppText
                        text={strings.selectClass.jobEarningsRate}
                        color={"#292927"}
                    />
                    <AppText
                        text={getMoneyGainRates()}
                        type={"bodyBold"}
                        color={"#292927"}
                    />
                </View>
                <View style={commonStyles.flexRow}>
                    <AppText
                        text={strings.selectClass.mainStats}
                        color={"#292927"}
                    />
                    <AppText
                        text={getMainStats()}
                        type={"bodyBold"}
                        color={"#292927"}
                    />
                </View>
            </>
        );
    }

    function getClassImage() {
        switch (classId) {
            case Classes.GANGSTER:
                return images.containers.classGangster;
            case Classes.DETECTIVE:
                return images.containers.classDetective;
            case Classes.BUSINESSMAN:
                return images.containers.classBusinessman;
        }
    }

    return (
        <ImageBackground
            key={classId}
            style={{
                width: scaledValue(Platform.OS === "ios" ? 300 : 300 * 0.9),
                height: scaledValue(Platform.OS === "ios" ? 451 : 451 * 0.9),
            }}
            source={getClassImage()}>
            <AppText
                text={strings.common.classNames[classId]}
                centered
                type={"h5"}
                color={"#1f1f1d"}
                style={{top: scaledValue(33)}}
            />
            <RiskLevel />
            <Stats />
            <View
                style={{
                    position: "absolute",
                    bottom: 12,
                    width: "89%",
                    alignSelf: "center",
                    height: "27%",
                    padding: gapSize.sizeS,
                }}>
                <AppText
                    text={strings.common.traits}
                    type={"h5"}
                    centered
                    color={"#1f1f1d"}
                />
                {getTraits()}
            </View>
        </ImageBackground>
    );
};

export default ClassCard;
