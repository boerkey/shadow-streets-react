import React, {useEffect, useState} from "react";
import {FlatList, Platform, View} from "react-native";

import {useDispatch, useSelector} from "react-redux";

import {boostApis} from "@apis/index";
import {gapSize, images} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {
    AppImage,
    AppText,
    TabSelector,
    TitleHeader,
} from "@components/index.ts";
import InnerContainer from "@components/InnerContainer";
import ScreenContainer from "@components/ScreenContainer";
import {BoostData} from "@interfaces/GangInterface";
import {renderNumber, showToast} from "@utils/helperFunctions";
import {commonStyles, strings} from "@utils/index.ts";

import {authActions, boostActions} from "@redux/actions";
import {getMyBoostsRequest} from "@redux/actions/boostActions";
import {RootState} from "@redux/index";
import BoostDataItem from "./BoostDataItem";
import MyBoostItem from "./MyBoostItem";
import PackDataItem from "./PackDataItem";

export interface PackData {
    id: number;
    name: string;
    type: PackType;
    description: string;
    image_id: number;
    price: number;
    content: any[];
    daily_limit?: number;
}

export enum PackType {
    DAILY = 1,
    SOUND = 2,
}

enum Tabs {
    BOOSTS = 0,
    PACKS = 1,
    MY_BOOSTS = 2,
}

const Boosts = () => {
    const dispatch = useDispatch();
    const myBoosts = useSelector((state: RootState) => state.boosts.myBoosts);
    const user = useSelector((state: RootState) => state.auth.user);
    const dailyPacks = useSelector(
        (state: RootState) => state.boosts.dailyPacks,
    );
    const soundPacks = useSelector(
        (state: RootState) => state.boosts.soundPacks,
    );

    const [tab, setTab] = useState(Tabs.BOOSTS);
    const [boostList, setBoostList] = useState<BoostData[]>([]);

    const getBoostData = (boostId: number) =>
        boostList.find(boost => boost.id === boostId);

    useEffect(() => {
        getBoosts();
        getMyBoosts();
        getPacks();
    }, []);

    function getBoosts() {
        boostApis.getBoostList().then(res => {
            setBoostList(res.data.boosts);
        });
    }

    function activateBoost(boostId: number) {
        boostApis.activateBoost(boostId).then(res => {
            showToast(res.data.message);
            getMyBoosts();
            dispatch(authActions.getUser());
        });
    }

    function getMyBoosts() {
        dispatch(getMyBoostsRequest());
    }

    function getPacks() {
        dispatch(boostActions.getPacks());
    }

    function buyPack(packId: number, packType: PackType) {
        boostApis.buyPack(packId, packType).then(res => {
            showToast(res.data.message);
            getPacks();
            dispatch(authActions.getUser());
        });
    }

    function getFlatListData() {
        switch (tab) {
            case Tabs.BOOSTS:
                return boostList;
            case Tabs.PACKS:
                return [...dailyPacks, ...soundPacks];
            case Tabs.MY_BOOSTS:
                return myBoosts;
            default:
                return [];
        }
    }

    const _renderItem = ({item}: {item: any}) => {
        switch (tab) {
            case Tabs.BOOSTS:
                return (
                    <BoostDataItem
                        item={item}
                        onPress={() => activateBoost(item.id)}
                    />
                );
            case Tabs.PACKS:
                return (
                    <PackDataItem
                        item={item}
                        onPress={() => buyPack(item.id, item.type)}
                    />
                );
            case Tabs.MY_BOOSTS:
                return (
                    <MyBoostItem
                        key={`boost-${item.boost_id}-${item.ends_at}`}
                        boostData={getBoostData(item.boost_id)}
                        item={item}
                    />
                );
        }
    };

    return (
        <ScreenContainer>
            <InnerContainer>
                <TitleHeader
                    title={strings.boosts.title}
                    rightComponent={
                        <View
                            style={{
                                position: "absolute",
                                right: 0,
                                flexDirection: "row",
                                alignItems: "center",
                            }}>
                            <AppImage
                                source={images.icons.shadowCoin}
                                size={30}
                            />
                            <AppText
                                text={renderNumber(user.shadow_coin)}
                                type={TextTypes.H5}
                                style={{marginLeft: gapSize.sizeS}}
                            />
                        </View>
                    }
                />
                <View style={[commonStyles.alignItemsCenter]}>
                    <TabSelector
                        items={[
                            {name: strings.boosts.boosts},
                            {name: strings.boosts.packs},
                            {name: strings.boosts.myBoosts},
                        ]}
                        selectedIndex={tab}
                        onSelect={setTab}
                        style={{marginTop: gapSize.sizeM}}
                    />
                    <FlatList
                        style={{
                            width: "100%",
                            height: Platform.OS === "ios" ? "89%" : "85%",
                        }}
                        data={getFlatListData()}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={_renderItem}
                    />
                </View>
            </InnerContainer>
        </ScreenContainer>
    );
};

export default Boosts;
