import React from "react";
import {FlatList, View} from "react-native";

import {questApis} from "@apis/index.ts";
import {colors, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {AppImage, AppText, Divider} from "@components/index.ts";
import {UserDailyQuest} from "@interfaces/UserInterface.ts";
import QuestRewards from "@screens/home/quest/QuestRewards.tsx";
import {showToast} from "@utils/helperFunctions.ts";
import {commonStyles, strings} from "@utils/index.ts";

interface DailyQuestProps {
    quests: UserDailyQuest[];
    onRewardsClaimed: () => void;
    onRewardsClaimStarted: () => void;
    loading: boolean;
    nextResetInText: string;
}

const DailyQuest = ({
    quests,
    onRewardsClaimed,
    onRewardsClaimStarted,
    loading,
    nextResetInText,
}: DailyQuestProps) => {
    function claimRewards(quest: UserDailyQuest) {
        if (!quest) return;
        onRewardsClaimStarted();
        questApis
            .claimQuestRewards(quest.quest_id, 2)
            .then(res => {
                showToast(res.data.message);
                onRewardsClaimed();
            })
            .catch(error => {
                console.log(error);
            });
    }

    const _renderQuestItem = ({
        item,
        index,
    }: {
        item: UserDailyQuest;
        index: number;
    }) => {
        const canClaim = item.completed_amount >= item.required_amount;
        return (
            <View style={commonStyles.alignItemsCenter}>
                <AppText text={item.name} type={TextTypes.H6} />
                <AppText
                    text={item.description}
                    postText={` (${item.completed_amount}/${item.required_amount})`}
                    type={TextTypes.Body2}
                />
                <QuestRewards
                    rewards={item.rewards}
                    canClaim={canClaim && !loading}
                    onClaim={() => claimRewards(item)}
                />
            </View>
        );
    };

    const totalQuestAmount = quests.filter(each => !each.is_claimed).length;
    const totalCompletedQuestAmount = quests.filter(each => {
        return (
            each.completed_amount >= each.required_amount && !each.is_claimed
        );
    }).length;

    return (
        <View style={[commonStyles.alignItemsCenter]}>
            <View style={commonStyles.flexRowAlignCenter}>
                <AppImage source={images.icons.whiteTime} size={14} />
                <AppText
                    text={`${strings.questModal.nextResetIn}: ${nextResetInText}`}
                    type={TextTypes.Caption}
                    fontSize={12}
                />
            </View>
            <Divider marginVertical={12} width={"100%"} />
            <View style={[commonStyles.flexRow, {alignSelf: "flex-end"}]}>
                <AppText
                    text={totalCompletedQuestAmount}
                    color={
                        totalCompletedQuestAmount > 0
                            ? colors.green
                            : colors.white
                    }
                    type={TextTypes.H6}
                />
                <AppText text={`/${totalQuestAmount}`} type={TextTypes.H6} />
            </View>
            <FlatList
                data={quests.filter(each => !each.is_claimed)}
                renderItem={_renderQuestItem}
                ItemSeparatorComponent={() => <Divider width={"100%"} />}
                style={{height: 300, zIndex: 3}}
            />
        </View>
    );
};

export default DailyQuest;
