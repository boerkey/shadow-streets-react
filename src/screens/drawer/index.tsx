import React from "react";
import {
    Linking,
    Platform,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native";

import {BlurView} from "@react-native-community/blur";
import {useSelector} from "react-redux";

import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import LevelAvatar from "@components/Header/LevelAvatar.tsx";
import {AppImage, AppText, SmallButton} from "@components/index.ts";
import {strings} from "@utils/index.ts";

import {UserRoles} from "@interfaces/UserInterface";
import {RootState} from "@redux/index.ts";
import {navigate, SCREEN_NAMES} from "../../router.tsx";

const Drawer = () => {
    const gameConfig = useSelector((state: RootState) => state.game.gameConfig);
    const user = useSelector((state: RootState) => state.auth.user);
    const isModeratorOrAdmin =
        user?.role === UserRoles.MODERATOR || user?.role === UserRoles.ADMIN;
    const hasUnreadAnnouncements = user?.has_unread_announcements ;

    return (
        <SafeAreaView
            style={{
                flex: 1,
                overflow: Platform.OS === "android" ? "hidden" : "visible",
            }}>
            <ScrollView style={{zIndex: 2}}>
                <View
                    style={{
                        paddingHorizontal: gapSize.size3L,
                        paddingVertical: gapSize.size6L,
                    }}>
                    <TouchableOpacity
                        onPress={() => navigate(SCREEN_NAMES.EDIT_PROFILE)}>
                        <LevelAvatar
                            style={{alignSelf: "center"}}
                            showStatsEnabled={false}
                            frameId={user.avatar_frame_id}
                        />
                        <AppText
                            text={strings.drawer.editProfile}
                            type={TextTypes.Caption2}
                            color={colors.textColor}
                            style={{
                                textDecorationLine: "underline",
                                marginBottom: gapSize.sizeL,
                                left: 5,
                            }}
                            centered
                        />
                    </TouchableOpacity>
                    <AppText
                        text={strings.drawer.game}
                        type={TextTypes.Caption2}
                        style={{marginBottom: gapSize.sizeM}}
                        color={colors.textColor}
                    />
                    <SmallButton
                        text={strings.drawer.character}
                        onPress={() => navigate(SCREEN_NAMES.CHARACTER)}
                        style={{marginBottom: gapSize.sizeL}}
                    />
                    <SmallButton
                        text={strings.drawer.guards}
                        onPress={() => navigate(SCREEN_NAMES.GUARDS)}
                        style={{marginBottom: gapSize.sizeL}}
                    />
                    <SmallButton
                        text={strings.drawer.encounters}
                        onPress={() => navigate(SCREEN_NAMES.ENCOUNTERS)}
                        style={{marginBottom: gapSize.sizeL}}
                        rightIcon={
                            user?.unread_encounters > 0 && images.icons.redDot
                        }
                    />
                    <SmallButton
                        text={strings.drawer.fights}
                        onPress={() => navigate(SCREEN_NAMES.FIGHTS)}
                        style={{marginBottom: gapSize.sizeL}}
                    />
                    <SmallButton
                        text={strings.drawer.buyCoins}
                        onPress={() => navigate(SCREEN_NAMES.BUY_SHADOW_COIN)}
                        style={{marginBottom: gapSize.sizeL}}
                        rightIcon={images.icons.shadowCoin}
                        rightIconSize={18}
                    />
                    <SmallButton
                        text={strings.drawer.boosts}
                        onPress={() => navigate(SCREEN_NAMES.BOOSTS)}
                        style={{marginBottom: gapSize.sizeL}}
                        rightIcon={images.icons.shadowCoin}
                        rightIconSize={18}
                        textStyle={{right: gapSize.size2S}}
                    />

                    <SmallButton
                        text={strings.drawer.cosmetics}
                        onPress={() => navigate(SCREEN_NAMES.COSMETICS)}
                        style={{marginBottom: gapSize.sizeL}}
                    />
                    <SmallButton
                        text={strings.drawer.gangs}
                        onPress={() => navigate(SCREEN_NAMES.GANGS)}
                        style={{marginBottom: gapSize.sizeL}}
                    />
                    <SmallButton
                        text={strings.drawer.confinedPeople}
                        onPress={() => navigate(SCREEN_NAMES.CONFINED_PEOPLE)}
                        style={{marginBottom: gapSize.sizeL}}
                    />
                    <SmallButton
                        text={strings.drawer.ranking}
                        onPress={() => navigate(SCREEN_NAMES.RANKING)}
                        style={{marginBottom: gapSize.sizeL}}
                    />
                    <SmallButton
                        text={strings.drawer.districts}
                        onPress={() => navigate(SCREEN_NAMES.DISTRICTS)}
                        style={{marginBottom: gapSize.sizeL}}
                    />
                    <SmallButton
                        text={strings.drawer.announcements}
                        onPress={() => navigate(SCREEN_NAMES.ANNOUNCEMENTS)}
                        style={{marginBottom: gapSize.sizeL}}
                        rightIcon={
                            hasUnreadAnnouncements && images.icons.redDot
                        }
                    />
                    <AppText
                        text={strings.drawer.joinUs}
                        type={TextTypes.Caption2}
                        style={{marginBottom: gapSize.sizeS}}
                        color={colors.textColor}
                    />
                    <AppImage
                        source={images.icons.discord}
                        size={42}
                        style={{marginBottom: gapSize.sizeM}}
                        onPress={() => {
                            Linking.openURL(gameConfig.discord_link);
                        }}
                    />
                    <AppText
                        text={strings.drawer.settings}
                        type={TextTypes.Caption2}
                        style={{marginBottom: gapSize.sizeM}}
                        color={colors.textColor}
                    />
                    {isModeratorOrAdmin && (
                        <SmallButton
                            text={strings.drawer.moderationPanel}
                            onPress={() =>
                                navigate(SCREEN_NAMES.MODERATION_PANEL)
                            }
                            style={{marginBottom: gapSize.sizeL}}
                        />
                    )}
                    <SmallButton
                        text={strings.drawer.settings}
                        onPress={() => navigate(SCREEN_NAMES.SETTINGS)}
                        style={{marginBottom: gapSize.sizeL}}
                    />
                    <SmallButton
                        text={strings.drawer.itemList}
                        onPress={() => navigate(SCREEN_NAMES.ITEM_LIST)}
                        style={{marginBottom: gapSize.sizeL}}
                    />

                    <SmallButton
                        text={strings.drawer.faq}
                        onPress={() => navigate(SCREEN_NAMES.FAQ)}
                        style={{marginBottom: gapSize.sizeL}}
                    />
                    <SmallButton
                        text={strings.drawer.support}
                        onPress={() => navigate(SCREEN_NAMES.SUPPORT)}
                        style={{marginBottom: gapSize.sizeL}}
                    />
                    <AppText
                        text={"v1.9.0"}
                        type={TextTypes.Caption2}
                        style={{marginBottom: gapSize.sizeM}}
                        color={colors.textColor}
                    />
                </View>
            </ScrollView>

            <BlurView
                style={{height: "100%", width: "100%", position: "absolute"}}
                blurAmount={10}
                overlayColor={""}
            />
        </SafeAreaView>
    );
};

export default Drawer;
