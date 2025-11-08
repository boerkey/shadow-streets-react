import React, {useEffect, useState} from "react";
import {ActivityIndicator, ScrollView, StyleSheet, View} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import MaskedView from "@react-native-masked-view/masked-view";
import {useRoute} from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import LinearGradient from "react-native-linear-gradient";
import {useDispatch, useSelector} from "react-redux";

import {profileApis, supportApis} from "@apis/index.ts";
import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import LevelAvatar from "@components/Header/LevelAvatar.tsx";
import {
    AppImage,
    AppText,
    ScreenContainer,
    TooltipDropdown,
} from "@components/index.ts";
import {getPlayerStatistics} from "@screens/player_profile/logic.tsx";
import {renderNumber} from "@utils/helperFunctions.ts";
import {commonStyles, scaledValue, strings} from "@utils/index.ts";

import {BLOCKED_USERS_KEY} from "@constants/keys.ts";
import {setBlockedUsers} from "@redux/actions/authActions.ts";
import {RootState} from "@redux/index.ts";
import {showToast} from "@utils/helperFunctions.ts";
import {navigateBack} from "../../router.tsx";

export enum ReportType {
    BLOCK_PLAYER = 0,
    NICKNAME = 1,
    PROFILE_IMAGE = 2,
    MESSAGE = 3,
    GANG_IMAGE = 4,
}

const PlayerProfile = () => {
    const dispatch = useDispatch();
    const blockedUsers = useSelector(
        (state: RootState) => state.auth.blockedUsers,
    );
    const user = useSelector((state: RootState) => state.auth.user);
    const {params} = useRoute();
    const {user_id, chatMessage} = params || {};

    const [playerProfile, setPlayerProfile] = useState({
        name: "???",
        prestige: 0,
        experience: 0,
        required_experience: 100,
        level: 1,
        img_url: "",
        loading: true,
        last_activity_ago: "",
        avatar_frame_id: 0,
        rank: 0,
        country: "en",
    });
    const [playerStatistics, setPlayerStatistics] = useState();
    const [loading, setLoading] = useState(true);

    const [isBlocked, setIsBlocked] = useState(
        blockedUsers.some(each => each.user_id === user_id),
    );

    useEffect(() => {
        profileApis.getUserProfile(user_id).then(res => {
            const {stats, user} = res.data;
            setPlayerProfile({
                ...user,
                img_url: isBlocked ? "" : user.img_url,
                name: isBlocked ? "BLOCKED" : user.name,
                experience: 0,
                required_experience: 100,
                loading: false,
            });
            setPlayerStatistics(stats);
            setLoading(false);
        });
    }, []);

    async function handleBlockUser() {
        const blockedUsers = await AsyncStorage.getItem(BLOCKED_USERS_KEY);
        if (blockedUsers) {
            const blockedUsersArray = JSON.parse(blockedUsers);
            blockedUsersArray.push({
                name: playerProfile.name,
                user_id: user_id,
            });
            AsyncStorage.setItem(
                BLOCKED_USERS_KEY,
                JSON.stringify(blockedUsersArray),
            );
            dispatch(setBlockedUsers(blockedUsersArray));
            showToast(strings.playerProfile.playerBlocked);
        } else {
            const blockedUsersArray = [
                {
                    name: playerProfile.name,
                    user_id: user_id,
                },
            ];
            AsyncStorage.setItem(
                BLOCKED_USERS_KEY,
                JSON.stringify(blockedUsersArray),
            );
            dispatch(setBlockedUsers(blockedUsersArray));
            showToast(strings.playerProfile.playerBlocked);
        }
        setIsBlocked(true);
        setPlayerProfile({
            ...playerProfile,
            img_url: "",
            name: "BLOCKED",
            experience: 0,
            required_experience: 100,
        });
    }

    function getDropdownList() {
        const dropdownList = [
            {
                name: strings.playerProfile.reportNickName,
                id: ReportType.NICKNAME,
            },
        ];
        if (playerProfile.img_url) {
            dropdownList.push({
                name: strings.playerProfile.reportProfileImage,
                id: ReportType.PROFILE_IMAGE,
            });
        }
        if (chatMessage) {
            dropdownList.push({
                name:
                    strings.playerProfile.reportMessage +
                    ":  " +
                    chatMessage.substring(0, 10) +
                    "...",
                id: ReportType.MESSAGE,
            });
        }
        if (!isBlocked && user_id !== user.id) {
            dropdownList.push({
                name: strings.playerProfile.blockPlayer,
                id: 0,
            });
        }
        if (playerProfile.gang?.img_url) {
            dropdownList.push({
                name: strings.playerProfile.reportGangImage,
                id: ReportType.GANG_IMAGE,
            });
        }
        return dropdownList;
    }

    function createReport(type: ReportType, content: string) {
        supportApis.createReport(type, content, user_id).then(res => {
            showToast(res.data.message);
        });
    }

    function handleDropdownSelect(id: number) {
        if (id === 0) {
            return handleBlockUser();
        }
        switch (id) {
            case ReportType.NICKNAME:
                createReport(ReportType.NICKNAME, playerProfile.name);
                break;
            case ReportType.PROFILE_IMAGE:
                createReport(ReportType.PROFILE_IMAGE, playerProfile.img_url);
                break;
            case ReportType.MESSAGE:
                createReport(ReportType.MESSAGE, chatMessage);
                break;
            case ReportType.GANG_IMAGE:
                createReport(
                    ReportType.GANG_IMAGE,
                    playerProfile.gang?.img_url,
                );
                break;
        }
    }

    function renderOnlineStatus() {
        if (playerProfile.last_activity_ago) {
            const hasNumber = /\d/.test(playerProfile.last_activity_ago);
            if (hasNumber) {
                return (
                    <AppText
                        text={strings.common.lastActivity}
                        postText={" " + playerProfile.last_activity_ago}
                        style={{marginLeft: 4}}
                        color={colors.grey200}
                    />
                );
            }
            return (
                <View style={[commonStyles.flexRowAlignCenter]}>
                    <View
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: colors.green,
                        }}
                    />
                    <AppText
                        text={strings.common.online}
                        style={{marginLeft: 4}}
                    />
                </View>
            );
        }
        return undefined;
    }

    return (
        <ScreenContainer isSafeAreaView={false}>
            <ScrollView>
                <MaskedView
                    maskElement={
                        <LinearGradient
                            colors={["transparent", "#FFFFFF23", "#000000B2"]}
                            locations={[0, 0.14, 0.98]}
                            start={{x: 0, y: 1}}
                            end={{x: 0, y: 0}}
                            style={{
                                width: "100%",
                                height: "100%",
                                position: "absolute",
                            }}
                        />
                    }>
                    <FastImage
                        source={
                            playerProfile.gang?.img_url && !isBlocked
                                ? {uri: playerProfile.gang?.img_url}
                                : images.examples.gang
                        }
                        style={{
                            height: scaledValue(280),
                            width: "100%",
                        }}
                    />
                </MaskedView>
                <View
                    style={{
                        top: -scaledValue(260),
                        padding: gapSize.size3L,
                        zIndex: 5,
                    }}>
                    <View style={commonStyles.flexRowSpaceBetweenAlignCenter}>
                        <AppImage
                            onPress={navigateBack}
                            source={images.icons.backArrow}
                            size={38}
                        />
                        {!playerProfile.loading && user_id !== user.id && (
                            <TooltipDropdown
                                onSelect={(i, item) =>
                                    handleDropdownSelect(item.id)
                                }
                                options={getDropdownList()}
                                dropdownWidth={scaledValue(250)}>
                                <AppImage
                                    source={images.icons.block}
                                    size={30}
                                />
                            </TooltipDropdown>
                        )}
                    </View>

                    {loading ? (
                        <ActivityIndicator style={{marginTop: "35%"}} />
                    ) : (
                        <View style={{alignItems: "center"}}>
                            <LevelAvatar
                                size={130}
                                scaledSize={true}
                                overrideUser={playerProfile}
                                flag={playerProfile.country}
                                frameId={playerProfile.avatar_frame_id}
                            />
                            {renderOnlineStatus()}
                            <View
                                style={[
                                    commonStyles.flexRowAlignCenter,
                                    {marginTop: gapSize.sizeL},
                                ]}>
                                <View style={[commonStyles.flexRowAlignCenter]}>
                                    <View style={[styles.rankItem]}>
                                        <AppText
                                            text={renderNumber(
                                                playerProfile?.prestige,
                                                1,
                                            )}
                                            type={TextTypes.H3}
                                            fontSize={18}
                                        />
                                        <AppText
                                            text={
                                                strings.playerProfile.prestige
                                            }
                                            type={TextTypes.Caption2}
                                            style={{top: -3}}
                                        />
                                    </View>
                                    <View style={[styles.rankItem]}>
                                        <AppText
                                            text={playerProfile.rank}
                                            type={TextTypes.H3}
                                            fontSize={18}
                                        />
                                        <AppText
                                            text={strings.playerProfile.rank}
                                            type={TextTypes.Caption2}
                                            style={{top: -3}}
                                        />
                                    </View>
                                </View>
                                <View
                                    style={{
                                        width: scaledValue(43),
                                        height: scaledValue(43),
                                        borderColor: colors.secondary500,
                                        backgroundColor: colors.secondaryTwo500,
                                        borderRadius: 4,
                                        marginLeft: gapSize.sizeL,
                                        alignItems: "center",
                                    }}>
                                    <AppImage
                                        source={images.icons.bounty}
                                        size={35}
                                        style={{top: -8}}
                                    />
                                    <AppText
                                        text={renderNumber(
                                            playerProfile?.bounty_level,
                                        )}
                                        type={TextTypes.BodyBold}
                                        style={{top: -10}}
                                    />
                                </View>
                            </View>
                            <AppText
                                text={strings.playerProfile.statistics}
                                style={{
                                    marginTop: gapSize.size3L,
                                    marginBottom: gapSize.sizeM,
                                }}
                                type={TextTypes.H5}
                            />
                            <View
                                style={{
                                    width: "100%",
                                    minHeight: scaledValue(232),
                                    paddingVertical: gapSize.sizeM,
                                    paddingHorizontal: gapSize.sizeL,
                                    backgroundColor: "rgba(24, 21, 21, 0.8)",
                                }}>
                                {getPlayerStatistics(playerStatistics)}
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </ScreenContainer>
    );
};

export default PlayerProfile;

const styles = StyleSheet.create({
    rankItem: {
        height: 43,
        paddingHorizontal: gapSize.sizeM,
        borderColor: colors.secondary500,
        backgroundColor: colors.secondaryTwo500,
        borderRadius: 4,
        marginLeft: gapSize.sizeM,
        alignItems: "center",
        justifyContent: "center",
    },
});
