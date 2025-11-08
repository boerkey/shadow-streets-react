import {groupFightApis} from "@apis/index";
import {groupFightActions} from "@redux/actions";
import {showToast} from "@utils/helperFunctions";
import {call, put, takeLatest} from "redux-saga/effects";
import actionTypes from "../action_types";
import {
    setActiveFightsInCurrentDistrict,
    setGroupFightDetails,
    setGroupFights,
} from "../actions/groupFightActions";

function* getGroupFights(): Generator<any, void, any> {
    try {
        const response = yield call(groupFightApis.getGroupFights);
        console.log("GROUP FIGHTS", response);
        yield put(setGroupFights(response.data));
    } catch (error) {
        console.log("error", error);
    }
}

function* getActiveGroupFightsInCurrentDistrict(): Generator<any, void, any> {
    try {
        const response = yield call(
            groupFightApis.getActiveGroupFightsInCurrentDistrict,
        );
        yield put(setActiveFightsInCurrentDistrict(response.data));
    } catch (error) {}
}

function* getGroupFightDetails(action: any): Generator<any, void, any> {
    try {
        const response = yield call(
            groupFightApis.getGroupFightDetails,
            action.payload,
        );
        console.log("response", response);
        yield put(setGroupFightDetails(response.data));
    } catch (error) {}
}

function* joinGroupFight(action: any): Generator<any, void, any> {
    try {
        const res = yield call(
            groupFightApis.joinGroupFight,
            action.payload.groupFightId,
            action.payload.sideId,
        );
        console.log("response", res);
        yield put(
            groupFightActions.getGroupFightDetails(action.payload.groupFightId),
        );
        showToast(res.data.message);
    } catch (error) {}
}

const groupFightSaga = [
    takeLatest(actionTypes.GET_GROUP_FIGHTS, getGroupFights),
    takeLatest(
        actionTypes.GET_ACTIVE_FIGHTS_IN_CURRENT_DISTRICT,
        getActiveGroupFightsInCurrentDistrict,
    ),
    takeLatest(actionTypes.GET_GROUP_FIGHT_DETAILS, getGroupFightDetails),
    takeLatest(actionTypes.JOIN_GROUP_FIGHT, joinGroupFight),
];

export default groupFightSaga;
