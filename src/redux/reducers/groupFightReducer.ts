import {GroupFight, GroupFightDetails} from "@interfaces/GroupFight.ts";
import {ActionType} from "@redux/actions";
import $ from "../action_types";

const initialState: {
    groupFights: GroupFight[];
    activeFightsInCurrentDistrict: GroupFight[];
    groupFightDetails: GroupFightDetails | null;
    groupFightDetailsLoading: boolean;
    loading: boolean;
} = {
    groupFights: [],
    activeFightsInCurrentDistrict: [],
    groupFightDetails: null,
    groupFightDetailsLoading: false,
    loading: false,
};

const groupFightReducer = (state = initialState, action: ActionType) => {
    const {type, payload} = action;

    switch (type) {
        case $.SET_GROUP_FIGHTS: {
            return {
                ...state,
                groupFights: payload,
                loading: false,
            };
        }
        case $.GET_GROUP_FIGHT_DETAILS: {
            return {
                ...state,
                groupFightDetailsLoading: true,
            };
        }
        case $.SET_GROUP_FIGHT_DETAILS: {
            return {
                ...state,
                groupFightDetails: payload,
                groupFightDetailsLoading: false,
            };
        }
        case $.SET_ACTIVE_FIGHTS_IN_CURRENT_DISTRICT: {
            return {
                ...state,
                activeFightsInCurrentDistrict: payload,
                loading: false,
            };
        }
        default:
            return state;
    }
};

export default groupFightReducer;
