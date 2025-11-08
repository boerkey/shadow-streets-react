import React, {useEffect, useState} from "react";

import {FlatList, RefreshControl, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";

import {gangApis} from "@apis/index.ts";
import {colors, gapSize} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {
    AppButton,
    AppText,
    Prompt,
    ScreenContainer,
    TabSelector,
    TitleHeader,
} from "@components/index.ts";
import {Gang} from "@interfaces/GangInterface";
import {authActions} from "@redux/actions";
import {RootState} from "@redux/index.ts";
import GangItem from "@screens/gangs/GangItem.tsx";
import {maxLength12} from "@utils/constants.ts";
import {renderNumber, showToast} from "@utils/helperFunctions.ts";
import {SCREEN_HEIGHT, strings} from "@utils/index.ts";
import GangUpgrades from "./GangUpgrades.tsx";

enum GANG_VIEWS {
    GANG_LIST = 0,
    GANG_UPGRADES = 1,
}

const Gangs = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const gameConfig = useSelector((state: RootState) => state.game.gameConfig);

    const [loading, setLoading] = useState(false);
    const [myGang, setMyGang] = useState(null);
    const [myGangUpgrades, setMyGangUpgrades] = useState([]);
    const [allGangs, setAllGangs] = useState([]);
    const [showCreateGangPrompt, setShowCreateGangPrompt] = useState(false);
    const [extendedGangId, setExtendedGangId] = useState(null);
    const [view, setView] = useState(GANG_VIEWS.GANG_LIST);

    const selectedGang = allGangs.find(
        (gang: Gang) => gang.id === extendedGangId,
    );

    useEffect(() => {
        getMyGang();
    }, []);

    function getMyGang() {
        setLoading(true);
        gangApis
            .getMyGang()
            .then(res => {
                setMyGangUpgrades(res.data.upgrades);
                setMyGang(res.data.gang);
                // Sort gangs to put user's gang first based on gang_id
                const sortedGangs = [...res.data.all_gangs].sort((a, b) => {
                    if (a.id === user.gang_id) return -1;
                    if (b.id === user.gang_id) return 1;
                    return 0;
                });
                setAllGangs(sortedGangs);
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            });
    }

    function createGang(name: string) {
        setShowCreateGangPrompt(false);
        gangApis.createGang(name).then(res => {
            showToast(res.data.message);
            getMyGang();
            dispatch(authActions.getUser());
        });
    }

    const _renderGang = ({item, index}: {item: Gang; index: number}) => {
        return (
            <GangItem
                gang={item}
                index={index}
                onExtendedChange={id => setExtendedGangId(id)}
                getAllGangs={getMyGang}
            />
        );
    };

    function getFilteredGangs() {
        if (!extendedGangId) return allGangs;
        return allGangs.filter(gang => gang.id === extendedGangId);
    }

    return (
        <ScreenContainer>
            <View style={{padding: gapSize.size3L}}>
                <TitleHeader
                    title={
                        selectedGang ? selectedGang.name : strings.gangs.title
                    }
                />
                {myGang && (
                    <TabSelector
                        items={[strings.gangs.gangs, strings.gangs.upgrades]}
                        selectedIndex={view}
                        onSelect={tab => setView(tab)}
                        style={{alignSelf: "center", marginTop: gapSize.sizeM}}
                    />
                )}
                <Prompt
                    isVisible={showCreateGangPrompt}
                    onClose={() => setShowCreateGangPrompt(false)}
                    onConfirm={createGang}
                    title={strings.gangs.createGang}
                    text={strings.gangs.gangCreationCost.replace(
                        "{cost}",
                        "$" + renderNumber(gameConfig?.gang_creation_cost),
                    )}
                    inputValidation={"any"}
                    placeholder={strings.gangs.gangName}
                    maxLength={maxLength12}
                />
                {view === GANG_VIEWS.GANG_LIST && (
                    <>
                        <FlatList
                            refreshControl={
                                <RefreshControl
                                    refreshing={loading}
                                    onRefresh={getMyGang}
                                    tintColor={colors.white}
                                />
                            }
                            data={getFilteredGangs()}
                            renderItem={_renderGang}
                            style={{
                                height: SCREEN_HEIGHT * 0.75,
                                marginTop: gapSize.sizeM,
                            }}
                            scrollEnabled={!extendedGangId}
                            ListEmptyComponent={
                                <AppText
                                    text={"No gangs found"}
                                    type={TextTypes.H4}
                                    centered
                                    style={{marginTop: SCREEN_HEIGHT * 0.35}}
                                />
                            }
                        />
                        {!myGang && (
                            <AppButton
                                onPress={() => setShowCreateGangPrompt(true)}
                                text={strings.gangs.createGang}
                                width={207}
                                style={{alignSelf: "center"}}
                            />
                        )}
                    </>
                )}
                {view === GANG_VIEWS.GANG_UPGRADES && (
                    <GangUpgrades
                        upgrades={myGangUpgrades}
                        onUpgradeComplete={getMyGang}
                    />
                )}
            </View>
        </ScreenContainer>
    );
};

export default Gangs;
