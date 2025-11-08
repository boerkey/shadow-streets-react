import {axiosModule} from "@utils/index.ts";

// No middleware applied here
export function silentAuth(device_id: string, lang: string) {
    return axiosModule.post("silent_auth", {
        device_id,
        lang,
    });
}

export function register(
    username: string,
    password: string,
    email: string,
    device_id: string,
    google_login_token = "",
) {
    return axiosModule.post("register", {
        device_id,
        username,
        password,
        email,
        google_login_token,
    });
}

export function login(
    email_or_username: string,
    password: string,
    google_login_token: string,
) {
    return axiosModule.post("login", {
        email_or_username,
        password,
        google_login_token,
    });
}

export function getUser() {
    return axiosModule.get("auth/get_user");
}

export function updateUserPicture(img_url: string) {
    return axiosModule.post("auth/update_picture", {
        img_url,
    });
}

export function updateUserInformation(username: string, email: string) {
    return axiosModule.post("auth/update_information", {
        username,
        email,
    });
}

export function updatePassword(old_password: string, new_password: string) {
    return axiosModule.post("auth/change_password", {
        old_password,
        new_password,
    });
}

export function savePushNotificationID(push_notification_id: string) {
    return axiosModule.post("auth/save_push_notification_id", {
        push_notification_id,
    });
}

export function resetPassword(email: string) {
    return axiosModule.post("auth/reset_password", {
        email,
    });
}

export function getUserBans() {
    return axiosModule.get("auth/get_user_bans");
}

export function deleteMyAccount() {
    return axiosModule.post("auth/delete_my_account");
}

export interface UserMarketingInfo {
    user_id: number;
    os: string;
}

export function saveUserMarketingInfo(data: UserMarketingInfo) {
    return axiosModule.post("auth/save_user_marketing_info", data);
}

export function getBotRestriction() {
    return axiosModule.get("auth/get_bot_restriction");
}
