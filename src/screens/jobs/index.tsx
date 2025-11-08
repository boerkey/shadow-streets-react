import React, {useEffect, useState} from "react";
import {FlatList, Platform, RefreshControl, View} from "react-native";

import {useDispatch, useSelector} from "react-redux";

import {colors, gapSize, images} from "@assets/index.ts";
import {
    AppImage,
    AppText,
    Header,
    ScreenContainer,
    TabSelector,
} from "@components/index.ts";
import {Classes} from "@interfaces/GameInterface.ts";
import {authActions, characterActions} from "@redux/actions";
import {RootState} from "@redux/index.ts";
import {strings} from "@utils/index.ts";
import {navigate, navigateBack, SCREEN_NAMES} from "../../router.tsx";

import {TextTypes} from "@components/AppText";
import useCountdown from "@hooks/useCountdown.ts";
import {getMyBoostsRequest} from "@redux/actions/boostActions.ts";
import PartyJobsList from "@screens/jobs/PartyJobsList.tsx";
import {showToast} from "@utils/helperFunctions.ts";
import CurrentSpecialRun from "./CurrentSpecialRun.tsx";
import JobItem from "./JobItem.tsx";
import MissionItem from "./MissionItem.tsx";
import SpecialRunItem from "./SpecialRunItem.tsx";

enum Tabs {
    SOLO_JOBS = 0,
    PARTY_JOBS = 1,
    MISSIONS = 2,
    SPECIAL_RUNS = 3,
}

const Jobs = () => {
    const dispatch = useDispatch();
    const jobs = useSelector((state: RootState) => state.character.jobs);
    const gameMissions = useSelector(
        (state: RootState) => state.game.gameMissions,
    );
    const nextMissionCooldownSeconds = useSelector(
        (state: RootState) => state.character.nextMissionCooldownSeconds,
    );
    const partyJobs = useSelector(
        (state: RootState) => state.character.partyJobs,
    );
    const specialRunCategories = useSelector(
        (state: RootState) => state.character.specialRunCategories,
    );
    const currentSpecialRun = useSelector(
        (state: RootState) => state.character.currentSpecialRun,
    );
    const user = useSelector((state: RootState) => state.auth.user);
    const jobsLoading = useSelector(
        (state: RootState) => state.character.jobsLoading,
    );
    const [tab, setTab] = useState(Tabs.SOLO_JOBS);
    const [selectedPartyJob, setSelectedPartyJob] = useState<any>(null);
    const [expandedJobIds, setExpandedJobIds] = useState<number[]>([]);
    const [expandedPartyJobIds, setExpandedPartyJobIds] = useState<number[]>(
        [],
    );
    const {formatted} = useCountdown(nextMissionCooldownSeconds);

    useEffect(() => {
        getMissions();
        getJobs();
        dispatch(authActions.getUserBonuses());
        dispatch(getMyBoostsRequest());
        dispatch(authActions.getBotRestriction());
        dispatch(authActions.getUserSettings());
        setTimeout(() => {
            dispatch(characterActions.getSpecialRuns());
        }, 1000);
    }, []);

    useEffect(() => {
        if (user.level >= 3 && user.class === Classes.NO_CLASS) {
            setTimeout(() => {
                showToast(strings.selectClass.timeToChooseClass);
            }, 500);
            navigate(SCREEN_NAMES.SELECT_CLASS);
        }
    }, [user.level]);

    function getJobs() {
        dispatch(characterActions.getJobs());
    }

    function getMissions() {
        setTimeout(() => {
            dispatch(characterActions.getMyMissions());
        }, 500);
    }

    const _renderItem = ({item, index}: {item: any; index: number}) => {
        if (tab === Tabs.MISSIONS) {
            return (
                <MissionItem
                    item={item}
                    index={index}
                    onMissionStart={getMissions}
                />
            );
        } else if (tab === Tabs.SPECIAL_RUNS) {
            return <SpecialRunItem item={item} index={index} />;
        }
        return (
            <JobItem
                job={item}
                onPartyJoin={job => {
                    setSelectedPartyJob({...job});
                }}
                isExpanded={
                    tab === Tabs.PARTY_JOBS
                        ? expandedPartyJobIds.includes(item.id)
                        : expandedJobIds.includes(item.id)
                }
                onExpand={() => {
                    if (tab === Tabs.PARTY_JOBS) {
                        return setExpandedPartyJobIds(
                            expandedPartyJobIds.includes(item.id)
                                ? expandedPartyJobIds.filter(
                                      id => id !== item.id,
                                  )
                                : [...expandedPartyJobIds, item.id],
                        );
                    }
                    return setExpandedJobIds(
                        expandedJobIds.includes(item.id)
                            ? expandedJobIds.filter(id => id !== item.id)
                            : [...expandedJobIds, item.id],
                    );
                }}
            />
        );
    };

    function getFlatListData() {
        switch (tab) {
            case Tabs.SOLO_JOBS:
                return jobs;
            case Tabs.PARTY_JOBS:
                return partyJobs;
            case Tabs.MISSIONS:
                return gameMissions;
            case Tabs.SPECIAL_RUNS:
                if (currentSpecialRun) {
                    return [];
                }
                return specialRunCategories;
        }
    }

    function refresh() {
        switch (tab) {
            case Tabs.SOLO_JOBS:
                getJobs();
                break;
            case Tabs.MISSIONS:
                getMissions();
                break;
            case Tabs.SPECIAL_RUNS:
                dispatch(characterActions.getSpecialRuns());
                break;
        }
    }

    function renderMissionCooldown() {
        if (nextMissionCooldownSeconds > 0 && tab === Tabs.MISSIONS) {
            return (
                <View
                    style={{
                        position: "absolute",
                        right: -gapSize.sizeS,
                        top: gapSize.sizeM,
                        flexDirection: "row",
                    }}>
                    <AppImage source={images.icons.redTime} size={18} />
                    <AppText text={formatted} color="red" />
                </View>
            );
        }
    }

    return (
        <ScreenContainer>
            <View
                style={{
                    padding: gapSize.size3L,
                    alignItems: "center",
                }}>
                <Header isAbsolute={false} />
                <View style={{width: "100%"}}>
                    <AppImage
                        onPress={() => {
                            if (selectedPartyJob) {
                                return setSelectedPartyJob(null);
                            }
                            navigateBack();
                        }}
                        source={images.icons.backArrow}
                        style={{
                            position: "absolute",
                            left: 0,
                            top: gapSize.sizeS,
                            zIndex: 2,
                        }}
                        size={35}
                    />
                    <AppText
                        text={
                            selectedPartyJob
                                ? selectedPartyJob.name
                                : strings.jobs.title
                        }
                        type={
                            selectedPartyJob
                                ? TextTypes.H4
                                : TextTypes.TitleSmall
                        }
                        color={colors.white}
                        style={{
                            marginBottom: gapSize.sizeL,
                            top: selectedPartyJob ? 10 : 0,
                            alignSelf: "center",
                        }}
                    />
                    {renderMissionCooldown()}
                </View>
                {selectedPartyJob ? (
                    <PartyJobsList job={selectedPartyJob} />
                ) : (
                    <>
                        <TabSelector
                            selectedIndex={tab}
                            onSelect={setTab}
                            items={[
                                strings.jobs.soloJobs,
                                strings.jobs.partyJobs,
                                strings.jobs.missions,
                                strings.jobs.specialRun,
                            ]}
                            style={{
                                marginBottom: gapSize.sizeL,
                                alignSelf: "center",
                            }}
                        />
                        {currentSpecialRun && tab === Tabs.SPECIAL_RUNS && (
                            <CurrentSpecialRun />
                        )}
                        <FlatList
                            refreshControl={
                                <RefreshControl
                                    tintColor={colors.white}
                                    refreshing={jobsLoading}
                                    onRefresh={refresh}
                                />
                            }
                            contentContainerStyle={{
                                paddingBottom: gapSize.size6L * 3,
                            }}
                            style={{
                                width: "100%",
                                height: Platform.OS === "ios" ? "100%" : "85%",
                            }}
                            data={getFlatListData()}
                            renderItem={_renderItem}
                        />
                    </>
                )}
            </View>
        </ScreenContainer>
    );
};

export default Jobs;
