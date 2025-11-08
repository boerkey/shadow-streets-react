import React, {useEffect, useState} from "react";
import {Platform, TouchableOpacity, View} from "react-native";

import {useDispatch, useSelector} from "react-redux";

import {RootState} from "@redux/index.ts";

import {characterApis, settingsApis} from "@apis/index.ts";
import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {
    AppButton,
    AppText,
    ScreenContainer,
    TitleHeader,
} from "@components/index.ts";
import useCountdown from "@hooks/useCountdown.ts";
import {Job} from "@interfaces/GameInterface.ts";
import {authActions} from "@redux/actions/index.ts";
import CrewList from "@screens/jobs/CrewList.tsx";
import {FirebaseParty} from "@screens/jobs/logic.ts";
import {
    getJobRequirements,
    getPartyStats,
    renderItemRewards,
    renderPartyMessage,
    renderRewards,
} from "@screens/jobs/PartyDetailsComponents.tsx";
import {showToast} from "@utils/helperFunctions.ts";
import {commonStyles, scaledValue, strings} from "@utils/index.ts";
import {navigate, navigateBack, SCREEN_NAMES} from "../../router.tsx";

const randomNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const PartyDetails = () => {
    const dispatch = useDispatch();
    const partyJobs = useSelector(
        (state: RootState) => state.character.partyJobs,
    );
    const user = useSelector((state: RootState) => state.auth.user);

    const userSettings = useSelector(
        (state: RootState) => state.auth.userSettings,
    );
    const [partyDetails, setPartyDetails] = useState<FirebaseParty | null>(
        null,
    );
    const captchaActive = useSelector(
        (state: RootState) => state.auth.partyJobCaptchaActive,
    );

    const [partyLoaded, setPartyLoaded] = useState(false);
    const [isOnCooldown, setIsOnCooldown] = useState(false);
    const [cooldownDuration, setCooldownDuration] = useState(0);
    const [correctNumber, setCorrectNumber] = useState(0);
    const [numberCheckList, setNumberCheckList] = useState<number[]>([]);

    const {formatted: cooldownFormattedTime} = useCountdown(cooldownDuration, {
        onComplete: () => {
            setIsOnCooldown(false);
            setCooldownDuration(0);
        },
        isPaused: !isOnCooldown,
    });

    const isPassivePartyGrindingEnabled = userSettings.auto_party_job_id > 0;
    const isAutoPartyJob =
        userSettings.auto_party_job_id == partyDetails?.job_id;

    const partyJob = partyJobs.find(
        (job: Job) => job.id === partyDetails?.job_id,
    );

    const isPartyLeader = partyDetails?.owner_id === user.id;
    const hasEnoughCrew =
        partyDetails?.required_crew === partyDetails?.crew?.length;

    useEffect(() => {
        getMyParty();
        const interval = setInterval(() => {
            getMyParty();
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (captchaActive) {
            triggerCaptcha();
        }
    }, []);

    function shouldTriggerCaptcha(): boolean {
        return Math.random() < 0.05;
    }

    function triggerCaptcha() {
        const newCorrectNumber = setRandomCheckList();
        setCorrectNumber(newCorrectNumber);
        dispatch(authActions.setPartyJobCaptchaActive(true));
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
            dispatch(authActions.setPartyJobCaptchaActive(false));
            doJob();
        }
    }
    function handleJobAction(jobId: number) {
        if (!isPassivePartyGrindingEnabled && shouldTriggerCaptcha()) {
            triggerCaptcha();
        } else {
            if (isPassivePartyGrindingEnabled) {
                selectPartyJob(jobId);
            } else {
                doJob();
            }
        }
    }

    function getMyParty() {
        characterApis
            .getMyParty()
            .then(res => {
                setPartyDetails(res.data.party);
            })
            .finally(() => {
                setPartyLoaded(true);
            });
    }

    useEffect(() => {
        if (!partyDetails && partyLoaded) {
            navigateBack();
        }
    }, [partyDetails]);

    function leaveParty() {
        characterApis.leaveParty().then(res => {
            navigateBack();
        });
    }

    function kickCrewFromParty(userId: number) {
        characterApis.kickFromParty(userId).then(res => {
            getMyParty();
        });
    }

    function doJob() {
        if (!partyDetails) return;

        setIsOnCooldown(false);
        setCooldownDuration(0);

        const userIds: number[] = partyDetails.crew.map(each => each.id);

        characterApis
            .doPartyJob(partyDetails.job_id, userIds)
            .then(res => {
                const {remaining_cooldown_seconds} = res.data;
                getMyParty();
                if (!partyDetails) return;

                if (
                    remaining_cooldown_seconds &&
                    remaining_cooldown_seconds > 0
                ) {
                    setCooldownDuration(remaining_cooldown_seconds);
                    setIsOnCooldown(true);
                } else {
                    setIsOnCooldown(false);
                    setCooldownDuration(0);
                }
            })
            .catch(e => {
                if (!partyDetails) return;
                if (e.response?.status === 429) {
                    const errorMessage =
                        e.response.data?.error ||
                        strings.jobs.jobOnCooldownGeneric;
                    const remainingSeconds = e.response.data?.remaining_seconds;

                    if (remainingSeconds && remainingSeconds > 0) {
                        setCooldownDuration(remainingSeconds);
                        setIsOnCooldown(true);
                        showToast(
                            errorMessage,
                            ` ${strings.jobs.waiting} ${remainingSeconds}s`,
                            "error",
                        );
                    } else {
                        showToast(errorMessage, "", "error");
                        setIsOnCooldown(false);
                    }
                }
            });
    }

    function selectPartyJob(jobId: number) {
        settingsApis.updateAutoPartyJob(jobId).then(res => {
            showToast(res.data.message);
            dispatch(authActions.getUserSettings());
        });
    }

    const getButtonState = () => {
        if (!partyDetails) {
            return {text: strings.common.loading, disabled: true};
        }

        if (isOnCooldown) {
            return {text: strings.jobs.onCooldown, disabled: true};
        }

        if (!hasEnoughCrew) {
            return {text: strings.jobs.waitingForCrew, disabled: true};
        }

        return {text: strings.jobs.doJob, disabled: false};
    };

    const buttonState = getButtonState();

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

    return (
        <ScreenContainer>
            {!partyDetails ? (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <AppText text={strings.common.loading} />
                </View>
            ) : (
                <View style={{padding: gapSize.size3L, flex: 1}}>
                    <TitleHeader />
                    <CrewList
                        size={Platform.OS === "ios" ? 60 : 48}
                        ownerId={partyDetails?.owner_id}
                        crew={partyDetails?.crew}
                        maxCrew={partyDetails?.required_crew}
                        onMemberKick={userId => {
                            if (!partyDetails) return;
                            if (isPartyLeader) {
                                kickCrewFromParty(userId);
                            }
                        }}
                    />
                    <View style={{marginTop: gapSize.sizeL}}>
                        <AppText
                            text={partyJob?.name}
                            type={TextTypes.BodyBold}
                            centered
                        />
                        <View
                            style={[
                                commonStyles.flexRowSpaceBetween,
                                {marginTop: gapSize.sizeL},
                            ]}>
                            <View style={{width: "48%"}}>
                                <AppText
                                    text={strings.jobs.requirements}
                                    type={TextTypes.BodyBold}
                                />
                                {getJobRequirements(partyJob)}
                            </View>
                            <View style={{width: "48%"}}>
                                <AppText
                                    text={strings.jobs.partyStats}
                                    type={TextTypes.BodyBold}
                                />
                                {getPartyStats(partyJob, partyDetails)}
                            </View>
                        </View>
                    </View>
                    {!captchaActive && renderRewards(partyDetails)}
                    {!captchaActive && renderPartyMessage(partyDetails)}
                    {!captchaActive &&
                        renderItemRewards(partyDetails?.result?.items_yield)}
                    {renderCheckList()}
                    <View
                        style={{
                            position: "absolute",
                            bottom: gapSize.sizeM,
                            left: gapSize.size3L,
                            right: gapSize.size3L,
                            alignItems: "center",
                        }}>
                        {isOnCooldown && (
                            <AppText
                                text={`${strings.jobs.onCooldown}: ${cooldownFormattedTime}`}
                                color={colors.red}
                                centered
                                style={{marginBottom: gapSize.sizeS}}
                            />
                        )}
                        {isPartyLeader && (
                            <AppButton
                                disabled={buttonState.disabled}
                                onPress={() =>
                                    handleJobAction(partyDetails.job_id)
                                }
                                text={
                                    isPassivePartyGrindingEnabled
                                        ? isAutoPartyJob
                                            ? strings.common.selected
                                            : strings.jobs.selectJob
                                        : strings.jobs.doJob
                                }
                                style={{
                                    marginBottom: gapSize.sizeM,
                                    alignSelf: "center",
                                }}
                                width={225}
                                rightIcon={
                                    isPassivePartyGrindingEnabled &&
                                    images.icons.settings
                                }
                                onRightIconPress={() =>
                                    navigate(SCREEN_NAMES.SETTINGS)
                                }
                            />
                        )}
                        {isPartyLeader && !hasEnoughCrew && (
                            <AppText
                                text={strings.jobs.waitingForCrew}
                                type={TextTypes.BodyBold}
                                color={colors.secondary500}
                                style={{marginBottom: gapSize.sizeM}}
                                centered
                            />
                        )}
                        {!isPartyLeader && (
                            <AppText
                                text={
                                    !hasEnoughCrew
                                        ? strings.jobs.waitingForCrew
                                        : strings.jobs.waitingForLeader
                                }
                                type={TextTypes.BodyBold}
                                color={colors.secondary500}
                                style={{marginBottom: gapSize.sizeM}}
                                centered
                            />
                        )}
                        <TouchableOpacity
                            onPress={leaveParty}
                            hitSlop={commonStyles.hitSlop}>
                            <AppText
                                text={strings.jobs.leaveParty}
                                color={"#E12648"}
                                style={{textDecorationLine: "underline"}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </ScreenContainer>
    );
};

export default PartyDetails;
