import React, {useEffect, useState} from "react";
import {FlatList, RefreshControl, View} from "react-native";

import {useDispatch, useSelector} from "react-redux";

import {
    investigateEncounteredUser,
    removeAllEncounters,
    removeOneEncounter,
    searchEncounteredUser,
} from "@apis/encounterApis.ts";
import {colors, gapSize} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {
    AppText,
    Divider,
    Prompt,
    ScreenContainer,
    SmallButton,
    TitleHeader,
} from "@components/index.ts";
import useCountdown from "@hooks/useCountdown.ts";
import {UserEncounter} from "@interfaces/UserInterface.ts";
import {encounterActions} from "@redux/actions";
import {RootState} from "@redux/index.ts";
import EncounterItem from "@screens/encounters/EncounterItem.tsx";
import {showToast} from "@utils/helperFunctions.ts";
import {commonStyles, SCREEN_HEIGHT, strings} from "@utils/index.ts";

const Encounters = () => {
    const dispatch = useDispatch();
    const gameConfig = useSelector((state: RootState) => state.game.gameConfig);
    const encounters = useSelector(
        (state: RootState) => state.encounters.encounters,
    );
    const cooldownSecondsUntilNextAttack = useSelector(
        (state: RootState) => state.encounters.cooldownSecondsUntilNextAttack,
    );
    const loading = useSelector((state: RootState) => state.encounters.loading);
    const [showPrompt, setShowPrompt] = useState(false);
    const [selectedEncounter, setSelectedEncounter] = useState<UserEncounter>(
        {},
    );

    const {formatted} = useCountdown(cooldownSecondsUntilNextAttack);

    useEffect(() => {
        fetchEncounters();
    }, []);

    function fetchEncounters() {
        dispatch(encounterActions.getEncounters());
    }

    function searchUser(encounter_id) {
        searchEncounteredUser(encounter_id).then(res => {
            const message = res.data.message;
            showToast(message);
            fetchEncounters();
        });
    }

    function removeOne(id: number) {
        removeOneEncounter(id).then(res => {
            const message = res.data.message;
            showToast(message);
            fetchEncounters();
        });
    }

    function removeAll() {
        removeAllEncounters().then((res: any) => {
            const message = res.data.message;
            showToast(message);
            fetchEncounters();
        });
    }

    function investigateUser() {
        setShowPrompt(false);
        if (!loading) {
            investigateEncounteredUser(selectedEncounter?.id).then(res => {
                const message = res.data.message;
                showToast(message);
                fetchEncounters();
            });
        }
    }

    const _renderItem = ({item}: {item: UserEncounter}) => {
        return (
            <EncounterItem
                key={item.id}
                item={item}
                onSearch={() => searchUser(item.id)}
                onInvestigate={() => {
                    setShowPrompt(true);
                    setSelectedEncounter(item);
                }}
                onRemove={() => removeOne(item.id)}
            />
        );
    };

    return (
        <ScreenContainer>
            <View style={{padding: gapSize.size2L}}>
                <TitleHeader
                    title={strings.encounters.title}
                    rightComponent={
                        cooldownSecondsUntilNextAttack > 0 && (
                            <AppText
                                text={formatted}
                                style={{position: "absolute", right: 5}}
                                color={colors.red}
                                type={TextTypes.BodyBold}
                            />
                        )
                    }
                    refreshOnBack={true}
                />
                <Prompt
                    isVisible={showPrompt}
                    onClose={() => setShowPrompt(false)}
                    onConfirm={investigateUser}
                    title={strings.encounters.investigate}
                    text={strings.encounters.investigateCost.replace(
                        "{cost}",
                        gameConfig.investigation_cost,
                    )}
                />
                <View
                    style={{
                        height: SCREEN_HEIGHT * 0.8,
                        borderWidth: 1,
                        borderColor: colors.secondary500,
                        marginTop: gapSize.sizeL,
                        padding: gapSize.sizeL,
                    }}>
                    {/*<AppText
                        text={strings.encounters.peopleYouHaveMet}
                        type={TextTypes.H4}
                        fontSize={24}
                        centered
                        style={{marginBottom: gapSize.sizeM}}
                    />*/}
                    <FlatList
                        ListHeaderComponent={() =>
                            encounters?.length > 0 && (
                                <View
                                    style={[
                                        commonStyles.flexRowSpaceBetween,
                                        {
                                            backgroundColor: colors.black,
                                            padding: gapSize.sizeM,
                                            marginBottom: gapSize.sizeM,
                                            borderWidth: 1,
                                            borderColor: colors.grey900,
                                        },
                                    ]}>
                                    <SmallButton
                                        text={strings.encounters.removeAll}
                                        width={120}
                                        onLongPress={removeAll}
                                    />
                                    <AppText
                                        text={strings.encounters.removeAllDescription
                                            .replace(
                                                "{all_cost}",
                                                gameConfig.remove_all_encounters_cost,
                                            )
                                            .replace(
                                                "{one_cost}",
                                                gameConfig.remove_one_encounter_cost,
                                            )}
                                        type={TextTypes.Caption2}
                                        style={{width: "55%"}}
                                        color={colors.orange}
                                    />
                                </View>
                            )
                        }
                        refreshControl={
                            <RefreshControl
                                tintColor={colors.white}
                                refreshing={loading}
                                onRefresh={fetchEncounters}
                            />
                        }
                        data={encounters}
                        renderItem={_renderItem}
                        ItemSeparatorComponent={() => (
                            <Divider marginVertical={gapSize.sizeM} />
                        )}
                    />
                </View>
            </View>
        </ScreenContainer>
    );
};

export default Encounters;
