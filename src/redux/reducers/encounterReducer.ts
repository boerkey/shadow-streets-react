import $ from "../action_types";
import {ActionType} from "@redux/actions";
import {UserEncounter} from "@interfaces/UserInterface.ts";

const initialState: {
    encounters: UserEncounter[];
    cooldownSecondsUntilNextAttack: number;
    loading: boolean;
} = {
    encounters: [],
    cooldownSecondsUntilNextAttack: 0,
    loading: false,
};

const encounterReducer = (state = initialState, action: ActionType) => {
    const {type, payload} = action;

    switch (type) {
        case $.GET_ENCOUNTERS: {
            return {
                ...state,
                loading: true,
            };
        }
        case $.SET_ENCOUNTERS: {
            return {
                ...state,
                encounters: payload.encounters,
                cooldownSecondsUntilNextAttack:
                    payload.cooldownSecondsUntilNextAttack,
                loading: false,
            };
        }
        default:
            return state;
    }
};

export default encounterReducer;
