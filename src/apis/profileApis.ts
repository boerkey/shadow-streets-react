import {axiosModule} from "@utils/index.ts";

export function getUserProfile(user_id: number = 0) {
    return axiosModule.get("profile/get_user_profile", {
        params: {
            user_id,
        },
    });
}

export function getUserRankings(userId: string, orderBy: string) {
    return axiosModule.get("profile/get_user_rankings", {
        params: {
            userId,
            orderBy,
        },
    });
}
