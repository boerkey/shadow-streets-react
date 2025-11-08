import React from "react";
import {StyleSheet, View} from "react-native";

import {colors, gapSize, images} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {AppButton, AppImage, AppText} from "@components/index";
import {QuestRewardType, UserQuestItemReward} from "@interfaces/UserInterface";
import commonStyles from "@utils/commonStyles";
import {renderNumber} from "@utils/helperFunctions.ts";
import {scaledValue, strings} from "@utils/index";
import {getItemImage} from "@utils/itemHelpers";

interface QuestRewardsProps {
    rewards: UserQuestItemReward[];
    canClaim: boolean;
    onClaim: () => void;
}

const QuestRewards = ({rewards, canClaim, onClaim}: QuestRewardsProps) => {
    const _renderReward = (
        rewardType: QuestRewardType,
        reward: UserQuestItemReward | number,
    ) => {
        switch (rewardType) {
            case QuestRewardType.MONEY:
                return (
                    <View style={commonStyles.alignItemsCenter}>
                        <View style={styles.rewardContainer}>
                            <AppImage source={images.icons.money} size={35} />
                        </View>
                        <AppText
                            text={renderNumber(reward)}
                            style={{marginTop: 1}}
                        />
                    </View>
                );
            case QuestRewardType.ITEM:
                return (
                    <View style={commonStyles.alignItemsCenter}>
                        <View style={styles.rewardContainer}>
                            <AppImage
                                source={getItemImage({
                                    item_id: reward.item_id,
                                    item_type: reward.type,
                                })}
                                size={38}
                            />
                        </View>
                        <AppText
                            preText="x"
                            text={reward.amount}
                            style={{marginTop: 1}}
                        />
                    </View>
                );
            case QuestRewardType.EXPERIENCE:
                return (
                    <View style={commonStyles.alignItemsCenter}>
                        <View style={styles.rewardContainer}>
                            <AppText
                                text={"XP"}
                                type={TextTypes.H6}
                                fontSize={20}
                                color="#F1C95B"
                            />
                        </View>
                        <AppText
                            text={renderNumber(reward)}
                            style={{marginTop: 1}}
                        />
                    </View>
                );
            case QuestRewardType.SHADOW_COIN:
                return (
                    <View style={commonStyles.alignItemsCenter}>
                        <View style={styles.rewardContainer}>
                            <AppImage
                                source={images.icons.shadowCoin}
                                size={30}
                            />
                        </View>
                        <AppText text={reward} style={{marginTop: 1}} />
                    </View>
                );
            case QuestRewardType.RANDOM_ITEM_BY_QUALITY:
                return (
                    <View style={commonStyles.alignItemsCenter}>
                        <View style={styles.rewardContainer}>
                            <AppText
                                text={"???"}
                                type={TextTypes.H6}
                                fontSize={20}
                                color="#F1C95B"
                            />
                        </View>
                        <AppText text={1} style={{marginTop: 2}} />
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <View style={commonStyles.alignItemsCenter}>
            <AppText
                text={strings.questModal.rewards}
                type={TextTypes.H6}
                centered
                style={{marginTop: gapSize.sizeM}}
            />
            <View
                style={[
                    commonStyles.flexRowSpaceBetweenAlignCenter,
                    {marginVertical: gapSize.sizeM},
                ]}>
                {Object.keys(rewards).map((rewardType, i, arr) => {
                    const hasNext = i < arr.length - 1;
                    return (
                        <View
                            style={{
                                marginRight: hasNext ? gapSize.sizeL : 0,
                            }}
                            key={i}>
                            {_renderReward(
                                parseInt(rewardType),
                                rewards[rewardType],
                            )}
                        </View>
                    );
                })}
            </View>
            <AppButton
                onPress={onClaim}
                text={strings.questModal.claimRewards}
                width={scaledValue(250)}
                disabled={!canClaim}
            />
        </View>
    );
};

export default QuestRewards;

const styles = StyleSheet.create({
    rewardContainer: {
        width: scaledValue(42),
        height: scaledValue(42),
        borderColor: colors.secondary500,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
