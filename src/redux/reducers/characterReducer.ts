import {Job, PartyJob} from "@interfaces/GameInterface.ts";
import {
    CurrentSpecialRun,
    LastSpecialRunRewards,
} from "@interfaces/SpecialRunInterface";
import {UserMission} from "@interfaces/UserInterface";
import {ActionType} from "@redux/actions";
import $ from "../action_types";

const initialState: {
    jobs: Job[];
    partyJobs: PartyJob[];
    jobsLoading: boolean;
    activeMission: UserMission | null;
    lastMission: UserMission | null;
    nextMissionCooldownSeconds: number;
    specialRunCategories: any[];
    specialRunDifficulties: any[];
    currentSpecialRun: CurrentSpecialRun | null;
    lastSpecialRunRewards: LastSpecialRunRewards | null;
    specialRunLimitText: string;
    specialRunLoading: boolean;
} = {
    jobs: [],
    partyJobs: [],
    jobsLoading: false,
    activeMission: null,
    lastMission: null,
    nextMissionCooldownSeconds: 0,
    specialRunCategories: [],
    specialRunDifficulties: [],
    currentSpecialRun: null,
    lastSpecialRunRewards: null,
    specialRunLimitText: "",
    specialRunLoading: false,
};

const characterReducer = (state = initialState, action: ActionType) => {
    const {type, payload} = action;

    switch (type) {
        case $.GET_JOBS:
        case $.GET_MY_MISSIONS: {
            return {...state, jobsLoading: true};
        }
        case $.SET_JOBS: {
            return {
                jobs: payload.jobs,
                partyJobs: payload.partyJobs,
                jobsLoading: false,
            };
        }
        case $.SET_MY_MISSIONS: {
            return {
                ...state,
                activeMission: payload.activeMission,
                lastMission: payload.lastMission,
                nextMissionCooldownSeconds: payload.nextMissionCooldownSeconds,
                jobsLoading: false,
            };
        }
        case $.SET_SPECIAL_RUNS: {
            return {
                ...state,
                specialRunCategories: payload.categories,
                specialRunDifficulties: payload.difficulties,
                currentSpecialRun: payload.current_special_run,
                lastSpecialRunRewards: payload.last_special_run_rewards,
                specialRunLimitText: payload.special_run_limit_text,
            };
        }
        case $.SET_SPECIAL_RUN_LOADING: {
            return {
                ...state,
                specialRunLoading: payload,
            };
        }
        default:
            return state;
    }
};

export default characterReducer;
