import {ItemType} from "@interfaces/GameInterface.ts";
import {User, UserSettings} from "@interfaces/UserInterface.ts";
import $ from "../action_types";

export function silentAuth(device_id: string, lang: string) {
    return {
        type: $.SILENT_AUTH,
        payload: {device_id, lang},
    };
}

export function register(
    device_id: string,
    email: string,
    name: string,
    password: string,
) {
    return {
        type: $.REGISTER,
        payload: {device_id, email, name, password},
    };
}

export function login(email: string, name: string, password: string) {
    return {
        type: $.LOGIN,
        payload: {email, name, password},
    };
}

export function getUser(navigateToHome = false) {
    return {
        type: $.GET_USER,
        payload: {navigateToHome},
    };
}

export function setUser(user: User) {
    return {
        type: $.SET_USER,
        payload: {user},
    };
}

export function resetStates() {
    return {
        type: $.RESET_STATES,
    };
}

export function getUserBonuses() {
    return {
        type: $.GET_USER_BONUSES,
    };
}

export function setUserBonuses(bonuses: any) {
    return {
        type: $.SET_USER_BONUSES,
        payload: {bonuses},
    };
}

export function setUserLoading(loading: boolean) {
    return {
        type: $.SET_USER_LOADED,
        payload: loading,
    };
}

export function setBlockedUsers(blockedUsers: string[]) {
    return {
        type: $.SET_BLOCKED_USERS,
        payload: blockedUsers,
    };
}

export function saveUserMarketingInfo() {
    return {
        type: $.SAVE_USER_MARKETING_INFO,
    };
}

export function getBotRestriction() {
    return {
        type: $.GET_BOT_RESTRICTION,
    };
}

export function setBotRestriction(restricted: boolean) {
    return {
        type: $.SET_BOT_RESTRICTION,
        payload: restricted,
    };
}

export function getUserSettings() {
    return {
        type: $.GET_USER_SETTINGS,
    };
}

export function setUserSettings(settings: UserSettings) {
    return {
        type: $.SET_USER_SETTINGS,
        payload: settings,
    };
}

export function setJobCaptchaActive(active: boolean) {
    return {
        type: $.SET_JOB_CAPTCHA_ACTIVE,
        payload: active,
    };
}

export function setPartyJobCaptchaActive(active: boolean) {
    return {
        type: $.SET_PARTY_JOB_CAPTCHA_ACTIVE,
        payload: active,
    };
}

export function setFavoriteItems(items: {id: number; type: ItemType}[]) {
    return {
        type: $.SET_FAVORITE_ITEMS,
        payload: items,
    };
}
