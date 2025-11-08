import {axiosModule} from "@utils/index.ts";

export function changeDistrict(location_x: number, location_y: number) {
    return axiosModule.post("/district/change_district", {
        location_x,
        location_y,
    });
}

export function getDistrictFightPhase() {
    return axiosModule.get("/district/get_district_fight_phase");
}

export function createOrUpdateTargetDistrict(district_id: number) {
    return axiosModule.post("/district/create_or_update_target_district", {
        district_id,
    });
}

export function getGangsByTargetDistrict(district_id: number) {
    return axiosModule.post("/district/get_gangs_by_target_district", {
        district_id,
    });
}
