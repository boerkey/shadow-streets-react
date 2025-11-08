import $ from "../action_types";

export function useItem(userItemId: number, itemType: number, amount: number) {
    return {
        type: $.USE_ITEM,
        payload: {userItemId, itemType, amount},
    };
}
