import {axiosModule} from "@utils/index.ts";

export function getUserQuests() {
    return axiosModule.get("/quest/get_user_quests");
}

export function claimQuestRewards(quest_id: number, quest_type: number) {
    return axiosModule.post("/quest/claim_quest_rewards", {
        quest_id,
        quest_type,
    });
}
