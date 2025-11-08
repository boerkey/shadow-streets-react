import axios from "axios";
import {call, delay, put, select, takeLatest} from "redux-saga/effects";

import {AUTH_CREDENTIALS_KEY} from "@constants/keys.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {setHeaders} from "@utils/axios.ts";

import {RootState} from "@redux/index.ts";
import {Platform} from "react-native";
import {authApis, characterApis, settingsApis} from "../../apis";
import {navigate, SCREEN_NAMES} from "../../router.tsx";
import $ from "../action_types";
import {ActionType, authActions} from "../actions";

function* silentAuth(action: ActionType) {
    try {
        const {device_id, lang} = action.payload;
        const {data} = yield call(authApis.silentAuth, device_id, lang);
        setHeaders([
            {key: "Authorization", value: data.login_token},
            {key: "Accept-Language", value: data.user.lang},
            {key: "uid", value: data.user.id},
        ]);
        yield call(getUserBonuses);

        yield put(authActions.setUser(data.user));
        yield call(navigate, SCREEN_NAMES.HOME);
    } catch (e) {
        if (axios.isAxiosError(e)) {
            console.error("Axios error:", e.message);
        } else {
        }
    }
}

function* getUser(action: ActionType) {
    try {
        yield put(authActions.setUserLoading(true));
        const {data} = yield call(authApis.getUser);
        yield put(authActions.setUser(data.user));
        yield call(getUserBonuses);
        yield delay(250);
        yield put(authActions.setUserLoading(false));
        if (action.payload.navigateToHome) {
            yield call(navigate, SCREEN_NAMES.HOME);
        }
    } catch (e) {
        AsyncStorage.removeItem(AUTH_CREDENTIALS_KEY);
    }
}

function* getUserBonuses() {
    try {
        const {data} = yield call(characterApis.getUserBonuses);
        yield put(authActions.setUserBonuses(data.bonuses));
    } catch (error) {
        console.error(error);
    }
}

function* saveUserMarketingInfo() {
    try {
        const user = yield select((state: RootState) => state.auth.user);
        const payload = {
            os: Platform.OS,
            user_id: user.id,
        };

        yield call(authApis.saveUserMarketingInfo, payload);
        console.log("User marketing info saved successfully.");
    } catch (error) {
        console.error("Failed to save user marketing info:", error);
    }
}

function* getBotRestriction() {
    try {
        const {data} = yield call(authApis.getBotRestriction);
        yield put(authActions.setBotRestriction(data.restricted));
    } catch (error) {
        console.error("Failed to get bot restriction:", error);
    }
}

function* getUserSettings() {
    try {
        const {data} = yield call(settingsApis.getSettings);
        yield put(
            authActions.setUserSettings({
                ...data.settings,
                max_auto_job_amount: data.max_auto_job_amount,
                country: data.country,
            }),
        );
    } catch (error) {
        console.error("Failed to get user settings:", error);
    }
}

const authSaga = [
    takeLatest($.SILENT_AUTH, silentAuth),
    takeLatest($.GET_USER, getUser),
    takeLatest($.GET_USER_BONUSES, getUserBonuses),
    takeLatest($.SAVE_USER_MARKETING_INFO, saveUserMarketingInfo),
    takeLatest($.GET_BOT_RESTRICTION, getBotRestriction),
    takeLatest($.GET_USER_SETTINGS, getUserSettings),
];

export default authSaga;
