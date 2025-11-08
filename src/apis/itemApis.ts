import {axiosModule} from "@utils/index.ts";

export function useItem(user_item_id: number, item_type: number, amount: number) {
    return axiosModule.post("item/use_item", {
        user_item_id,
        item_type,
        amount,
    });
}

export function getUpgradeInfo(user_item_id: number, item_type: number) {
    return axiosModule.post("item/get_item_upgrade_info", {
        user_item_id,
        item_type,
    });
}

export function upgradeItem(
    user_item_id: number,
    item_type: number,
    use_safety: boolean,
) {
    return axiosModule.post("item/upgrade_item", {
        user_item_id,
        item_type,
        use_safety,
    });
}

export function deleteItem(user_item_id: number, item_type: number) {
    return axiosModule.post("item/delete_item", {
        user_item_id,
        item_type,
    });
}

export function getRequiredMaterialsToRepairItem(
    user_item_id: number,
    item_id: number,
    item_type: number,
) {
    return axiosModule.post("item/get_required_materials_to_repair_item", {
        user_item_id,
        item_id,
        item_type,
    });
}

export function repairItem(user_item_id: number, item_type: number) {
    return axiosModule.post("item/repair_item", {
        user_item_id,
        item_type,
    });
}

export function getReRollCost(user_item_id: number, item_type: number) {
    return axiosModule.post("item/get_reroll_cost", {
        user_item_id,
        item_type,
    });
}

export function reRollItemProperties(user_item_id: number, item_type: number) {
    return axiosModule.post("item/reroll_item_properties", {
        user_item_id,
        item_type,
    });
}