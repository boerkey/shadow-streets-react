import {axiosModule} from "@utils/index.ts";

export function getGameConfig() {
    return axiosModule.get("get_game_config");
}

export function getGameStreets() {
    return axiosModule.get("get_game_streets");
}

export function getGameItemList() {
    return axiosModule.get("get_game_item_list");
}

export function getGamePropertyUpgrades() {
    return axiosModule.get("get_game_property_upgrades");
}

export function getGameGangUpgrades() {
    return axiosModule.get("get_game_gang_upgrades");
}

export function getGameMissions() {
    return axiosModule.get("get_game_missions");
}

export function getGameAnnouncements() {
    return axiosModule.get("get_game_announcements");
}

export function readGameAnnouncement(announcement_id: number) {
    return axiosModule.post(`read_game_announcement`, {
        announcement_id,
    });
}

export function voteGameAnnouncement(announcement_id: number, vote: number) {
    return axiosModule.post(`vote_game_announcement`, {
        announcement_id,
        vote,
    });
}
