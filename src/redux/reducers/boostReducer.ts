import {UserBoost} from "@interfaces/UserInterface"; // Assuming UserBoost interface path
import actionTypes from "../action_types";

interface BoostState {
    myBoosts: UserBoost[];
    loading: boolean;
    error: any;
    dailyPacks: any[];
    soundPacks: any[];
    userPacks: any[];
}

const initialState: BoostState = {
    myBoosts: [],
    loading: false,
    error: null,
    dailyPacks: [],
    soundPacks: [],
    userPacks: [],
};

const boostReducer = (state = initialState, action: any): BoostState => {
    switch (action.type) {
        case actionTypes.GET_MY_BOOSTS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case actionTypes.GET_MY_BOOSTS_SUCCESS:
            return {
                ...state,
                loading: false,
                myBoosts: action.payload,
            };
        case actionTypes.GET_MY_BOOSTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case actionTypes.SET_PACKS:
            return {
                ...state,
                dailyPacks: action.payload.dailyPacks,
                soundPacks: action.payload.soundPacks,
                userPacks: action.payload.userPacks,
            };
        default:
            return state;
    }
};

export default boostReducer;
