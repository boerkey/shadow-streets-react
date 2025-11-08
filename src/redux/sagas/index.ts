import {all} from "redux-saga/effects";

import authSaga from "./authSaga";
import boostSaga from "./boostSaga";
import characterSaga from "./characterSaga";
import encounterSaga from "./encounterSaga.ts";
import groupFightSaga from "./groupFightSaga.ts";
import gameSaga from "./gameSaga";
import itemSaga from "./itemSaga.ts";
import propertySaga from "./propertySaga.ts";
import timerSaga from "./timerSaga.ts";

export default function* rootSaga() {
    yield all([
        ...authSaga,
        ...characterSaga,
        ...gameSaga,
        ...timerSaga,
        ...itemSaga,
        ...propertySaga,
        ...encounterSaga,
        ...boostSaga,
        ...groupFightSaga,
    ]);
}
