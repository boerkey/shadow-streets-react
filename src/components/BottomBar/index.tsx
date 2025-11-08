import React, {useEffect, useState} from "react";
import {
    ImageBackground,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import SoundPlayer from "react-native-sound-player";
import {useSelector} from "react-redux";

import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {AppImage, AppText, CopilotContainer} from "@components/index.ts";
import {boostActions} from "@redux/actions";
import {RootState} from "@redux/index.ts";
import {scaledValue, strings} from "@utils/index.ts";
import {useDispatch} from "react-redux";
import {navigate, SCREEN_NAMES} from "../../router.tsx";

const freeSongList = ["free1", "free2", "free3"];
const mixSongList = [
    "mix1",
    "mix2",
    "mix3",
    "mix4",
    "mix5",
    "mix6",
    "mix7",
    "mix8",
    "mix9",
    "mix10",
];

const BottomBar = () => {
    const dispatch = useDispatch();
    const [currentSongIndex, setCurrentSongIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user);
    const isChatMessagesRead = useSelector(
        (state: RootState) => state.chat.isChatMessagesRead,
    );
    const isGangChatMessagesRead = useSelector(
        (state: RootState) => state.chat.isGangChatMessagesRead,
    );
    const userPacks = useSelector((state: RootState) => state.boosts.userPacks);

    const hasMixPack = userPacks["sound_pack_1"] > 0;
    const hasUnreadMessages = user?.unread_messages > 0;

    useEffect(() => {
        dispatch(boostActions.getPacks());
    }, []);

    function getFullSongList() {
        if (hasMixPack) {
            return [...freeSongList, ...mixSongList];
        }
        return freeSongList;
    }
    const fullList = getFullSongList();

    useEffect(() => {
        let listener: any;
        if (isPlaying) {
            listener = SoundPlayer.addEventListener("FinishedPlaying", () => {
                playNextSong();
            });
        }
        return () => {
            listener?.remove();
        };
    }, [isPlaying]);

    function playNextSong() {
        const nextSongIndex = currentSongIndex + 1;
        if (nextSongIndex < fullList.length) {
            const currentSong = fullList[nextSongIndex];
            SoundPlayer.playSoundFile(currentSong, "mp3");
            setCurrentSongIndex(nextSongIndex);
        } else {
            setCurrentSongIndex(0);
            SoundPlayer.playSoundFile(fullList[0], "mp3");
        }
        setIsPlaying(true);
    }

    function decideAndPlay() {
        SoundPlayer.stop();
        playNextSong();
    }

    function pauseOrResume() {
        if (isPlaying) {
            console.log("pause");
            SoundPlayer.pause();
            setIsPlaying(false);
        } else {
            console.log("resume");
            SoundPlayer.resume();
            setIsPlaying(true);
        }
    }

    return (
        <View style={styles.bottomBarContainer}>
            <TouchableOpacity
                onPress={decideAndPlay}
                onLongPress={pauseOrResume}>
                <ImageBackground
                    source={images.containers.bottomBarContainer}
                    style={styles.imageBackground}>
                    <AppImage
                        source={
                            hasMixPack
                                ? images.packs.musicPacks[1]
                                : images.icons.radio
                        }
                        size={55}
                        style={styles.appImage}
                    />
                    <AppText
                        text={isPlaying ? strings.home.next : strings.home.play}
                        postText={
                            currentSongIndex !== -1
                                ? ` - ${currentSongIndex + 1}`
                                : ""
                        }
                        fontSize={12}
                        type={TextTypes.H6}
                        color={colors.secondary500}
                        style={styles.appText}
                    />
                </ImageBackground>
            </TouchableOpacity>
            <CopilotContainer
                uniqueId={"home-4"}
                text={strings.copilot.home[4]}
                orderNumber={4}>
                <TouchableOpacity onPress={() => navigate(SCREEN_NAMES.JOBS)}>
                    <ImageBackground
                        source={images.containers.bottomBarContainer}
                        style={styles.imageBackground}>
                        <AppImage
                            source={images.icons.jobs}
                            size={55}
                            style={styles.appImage}
                        />
                        <AppText
                            text={strings.home.jobs}
                            fontSize={12}
                            type={TextTypes.H6}
                            color={colors.secondary500}
                            style={styles.appText}
                        />
                    </ImageBackground>
                </TouchableOpacity>
            </CopilotContainer>
            <CopilotContainer
                uniqueId={"home-5"}
                text={strings.copilot.home[5]}
                orderNumber={5}>
                <TouchableOpacity
                    onPress={() => navigate(SCREEN_NAMES.INVENTORY)}>
                    <ImageBackground
                        source={images.containers.bottomBarContainer}
                        style={styles.imageBackground}>
                        <AppImage
                            source={images.icons.inventory}
                            size={55}
                            style={styles.appImage}
                        />
                        <AppText
                            text={strings.home.inventory}
                            minifyLength={6}
                            fontSize={12}
                            type={TextTypes.H6}
                            color={colors.secondary500}
                            style={styles.appText}
                        />
                    </ImageBackground>
                </TouchableOpacity>
            </CopilotContainer>

            <CopilotContainer
                uniqueId={"home-6"}
                text={strings.copilot.home[6]}
                orderNumber={6}>
                <TouchableOpacity onPress={() => navigate(SCREEN_NAMES.CHAT)}>
                    <ImageBackground
                        source={images.containers.bottomBarContainer}
                        style={styles.imageBackground}>
                        <AppImage
                            source={images.icons.message}
                            size={55}
                            style={styles.appImage}
                        />
                        <AppText
                            text={strings.home.chat}
                            fontSize={12}
                            type={TextTypes.H6}
                            color={colors.secondary500}
                            style={styles.appText}
                        />
                        {hasUnreadMessages && (
                            <AppImage
                                source={images.icons.redDot}
                                style={{
                                    position: "absolute",
                                    top: -5,
                                    right: -4,
                                }}
                                size={12}
                            />
                        )}
                        {!isChatMessagesRead && (
                            <AppImage
                                source={images.icons.blueDot}
                                style={{
                                    position: "absolute",
                                    top: 10,
                                    right: -4,
                                }}
                                size={12}
                            />
                        )}
                        {!isGangChatMessagesRead && (
                            <AppImage
                                source={images.icons.greenDot}
                                style={{
                                    position: "absolute",
                                    top: 25,
                                    right: -4,
                                }}
                                size={12}
                            />
                        )}
                    </ImageBackground>
                </TouchableOpacity>
            </CopilotContainer>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomBarContainer: {
        position: "absolute",
        bottom: Platform.OS === "ios" ? gapSize.sizeL : gapSize.sizeS,
        height: scaledValue(70),
        width: "100%",
        paddingHorizontal: scaledValue(15),
        backgroundColor: "transparent",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    imageBackground: {
        width: scaledValue(73),
        height: scaledValue(55),
        alignItems: "center",
        justifyContent: "center",
    },
    appImage: {
        marginTop: -gapSize.sizeL,
    },
    appText: {
        top: -gapSize.sizeS,
    },
});

export default BottomBar;
