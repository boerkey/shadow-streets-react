import React, {useEffect, useState} from "react";
import {ActivityIndicator, View} from "react-native";

import {useSelector} from "react-redux";

import {fightApis} from "@apis/index.ts";
import {colors, gapSize} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {AppText} from "@components/index.ts";
import {Fight, FightResultType} from "@interfaces/UserInterface.ts";
import {RootState} from "@redux/index.ts";
import FighterAvatar from "@screens/fights/FightDetails/FighterAvatar.tsx";
import FighterStats from "@screens/fights/FightDetails/FighterStats.tsx";
import FightMessages from "@screens/fights/FightDetails/FightMessages.tsx";
import FightResult from "@screens/fights/FightDetails/FightResult.tsx";
import {FightListItemInterface} from "@screens/fights/index.tsx";
import VerticalDivider from "@screens/inventory/VerticalDivider.tsx";
import {commonStyles, scaledValue} from "@utils/index.ts";

const FightDetails = ({fight}: {fight: FightListItemInterface}) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [fightDetails, setFightDetails] = useState<Fight>();
    const [loading, setLoading] = useState(true);

    const winnerId = fightDetails?.winner_id;

    useEffect(() => {
        if (!!fight.id) {
            getFightDetails();
        }
    }, [fight]);

    function getFightDetails() {
        setLoading(true);
        fightApis
            .getFightDetails(fight.id)
            .then(res => {
                setFightDetails(res.data);
            })
            .finally(() => {
                setTimeout(() => setLoading(false), 250);
            });
    }

    // by default we show the winner's result to avoid showing NEGATIVE values
    function getResult() {
        const myResult = fightDetails?.result.find(
            each => each.user_id === user.id,
        );
        if (myResult) {
            return myResult;
        }
        return fightDetails?.result.find(each => each.user_id === winnerId);
    }

    function getWinnerName() {
        if (winnerId === fight.attacker_id) {
            return fight.attacker_name;
        }
        if (winnerId === fight.defender_id) {
            return fight.defender_name;
        }
        return "";
    }

    function getWinnerImage() {
        if (winnerId === fight.attacker_id) {
            return fight.attacker_img_url;
        }
        return fight.defender_img_url;
    }

    function getWinnerFrameId() {
        if (winnerId === fight.attacker_id) {
            return fight.attacker_avatar_frame_id;
        }
        return fight.defender_avatar_frame_id;
    }

    function isWinnerOrLoser() {
        if (fight.attacker_id === user.id || fight.defender_id === user.id) {
            return winnerId === user.id;
        }
        return undefined;
    }

    if (loading) {
        return <ActivityIndicator style={{marginTop: "20%"}} />;
    }

    return (
        <View style={{marginTop: gapSize.sizeM}}>
            <View
                style={{
                    borderWidth: 1,
                    borderColor: colors.secondary500,
                    paddingHorizontal: scaledValue(12),
                    paddingVertical: scaledValue(8),
                    backgroundColor: colors.black,
                }}>
                <View style={commonStyles.flexRowSpaceBetween}>
                    <AppText
                        text={fight.attacker_name}
                        fontSize={15}
                        color={colors.white}
                    />
                    <AppText
                        text={"VS"}
                        type={TextTypes.H2}
                        fontSize={22}
                        color={colors.white}
                        style={{bottom: 5}}
                    />
                    <AppText
                        text={fight.defender_name}
                        fontSize={15}
                        color={colors.white}
                    />
                </View>
                <View style={[commonStyles.flexRowSpaceBetween]}>
                    <FighterAvatar
                        health={fightDetails?.attacker_health ?? 1}
                        maxHealth={fightDetails?.attacker_max_health ?? 1}
                        avatarSource={fight.attacker_img_url}
                        frameId={fight.attacker_avatar_frame_id}
                        isAttacker
                    />
                    <FighterStats
                        damage={fightDetails?.attacker_damage ?? 1}
                        defence={fightDetails?.attacker_defence ?? 1}
                        level={fightDetails?.attacker_level}
                        isAttacker
                    />
                    <VerticalDivider
                        style={{width: 0.5, marginHorizontal: scaledValue(4)}}
                    />
                    <FighterStats
                        damage={fightDetails?.defender_damage}
                        defence={fightDetails?.defender_defence}
                        level={fightDetails?.defender_level}
                    />
                    <FighterAvatar
                        health={fightDetails?.defender_health ?? 1}
                        maxHealth={fightDetails?.defender_max_health ?? 1}
                        avatarSource={fight.defender_img_url}
                        frameId={fight.defender_avatar_frame_id}
                    />
                </View>
            </View>
            <FightMessages
                messages={fightDetails?.messages}
                isWinnerOrLoser={isWinnerOrLoser()}
            />
            {getResult() && (
                <FightResult
                    fightResultType={fightDetails?.result_type ?? FightResultType.RESULT_TYPE_UNEXPECTED_SYSTEM_ERROR}
                    result={getResult()}
                    winnerName={getWinnerName()}
                    isWinnerOrLoser={isWinnerOrLoser()}
                    winnerImage={getWinnerImage()}
                    winnerFrameId={getWinnerFrameId()}
                />
            )}
        </View>
    );
};

export default FightDetails;
