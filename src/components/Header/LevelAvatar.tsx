import React, {useState} from "react";
import {
    ActivityIndicator,
    Image,
    ImageBackground,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

import FastImage from "react-native-fast-image";
import * as Progress from "react-native-progress";
import {useDispatch, useSelector} from "react-redux";

import {colors, gapSize, images} from "@assets/index.ts";
import AppText, {TextTypes} from "@components/AppText";
import StatsContainer from "@components/Header/StatsContainer.tsx";
import {AppImage} from "@components/index.ts";
import {UserStatuses} from "@interfaces/UserInterface.ts";
import {authActions} from "@redux/actions";
import {RootState} from "@redux/index.ts";
import {commonStyles, moderateScale, scaledValue} from "@utils/index.ts";

interface LevelAvatarProps {
    size?: number;
    scaledSize?: boolean;
    showStatus?: boolean;
    showName?: boolean;
    style?: ViewStyle;
    overrideUser?: any;
    showStatsEnabled?: boolean;
    allowRefresh?: boolean;
    flag?: string;
    frameId?: number;
}

const LevelAvatar = ({
    size = scaledValue(66),
    scaledSize = false,
    showStatus = false,
    showName = true,
    style = {},
    overrideUser,
    showStatsEnabled = false,
    allowRefresh = false,
    flag,
    frameId = 0,
}: LevelAvatarProps) => {
    const dispatch = useDispatch();
    const gameConfig = useSelector((state: RootState) => state.game.gameConfig);
    const user = overrideUser
        ? overrideUser
        : useSelector((state: RootState) => state.auth.user);
    const userLoading = useSelector(
        (state: RootState) => state.auth.userLoading,
    );
    const [showStats, setShowStats] = useState(false);

    function renderStatus() {
        let icon;
        if (user.status !== 0) {
            switch (user.status) {
                case UserStatuses.HOSPITALIZED:
                    icon = images.icons.health;
                    break;
                case UserStatuses.IN_JAIL:
                    icon = images.icons.handcuffs;
                    break;
                case UserStatuses.SALARY_UNPAID:
                    icon = images.icons.money;
                    break;
            }
        }
        if (icon) {
            return (
                <Image
                    source={icon}
                    resizeMode={"contain"}
                    style={[
                        {
                            position: "absolute",
                            top: scaledSize ? size * 0.1 : 5,
                            left: scaledSize ? size * 0.1 : 5,
                            width: scaledValue(scaledSize ? size * 0.2 : 18),
                            height: scaledValue(scaledSize ? size * 0.2 : 18),
                            zIndex: 3,
                        },
                    ]}
                />
            );
        }
    }
    function getFrameContainerStyle() {
        return {
            width: size * 1.1,
            height: size * 1.1,
        };
    }

    function getFrameImageStyle() {
        return {
            width: size * (Platform.OS === "ios" ? 0.76 : 0.77),
            height: size * (Platform.OS === "ios" ? 0.76 : 0.77),
            borderRadius: size * 0.5,
            opacity: userLoading ? 0.25 : 1,
            alignSelf: "center",
        };
    }

    function getProgressCircleSize() {
        return size * (scaledSize && size > 150 ? 0.85 : 0.9);
    }

    function getCircleColor() {
        switch (frameId) {
            case 1:
                return colors.white;
            case 2:
                return "#F1C95B";
            case 3:
                return "#E1B469";
            case 4:
                return "#E1B469";
            case 5:
                return "#DBDBDB";
            case 6:
                return "#FF7B00";
            case 7:
                return "#E8E7E1";
            case 8:
                return "#DEAA2C";
            case 9:
                return "#FF9900";
            case 10:
                return "#C966F2";
            case 11:
                return "#58A9FB";
            case 12:
                return "#FF6B6B";
            case 13:
                return colors.yellow;
            case 14:
                return "#FFC609";
            case 15:
                return "#C4D264";
            default:
                return colors.orange;
        }
    }

    function getLevelTextColor() {
        switch (frameId) {
            case 1:
                return colors.white;
            case 2:
                return "#0E506A";
            case 3:
                return "#E1B469";
            case 4:
                return "#E1B469";
            case 5:
                return "#2D2D30";
            case 6:
                return "#E1AF2D";
            case 7:
                return "#E8E7E1";
            case 8:
                return "#E1AF2D";
            case 9:
                return colors.black;
            case 10:
                return colors.secondaryTwo500;
            case 11:
                return "#251F13";
            case 12:
                return colors.white;
            case 13:
                return colors.yellow;
            case 14:
                return "#5E360A";
            case 15:
                return "#533D20";
            default:
                return colors.orange;
        }
    }

    return (
        <View style={{width: size, ...style}}>
            <TouchableOpacity
                disabled={!allowRefresh}
                onPress={() => {
                    if (!userLoading) {
                        dispatch(authActions.getUser());
                    }
                }}>
                <ImageBackground
                    source={images.cosmetics.avatarFrames[frameId]}
                    style={[styles.imageBackground, getFrameContainerStyle()]}>
                    {showStatus && renderStatus()}
                    {userLoading && (
                        <ActivityIndicator
                            style={{position: "absolute", zIndex: 5}}
                            color={colors.secondary500}
                        />
                    )}
                    <Progress.Circle
                        formatText={num => (
                            <>
                                <FastImage
                                    source={
                                        user.img_url
                                            ? {uri: user.img_url}
                                            : images.examples.pp
                                    }
                                    resizeMode={FastImage.resizeMode.cover}
                                    style={[getFrameImageStyle()]}
                                />
                            </>
                        )}
                        unfilledColor={"transparent"}
                        borderColor={"transparent"}
                        color={getCircleColor()}
                        progress={
                            user.experience
                                ? user.experience / user.required_experience
                                : 0
                        }
                        size={getProgressCircleSize()}
                        showsText={true}
                        style={styles.progressCircle}
                        thickness={3}
                    />
                    <AppText
                        text={`LVL ${user.level}`}
                        color={getLevelTextColor()}
                        fontSize={moderateScale(scaledSize ? size * 0.085 : 6)}
                        type={TextTypes.H1}
                        style={[
                            styles.levelText,
                            {
                                bottom: scaledSize ? size * 0.125 : 8,
                            },
                        ]}
                    />
                </ImageBackground>
            </TouchableOpacity>
            {showName && (
                <TouchableOpacity
                    onPress={() => {
                        !overrideUser && setShowStats(prev => !prev);
                    }}
                    style={[
                        commonStyles.flexRowAlignCenter,
                        commonStyles.alignCenter,
                        {
                            width: scaledValue(150),
                            paddingLeft: "12%",
                            justifyContent: "center",
                            marginTop: -gapSize.sizeS,
                        },
                    ]}>
                    <View style={commonStyles.flexRowAlignCenter}>
                        <AppText
                            text={user.name}
                            color={colors.white}
                            type={TextTypes.H6}
                            fontSize={moderateScale(scaledSize ? size / 9 : 12)}
                            style={styles.usernameText}
                        />
                        {flag && (
                            <AppImage
                                source={images.countries[flag]}
                                size={21}
                                style={{marginLeft: gapSize.sizeS}}
                            />
                        )}
                    </View>
                    {showStatsEnabled && (
                        <AppImage source={images.icons.arrowDown} size={10} />
                    )}
                </TouchableOpacity>
            )}
            {showStatsEnabled && showStats && (
                <StatsContainer user={user} gameConfig={gameConfig} />
            )}
        </View>
    );
};

export default LevelAvatar;

const styles = StyleSheet.create({
    imageBackground: {
        alignItems: "center",
        justifyContent: "center",
    },
    progressCircle: {
        zIndex: -1,
    },
    levelText: {
        position: "absolute",
        bottom: 3,
    },
    usernameText: {
        textAlign: "center",
        marginTop: Platform.OS === "ios" ? 2 : 0,
    },
});
