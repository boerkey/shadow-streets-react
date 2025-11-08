// timerSaga.js
import {put, delay, takeLatest} from "redux-saga/effects";
import $ from "../action_types";
import {ActionType, timerActions} from "@redux/actions";

// Saga to handle the timer countdown
function* handleTimer(action: ActionType) {
    const {duration} = action.payload;

    // Countdown logic
    for (let i = duration; i > 0; i--) {
        yield delay(1000); // Wait 1 second
        yield put(timerActions.decrementTimer()); // Dispatch decrement action
    }

    // Reset timer when done
    yield put(timerActions.resetTimer());
}
const timerSaga = [takeLatest($.START_TIMER, handleTimer)];

export default timerSaga;
