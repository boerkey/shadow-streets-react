import $ from "../action_types";
import {ActionType} from "@redux/actions";
import {PropertyProductionItem} from "@interfaces/PropertyInterface.ts";

const initialState: {
    itemProductionLoading: boolean;
    itemProductionList: PropertyProductionItem[];
    maxProductionLimit: number;
    eachProductionCycleAsSeconds: number;
} = {
    itemProductionLoading: false,
    itemProductionList: [],
    maxProductionLimit: 20,
    eachProductionCycleAsSeconds: 300,
};

const propertyReducer = (state = initialState, action: ActionType) => {
    const {type, payload} = action;

    switch (type) {
        case $.ADD_ITEM_TO_PRODUCTION:
        case $.TAKE_PRODUCED_ITEM_FROM_PROPERTY:
        case $.GET_PROPERTY_ITEM_PRODUCTION_LIST: {
            return {
                ...state,
                itemProductionLoading: true,
            };
        }
        case $.SET_PROPERTY_ITEM_PRODUCTION_LIST: {
            return {
                ...state,
                itemProductionList: payload.productionList,
                maxProductionLimit: payload.maxProductionLimit,
                eachProductionCycleAsSeconds:
                    payload.eachProductionCycleAsSeconds,
                itemProductionLoading: false,
            };
        }
        default:
            return state;
    }
};

export default propertyReducer;
