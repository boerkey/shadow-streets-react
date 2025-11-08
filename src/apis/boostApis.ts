import {axiosModule} from "@utils/index.ts";

export function getBoostList() {
    return axiosModule.get("boost/get_boost_list");
}

export function activateBoost(boost_id: number) {
    return axiosModule.post("boost/activate_boost", {boost_id});
}

export function getMyBoosts() {
    return axiosModule.get("boost/get_my_boosts");
}

export function getAdId() {
    return axiosModule.get("boost/get_ad_ids");
}

export function gainShadowCoinsWithAd() {
    return axiosModule.post("boost/gain_shadow_coins_with_ad");
}

export function getPacks() {
    return axiosModule.get("boost/get_packs");
}

export function buyPack(pack_id: number, pack_type: PackType) {
    return axiosModule.post("boost/buy_pack", {pack_id, pack_type});
}
