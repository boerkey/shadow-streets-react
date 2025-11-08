import {encounterApis} from "@apis/index.ts";
import {encounterActions} from "@redux/actions";
import {call, put, takeLatest} from "redux-saga/effects";
import $ from "../action_types";

function* getEncounters() {
    try {
        const {data} = yield call(encounterApis.getEncounters);
        yield put(
            encounterActions.setEncounters(
                data.encounters,
                data.seconds_until_next_attack,
            ),
        );
    } catch (e) {}
}

const encounterSaga = [takeLatest($.GET_ENCOUNTERS, getEncounters)];

export default encounterSaga;
