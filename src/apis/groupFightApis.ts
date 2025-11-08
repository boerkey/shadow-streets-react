import {axiosModule} from "@utils/index.ts";

const API_PATH = "/group_fight";

export function getGroupFights() {
    return axiosModule.get(`${API_PATH}/get_group_fights`);
}

export function getGroupFightDetails(group_fight_id: number) {
    return axiosModule.post(`${API_PATH}/get_group_fight_details`, {
        group_fight_id,
    });
}

export function joinGroupFight(group_fight_id: number, side_id: number) {
    return axiosModule.post(`${API_PATH}/join_group_fight`, {
        group_fight_id,
        side_id,
    });
}

export function getActiveGroupFightsInCurrentDistrict() {
    return axiosModule.get(`${API_PATH}/get_active_group_fights_in_current_district`);
}