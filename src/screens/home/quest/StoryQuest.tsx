import React from "react";
import {Image} from "react-native";

import {AppText} from "@components/index.ts";
import {TextTypes} from "@components/AppText";
import {gapSize, images} from "@assets/index.ts";
import {strings} from "@utils/index.ts";
import {UserStoryQuest} from "@interfaces/UserInterface.ts";
import QuestRewards from "./QuestRewards";
import {questApis} from "@apis/index";
import {showToast} from "@utils/helperFunctions";

interface StoryQuestProps {
    quests: UserStoryQuest[];
    onRewardsClaimed: () => void;
    onRewardsClaimStarted: () => void;
    loading: boolean;
}

const StoryQuest = ({
    quests,
    onRewardsClaimed,
    onRewardsClaimStarted,
    loading,
}: StoryQuestProps) => {
    const quest = quests.find(quest => !quest.is_claimed);

    function claimRewards() {
        if (!quest) return;
        onRewardsClaimStarted();
        questApis
            .claimQuestRewards(quest.quest_id, 1)
            .then(res => {
                showToast(res.data.message);
                onRewardsClaimed();
            })
            .catch(error => {
                console.log(error);
            });
    }

    if (!quest) {
        return (
            <>
                <Image
                    source={images.backgrounds.questTest}
                    style={{width: 309, height: 139}}
                />
                <AppText
                    text={strings.questModal.noQuest}
                    type={TextTypes.BodyBold}
                    centered
                    style={{marginTop: "20%"}}
                />
            </>
        );
    }

    const canClaimTheQuest =
        !quest.is_claimed && quest.completed_amount >= quest.required_amount;

    return (
        <>
            <AppText
                text={`${quest.quest_id}. ${quest.name}`}
                type={TextTypes.H6}
                style={{marginTop: gapSize.sizeM}}
            />
            <Image
                source={images.backgrounds.questTest}
                style={{width: 309, height: 139}}
            />
            <AppText
                text={quest.description}
                postText={` (${quest.completed_amount}/${quest.required_amount})`}
                fontSize={12}
            />
            <QuestRewards
                rewards={quest.rewards}
                canClaim={canClaimTheQuest && !loading}
                onClaim={claimRewards}
            />
        </>
    );
};

export default StoryQuest;
