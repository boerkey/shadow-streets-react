import React, {useEffect, useState} from "react";
import {FlatList, RefreshControl, View} from "react-native";

import {confinedApis} from "@apis/index.ts";
import {colors, gapSize} from "@assets/index.ts";
import {Header, ScreenContainer, TitleHeader} from "@components/index.ts";
import {SCREEN_HEIGHT, strings} from "@utils/index.ts";
import ConfinedItem, {ConfinedUser} from "./ConfinedItem.tsx";

const ConfinedPeople = () => {
    const [confinedPeople, setConfinedPeople] = useState<ConfinedUser[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getConfinedPeople();
    }, []);

    function getConfinedPeople() {
        setLoading(true);
        confinedApis
            .getConfinedPeople()
            .then(res => {
                setConfinedPeople(res.data.confined_people);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const _renderItem = ({item, index}) => (
        <ConfinedItem
            onRefresh={getConfinedPeople}
            item={item}
        />
    );

    return (
        <ScreenContainer>
            <View style={{padding: gapSize.sizeL}}>
                <Header isAbsolute={false} />
                <TitleHeader
                    title={strings.confinedPeople.header}
                    style={{marginTop: gapSize.sizeS}}
                />
                <View style={{alignItems: "center"}}>
                    <FlatList
                        style={{
                            height: SCREEN_HEIGHT * 0.65,
                        }}
                        refreshControl={
                            <RefreshControl
                                tintColor={colors.white}
                                refreshing={loading}
                                onRefresh={getConfinedPeople}
                            />
                        }
                        data={confinedPeople}
                        renderItem={_renderItem}
                    />
                </View>
            </View>
        </ScreenContainer>
    );
};

export default ConfinedPeople;
