import $ from "../action_types";

export function startTimer(duration: number) {
    return {type: $.START_TIMER, payload: {duration}};
}
export function decrementTimer() {
    return {type: $.DECREMENT_TIMER};
}

export function resetTimer() {
    return {type: $.RESET_TIMER};
}
