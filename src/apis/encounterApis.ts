import {axiosModule} from "@utils/index.ts";

export function getEncounters() {
    return axiosModule.get("encounters/get_encounters");
}

export function searchEncounteredUser(encounter_id: number) {
    return axiosModule.post("encounters/search_encountered_user", {
        id: encounter_id,
    });
}

export function investigateEncounteredUser(encounter_id: number) {
    return axiosModule.post("encounters/investigate_encountered_user", {
        id: encounter_id,
    });
}

export function removeOneEncounter(id: number) {
    return axiosModule.post("encounters/remove_one_encounter", {
        id,
    });
}

export function removeAllEncounters() {
    return axiosModule.post("encounters/remove_all_encounters");
}