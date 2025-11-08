import React from "react";
import {StyleSheet, View} from "react-native";

import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {AppImage, AppText, Avatar} from "@components/index.ts";
import {
    FightResult as FightResultInterface,
    FightResultType,
} from "@interfaces/UserInterface.ts";
import {renderNumber} from "@utils/helperFunctions.ts";
import {commonStyles, scaledValue, strings} from "@utils/index.ts";

const rewardFontSize = 18;
const statRewardFontSize = 14;

const FightResult = ({
    fightResultType,
    result,
    winnerName,
    isWinnerOrLoser,
    winnerFrameId,
    winnerImage,
}: {
    fightResultType: FightResultType;
    result: FightResultInterface;
    winnerName: string;
    isWinnerOrLoser: undefined | boolean;
    winnerFrameId?: number;
    winnerImage: string;
}) => {
    function getWinnerName() {
        if (isWinnerOrLoser !== undefined) {
            if (isWinnerOrLoser) {
                return strings.fights.winnerOfFight.replace(
                    "{name}",
                    strings.fights.you,
                );
            }
            return strings.fights.youLostTheFight;
        }
        return strings.fights.winnerOfFight.replace("{name}", winnerName);
    }

    const conditionalMultiplier =
        isWinnerOrLoser === undefined ? 1 : isWinnerOrLoser ? 1 : -1;

    const conditionalColor =
        isWinnerOrLoser === undefined
            ? colors.white
            : isWinnerOrLoser
            ? colors.green
            : colors.red;

    return (
        <View
            style={{
                backgroundColor: colors.black,
                borderWidth: 1,
                borderColor: colors.secondary500,
                padding: gapSize.sizeM,
                marginTop: scaledValue(12),
            }}>
            <AppText
                text={strings.common.result}
                type={TextTypes.H4}
                fontSize={24}
                centered
            />
            {fightResultType ===
            FightResultType.RESULT_TYPE_DEFENDER_CHARISMA_DODGE ? (
                <View>
                    <AppText
                        text={strings.fights.defenderDodged}
                        type={TextTypes.BodyBold}
                        centered
                    />
                </View>
            ) : (
                <View
                    style={[
                        commonStyles.alignItemsCenter,
                        {marginTop: gapSize.sizeM},
                    ]}>
                    <Avatar
                        source={winnerImage}
                        size={75}
                        frameId={winnerFrameId}
                    />
                    <AppText
                        text={getWinnerName()}
                        type={TextTypes.BodyBold}
                        style={{marginVertical: gapSize.sizeM}}
                        color={conditionalColor}
                    />
                    <View
                        style={[
                            commonStyles.flexRowSpaceBetween,
                            {width: "95%"},
                        ]}>
                        <View
                            style={[
                                styles.eachSectionContainer,
                                {width: "27%"},
                            ]}>
                            <View
                                style={[
                                    commonStyles.flexRowSpaceBetweenAlignCenter,
                                ]}>
                                <AppImage
                                    source={images.icons.money}
                                    style={{left: -5}}
                                />
                                <AppText
                                    text={renderNumber(result.money_gain)}
                                    postText={"$"}
                                    type={TextTypes.H6}
                                    fontSize={statRewardFontSize}
                                    style={{marginLeft: gapSize.sizeS}}
                                    color={conditionalColor}
                                />
                            </View>
                            <View
                                style={[
                                    commonStyles.flexRowSpaceBetweenAlignCenter,
                                ]}>
                                <AppText
                                    text={strings.common.xp}
                                    type={TextTypes.H6}
                                    fontSize={rewardFontSize}
                                    color={colors.orange}
                                />
                                <AppText
                                    text={renderNumber(result.experience_gain)}
                                    type={TextTypes.H6}
                                    fontSize={statRewardFontSize}
                                    style={{marginLeft: gapSize.sizeS}}
                                    color={conditionalColor}
                                />
                            </View>
                            <View
                                style={[
                                    commonStyles.flexRowSpaceBetweenAlignCenter,
                                    {
                                        opacity:
                                            result.prestige_gain !== 0 ? 1 : 0,
                                    },
                                ]}>
                                <AppText
                                    text={strings.common.pre}
                                    type={TextTypes.H6}
                                    fontSize={rewardFontSize}
                                />
                                <AppText
                                    text={result.prestige_gain}
                                    type={TextTypes.H6}
                                    fontSize={statRewardFontSize}
                                    style={{
                                        marginLeft: gapSize.sizeS,
                                    }}
                                    color={conditionalColor}
                                />
                            </View>
                        </View>
                        <View style={styles.eachSectionContainer}>
                            <View style={commonStyles.flexRowAlignCenter}>
                                <AppImage source={images.icons.strength} />
                                <AppText
                                    text={renderNumber(result.strength_gain, 2)}
                                    type={TextTypes.H6}
                                    fontSize={statRewardFontSize}
                                    style={{marginLeft: gapSize.sizeS}}
                                    color={conditionalColor}
                                />
                            </View>
                            <View style={[commonStyles.flexRowAlignCenter]}>
                                <AppImage source={images.icons.dexterity} />
                                <AppText
                                    text={renderNumber(
                                        result.dexterity_gain,
                                        2,
                                    )}
                                    type={TextTypes.H6}
                                    fontSize={statRewardFontSize}
                                    style={{marginLeft: gapSize.sizeS}}
                                    color={conditionalColor}
                                />
                            </View>
                            <View
                                style={[
                                    commonStyles.flexRowAlignCenter,
                                    {
                                        opacity:
                                            result.bounty_gain !== 0 ? 1 : 0,
                                    },
                                ]}>
                                <AppImage
                                    source={images.icons.bountyWithBackground}
                                />
                                <AppText
                                    text={renderNumber(result.bounty_gain)}
                                    type={TextTypes.H6}
                                    fontSize={statRewardFontSize}
                                    style={{marginLeft: gapSize.sizeS}}
                                    color={
                                        result.bounty_gain > 0
                                            ? colors.red
                                            : colors.green
                                    }
                                />
                            </View>
                        </View>
                        <View style={styles.eachSectionContainer}>
                            <View style={commonStyles.flexRowAlignCenter}>
                                <AppImage source={images.icons.intelligence} />
                                <AppText
                                    text={renderNumber(
                                        result.intelligence_gain,
                                        2,
                                    )}
                                    type={TextTypes.H6}
                                    fontSize={statRewardFontSize}
                                    style={{marginLeft: gapSize.sizeS}}
                                    color={conditionalColor}
                                />
                            </View>
                            <View style={commonStyles.flexRowAlignCenter}>
                                <AppImage source={images.icons.charisma} />
                                <AppText
                                    text={renderNumber(result.charisma_gain, 2)}
                                    type={TextTypes.H6}
                                    fontSize={statRewardFontSize}
                                    style={{marginLeft: gapSize.sizeS}}
                                    color={conditionalColor}
                                />
                            </View>
                            <View
                                style={[
                                    commonStyles.flexRowAlignCenter,
                                    {opacity: 0},
                                ]}>
                                <AppImage source={images.icons.charisma} />
                                <AppText
                                    text={renderNumber(
                                        result.charisma_gain *
                                            conditionalMultiplier,
                                        2,
                                    )}
                                    type={TextTypes.H6}
                                    fontSize={statRewardFontSize}
                                    style={{marginLeft: gapSize.sizeS}}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

export default FightResult;

const styles = StyleSheet.create({
    eachSectionContainer: {
        height: scaledValue(100),

        justifyContent: "space-between",
    },
});
