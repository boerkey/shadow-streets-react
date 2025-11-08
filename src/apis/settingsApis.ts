import {axiosModule} from "@utils/index.ts";

export function getSettings() {
    return axiosModule.get("settings/get_settings");
}

export function updateUserLang(lang: string) {
    return axiosModule.post("settings/update_user_lang", {lang});
}

export function updateAutoEat(auto_eat: number) {
    return axiosModule.post("settings/update_auto_eat", {auto_eat});
}

export function updateAutoHeal(auto_heal: number) {
    return axiosModule.post("settings/update_auto_heal", {auto_heal});
}

export function updateAutoJob(auto_job_id: number) {
    return axiosModule.post("settings/update_auto_job", {auto_job_id});
}

export function updateAutoJobAmount(auto_job_amount: number) {
    return axiosModule.post("settings/update_auto_job_amount", {
        auto_job_amount,
    });
}

export function updateAutoPartyJob(auto_party_job_id: number) {
    return axiosModule.post("settings/update_auto_party_job", {
        auto_party_job_id,
    });
}

export function updateUserCountry(country: string) {
    return axiosModule.post("settings/update_user_country", {
        country,
    });
}