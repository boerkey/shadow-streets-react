import React, {useState} from "react";
import {Pressable, ScrollView, View} from "react-native";

import auth from "@react-native-firebase/auth";
import {useDispatch, useSelector} from "react-redux";

import {gangApis} from "@apis/index.ts";
import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import LevelAvatar from "@components/Header/LevelAvatar.tsx";
import {
    AppImage,
    AppText,
    Divider,
    Prompt,
    TooltipDropdown,
} from "@components/index.ts";
import {
    Gang,
    GangMember,
    GangMemberRoles,
    GangUpgrade,
} from "@interfaces/GangInterface.ts";
import {authActions} from "@redux/actions/index.ts";
import {RootState} from "@redux/index.ts";
import {
    getDarkBackground,
    pickImageAndUpload,
    renderNumber,
    showToast,
} from "@utils/helperFunctions.ts";
import {commonStyles, strings} from "@utils/index.ts";
import FastImage from "react-native-fast-image";
import {SCREEN_NAMES, navigate} from "../../router.tsx";

enum ApplicationResponse {
    ACCEPT = 0,
    REFUSE = 1,
}

enum DropdownActions {
    CHANGE_GANG_IMAGE = 1,
    DONATE_MONEY = 2,
    LEAVE = 3,
    CHANGE_GANG_LEADER = 4,
}

const GangItem = ({
    gang,
    index,
    onExtendedChange,
    getAllGangs,
}: {
    gang: Gang;
    index: number;
    onExtendedChange: (id: number | null) => void;
    getAllGangs: () => void;
}) => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const gameConfig = useSelector((state: RootState) => state.game.gameConfig);

    const [extended, setExtended] = useState(false);
    const [gangDetails, setGangDetails] = useState<Gang>({});
    const [members, setMembers] = useState<GangMember[]>([]);
    const [applications, setApplications] = useState<GangMember[]>([]);
    const [gangUpgradeAmount, setGangUpgradeAmount] = useState(0);
    const [maxUpgradeAmount, setMaxUpgradeAmount] = useState(0);
    const [showGangDonatePrompt, setShowGangDonatePrompt] = useState(false);
    const [newGangLeaderId, setNewGangLeaderId] = useState(0);

    const isOwnerIsMe = gangDetails?.owner_id === user.id;
    const iDontHaveGang = user.gang_id === 0;
    const isItMyGang = gangDetails.id === user.gang_id;

    function getGangDetails() {
        let upgradeAmount = 0;
        gangApis.getGangDetails(gang.id).then(res => {
            setMembers(res.data.members);
            setGangDetails(res.data.gang);
            res.data.upgrades.forEach((each: GangUpgrade) => {
                upgradeAmount += each.level;
            });
            setGangUpgradeAmount(upgradeAmount);
            setMaxUpgradeAmount(res.data.max_upgrade_amount);
            const renderedApplications: GangMember[] = [];
            res.data.applications.forEach((each: GangMember) => {
                renderedApplications.push({
                    ...each,
                    role: GangMemberRoles.JOIN_REQUEST,
                });
            });
            setApplications(renderedApplications);
        });
    }

    function joinGang() {
        gangApis.joinGang(gang.id).then(res => {
            showToast(res.data.message);
        });
    }

    function respondToApplication(
        applicationId: number,
        response: ApplicationResponse,
    ) {
        gangApis.respondGangApplication(applicationId, response).then(res => {
            showToast(res.data.message);
            getGangDetails();
        });
    }

    function leaveGang() {
        gangApis.leaveGang().then(res => {
            showToast(res.data.message);
            dispatch(authActions.getUser());
            getAllGangs();
        });
    }

    function kickMember(userId: number) {
        gangApis.kickMemberFromGang(userId).then(res => {
            showToast(res.data.message);
            getGangDetails();
            dispatch(authActions.getUser());
        });
    }

    function donateMoneyToGang(amount: number) {
        gangApis.donateMoneyToGang(amount).then(res => {
            showToast(res.data.message);
            getAllGangs();
        });
    }

    async function ensureAnonymousLogin() {
        const currentUser = auth().currentUser;
        if (!currentUser) {
            await auth().signInAnonymously();
        }
        return auth().currentUser?.uid;
    }

    async function changeGangImage() {
        const fbUserId = await ensureAnonymousLogin();

        // Add a small delay
        await new Promise(resolve => setTimeout(resolve, 500));

        pickImageAndUpload(1000000, "GangImages/" + fbUserId, false, 0.6)
            .then(imgUrl => {
                if (!imgUrl) {
                    console.log("No image URL returned");
                    return;
                }

                gangApis
                    .changeGangImage(imgUrl)
                    .then(res => {
                        showToast(res.data.message);
                        getAllGangs();
                    })
                    .catch(err => {
                        console.log("API error:", JSON.stringify(err));
                    });
            })
            .catch(err => {
                console.log("Image picker error:", JSON.stringify(err));
            })
            .finally(() => {
                console.log("Image picking process completed");
            });
    }

    function getMergedList() {
        // We sort the applications to the top of the list, then leader should be at top
        return [...applications, ...members].sort((a, b) =>
            a.role > b.role ? -1 : 1,
        );
    }

    function getDropdownOptions(isItMe: boolean) {
        if (isOwnerIsMe) {
            if (isItMe) {
                return [
                    {
                        name: strings.gangs.changeGangImage,
                        id: DropdownActions.CHANGE_GANG_IMAGE,
                    },
                    {
                        name: strings.gangs.donateMoney,
                        id: DropdownActions.DONATE_MONEY,
                    },
                    {
                        name: isItMe
                            ? strings.common.leave
                            : strings.common.kick,
                        textColor: colors.red,
                        id: DropdownActions.LEAVE,
                    },
                ];
            }
            return [
                {
                    name: strings.gangs.donateMoney,
                    id: DropdownActions.DONATE_MONEY,
                },
                {
                    name: strings.gangs.changeGangLeader,
                    id: DropdownActions.CHANGE_GANG_LEADER,
                },
                {
                    name: isItMe ? strings.common.leave : strings.common.kick,
                    textColor: colors.red,
                    id: DropdownActions.LEAVE,
                },
            ];
        }
        return [
            {
                name: strings.gangs.donateMoney,
                id: DropdownActions.DONATE_MONEY,
            },
            {
                name: isItMe ? strings.common.leave : strings.common.kick,
                textColor: colors.red,
                id: DropdownActions.LEAVE,
            },
        ];
    }

    function handleOnSelect(id: number, item: GangMember, isItMe: boolean) {
        switch (id) {
            case DropdownActions.CHANGE_GANG_IMAGE:
                return changeGangImage();
            case DropdownActions.DONATE_MONEY:
                return setShowGangDonatePrompt(true);
            case DropdownActions.LEAVE:
                return isItMe ? leaveGang() : kickMember(item.user_id);
            case DropdownActions.CHANGE_GANG_LEADER:
                return setNewGangLeaderId(item.user_id);
        }
    }

    function changeGangLeader() {
        gangApis.changeGangLeader(newGangLeaderId).then(res => {
            showToast(res.data.message);
            getGangDetails();
        });
        setNewGangLeaderId(0);
    }

    const _renderMember = ({item}: {item: GangMember}) => {
        const isItMe = item.user_id === user.id;
        3;
        function getRoleColor() {
            switch (item.role) {
                case 0:
                    return colors.secondary500;
                case 1:
                    return colors.green;
                case 2:
                    return "#F1C95B";
            }
        }

        return (
            <View style={[commonStyles.flexRow]}>
                <Pressable
                    onPress={() =>
                        navigate(SCREEN_NAMES.PLAYER_PROFILE, {
                            user_id: item.user_id,
                        })
                    }>
                    <LevelAvatar
                        showStatus={false}
                        showName={false}
                        size={60}
                        scaledSize
                        frameId={item.avatar_frame_id}
                        overrideUser={{
                            level: item.level,
                            img_url: item.img_url,
                        }}
                    />
                </Pressable>

                <View style={{marginLeft: 8, flex: 1}}>
                    <View style={commonStyles.flexRowSpaceBetween}>
                        <AppText text={item.name} />
                        <AppText
                            text={item.last_active_ago}
                            type={TextTypes.Caption2}
                            color={colors.grey500}
                        />
                    </View>
                    <View style={[commonStyles.flexRowSpaceBetween, {top: 5}]}>
                        <AppText
                            text={strings.gangs.roleNames[item.role]}
                            fontSize={12}
                            color={getRoleColor()}
                        />
                        {isOwnerIsMe &&
                            item.role === GangMemberRoles.JOIN_REQUEST && (
                                <TooltipDropdown
                                    selectedIndex={-1}
                                    onSelect={i =>
                                        respondToApplication(item.id, i + 1)
                                    }
                                    dropdownWidth={150}
                                    options={[
                                        {
                                            name: strings.common.accept,
                                            textColor: colors.green,
                                        },
                                        {
                                            name: strings.common.refuse,
                                            textColor: colors.red,
                                        },
                                    ]}>
                                    <AppImage
                                        source={images.icons.threeDot}
                                        size={15}
                                    />
                                </TooltipDropdown>
                            )}
                        {(isOwnerIsMe || isItMe) &&
                            (item.role === GangMemberRoles.MEMBER ||
                                item.role === GangMemberRoles.OWNER) && (
                                <TooltipDropdown
                                    selectedIndex={-1}
                                    onSelect={(i, selectItem) =>
                                        handleOnSelect(
                                            selectItem.id,
                                            item,
                                            isItMe,
                                        )
                                    }
                                    dropdownWidth={185}
                                    hitSlop={commonStyles.hitSlop}
                                    options={getDropdownOptions(isItMe)}>
                                    <AppImage
                                        source={images.icons.threeDot}
                                        size={15}
                                    />
                                </TooltipDropdown>
                            )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={{marginBottom: gapSize.sizeM}}>
            <Prompt
                isVisible={newGangLeaderId > 0}
                onClose={() => setNewGangLeaderId(0)}
                onConfirm={changeGangLeader}
                text={strings.gangs.gangLeaderWillBeChanged}
                title={strings.common.warning}
            />
            <Pressable
                onPress={() => {
                    if (!extended) {
                        getGangDetails();
                    }
                    setExtended(prev => {
                        onExtendedChange(prev ? null : gang.id);
                        return !prev;
                    });
                }}
                style={({pressed}) => [{opacity: pressed ? 0.5 : 1}]}>
                <FastImage
                    style={{
                        borderWidth: 1,
                        borderColor: isItMyGang
                            ? colors.green
                            : colors.borderColor,
                    }}
                    source={
                        gang.img_url
                            ? {uri: gang.img_url}
                            : images.examples.gang
                    }>
                    <View
                        style={{
                            width: "100%",
                            height: extended ? 200 : 88,
                            backgroundColor: getDarkBackground(),
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                        <View
                            style={{
                                position: "absolute",
                                top: 5,
                                right: 10,
                                alignItems: "flex-end",
                            }}>
                            <AppText
                                text={gang.leader_name}
                                type={TextTypes.Caption2}
                                color={colors.grey200}
                            />
                            <AppText
                                text={`${gang.member_amount}/${gameConfig.gang_max_member_amount}`}
                                style={{marginTop: 2}}
                                type={TextTypes.Caption2}
                                color={colors.grey200}
                            />

                            {iDontHaveGang && (
                                <AppImage
                                    onPress={joinGang}
                                    hitSlop={commonStyles.hitSlop}
                                    source={images.icons.apply}
                                    size={20}
                                    style={{marginTop: gapSize.sizeS}}
                                />
                            )}
                        </View>
                        {!extended && (
                            <AppText
                                preText={`#${index + 1} `}
                                text={gang.name}
                                type={TextTypes.H5}
                            />
                        )}
                        {extended && (
                            <View
                                style={[
                                    commonStyles.flexRowSpaceBetween,
                                    {
                                        position: "absolute",
                                        bottom: 15,
                                        width: "92%",
                                    },
                                ]}>
                                <View style={commonStyles.alignItemsCenter}>
                                    <AppText
                                        text={renderNumber(
                                            gang?.total_prestige,
                                        )}
                                        type={TextTypes.H3}
                                    />
                                    <AppText
                                        text={strings.gangs.totalPrestige}
                                        type={TextTypes.Caption2}
                                    />
                                </View>
                                <View style={commonStyles.alignItemsCenter}>
                                    <AppText
                                        text={
                                            isItMyGang
                                                ? renderNumber(
                                                      gang.bounty_point,
                                                  )
                                                : "???"
                                        }
                                        type={TextTypes.H3}
                                    />
                                    <AppText
                                        text={strings.gangs.bountyPoints}
                                        type={TextTypes.Caption2}
                                    />
                                </View>
                                <View style={commonStyles.alignItemsCenter}>
                                    <AppText
                                        text={
                                            isItMyGang
                                                ? renderNumber(gang.money)
                                                : "???"
                                        }
                                        type={TextTypes.H3}
                                    />
                                    <AppText
                                        text={strings.common.money}
                                        type={TextTypes.Caption2}
                                    />
                                </View>
                                <View style={commonStyles.alignItemsCenter}>
                                    <AppText
                                        text={`${gangUpgradeAmount}/${maxUpgradeAmount}`}
                                        type={TextTypes.H3}
                                    />
                                    <AppText
                                        text={strings.gangs.upgrades}
                                        type={TextTypes.Caption2}
                                    />
                                </View>
                            </View>
                        )}
                    </View>
                </FastImage>
            </Pressable>

            {extended && (
                <View
                    style={{
                        borderBottomWidth: 1,
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderColor: isItMyGang
                            ? colors.green
                            : colors.borderColor,
                        paddingHorizontal: gapSize.size3L,
                        paddingVertical: gapSize.sizeL,
                    }}>
                    <AppText
                        text={"Members"}
                        type={TextTypes.H4}
                        style={{marginBottom: gapSize.sizeM}}
                        centered
                    />
                    <View style={{maxHeight: 300}}>
                        <ScrollView
                            nestedScrollEnabled={true}
                            showsVerticalScrollIndicator={false}>
                            {getMergedList().map((item, index) => (
                                <React.Fragment
                                    key={`${item.id || "0"}-${
                                        item.role || "0"
                                    }-${item.name || "unknown"}`}>
                                    {_renderMember({item})}
                                    {index < getMergedList().length - 1 && (
                                        <Divider
                                            width={"100%"}
                                            marginVertical={gapSize.sizeM}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            )}
            <Prompt
                isVisible={showGangDonatePrompt}
                onClose={() => setShowGangDonatePrompt(false)}
                onConfirm={donateMoneyToGang}
                inputValidation="number-only"
                title={strings.gangs.donateMoney}
                placeholder={"$"}
                formatNumber
            />
        </View>
    );
};

export default GangItem;
