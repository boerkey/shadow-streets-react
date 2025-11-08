import {axiosModule} from "@utils/index.ts";

export function getJobs() {
    return axiosModule.get("character/get_jobs");
}

export function doJob(jobId: number) {
    return axiosModule.post(`character/do_job`, {
        job_id: jobId,
    });
}

export function chooseClass(classId: number) {
    return axiosModule.post(`character/choose_class`, {
        class: classId,
    });
}

export function changeClass(classId: number) {
    return axiosModule.post(`character/change_class`, {
        class: classId,
    });
}

export function doPartyJob(jobId: number, userIds: number[]) {
    return axiosModule.post(`character/do_party_job`, {
        job_id: jobId,
        user_ids: userIds,
    });
}

export function getUserBonuses() {
    return axiosModule.get("character/get_user_bonuses");
}

export function startMission(mission_id: number) {
    return axiosModule.post(`character/start_mission`, {
        mission_id,
    });
}

export function getMyMissions() {
    return axiosModule.get(`character/get_my_missions`);
}

export function getMyParty() {
    return axiosModule.get(`character/get_my_party`);
}

export function getPartiesByJob(job_id: number) {
    return axiosModule.get(`character/get_parties_by_job_id/${job_id}`);
}

export function createParty(job_id: number) {
    return axiosModule.post(`character/create_party`, {
        job_id,
    });
}

export function joinParty(party_id: number) {
    return axiosModule.post(`character/join_party/${party_id}`);
}

export function leaveParty() {
    return axiosModule.post(`character/leave_party`);
}

export function getPartyDetails(partyId: number) {
    return axiosModule.get(`character/party/${partyId}`);
}

export function kickFromParty(user_id: number) {
    return axiosModule.post(`character/kick_from_party`, {
        user_id,
    });
}
