import React, {useState} from "react";
import {ImageBackground, TouchableOpacity, View} from "react-native";

import * as Progress from "react-native-progress";
import {useSelector} from "react-redux";

import {characterApis} from "@apis/index";
import {colors, fonts, gapSize, images} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {AppButton, AppImage, AppText, Divider} from "@components/index";
import {GameMission} from "@interfaces/GameInterface";
import {RootState} from "@redux/index";
import {showToast} from "@utils/helperFunctions";
import {
    commonStyles,
    helperFunctions,
    scaledValue,
    strings,
} from "@utils/index";
import styles from "./styles";

const MissionItem = ({
    item,
    index,
    onMissionStart,
}: {
    item: GameMission;
    index: number;
    onMissionStart: () => void;
}) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const lastMission = useSelector(
        (state: RootState) => state.character.lastMission,
    );
    const activeMission = useSelector(
        (state: RootState) => state.character.activeMission,
    );
    const isLastMission = lastMission?.id === item.id;
    const [isExpanded, setIsExpanded] = useState(isLastMission ?? index === 0);
    const isBlockedByLevel = item.required_level > user.level;
    const isBlockedByEnergy = item.required_energy > user.energy;
    const hasActiveMission = activeMission?.id === item.id;
    const hasAnyActiveMission = !!activeMission;

    function startMission() {
        characterApis.startMission(item.id).then(res => {
            showToast(res.data.message);
            onMissionStart();
        });
    }

    function renderButton() {
        if (!isBlockedByLevel && !hasAnyActiveMission) {
            return (
                <AppButton
                    text={strings.jobs.startMission}
                    onPress={startMission}
                    style={{marginTop: gapSize.size2L}}
                    disabled={isBlockedByEnergy}
                    width={225}
                />
            );
        }
    }

    function renderRequirements() {
        if (!hasActiveMission) {
            return (
                <>
                    <AppText
                        text={strings.common.requirements}
                        type={TextTypes.BodyBold}
                        color={colors.white}
                    />
                    <View
                        style={{
                            marginTop: gapSize.sizeM,
                            width: "100%",
                        }}>
                        <View style={commonStyles.flexRowSpaceBetween}>
                            <AppText
                                fontSize={14}
                                text={strings.common.level}
                            />
                            <AppText
                                text={item.required_level}
                                color={colors.borderColor}
                                type={TextTypes.BodyBold}
                            />
                        </View>
                        <Divider width={"100%"} marginVertical={7} />
                        <View style={commonStyles.flexRowSpaceBetween}>
                            <AppText text={strings.common.energy} />
                            <AppText
                                text={item.required_energy}
                                color={colors.borderColor}
                                type={TextTypes.BodyBold}
                            />
                        </View>
                        <Divider width={"100%"} marginVertical={7} />

                        <View style={commonStyles.flexRowSpaceBetween}>
                            <AppText text={strings.common.duration} />
                            <AppText
                                text={`~${item.rounds} ${strings.common.min}`}
                                color={colors.borderColor}
                                type={TextTypes.BodyBold}
                            />
                        </View>
                        <Divider width={"100%"} marginVertical={7} />
                        <View style={commonStyles.flexRowSpaceBetween}>
                            <View style={commonStyles.flexRowAlignCenter}>
                                <AppImage
                                    source={images.icons.damage}
                                    size={18}
                                    style={{marginRight: gapSize.sizeS}}
                                />
                                <AppText
                                    text={strings.jobs.totalRequiredDamage}
                                />
                            </View>
                            <AppText
                                preText="~"
                                text={item.total_health}
                                color={colors.borderColor}
                                type={TextTypes.BodyBold}
                            />
                        </View>
                        <Divider width={"100%"} marginVertical={7} />
                        <View style={commonStyles.flexRowSpaceBetween}>
                            <View style={commonStyles.flexRowAlignCenter}>
                                <AppImage
                                    source={images.icons.defence}
                                    size={18}
                                    style={{marginRight: gapSize.sizeS}}
                                />
                                <AppText
                                    text={strings.jobs.possibleIncomingDamage}
                                />
                            </View>
                            <AppText
                                preText="~"
                                text={`${item.damage_per_round * item.rounds}`}
                                color={colors.borderColor}
                                type={TextTypes.BodyBold}
                            />
                        </View>
                        <Divider width={"100%"} marginVertical={7} />
                    </View>
                </>
            );
        }
    }

    function renderLastMission() {
        if (lastMission?.id === item.id && !hasActiveMission) {
            const {outcome} = lastMission;
            return (
                <View style={{width: "100%", marginBottom: gapSize.sizeL}}>
                    <AppText
                        text={strings.jobs.lastMission}
                        type={TextTypes.BodyBold}
                        centered
                    />
                    <View style={{marginTop: gapSize.sizeS}}>
                        <AppText
                            preText={strings.jobs.missionOutcome + ": "}
                            text={
                                outcome.succeeded
                                    ? strings.common.success
                                    : strings.common.failed
                            }
                            type={TextTypes.BodyBold}
                            color={
                                outcome.succeeded ? colors.green : colors.red
                            }
                            style={{marginBottom: gapSize.sizeS}}
                        />
                        <View
                            style={[
                                commonStyles.flexRowAlignCenter,
                                {marginBottom: gapSize.sizeS},
                            ]}>
                            <AppImage
                                source={images.icons.damage}
                                size={18}
                                style={{marginRight: gapSize.sizeS}}
                            />
                            <AppText
                                preText={strings.jobs.damageDealt + ": "}
                                text={helperFunctions.renderNumber(
                                    lastMission.damage_dealt,
                                    0,
                                )}
                            />
                        </View>
                        <View
                            style={[
                                commonStyles.flexRowAlignCenter,
                                {marginBottom: gapSize.sizeS},
                            ]}>
                            <AppImage
                                source={images.icons.defence}
                                size={18}
                                style={{marginRight: gapSize.sizeS}}
                            />
                            <AppText
                                preText={strings.jobs.damageReceived + ": "}
                                text={helperFunctions.renderNumber(
                                    lastMission.damage_received,
                                    0,
                                )}
                            />
                        </View>
                        <View
                            style={[
                                commonStyles.flexRowAlignCenter,
                                {marginBottom: gapSize.sizeS},
                            ]}>
                            <AppImage
                                source={images.icons.money}
                                size={18}
                                style={{marginRight: gapSize.sizeS}}
                            />
                            <AppText
                                text={strings.common.money + ": "}
                                postText={`${helperFunctions.renderNumber(
                                    outcome.money_yield,
                                    1,
                                )}`}
                            />
                        </View>
                        <View
                            style={[
                                commonStyles.flexRowAlignCenter,
                                {marginBottom: gapSize.sizeS},
                            ]}>
                            <AppImage
                                source={images.icons.shadowCoin}
                                size={18}
                                style={{marginRight: gapSize.sizeS}}
                            />
                            <AppText
                                text={strings.common.shadowCoin + ": "}
                                postText={`${helperFunctions.renderNumber(
                                    outcome.shadow_coin_yield,
                                    1,
                                )}`}
                            />
                        </View>
                    </View>
                </View>
            );
        }
        return null;
    }

    function renderCurrentMission() {
        if (hasActiveMission) {
            return (
                <>
                    <AppText
                        text={strings.jobs.activeMission}
                        type={TextTypes.BodyBold}
                        color={colors.white}
                    />
                    <View
                        style={{
                            marginTop: gapSize.sizeM,
                            width: "100%",
                        }}>
                        <View
                            style={commonStyles.flexRowSpaceBetweenAlignCenter}>
                            <View style={[commonStyles.flexRowAlignCenter]}>
                                <AppImage
                                    source={images.icons.damage}
                                    size={18}
                                    style={{marginRight: gapSize.sizeS}}
                                />
                                <AppText text={strings.jobs.damageDealt} />
                            </View>
                            <AppText
                                text={helperFunctions.renderNumber(
                                    activeMission.damage_dealt,
                                    0,
                                )}
                                type={TextTypes.BodyBold}
                                color={colors.green}
                            />
                        </View>
                        <Divider width={"100%"} marginVertical={7} />
                        <View
                            style={commonStyles.flexRowSpaceBetweenAlignCenter}>
                            <View style={[commonStyles.flexRowAlignCenter]}>
                                <AppImage
                                    source={images.icons.defence}
                                    size={18}
                                    style={{marginRight: gapSize.sizeS}}
                                />
                                <AppText text={strings.jobs.damageReceived} />
                            </View>
                            <AppText
                                text={helperFunctions.renderNumber(
                                    activeMission.damage_received,
                                    0,
                                )}
                                type={TextTypes.BodyBold}
                                color={colors.red}
                            />
                        </View>
                        <Divider width={"100%"} marginVertical={7} />
                    </View>
                </>
            );
        }
    }

    function renderProgress() {
        if (hasActiveMission) {
            const progressRatio = activeMission.round / item.rounds;
            return (
                <View
                    style={{
                        position: "absolute",
                        top: 7,
                        left: 7,
                        width: 100,
                    }}>
                    <View
                        style={[
                            commonStyles.flexRowSpaceBetween,
                            {marginBottom: gapSize.sizeS},
                        ]}>
                        <AppText
                            text={strings.common.progress}
                            type={TextTypes.BodySmall}
                        />
                        <AppText
                            text={`${helperFunctions.renderNumber(
                                progressRatio * 100,
                                0,
                            )}%`}
                            type={TextTypes.BodySmall}
                        />
                    </View>
                    <Progress.Bar
                        progress={progressRatio}
                        width={100}
                        height={7}
                        color={colors.yellow}
                        borderColor="#35434E"
                        unfilledColor={colors.grey900}
                        borderRadius={0}
                        style={{padding: 1}}
                    />
                </View>
            );
        }
    }

    return (
        <ImageBackground
            source={images.missions[1]}
            style={{marginBottom: scaledValue(12)}}>
            <TouchableOpacity
                onPress={() => setIsExpanded(!isExpanded)}
                style={[
                    styles.mainContainer,
                    {
                        height: scaledValue(isExpanded ? 131 : 88),
                    },
                ]}>
                {renderProgress()}
                <View>
                    <View style={{alignItems: "center"}}>
                        <View style={commonStyles.flexRow}>
                            <AppText
                                text={item.name}
                                type={TextTypes.H5}
                                color={colors.white}
                                style={{
                                    marginTop:
                                        hasActiveMission && !isExpanded
                                            ? 15
                                            : 0,
                                }}
                            />
                            {isBlockedByLevel && (
                                <AppImage
                                    source={images.icons.lock}
                                    size={18}
                                    style={{marginLeft: gapSize.sizeS}}
                                />
                            )}
                        </View>
                        {isBlockedByLevel && (
                            <AppText
                                text={strings.jobs.youNeedLevelToStartThisMission.replace(
                                    "{level}",
                                    item.required_level,
                                )}
                                type={TextTypes.BodySmall}
                                highlightStyle={{
                                    color: colors.secondary500,
                                    fontFamily: fonts.RalewayBold,
                                }}
                                wordsToHighlight={[
                                    `${strings.common.level} ${item.required_level}`,
                                ]}
                            />
                        )}
                    </View>
                </View>
            </TouchableOpacity>

            {isExpanded && (
                <View style={styles.requirementsContainer}>
                    {renderLastMission()}
                    {renderRequirements()}
                    {renderCurrentMission()}
                    {renderButton()}
                </View>
            )}
        </ImageBackground>
    );
};

export default MissionItem;
