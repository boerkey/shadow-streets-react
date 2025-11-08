import React from "react";
import {Platform, View} from "react-native";

import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import Divider from "@components/Divider";
import {AppImage, AppText} from "@components/index.ts";
import {PartyJob} from "@interfaces/GameInterface.ts";
import {FirebaseParty, getTotalPartyStat} from "@screens/jobs/logic.ts";
import {renderNumber} from "@utils/helperFunctions.ts";
import {commonStyles, strings} from "@utils/index.ts";
import {getItemImage} from "@utils/itemHelpers";

// Define valid stat keys for type safety
type StatKey = "strength" | "dexterity" | "intelligence" | "charisma";

export function getJobRequirements(partyJob: PartyJob | undefined) {
    function renderStats() {
        let stats: React.ReactNode[] = [];
        if (partyJob) {
            const recommendedStats = partyJob.recommended_stats || {};
            Object.entries(recommendedStats).forEach(([key, value]) => {
                if (
                    value > 0 &&
                    [
                        "strength",
                        "dexterity",
                        "intelligence",
                        "charisma",
                    ].includes(key)
                ) {
                    const statKey = key as StatKey;
                    stats.push(
                        <View key={statKey}>
                            <View style={commonStyles.flexRowSpaceBetween}>
                                <View style={commonStyles.flexRowAlignCenter}>
                                    <AppImage
                                        source={images.icons[statKey]}
                                        size={20}
                                    />
                                    <AppText
                                        text={`${strings.common[statKey]}`}
                                        style={{
                                            marginLeft: gapSize.sizeS,
                                        }}
                                    />
                                </View>
                                <AppText text={value} />
                            </View>
                            <Divider
                                text={""}
                                width={"100%"}
                                marginVertical={
                                    Platform.OS === "android"
                                        ? 3
                                        : gapSize.sizeS
                                }
                            />
                        </View>,
                    );
                }
            });
        }
        return stats;
    }
    return (
        <View style={{marginTop: gapSize.sizeM}}>
            <View style={commonStyles.flexRowSpaceBetween}>
                <AppText text={strings.jobs.requiredCrew} />
                <AppText text={partyJob?.required_crew ?? "-"} />
            </View>
            <Divider width={"100%"} marginVertical={gapSize.sizeS} />
            <View style={commonStyles.flexRowSpaceBetween}>
                <AppText text={strings.common.energy} />
                <AppText text={partyJob?.required_energy ?? "-"} />
            </View>
            <Divider width={"100%"} marginVertical={gapSize.sizeS} />
            {renderStats()}
        </View>
    );
}

export function getPartyStats(
    partyJob: PartyJob | undefined,
    partyDetails: FirebaseParty | null,
) {
    function renderPartyStats() {
        let stats: React.ReactNode[] = [];
        if (partyJob && partyDetails) {
            const recommendedStats = partyJob.recommended_stats || {};
            Object.entries(recommendedStats).forEach(([key, value]) => {
                if (
                    value > 0 &&
                    [
                        "strength",
                        "dexterity",
                        "intelligence",
                        "charisma",
                    ].includes(key)
                ) {
                    const statKey = key as StatKey;
                    stats.push(
                        <View key={statKey}>
                            <View style={commonStyles.flexRowSpaceBetween}>
                                <View style={commonStyles.flexRowAlignCenter}>
                                    <AppImage
                                        source={images.icons[statKey]}
                                        size={20}
                                    />
                                    <AppText
                                        text={`${strings.common[statKey]}`}
                                        style={{
                                            marginLeft: gapSize.sizeS,
                                        }}
                                    />
                                </View>
                                <AppText
                                    text={getTotalPartyStat(
                                        partyDetails,
                                        statKey,
                                    )}
                                />
                            </View>
                            <Divider
                                text={""}
                                width={"100%"}
                                marginVertical={gapSize.sizeS}
                            />
                        </View>,
                    );
                }
            });
        }
        return stats;
    }
    return (
        <View style={{marginTop: gapSize.sizeM}}>
            <View style={commonStyles.flexRowSpaceBetween}>
                <AppText text={strings.jobs.crew} />
                <AppText text={partyDetails?.crew?.length ?? 0} />
            </View>
            <Divider width={"100%"} marginVertical={gapSize.sizeS} />
            {renderPartyStats()}
        </View>
    );
}

export function renderRewards(partyDetails: FirebaseParty | null) {
    if (partyDetails && partyDetails.result) {
        const {
            result: {
                money_yield,
                experience_yield,
                strength_yield,
                charisma_yield,
                intelligence_yield,
                dexterity_yield,
            },
        } = partyDetails;

        const fontSize = Platform.OS === "ios" ? 22 : 18;
        const iconSize = Platform.OS === "ios" ? 28 : 24;
        return (
            <View style={{marginTop: gapSize.sizeL}}>
                <AppText
                    text={strings.jobs.rewards}
                    centered
                    type={TextTypes.BodyBold}
                    style={{marginBottom: gapSize.sizeM}}
                />
                <View style={commonStyles.flexRowSpaceBetween}>
                    <View style={{width: "30%"}}>
                        <View style={commonStyles.flexRowSpaceBetween}>
                            <AppImage
                                source={images.icons.money}
                                size={iconSize}
                            />
                            <AppText
                                text={`+${renderNumber(money_yield)}$`}
                                type={TextTypes.H5}
                                fontSize={fontSize}
                            />
                        </View>
                        <View style={commonStyles.flexRowSpaceBetween}>
                            <AppText
                                text={`XP`}
                                type={TextTypes.H5}
                                fontSize={fontSize}
                            />
                            <AppText
                                text={`+${renderNumber(experience_yield)}`}
                                type={TextTypes.H5}
                                fontSize={fontSize}
                            />
                        </View>
                    </View>
                    <View style={{width: "30%"}}>
                        <View style={commonStyles.flexRowSpaceBetween}>
                            <AppImage
                                source={images.icons.strength}
                                size={iconSize}
                            />
                            <AppText
                                text={`+${renderNumber(strength_yield, 2)}`}
                                type={TextTypes.H5}
                                fontSize={fontSize}
                            />
                        </View>
                        <View style={commonStyles.flexRowSpaceBetween}>
                            <AppImage
                                source={images.icons.dexterity}
                                size={iconSize}
                            />
                            <AppText
                                text={`+${renderNumber(dexterity_yield, 2)}`}
                                type={TextTypes.H5}
                                fontSize={fontSize}
                            />
                        </View>
                    </View>
                    <View style={{width: "30%"}}>
                        <View style={commonStyles.flexRowSpaceBetween}>
                            <AppImage
                                source={images.icons.intelligence}
                                size={iconSize}
                            />
                            <AppText
                                text={`+${renderNumber(intelligence_yield, 2)}`}
                                type={TextTypes.H5}
                                fontSize={fontSize}
                            />
                        </View>
                        <View style={commonStyles.flexRowSpaceBetween}>
                            <AppImage
                                source={images.icons.charisma}
                                size={iconSize}
                            />
                            <AppText
                                text={`+${renderNumber(charisma_yield, 2)}`}
                                type={TextTypes.H5}
                                fontSize={fontSize}
                            />
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

interface DroppedItem {
    item_id: number;
    item_type: number;
    user_id: number;
}

interface AggregatedItem {
    item_id: number;
    item_type: number;
    count: number;
}

export function renderItemRewards(droppedItems: DroppedItem[] | undefined) {
    if (!droppedItems || droppedItems.length === 0) {
        return null; // Don't render anything if no items
    }

    // Aggregate items
    const aggregated: {[key: string]: AggregatedItem} = {};
    droppedItems.forEach(item => {
        const key = `${item.item_type}_${item.item_id}`;
        if (aggregated[key]) {
            aggregated[key].count++;
        } else {
            aggregated[key] = {
                item_id: item.item_id,
                item_type: item.item_type,
                count: 1,
            };
        }
    });

    const itemsToRender = Object.values(aggregated);

    return (
        <View style={{marginTop: gapSize.sizeL, alignItems: "center"}}>
            <AppText
                text={strings.jobs.loot}
                centered
                type={TextTypes.BodyBold}
                style={{marginBottom: gapSize.sizeM}}
            />
            <View
                style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                }}>
                {itemsToRender.map((item, index) => {
                    const imageSource = getItemImage(item); // Use helper to get image source
                    return (
                        <View
                            key={`${item.item_type}_${item.item_id}_${index}`}
                            style={[
                                {
                                    alignItems: "center",
                                    marginHorizontal: gapSize.sizeM,
                                    marginBottom: gapSize.sizeM,
                                },
                            ]}>
                            <AppImage
                                source={imageSource}
                                size={Platform.OS === "ios" ? 40 : 30} // Adjust size as needed
                                style={{
                                    marginBottom:
                                        Platform.OS === "ios"
                                            ? gapSize.sizeS
                                            : 2,
                                }}
                            />
                            <AppText
                                text={`x${item.count}`}
                                type={TextTypes.BodyBold}
                            />
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

// mostly to show the error message
export function renderPartyMessage(partyDetails: FirebaseParty | null) {
    return (
        <View style={{marginTop: gapSize.sizeL}}>
            <AppText
                text={partyDetails?.message}
                centered
                color={
                    partyDetails?.result?.succeeded ? colors.green : colors.red
                }
            />
        </View>
    );
}
