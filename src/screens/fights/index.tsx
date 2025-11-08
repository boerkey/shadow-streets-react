import React, {useEffect, useState} from "react";
import {
    ActivityIndicator,
    FlatList,
    Platform,
    RefreshControl,
    View,
} from "react-native";

import {useRoute} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";

import {fightApis} from "@apis/index.ts";
import {colors, gapSize, images} from "@assets/index.ts";
import {ScreenContainer, TabSelector, TitleHeader} from "@components/index.ts";
import {groupFightActions} from "@redux/actions";
import {RootState} from "@redux/index.ts";
import FightDetails from "@screens/fights/FightDetails.tsx";
import FightListItem from "@screens/fights/FightListItem.tsx";
import {getDarkBackground} from "@utils/helperFunctions.ts";
import {SCREEN_HEIGHT} from "@utils/index.ts";
import {navigate, navigateBack, SCREEN_NAMES} from "../../router.tsx";

export interface FightListItemInterface {
    id: string;
    attacker_name: string;
    attacker_id: number;
    attacker_img_url: string;
    attacker_avatar_frame_id: number;
    defender_name: string;
    defender_id: number;
    defender_img_url: string;
    defender_avatar_frame_id: number;
    time_ago: string;
    location_name: string;
    status?: number;
    status_text?: string;
}

const Fights = () => {
    const dispatch = useDispatch();

    const groupFights = useSelector(
        (state: RootState) => state.groupFight.groupFights,
    );

    const [loading, setLoading] = useState(true);
    const [fightList, setFightList] = useState<FightListItemInterface[]>([]);
    const [selectedFight, setSelectedFight] = useState(null);
    const [selectedTab, setSelectedTab] = useState(0);
    const {params} = useRoute();
    const {fightId} = params || {};

    useEffect(() => {
        getFightsList();
        getGroupFightsList();
    }, []);

    function getFightsList() {
        setLoading(true);
        fightApis.getFightList().then(res => {
            setFightList(res.data);
            setLoading(false);
            if (fightId) {
                selectFight(res.data, fightId);
            }
        });
    }

    function getGroupFightsList() {
        setLoading(true);
        dispatch(groupFightActions.getGroupFights());
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }

    function selectFight(list: any, id: number) {
        const foundFight = list.find(fight => fight.id === id);
        if (foundFight) {
            setSelectedFight(foundFight);
        }
    }

    const _renderFight = ({item}) => (
        <FightListItem
            key={item.id}
            item={item}
            onPress={() => {
                if (selectedTab === 0) {
                    setSelectedFight(item);
                } else {
                    navigate(SCREEN_NAMES.GROUP_FIGHT, {fightId: item.id});
                }
            }}
        />
    );

    function handleBackPress() {
        if (selectedFight) {
            return setSelectedFight(null);
        }
        navigateBack();
    }

    return (
        <ScreenContainer source={images.backgrounds.fights} style={{zIndex: 1}}>
            <View
                style={{
                    height: SCREEN_HEIGHT,
                    width: "100%",
                    position: "absolute",
                    backgroundColor: getDarkBackground(5),
                    zIndex: 1,
                }}
            />
            <View style={{padding: gapSize.sizeL, zIndex: 2}}>
                <TitleHeader title="Fights" onBackPressed={handleBackPress} />
                {!selectedFight && (
                    <TabSelector
                        items={["Solo Fights", "Group Fights"]}
                        selectedIndex={selectedTab}
                        onSelect={setSelectedTab}
                        style={{
                            marginVertical: gapSize.sizeS,
                            alignSelf: "center",
                        }}
                    />
                )}
                {selectedFight ? (
                    <FightDetails fight={selectedFight} />
                ) : (
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                tintColor={colors.white}
                                refreshing={loading}
                                onRefresh={
                                    selectedTab === 0
                                        ? getFightsList
                                        : getGroupFightsList
                                }
                            />
                        }
                        ListEmptyComponent={
                            <ActivityIndicator style={{marginTop: "25%"}} />
                        }
                        data={selectedTab === 0 ? fightList : groupFights}
                        renderItem={_renderFight}
                        style={{height: Platform.OS === "ios" ? "90%" : "85%"}}
                    />
                )}
            </View>
        </ScreenContainer>
    );
};

export default Fights;
