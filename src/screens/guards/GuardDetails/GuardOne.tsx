import React, {useEffect, useState} from "react";
import {RefreshControl, ScrollView, TouchableOpacity, View} from "react-native";

import {useDispatch, useSelector} from "react-redux";

import {guardApis} from "@apis/index";
import {colors, gapSize, images} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {
    AppButton,
    AppImage,
    AppText,
    CheckBox,
    Divider,
    Prompt,
    TabSelector,
    TooltipDropdown,
} from "@components/index";
import {GuardUpgrade, UserGuard} from "@interfaces/GameInterface";
import {RootState} from "@redux/index";
import {renderNumber, showToast} from "@utils/helperFunctions";
import {commonStyles, scaledValue, strings} from "@utils/index";
import GuardUpgrades from "./GuardUpgrades";

enum TaskType {
    Solo = 1,
    Party = 2,
}

const GuardOne = ({
    guard,
    getGuard,
    guardUpgradesData,
    loading,
}: {
    guard: UserGuard;
    getGuard: () => void;
    guardUpgradesData: GuardUpgrade[];
    loading: boolean;
}) => {
    const dispatch = useDispatch();
    const jobs = useSelector((state: RootState) => state.character.jobs);
    const user = useSelector((state: RootState) => state.auth.user);
    const [selectedTask, setSelectedTask] = useState<number>(-1);
    const [partyJobEnabled, setPartyJobEnabled] = useState<boolean>(false);
    const [guardDetailsTab, setGuardDetailsTab] = useState<number>(0);
    const [isResetStatisticsVisible, setIsResetStatisticsVisible] =
        useState<boolean>(false);
    const soloTask = guard.tasks.find(task => task.task_id === TaskType.Solo);
    const partyTask = guard.tasks.find(task => task.task_id === TaskType.Party);
    const hasAssignedTask = !!soloTask;

    useEffect(() => {
        setSelectedTask(soloTask ? soloTask.task_value - 1 : -1);
        setPartyJobEnabled(!!partyTask);
    }, [guard]);

    function getJobsThatIcanDo() {
        const jobList: {name: string; id: number}[] = [];
        jobs.forEach((job: any) => {
            if (job.required_level <= user.level) {
                jobList.push({
                    name: job.name,
                    id: job.id,
                });
            }
        });
        return jobList;
    }

    function getSoloJobName() {
        const jobList = getJobsThatIcanDo();
        const name =
            jobList.find(job => job.id === selectedTask + 1)?.name ??
            strings.guards.selectJob;
        return name.length > 15 ? name.slice(0, 15) + "..." : name;
    }

    function updateGuardTask(taskId: number, taskValue: number) {
        guardApis.updateGuardTask(guard.id, taskId, taskValue).then(res => {
            showToast(res.data.message);
            getGuard();
        });
    }

    function getStatValue(
        id: number,
        baseValue: number,
        normalizer_multiplier: number,
    ) {
        let upgradeValue = 0;
        const hasThisUpgrade = guard.upgrades.find(
            guardUpgrade => guardUpgrade.upgrade_id === id,
        );

        if (hasThisUpgrade) {
            const upgrade = guardUpgradesData.find(
                upgrade => upgrade.id === hasThisUpgrade.upgrade_id,
            );
            upgradeValue = upgrade?.bonus[hasThisUpgrade.level - 1] ?? 0;
        }

        return renderNumber((baseValue + upgradeValue) * normalizer_multiplier);
    }

    function renderGuardValues() {
        if (guardDetailsTab === 0) {
            return Object.keys(guard.statistics).map(key => {
                const keyString = strings.playerProfile.stats[key];
                if (keyString) {
                    const value = renderNumber(guard.statistics[key], 1);

                    return (
                        <View key={key}>
                            <View style={commonStyles.flexRowSpaceBetween}>
                                <AppText text={keyString} />
                                <AppText text={value} />
                            </View>
                            <Divider
                                width={"100%"}
                                marginVertical={gapSize.sizeM}
                            />
                        </View>
                    );
                }
            });
        }
        return guardUpgradesData.map(upgrade => {
            const normalizer_multiplier = upgrade.normalizer_multiplier;
            const baseValue = upgrade.base_value;
            return (
                <View key={upgrade.id}>
                    <View style={commonStyles.flexRowSpaceBetween}>
                        <AppText text={upgrade.name} />
                        <AppText
                            text={getStatValue(
                                upgrade.id,
                                baseValue,
                                normalizer_multiplier,
                            )}
                            postText={normalizer_multiplier > 1 ? "%" : "/min"}
                        />
                    </View>
                    <Divider width={"100%"} marginVertical={gapSize.sizeM} />
                </View>
            );
        });
    }

    function switchAutoEat() {
        guardApis.switchAutoEat(guard.id).then(res => {
            getGuard();
        });
    }

    function resetStatistics() {
        guardApis.resetStatistics(guard.id).then(res => {
            getGuard();
        });
    }

    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={getGuard} />
            }
            contentContainerStyle={{paddingBottom: 300}}
            showsVerticalScrollIndicator={false}>
            <TabSelector
                items={[
                    {id: 1, name: strings.guards.statistics},
                    {id: 0, name: strings.guards.info},
                ]}
                selectedIndex={guardDetailsTab}
                onSelect={index => {
                    setGuardDetailsTab(index);
                }}
                style={{alignSelf: "center", marginTop: gapSize.sizeM}}
            />
            <Prompt
                isVisible={isResetStatisticsVisible}
                onClose={() => setIsResetStatisticsVisible(false)}
                title={strings.common.warning}
                text={strings.guards.resetStatisticsDescription}
                onConfirm={resetStatistics}
            />
            <View
                style={{
                    backgroundColor: "#181515",
                    paddingHorizontal: gapSize.sizeM,
                    paddingTop: gapSize.sizeL,
                    paddingBlock: gapSize.sizeM,
                    marginBottom: gapSize.sizeM,
                }}>
                {renderGuardValues()}
                {guardDetailsTab === 1 && (
                    <AppText
                        text={strings.guards.proportionateExplanation}
                        type={TextTypes.Body2}
                    />
                )}
                {guardDetailsTab === 0 && (
                    <TouchableOpacity
                        onPress={() => setIsResetStatisticsVisible(true)}>
                        <AppText
                            text={strings.guards.resetStatistics}
                            type={TextTypes.Body2}
                            color={colors.red}
                        />
                    </TouchableOpacity>
                )}
            </View>
            <View style={commonStyles.flexRow}>
                <TooltipDropdown
                    placement="top"
                    disabled={!!soloTask}
                    paddingHorizontal={0}
                    onSelect={index => {
                        setSelectedTask(index);
                    }}
                    dropdownWidth={250}
                    options={getJobsThatIcanDo()}>
                    <View
                        style={{
                            width: scaledValue(185),
                            height: 40,
                            borderWidth: 1,
                            borderColor: colors.borderColor,
                            backgroundColor: colors.black,
                            paddingVertical: gapSize.sizeS,
                            paddingHorizontal: gapSize.sizeM,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            opacity: soloTask ? 0.5 : 1,
                        }}>
                        <AppText text={getSoloJobName()} />
                        <AppImage source={images.icons.arrowDown} size={15} />
                    </View>
                </TooltipDropdown>
                <AppButton
                    disabled={selectedTask === -1}
                    text={
                        hasAssignedTask
                            ? strings.common.unassign
                            : strings.common.assign
                    }
                    onPress={() => {
                        updateGuardTask(
                            TaskType.Solo,
                            hasAssignedTask ? 0 : selectedTask + 1,
                        );
                    }}
                    height={40}
                    width={143}
                    fontSize={20}
                    style={{marginLeft: gapSize.sizeM}}
                />
            </View>
            <CheckBox
                text={strings.guards.triggerPartyJobs + "/min"}
                isChecked={partyJobEnabled}
                onPress={() => {
                    updateGuardTask(TaskType.Party, partyJobEnabled ? 0 : 1);
                }}
                style={{
                    marginTop: gapSize.size2L,
                    marginBottom: gapSize.sizeM,
                    marginLeft: gapSize.sizeXS,
                }}
            />
            <CheckBox
                text={strings.settings.autoEatFood}
                isChecked={guard.auto_eat}
                onPress={() => {
                    switchAutoEat();
                }}
                style={{
                    marginBottom: gapSize.sizeM,
                    marginLeft: gapSize.sizeXS,
                }}
            />
            <View style={{alignItems: "center"}}>
                <GuardUpgrades
                    guardUpgradesData={guardUpgradesData}
                    user={user}
                    guard={guard}
                    getGuard={getGuard}
                    showUpgradeIndicator
                />
            </View>
        </ScrollView>
    );
};

export default GuardOne;
