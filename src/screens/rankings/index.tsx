import React, {useEffect, useState} from "react";
import {
    ActivityIndicator,
    FlatList,
    Platform,
    TouchableOpacity,
    View,
} from "react-native";

import {useSelector} from "react-redux";

import {profileApis} from "@apis/index.ts";
import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import LevelAvatar from "@components/Header/LevelAvatar.tsx";
import {
    AppImage,
    AppText,
    ScreenContainer,
    TabSelector,
    TitleHeader,
} from "@components/index.ts";
import MaskedView from "@react-native-masked-view/masked-view";
import {RootState} from "@redux/index.ts";
import {renderNumber} from "@utils/helperFunctions.ts";
import {commonStyles, scaledValue, strings} from "@utils/index.ts";
import FastImage from "react-native-fast-image";
import LinearGradient from "react-native-linear-gradient";
import {navigate, SCREEN_NAMES} from "../../router.tsx";

enum Tabs {
    PRESTIGE,
    LEVEL,
    GUARD_RANK,
}

const Rankings = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [selectedTab, setSelectedTab] = useState<Tabs>(Tabs.PRESTIGE);
    const [filterLang, setFilterLang] = useState<string>("");
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getUsers();
    }, []);

    function getUsers(defaultFilter = "prestige") {
        profileApis
            .getUserRankings(user.id, defaultFilter, filterLang)
            .then(res => {
                setRankings(res.data.rankings);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function filterAndGetUsers(i: number) {
        getUsers(Tabs[i].toLowerCase());
    }

    const _renderItem = ({item, index}) => (
        <RankItem item={item} index={index} />
    );

    return (
        <ScreenContainer>
            <View style={{padding: gapSize.size3L}}>
                <TitleHeader title={strings.ranking.title} />
                <View style={{marginTop: gapSize.sizeM}}>
                    <TabSelector
                        selectedIndex={selectedTab}
                        onSelect={i => {
                            setSelectedTab(i);
                            filterAndGetUsers(i);
                        }}
                        items={strings.ranking.tabs}
                    />
                    <FlatList
                        ListEmptyComponent={
                            <ActivityIndicator
                                color={colors.white}
                                style={{marginTop: 100}}
                            />
                        }
                        data={rankings}
                        renderItem={_renderItem}
                        style={{height: Platform.OS === "ios" ? "90%" : "87%"}}
                    />
                </View>
            </View>
        </ScreenContainer>
    );
};

export default Rankings;

const RankItem = ({
    item,
    index,
}: {
    item: {
        id: number;
        name: string;
        lang: string;
        img_url: string;
        gang_img_url: string;
        prestige: string;
        level: number;
        avatar_frame_id: number;
        country: string;
        owner_name?: string;
        user_id?: number;
    };
    index: number;
}) => {
    const isGuard = item.owner_name;
    return (
        <TouchableOpacity
            onPress={() => {
                navigate(SCREEN_NAMES.PLAYER_PROFILE, {
                    user_id: isGuard ? item.user_id : item.id,
                });
            }}>
            <MaskedView
                maskElement={
                    <LinearGradient
                        colors={["transparent", "#FFFFFF45", "#000000D8"]}
                        locations={[0, 0.08, 0.6]}
                        start={{x: 1, y: 0}}
                        end={{x: 0, y: 0}}
                        style={{
                            width: "110%",
                            height: "100%",
                        }}
                    />
                }>
                <FastImage
                    source={{uri: item.gang_img_url}}
                    style={{
                        width: "100%",
                        minHeight: scaledValue(103),
                        marginTop: scaledValue(10),
                        alignItems: "center",
                        flexDirection: "row",
                        paddingVertical: gapSize.sizeM,
                        borderWidth: 1,
                        borderColor: colors.secondary500,
                    }}>
                    <AppText
                        text={index + 1}
                        type={TextTypes.H6}
                        fontSize={18}
                        style={{
                            marginRight: gapSize.sizeM,
                            marginLeft: scaledValue(12),
                        }}
                    />
                    <LevelAvatar
                        overrideUser={item}
                        showName={false}
                        size={81}
                        scaledSize
                        frameId={item.avatar_frame_id}
                    />
                    <View
                        style={{
                            marginLeft: gapSize.sizeL,
                            bottom: gapSize.sizeM,
                        }}>
                        <View
                            style={[
                                commonStyles.flexRowAlignCenter,
                                {marginBottom: gapSize.sizeS},
                            ]}>
                            <AppText
                                text={item.name}
                                type={TextTypes.H6}
                                color={colors.secondary500}
                                style={{
                                    paddingHorizontal: 4,
                                    backgroundColor: colors.black,
                                }}
                            />
                            <AppImage
                                source={images.countries[item.country]}
                                size={24}
                                style={{marginLeft: gapSize.sizeS}}
                            />
                        </View>
                        <View
                            style={[
                                commonStyles.flexRow,
                                {
                                    backgroundColor: colors.black,
                                    padding: 4,
                                    width: 115,
                                },
                            ]}>
                            <AppText
                                text={`${
                                    isGuard
                                        ? item.owner_name
                                        : strings.common.prestige
                                }`}
                            />
                            {!isGuard && (
                                <AppText
                                    text={`: ${renderNumber(
                                        item?.prestige,
                                        2,
                                    )}`}
                                    type={TextTypes.BodyBold}
                                />
                            )}
                        </View>
                    </View>
                </FastImage>
            </MaskedView>
        </TouchableOpacity>
    );
};
