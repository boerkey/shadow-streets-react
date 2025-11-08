import {itemApis} from "@apis/index.ts";
import {ActionType, authActions} from "@redux/actions";
import {call, put, throttle} from "redux-saga/effects";
import $ from "../action_types";

function* useItem(action: ActionType) {
    try {
        const {userItemId, itemType, amount} = action.payload;
        const {data} = yield call(
            itemApis.useItem,
            userItemId,
            itemType,
            amount,
        );
        yield put(authActions.setUser(data.user));
        // showToast(data.message);
        yield put(authActions.getUserBonuses());
    } catch (e) {}
}

const itemSaga = [throttle(500, $.USE_ITEM, useItem)];

export default itemSaga;
