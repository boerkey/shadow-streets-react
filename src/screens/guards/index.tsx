import React, {useEffect, useState} from "react";
import {FlatList, View} from "react-native";

import {guardApis} from "@apis/index";
import {gapSize} from "@assets/index";
import {ScreenContainer, TabSelector, TitleHeader} from "@components/index.ts";
import {Guard} from "@interfaces/GameInterface";
import {useIsFocused} from "@react-navigation/native";

import {showToast} from "@utils/helperFunctions";
import {strings} from "@utils/index";
import {navigate, SCREEN_NAMES} from "../../router";
import GuardItem from "./GuardItem";

const Guards = () => {
    const isFocused = useIsFocused();
    const [guards, setGuards] = useState<Guard[]>([]);
    const [userGuards, setUserGuards] = useState<any[]>([]);
    const [selectedTab, setSelectedTab] = useState(0);

    const isMyGuard = selectedTab === 1;

    useEffect(() => {
        getGuards();
    }, [isFocused]);

    function getGuards() {
        guardApis.getGuards().then(res => {
            setGuards(res.data.guards);
            setUserGuards(res.data.user_guards);
            if (res.data.user_guards.length > 0) {
                setSelectedTab(1);
            }
        });
    }

    function buyGuard(id: number) {
        guardApis.buyGuard(id).then(res => {
            showToast(res.data.message);
            getGuards();
        });
    }

    function getTabList() {
        let tabList = [];
        tabList.push("Guards");
        if (userGuards.length > 0) {
            tabList.push("My Guards");
        }
        return tabList;
    }

    const _renderItem = ({item}: {item: Guard}) => {
        const myGuard = userGuards.find(guard => guard.type === item.type);
        return (
            <GuardItem
                guard={item}
                guardData={item}
                isMyGuard={isMyGuard}
                onPress={() =>
                    isMyGuard
                        ? navigate(SCREEN_NAMES.GUARD_DETAILS, {
                              guard: myGuard,
                              guardUpgrades: guards.find(
                                  guard => guard.id === myGuard.type,
                              )?.upgrades,
                          })
                        : buyGuard(item.id)
                }
            />
        );
    };

    return (
        <ScreenContainer>
            <View style={{padding: gapSize.size3L}}>
                <TitleHeader title={strings.guards.title} />
                <View style={{alignItems: "center"}}>
                    {userGuards.length > 0 && (
                        <TabSelector
                            items={getTabList()}
                            onSelect={setSelectedTab}
                            selectedIndex={selectedTab}
                            style={{marginVertical: gapSize.sizeM}}
                        />
                    )}
                    <FlatList
                        style={{width: "100%", marginTop: gapSize.sizeS}}
                        data={isMyGuard ? userGuards : guards}
                        renderItem={_renderItem}
                    />
                </View>
            </View>
        </ScreenContainer>
    );
};

export default Guards;
