import $ from "../action_types";
import {UserEncounter} from "@interfaces/UserInterface.ts";

export function getEncounters() {
    return {
        type: $.GET_ENCOUNTERS,
    };
}

export function setEncounters(
    encounters: UserEncounter[],
    cooldownSecondsUntilNextAttack: number,
) {
    return {
        type: $.SET_ENCOUNTERS,
        payload: {encounters, cooldownSecondsUntilNextAttack},
    };
}
