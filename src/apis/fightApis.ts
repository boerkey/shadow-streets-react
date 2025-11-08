import {axiosModule} from "@utils/index.ts";

export function attack(target_user_id: number) {
    return axiosModule.post("/fights/attack", {target_user_id});
}

export function getFightList(limit?: number) {
    return axiosModule.get("/fights/get_fight_list", {
        params: {
            limit: limit,
        },
    });
}

export function getFightDetails(fight_id: number) {
    return axiosModule.post("/fights/get_fight_details", {
        fight_id,
    });
}
