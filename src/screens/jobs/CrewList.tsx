import React from "react";
import {View} from "react-native";

import {colors, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {AppImage, AppText, Avatar} from "@components/index.ts";
import {RootState} from "@redux/index.ts";
import {FirebasePartyCrew} from "@screens/jobs/logic.ts";
import {commonStyles} from "@utils/index.ts";
import {useSelector} from "react-redux";

interface CrewListProps {
    ownerId: number;
    crew: FirebasePartyCrew[];
    maxCrew: number;
    onMemberKick: (userId: number) => void;
    size?: number;
}

const CrewList = ({
    ownerId,
    crew,
    maxCrew,
    onMemberKick,
    size = 60,
}: CrewListProps) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const isLeader = user.id === ownerId;
    function renderCrewList() {
        let list = [];
        for (let i = 0; i < maxCrew; i++) {
            const crewMember = crew[i];
            const nextCrewMember = crew[i + 1];
            if (crewMember) {
                const isMemberLeader = crewMember.id === ownerId;
                const canLeaderKick = isLeader && crewMember.id !== user.id;
                const isMe = crewMember.id === user.id;
                list.push(
                    <View key={i} style={{alignItems: "center"}}>
                        <AppImage
                            source={
                                isMemberLeader
                                    ? images.icons.crown
                                    : isLeader
                                    ? images.icons.trash
                                    : undefined
                            }
                            size={16}
                            onPress={() => {
                                isLeader && onMemberKick(crewMember.id);
                            }}
                        />

                        <Avatar source={crewMember.img_url} size={size} />
                        <AppText
                            text={crewMember.name}
                            style={{
                                marginTop: 2,
                            }}
                            color={isMe ? colors.secondary500 : colors.white}
                            fontSize={12}
                        />
                        <EnergyIndicator user={crewMember} />
                    </View>,
                );
            } else {
                list.push(
                    <View
                        key={i}
                        style={{
                            width: size,
                            height: size,
                            borderRadius: size/2,
                            borderColor: colors.lineColor,
                            borderWidth: 1,
                        }}
                    />,
                );
            }

            if (i + 1 < maxCrew) {
                list.push(
                    <View
                        key={"line" + i}
                        style={{
                            width: 35,
                            height: 1,
                            backgroundColor: nextCrewMember
                                ? colors.secondary500
                                : colors.lineColor,
                        }}
                    />,
                );
            }
        }
        return (
            <View
                style={[
                    commonStyles.flexRowAlignCenter,
                    {width: "90%", alignSelf: "center"},
                ]}>
                {list}
            </View>
        );
    }
    return <View>{renderCrewList()}</View>;
};

export default CrewList;

const EnergyIndicator = ({user}: {user: FirebasePartyCrew}) => {
    const ratio = user.energy / 200;

    function getEnergyIcon() {
        if (ratio >= 0.6) {
            return images.icons.greenEnergy;
        }
        if (ratio > 0.3 && ratio < 0.6) {
            return images.icons.orangeEnergy;
        }
        return images.icons.redEnergy;
    }

    function getTextColor() {
        if (ratio >= 0.6) {
            return colors.green;
        }
        if (ratio > 0.3 && ratio < 0.6) {
            return colors.orange;
        }
        return colors.red;
    }

    return (
        <View style={[commonStyles.flexRow, {marginTop: 2}]}>
            <AppImage source={getEnergyIcon()} size={12} />
            <AppText
                text={user.energy}
                type={TextTypes.H6}
                fontSize={12}
                style={{top: -2}}
                color={getTextColor()}
            />
        </View>
    );
};
