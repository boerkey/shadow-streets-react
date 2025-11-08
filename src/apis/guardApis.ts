import {axiosModule} from "@utils/index.ts";

export function getGuards() {
    return axiosModule.get("guard/get_guards");
}

export function buyGuard(guard_id: number) {
    return axiosModule.post("guard/buy_guard", {
        guard_id,
    });
}

export function upgradeGuard(guard_id: number, upgrade_id: number) {
    return axiosModule.post("guard/upgrade_guard", {
        guard_id,
        upgrade_id,
    });
}

export function updateGuardTask(
    guard_id: number,
    task_id: number,
    task_value: number,
) {
    return axiosModule.post("guard/update_guard_task", {
        guard_id,
        task_id,
        task_value,
    });
}

export function updateGuardName(guard_id: number, name: string) {
    return axiosModule.post("guard/update_guard_name", {
        guard_id,
        name,
    });
}

export function updateGuardImage(guard_id: number, img_url: string) {
    return axiosModule.post("guard/update_guard_image", {
        guard_id,
        img_url,
    });
}

export function switchAutoEat(guard_id: number) {
    return axiosModule.post("guard/switch_auto_eat", {
        guard_id,
    });
}

export function resetStatistics(guard_id: number) {
    return axiosModule.post("guard/reset_statistics", {
        guard_id,
    });
}
