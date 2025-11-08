import {Job, PartyJob} from "@interfaces/GameInterface.ts";
import {UserMission} from "@interfaces/UserInterface";
import $ from "../action_types";

export function getJobs() {
    return {
        type: $.GET_JOBS,
    };
}

export function setJobs(jobs: Job[], partyJobs: PartyJob[]) {
    return {
        type: $.SET_JOBS,
        payload: {jobs, partyJobs},
    };
}

export function doJob(jobId: number) {
    return {
        type: $.DO_JOB,
        payload: {jobId},
    };
}

export function chooseClass(classId: number) {
    return {
        type: $.CHOOSE_CLASS,
        payload: {classId},
    };
}

export function getMyMissions() {
    return {
        type: $.GET_MY_MISSIONS,
    };
}

export function setMyMissions(
    activeMission: UserMission,
    lastMission: UserMission,
    nextMissionCooldownSeconds: number,
) {
    return {
        type: $.SET_MY_MISSIONS,
        payload: {activeMission, lastMission, nextMissionCooldownSeconds},
    };
}

export function getSpecialRuns() {
    return {
        type: $.GET_SPECIAL_RUNS,
    };
}

export function setSpecialRuns(
    categories: any[],
    difficulties: any[],
    current_special_run: any,
    last_special_run_rewards: any,
    special_run_limit_text: string,
) {
    return {
        type: $.SET_SPECIAL_RUNS,
        payload: {
            categories,
            difficulties,
            current_special_run,
            last_special_run_rewards,
            special_run_limit_text,
        },
    };
}

export function setSpecialRunLoading(loading: boolean) {
    return {
        type: $.SET_SPECIAL_RUN_LOADING,
        payload: loading,
    };
}
