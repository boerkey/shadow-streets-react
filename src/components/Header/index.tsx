import React from "react";
import {Platform, StyleSheet, View} from "react-native";

import {useSelector} from "react-redux";

import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import BarContainer from "@components/Header/BarContainer.tsx";
import LevelAvatar from "@components/Header/LevelAvatar.tsx";
import {AppImage, AppText} from "@components/index.ts";
import {RootState} from "@redux/index.ts";
import {renderNumber} from "@utils/helperFunctions.ts";
import {commonStyles, scaledValue} from "@utils/index.ts";

const Header = ({
    isAbsolute = true,
    showName = true,
    showStats = false,
    allowRefresh = false,
}) => {
    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <View
            style={
                isAbsolute
                    ? styles.headerContainer
                    : styles.headerContainerNotAbsolute
            }>
            <View style={commonStyles.flexRow}>
                <LevelAvatar
                    showName={showName}
                    showStatus={true}
                    showStatsEnabled={showStats}
                    allowRefresh={allowRefresh}
                    frameId={user.avatar_frame_id}
                />
                <BarContainer />
            </View>
            <View style={{width: 90}}>
                <View style={commonStyles.flexRowAlignCenter}>
                    <AppImage source={images.icons.money} size={39} />
                    <AppText
                        text={`$${renderNumber(user.money)}`}
                        type={TextTypes.BodyBold}
                        color={colors.white}
                        style={{
                            marginLeft: gapSize.sizeS,
                        }}
                    />
                </View>
                <View
                    style={[
                        commonStyles.flexRowAlignCenter,
                        {left: gapSize.sizeS},
                    ]}>
                    <AppImage source={images.icons.shadowCoin} size={30} />
                    <AppText
                        text={`${renderNumber(user.shadow_coin)}`}
                        type={TextTypes.BodyBold}
                        color={colors.white}
                        style={{marginLeft: gapSize.sizeM}}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        position: "absolute",
        zIndex: 3,
        top: scaledValue(Platform.OS === "ios" ? 30 : 10),
        alignSelf: "center",
        paddingHorizontal: gapSize.sizeL,
        paddingVertical: gapSize.sizeM,
        width: "100%",
        marginTop: "5%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    headerContainerNotAbsolute: {
        zIndex: 3,
        alignSelf: "center",
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: scaledValue(Platform.OS === "ios" ? 0 : 15),
    },
});

export default Header;
