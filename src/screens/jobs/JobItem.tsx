import React, {ReactNode, useEffect, useState} from "react";
import {ImageBackground, TouchableOpacity, View} from "react-native";

import {useDispatch, useSelector} from "react-redux";

import {settingsApis} from "@apis/index";
import {colors, fonts, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {AppButton, AppImage, AppText, Divider} from "@components/index.ts";
import {Classes, Job, PartyJob} from "@interfaces/GameInterface.ts";
import {UserBoost} from "@interfaces/UserInterface.ts";
import {authActions, characterActions} from "@redux/actions";
import {RootState} from "@redux/index.ts";
import {showToast} from "@utils/helperFunctions";
import {commonStyles, scaledValue, strings} from "@utils/index.ts";
import {navigate, SCREEN_NAMES} from "../../router.tsx";
import styles from "./styles";

interface JobItemProps {
    job: Job | PartyJob;
    onPartyJoin: (job: PartyJob) => void;
    isExpanded: boolean;
    onExpand: () => void;
}

const randomNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const JobItem = ({job, onPartyJoin, isExpanded, onExpand}: JobItemProps) => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const myBoosts = useSelector((state: RootState) => state.boosts.myBoosts);

    const userSettings = useSelector(
        (state: RootState) => state.auth.userSettings,
    );
    const [correctNumber, setCorrectNumber] = useState(0);
    const [numberCheckList, setNumberCheckList] = useState<number[]>([]);
    const captchaActive = useSelector(
        (state: RootState) => state.auth.jobCaptchaActive,
    );

    const hasSpeedBoost = myBoosts.some(
        (boost: UserBoost) => boost.boost_id === 3,
    );

    const isPassiveGrindingEnabled = userSettings.auto_job_id > 0;
    const isSelectedJob = userSettings.auto_job_id == job.id;

    const isBlockedByLevel = user?.level < job.required_level;
    // Type guard for party job
    const isPartyJob = (job as any).required_crew > 0;

    useEffect(() => {
        if (isExpanded && captchaActive) {
            triggerCaptcha();
        }
    }, [isExpanded]);

    function shouldTriggerCaptcha(): boolean {
        return Math.random() < 0.03;
    }

    function triggerCaptcha() {
        const newCorrectNumber = setRandomCheckList();
        setCorrectNumber(newCorrectNumber);
        dispatch(authActions.setJobCaptchaActive(true));
    }

    function setRandomCheckList(): number {
        // Generate 3 unique random numbers
        const shuffledNumbers = [...randomNumbers].sort(
            () => Math.random() - 0.5,
        );
        const list = shuffledNumbers.slice(0, 3).sort((a, b) => a - b);
        setNumberCheckList(list);

        // Return a random number from the list as the correct one
        const randomIndex = Math.floor(Math.random() * list.length);
        return list[randomIndex];
    }

    function handleNumberSelection(selectedNumber: number) {
        if (selectedNumber === correctNumber) {
            dispatch(authActions.setJobCaptchaActive(false));
            dispatch(characterActions.doJob(job.id));
        }
    }

    function handleJobAction() {
        if (!isPassiveGrindingEnabled && shouldTriggerCaptcha()) {
            triggerCaptcha();
        } else {
            if (isPassiveGrindingEnabled) {
                setAutoJob();
            } else {
                dispatch(characterActions.doJob(job.id));
            }
        }
    }

    function handlePartyJoin() {
        onPartyJoin(job as PartyJob);
    }

    function renderCheckList() {
        if (!captchaActive) {
            return null;
        }

        const list: JSX.Element[] = [];
        numberCheckList.forEach((number, index) =>
            list.push(
                <TouchableOpacity
                    key={index}
                    onPress={() => handleNumberSelection(number)}
                    style={{
                        width: scaledValue(50),
                        height: scaledValue(50),
                        backgroundColor: colors.grey900,
                        borderRadius: 4,
                        justifyContent: "center",
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor:
                            number === correctNumber
                                ? colors.green
                                : colors.secondary500,
                    }}>
                    <AppText
                        text={number.toString()}
                        type={TextTypes.H1}
                        color={
                            number === correctNumber
                                ? colors.green
                                : colors.secondary500
                        }
                        centered
                    />
                </TouchableOpacity>,
            ),
        );

        return (
            <View style={{marginTop: gapSize.sizeL}}>
                <AppText
                    text={`Select the number: ${correctNumber}`}
                    type={TextTypes.H3}
                    color={colors.white}
                    centered
                />
                <AppText
                    text="Tap to select the correct number to continue"
                    type={TextTypes.BodySmall}
                    color={colors.secondary500}
                    centered
                    style={{marginTop: gapSize.sizeS}}
                />
                <View
                    style={[
                        commonStyles.flexRowSpaceEvenly,
                        {marginTop: gapSize.sizeM},
                    ]}>
                    {list}
                </View>
            </View>
        );
    }

    function getRecommendedStats() {
        let list: ReactNode[] = [];
        if (job?.recommended_stats) {
            Object.keys(job.recommended_stats).forEach(key => {
                const value = (job.recommended_stats as any)[key];
                value > 0 &&
                    list.push(
                        <View key={key}>
                            <View
                                style={
                                    commonStyles.flexRowSpaceBetweenAlignCenter
                                }>
                                <View style={commonStyles.flexRowAlignCenter}>
                                    <AppImage
                                        size={24}
                                        source={(images.icons as any)[key]}
                                        style={{marginRight: 8}}
                                    />
                                    <AppText
                                        text={(strings.common as any)[key]}
                                    />
                                </View>
                                <AppText
                                    text={value}
                                    color={colors.borderColor}
                                    type={TextTypes.BodyBold}
                                />
                            </View>
                            <Divider width={"100%"} marginVertical={7} />
                        </View>,
                    );
            });
        }
        return list;
    }

    function levelText() {
        return strings.jobs.youNeedLevelToCompleteThisJob.replace(
            "{level}",
            job.required_level,
        );
    }

    function setAutoJob() {
        settingsApis.updateAutoJob(job.id).then(res => {
            showToast(res.data.message);
            dispatch(authActions.getUserSettings());
        });
    }

    function renderButtons() {
        if (!isBlockedByLevel) {
            if (isPartyJob) {
                return (
                    <View
                        style={[
                            {
                                marginTop: gapSize.sizeL,
                                width: "100%",
                                alignItems: "center",
                            },
                        ]}>
                        <AppButton
                            onPress={handlePartyJoin}
                            text={strings.jobs.joinParty}
                            width={scaledValue(150)}
                            fontSize={18}
                            // No disabled state for party jobs
                        />
                    </View>
                );
            }
            return (
                <AppButton
                    onPress={handleJobAction}
                    text={
                        !isPassiveGrindingEnabled
                            ? strings.jobs.doJob
                            : isSelectedJob
                            ? strings.common.selected
                            : strings.jobs.selectJob
                    }
                    style={{
                        marginTop: gapSize.sizeL,
                        opacity: captchaActive ? 0.5 : 1,
                    }}
                    width={
                        isPassiveGrindingEnabled ? scaledValue(210) : undefined
                    }
                    rightIcon={
                        isPassiveGrindingEnabled && images.icons.settings
                    }
                    onRightIconPress={() => navigate(SCREEN_NAMES.SETTINGS)}
                    disabled={captchaActive}
                    timeoutDuration={hasSpeedBoost ? 1250 : 2500}
                />
            );
        }
    }

    return (
        <ImageBackground
            source={
                (images.jobs as any)[isPartyJob ? Classes.PARTY : user.class][
                    job.id
                ]
            }
            style={{marginBottom: scaledValue(12)}}>
            <TouchableOpacity
                onPress={onExpand}
                style={[
                    styles.mainContainer,
                    {
                        height: scaledValue(isExpanded ? 131 : 88),
                    },
                ]}>
                <View>
                    <View style={{alignItems: "center"}}>
                        <View style={commonStyles.flexRow}>
                            <AppText
                                text={job.name}
                                type={TextTypes.H5}
                                color={colors.white}
                            />
                            {isBlockedByLevel && (
                                <AppImage
                                    source={images.icons.lock}
                                    size={18}
                                    style={{marginLeft: gapSize.sizeS}}
                                />
                            )}
                        </View>
                        {isBlockedByLevel && (
                            <AppText
                                text={levelText()}
                                type={TextTypes.BodySmall}
                                highlightStyle={{
                                    color: colors.secondary500,
                                    fontFamily: fonts.RalewayBold,
                                }}
                                wordsToHighlight={[
                                    `${strings.common.level} ${job.required_level}`,
                                ]}
                            />
                        )}
                    </View>
                </View>
            </TouchableOpacity>
            {isExpanded && (
                <View style={styles.requirementsContainer}>
                    <AppText
                        text={strings.common.requirements}
                        type={TextTypes.BodyBold}
                        color={colors.white}
                    />
                    <View
                        style={{
                            marginTop: gapSize.sizeM,
                            width: "100%",
                        }}>
                        <View style={commonStyles.flexRowSpaceBetween}>
                            <AppText
                                fontSize={14}
                                text={strings.common.level}
                            />
                            <AppText
                                text={job.required_level}
                                color={colors.borderColor}
                                type={TextTypes.BodyBold}
                            />
                        </View>
                        <Divider width={"100%"} marginVertical={7} />
                        {isPartyJob && (
                            <>
                                <View style={commonStyles.flexRowSpaceBetween}>
                                    <AppText
                                        fontSize={14}
                                        text={strings.jobs.requiredCrew}
                                    />
                                    <AppText
                                        text={(job as any)?.required_crew}
                                        color={colors.borderColor}
                                        type={TextTypes.BodyBold}
                                    />
                                </View>
                                <Divider width={"100%"} marginVertical={7} />
                            </>
                        )}
                        <View style={commonStyles.flexRowSpaceBetween}>
                            <AppText text={strings.common.energy} />
                            <AppText
                                text={job.required_energy}
                                color={colors.borderColor}
                                type={TextTypes.BodyBold}
                            />
                        </View>
                        <Divider width={"100%"} marginVertical={7} />
                        {getRecommendedStats()}
                        {renderCheckList()}
                    </View>
                    {renderButtons()}
                </View>
            )}
        </ImageBackground>
    );
};

export default JobItem;
