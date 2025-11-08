import {call, delay, put, takeLatest} from "redux-saga/effects";

import {showJobResultToast} from "@utils/helperFunctions.ts";
import {characterApis, specialRunApis} from "../../apis";
import {navigateBack} from "../../router.tsx";
import $ from "../action_types";
import {ActionType, authActions, characterActions} from "../actions";

function* getJobs() {
    try {
        const {data} = yield call(characterApis.getJobs);
        yield put(characterActions.setJobs(data.jobs, data.party_jobs));
    } catch (e) {
        console.log(e);
    }
}

function* doJob(action: ActionType) {
    try {
        const {data} = yield call(characterApis.doJob, action.payload.jobId);
        const {user, outcome} = data;
        yield put(authActions.setUser(user));
        showJobResultToast(outcome);
    } catch (e) {}
}

function* chooseClass(action: ActionType) {
    try {
        yield call(characterApis.chooseClass, action.payload.classId);
        yield put(authActions.getUser());
        yield put(characterActions.getJobs());
        yield call(navigateBack);
    } catch (e) {
        console.error(e);
    }
}

function* getMyMissions() {
    try {
        const {data} = yield call(characterApis.getMyMissions);
        yield put(
            characterActions.setMyMissions(
                data.active_mission,
                data.last_mission,
                data.next_mission_cooldown_seconds,
            ),
        );
    } catch (e) {}
}

function* getSpecialRuns() {
    try {
        // Set loading state
        yield put(characterActions.setSpecialRunLoading(true));

        // Fetch data
        const {data} = yield call(specialRunApis.getSpecialRuns);

        // Update state with fetched data
        yield put(
            characterActions.setSpecialRuns(
                data.categories,
                data.difficulties,
                data.current_special_run,
                data.last_special_run_rewards,
                data.available_runs + "/" + data.daily_limit,
            ),
        );

        // Wait for 2 seconds
        yield delay(1500);

        // Set loading state to false
        yield put(characterActions.setSpecialRunLoading(false));
    } catch (e) {}
}

const characterSaga = [
    takeLatest($.GET_JOBS, getJobs),
    takeLatest($.DO_JOB, doJob),
    takeLatest($.CHOOSE_CLASS, chooseClass),
    takeLatest($.GET_MY_MISSIONS, getMyMissions),
    takeLatest($.GET_SPECIAL_RUNS, getSpecialRuns),
];

export default characterSaga;
