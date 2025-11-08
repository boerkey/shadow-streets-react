import {axiosModule} from "@utils/index";

export function getCosmeticsList() {
    return axiosModule.get("/cosmetics/get_cosmetics_list");
}

export function buyCosmetic(cosmetic_id: number, type: number) {
    return axiosModule.post(`/cosmetics/buy_cosmetic`, {
        cosmetic_id,
        type,
    });
}

export function activateAvatarFrame(avatar_frame_id: number) {
    return axiosModule.post(`/cosmetics/activate_avatar_frame`, {
        avatar_frame_id,
    });
}
