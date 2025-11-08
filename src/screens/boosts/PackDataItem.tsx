import {AppButton} from "@components/index";
import React from "react";
import {StyleSheet, View} from "react-native";

import {colors, gapSize, images} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {AppImage, AppText} from "@components/index";
import {QuestRewardType, UserQuestItemReward} from "@interfaces/UserInterface";
import {RootState} from "@redux/index";
import {commonStyles, scaledValue, strings} from "@utils/index";
import {getItemImage} from "@utils/itemHelpers";
import {useSelector} from "react-redux";
import {PackData, PackType} from "./index";

const PackDataItem = ({
    item,
    onPress,
}: {
    item: PackData;
    onPress: () => void;
}) => {
    const userPacks = useSelector((state: RootState) => state.boosts.userPacks);

    function isOwned() {
        if (item.type === PackType.SOUND) {
            return userPacks["sound_pack_" + item.id] > 0;
        }
        return false;
    }

    function getPackImage() {
        switch (item.type) {
            case PackType.DAILY:
                return images.packs.dailyPacks[
                    item.image_id !== 0 ? item.image_id : item.id
                ];
            case PackType.SOUND:
                return images.packs.musicPacks[
                    item.image_id !== 0 ? item.image_id : item.id
                ];
        }
    }

    function renderContent() {
        if (!item.content) return null;

        const entries = Object.entries(item.content);

        return entries.map(([rewardTypeStr, rewards], index) => {
            const rewardType = parseInt(rewardTypeStr);

            return (
                <View
                    key={rewardType}
                    style={{
                        flexDirection: "row",
                    }}>
                    {rewards.map(
                        (reward: UserQuestItemReward, rewardIndex: number) => (
                            <View
                                key={rewardIndex}
                                style={{
                                    marginRight: 10,
                                }}>
                                {renderReward(rewardType, reward)}
                            </View>
                        ),
                    )}
                </View>
            );
        });
    }

    function renderDailyLimit() {
        if (!item.daily_limit) return null;
        const userPackCurrentAmount = userPacks["daily_pack_" + item.id];
        return (
            <AppText
                text={`${userPackCurrentAmount || 0}/${item.daily_limit}`}
                type={TextTypes.H6}
                centered
                color={isMaxLimitReached() ? colors.green : colors.white}
            />
        );
    }

    function isMaxLimitReached() {
        if (!item.daily_limit) return false;
        if (item.type === PackType.DAILY) {
            return userPacks["daily_pack_" + item.id] >= item.daily_limit;
        }
        return false;
    }

    function renderReward(
        rewardType: QuestRewardType,
        reward: UserQuestItemReward,
    ) {
        switch (rewardType) {
            case QuestRewardType.ITEM:
                return (
                    <View style={commonStyles.alignItemsCenter}>
                        <View style={styles.rewardContainer}>
                            <AppImage
                                source={getItemImage({
                                    item_id: reward.item_id,
                                    item_type: reward.type,
                                })}
                                size={22}
                            />
                        </View>
                        <AppText
                            preText="x"
                            text={reward.amount}
                            style={{marginTop: 1}}
                            fontSize={11}
                        />
                    </View>
                );
        }
    }

    return (
        <View
            style={[
                styles.boostItemContainer,
                {
                    borderColor:
                        isOwned() || isMaxLimitReached()
                            ? colors.green
                            : colors.secondary500,
                },
            ]}>
            <View>
                <AppImage source={getPackImage()} size={70} />
                {renderDailyLimit()}
            </View>
            <View
                style={{
                    width: "45%",
                    marginLeft: gapSize.sizeM,
                    top: -gapSize.sizeS,
                }}>
                <AppText text={item.name} type={TextTypes.H5} fontSize={15} />
                <AppText
                    text={item.description}
                    fontSize={13}
                    style={{width: "90%", marginVertical: gapSize.sizeS}}
                />
                {renderContent()}
            </View>
            {!isOwned() && !isMaxLimitReached() && (
                <View style={commonStyles.alignItemsCenter}>
                    <View
                        style={[
                            commonStyles.flexRowAlignCenter,
                            {marginBottom: gapSize.sizeS, top: -gapSize.sizeS},
                        ]}>
                        <AppImage source={images.icons.shadowCoin} size={30} />
                        <AppText
                            text={item.price}
                            type={TextTypes.H5}
                            style={{marginLeft: gapSize.sizeS}}
                        />
                    </View>
                    <AppButton
                        onPress={onPress}
                        promptTitle={item.name}
                        promptText={
                            strings.boosts.youWillActivateBoostAreYouSure
                        }
                        text={strings.common.buy}
                        width={100}
                        height={42}
                        fontSize={20}
                    />
                </View>
            )}
        </View>
    );
};

export default PackDataItem;

const styles = StyleSheet.create({
    boostItemContainer: {
        width: "100%",
        minHeight: scaledValue(124),
        borderColor: colors.secondary500,
        borderWidth: 1,
        marginTop: gapSize.sizeM,
        flexDirection: "row",
        paddingVertical: gapSize.sizeL,
        paddingHorizontal: gapSize.sizeM,
        alignItems: "center",
        backgroundColor: colors.black,
    },
    rewardContainer: {
        width: scaledValue(30),
        height: scaledValue(30),
        borderColor: colors.secondary500,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
