import {axiosModule} from "@utils/index.ts";

export function getMyGang() {
    return axiosModule.get("gang/get_my_gang");
}

export function getGangDetails(gangId: number) {
    return axiosModule.get(`gang/get_gang_details/${gangId}`);
}

export function createGang(name: string) {
    return axiosModule.post("gang/create_gang", {name});
}

export function joinGang(gangId: number) {
    return axiosModule.post("gang/join_gang", {gang_id: gangId});
}

export function respondGangApplication(
    application_id: number,
    decision: 0 | 1,
) {
    return axiosModule.post("gang/respond_gang_application", {
        application_id,
        decision,
    });
}

export function leaveGang() {
    return axiosModule.post("gang/leave_gang");
}

export function kickMemberFromGang(user_id: number) {
    return axiosModule.post("gang/kick_member_from_gang", {user_id});
}

export function upgradeGang(gang_upgrade_id: number) {
    return axiosModule.post("gang/upgrade_gang", {gang_upgrade_id});
}

export function changeGangImage(img_url: string) {
    return axiosModule.post("gang/change_gang_image", {img_url});
}

export function donateMoneyToGang(amount: number) {
    return axiosModule.post("gang/donate_money_to_gang", {amount});
}

export function changeGangLeader(new_leader_id: number) {
    return axiosModule.post("gang/change_gang_leader", {new_leader_id});
}
