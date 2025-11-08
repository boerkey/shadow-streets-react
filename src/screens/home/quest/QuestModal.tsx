import React, {useEffect, useState} from "react";
import {View} from "react-native";

import {questApis} from "@apis/index.ts";
import {colors, gapSize} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {AppModal, AppText, TabSelector} from "@components/index.ts";
import {UserDailyQuest, UserStoryQuest} from "@interfaces/UserInterface.ts";
import {authActions} from "@redux/actions";
import DailyQuest from "@screens/home/quest/DailyQuest.tsx";
import StoryQuest from "@screens/home/quest/StoryQuest.tsx";
import {scaledValue, strings} from "@utils/index.ts";
import {useDispatch} from "react-redux";

const QuestModal = ({isVisible, onClose}) => {
    const dispatch = useDispatch();
    const [tab, setTab] = useState<number>(0);
    const [storyQuests, setStoryQuests] = useState<UserStoryQuest[]>([]);
    const [dailyQuests, setDailyQuests] = useState<UserDailyQuest[]>([]);
    const [nextResetInText, setNextResetInText] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (isVisible) {
            getQuests();
        }
    }, [isVisible]);

    function getQuests() {
        setLoading(true);
        questApis
            .getUserQuests()
            .then(res => {
                const {story_quests, daily_quests, time_until_reset} = res.data;
                setStoryQuests(story_quests);
                setDailyQuests(daily_quests);
                setNextResetInText(time_until_reset);
                dispatch(authActions.getUser());
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <AppModal isVisible={isVisible} onClose={onClose}>
            <View
                style={{
                    backgroundColor: colors.black,
                    width: scaledValue(345),
                    minHeight: scaledValue(515),
                    padding: gapSize.size2L,
                    borderWidth: 1,
                    borderColor: colors.secondary500,
                }}>
                <AppText
                    text={strings.questModal.title}
                    type={TextTypes.TitleSmall}
                    centered
                />
                <TabSelector
                    selectedIndex={tab}
                    onSelect={setTab}
                    items={[strings.questModal.story, strings.questModal.daily]}
                    style={{
                        marginVertical: gapSize.sizeM,
                        alignSelf: "center",
                        height: 40,
                    }}
                />
                {tab === 0 ? (
                    <StoryQuest
                        quests={storyQuests}
                        onRewardsClaimed={getQuests}
                        onRewardsClaimStarted={() => setLoading(true)}
                        loading={loading}
                    />
                ) : (
                    <DailyQuest
                        quests={dailyQuests}
                        onRewardsClaimed={getQuests}
                        onRewardsClaimStarted={() => setLoading(true)}
                        loading={loading}
                        nextResetInText={nextResetInText}
                    />
                )}
            </View>
        </AppModal>
    );
};

export default QuestModal;
