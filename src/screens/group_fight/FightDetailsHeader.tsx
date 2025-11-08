import {View} from "react-native";

import {useSelector} from "react-redux";

import {colors, gapSize, images} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {AppText, Avatar, VerticalDivider} from "@components/index";
import {commonStyles, scaledValue, strings} from "@utils/index";

import {GroupFightParticipant} from "@interfaces/GroupFight";
import {RootState} from "@redux/index";
import {renderNumber} from "@utils/helperFunctions";

const FightDetailsHeader = () => {
    const groupFightDetails = useSelector(
        (state: RootState) => state.groupFight.groupFightDetails,
    );

    function getGoal() {
        switch (groupFightDetails?.group_fight?.goal) {
            case 1:
                return "BLOCKADE";
        }
    }

    function getTotalPlayerAmount(side: "attacker" | "defender") {
        return groupFightDetails?.sides[side].participants?.length ?? 0;
    }

    function getAlivePlayerAmount(side: "attacker" | "defender") {
        return (
            groupFightDetails?.sides[side].participants?.filter(
                (participant: GroupFightParticipant) => participant.health > 0,
            )?.length ?? 0
        );
    }

    return (
        <View
            style={{
                borderWidth: 1,
                borderColor: colors.secondary500,
                minHeight: scaledValue(169),
                padding: gapSize.sizeM,
            }}>
            <View style={commonStyles.flexRowSpaceBetweenAlignCenter}>
                <AppText
                    text={groupFightDetails?.sides.attacker.name}
                    style={{
                        width: "40%",
                    }}
                />
                <AppText text={"VS"} type={TextTypes.Title} />
                <AppText
                    text={
                        groupFightDetails?.sides.defender.name
                            ? groupFightDetails?.sides.defender.name
                            : "Unknown"
                    }
                    style={{
                        width: "40%",
                        textAlign: "right",
                    }}
                />
            </View>
            <View style={[commonStyles.flexRow, {marginTop: gapSize.sizeS}]}>
                <Avatar
                    size={75}
                    noFrame
                    source={groupFightDetails?.sides.attacker.img_url}
                    defaultSource={images.examples.gang}
                />
                <View
                    style={{
                        width: "24%",
                        marginLeft: gapSize.sizeS,
                    }}>
                    <View
                        style={[
                            commonStyles.flexRowSpaceBetween,
                            {
                                width: "100%",
                                borderBottomWidth: 1,
                                borderColor: colors.lineColor,
                                paddingBottom: gapSize.sizeXS,
                                marginBottom: gapSize.sizeS,
                            },
                        ]}>
                        <AppText
                            text={strings.gameKeys.dmg}
                            type={TextTypes.Body2}
                        />
                        <AppText
                            text={renderNumber(
                                groupFightDetails?.sides.attacker.total_damage,
                                1,
                            )}
                            type={TextTypes.Body2}
                        />
                    </View>
                    <View
                        style={[
                            commonStyles.flexRowSpaceBetween,
                            {
                                width: "100%",
                                borderBottomWidth: 1,
                                borderColor: colors.lineColor,
                                paddingBottom: gapSize.sizeXS,
                                marginBottom: gapSize.sizeS,
                            },
                        ]}>
                        <AppText
                            text={strings.gameKeys.def}
                            type={TextTypes.Body2}
                        />
                        <AppText
                            text={renderNumber(
                                groupFightDetails?.sides.attacker.total_defence,
                                1,
                            )}
                            type={TextTypes.Body2}
                        />
                    </View>
                    <View
                        style={[
                            commonStyles.flexRowSpaceBetween,
                            {
                                width: "100%",
                                borderBottomWidth: 1,
                                borderColor: colors.lineColor,
                                paddingBottom: gapSize.sizeXS,
                                marginBottom: gapSize.sizeS,
                            },
                        ]}>
                        <AppText
                            text={strings.gameKeys.hp}
                            type={TextTypes.Body2}
                        />
                        <AppText
                            text={renderNumber(
                                groupFightDetails?.sides.attacker.total_health,
                                1,
                            )}
                            type={TextTypes.Body2}
                        />
                    </View>
                    <View
                        style={[
                            commonStyles.flexRowSpaceBetween,
                            {
                                width: "100%",
                                borderBottomWidth: 1,
                                borderColor: colors.lineColor,
                                paddingBottom: gapSize.sizeXS,
                                marginBottom: gapSize.sizeS,
                            },
                        ]}>
                        <AppText
                            text={strings.groupFight.crewSize}
                            type={TextTypes.Body2}
                        />
                        <AppText
                            text={
                                getAlivePlayerAmount("attacker") +
                                "/" +
                                getTotalPlayerAmount("attacker")
                            }
                            type={TextTypes.Body2}
                        />
                    </View>
                </View>
                <VerticalDivider style={{height: 90}} />
                <View
                    style={{
                        width: "24%",
                        marginRight: gapSize.sizeS,
                    }}>
                    <View
                        style={[
                            commonStyles.flexRowSpaceBetween,
                            {
                                width: "100%",
                                borderBottomWidth: 1,
                                borderColor: colors.lineColor,
                                paddingBottom: gapSize.sizeXS,
                                marginBottom: gapSize.sizeS,
                            },
                        ]}>
                        <AppText
                            text={strings.gameKeys.dmg}
                            type={TextTypes.Body2}
                        />
                        <AppText
                            text={renderNumber(
                                groupFightDetails?.sides.defender.total_damage,
                                1,
                            )}
                            type={TextTypes.Body2}
                        />
                    </View>
                    <View
                        style={[
                            commonStyles.flexRowSpaceBetween,
                            {
                                width: "100%",
                                borderBottomWidth: 1,
                                borderColor: colors.lineColor,
                                paddingBottom: gapSize.sizeXS,
                                marginBottom: gapSize.sizeS,
                            },
                        ]}>
                        <AppText
                            text={strings.gameKeys.def}
                            type={TextTypes.Body2}
                        />
                        <AppText
                            text={renderNumber(
                                groupFightDetails?.sides.defender.total_defence,
                                1,
                            )}
                            type={TextTypes.Body2}
                        />
                    </View>
                    <View
                        style={[
                            commonStyles.flexRowSpaceBetween,
                            {
                                width: "100%",
                                borderBottomWidth: 1,
                                borderColor: colors.lineColor,
                                paddingBottom: gapSize.sizeXS,
                                marginBottom: gapSize.sizeS,
                            },
                        ]}>
                        <AppText
                            text={strings.gameKeys.hp}
                            type={TextTypes.Body2}
                        />
                        <AppText
                            text={renderNumber(
                                groupFightDetails?.sides.defender.total_health,
                                1,
                            )}
                            type={TextTypes.Body2}
                        />
                    </View>
                    <View
                        style={[
                            commonStyles.flexRowSpaceBetween,
                            {
                                width: "100%",
                                borderBottomWidth: 1,
                                borderColor: colors.lineColor,
                                paddingBottom: gapSize.sizeXS,
                                marginBottom: gapSize.sizeS,
                            },
                        ]}>
                        <AppText
                            text={strings.groupFight.crewSize}
                            type={TextTypes.Body2}
                        />
                        <AppText
                            text={
                                getAlivePlayerAmount("defender") +
                                "/" +
                                getTotalPlayerAmount("defender")
                            }
                            type={TextTypes.Body2}
                        />
                    </View>
                </View>
                <Avatar
                    size={75}
                    noFrame
                    source={groupFightDetails?.sides.defender.img_url}
                    defaultSource={images.examples.gang}
                />
            </View>
            <AppText
                text={getGoal()}
                type={TextTypes.H7}
                style={{marginTop: gapSize.sizeM}}
                color={colors.red}
                centered
            />
        </View>
    );
};

export default FightDetailsHeader;
