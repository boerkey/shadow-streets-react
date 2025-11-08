import {boostApis} from "@apis/index";
import {call, put, takeLatest} from "redux-saga/effects";
import actionTypes from "../action_types";
import {
    getMyBoostsFailure,
    getMyBoostsSuccess,
    setPacks,
} from "../actions/boostActions";

function* getMyBoostsSaga(): Generator<any, void, any> {
    try {
        const response = yield call(boostApis.getMyBoosts);
        yield put(getMyBoostsSuccess(response.data.boosts));
    } catch (error) {
        yield put(getMyBoostsFailure(error));
    }
}

function* getPacksSaga(): Generator<any, void, any> {
    try {
        const response = yield call(boostApis.getPacks);
        yield put(
            setPacks(
                response.data.daily_packs,
                response.data.sound_packs,
                response.data.user_packs,
            ),
        );
    } catch (error) {}
}

const boostSaga = [
    takeLatest(actionTypes.GET_MY_BOOSTS_REQUEST, getMyBoostsSaga),
    takeLatest(actionTypes.GET_PACKS, getPacksSaga),
];

export default boostSaga;
