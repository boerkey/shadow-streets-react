import {combineReducers} from "redux";

import authReducer from "./authReducer";
import boostReducer from "./boostReducer.ts";
import characterReducer from "./characterReducer";
import chatReducer from "./chatReducer";
import encounterReducer from "./encounterReducer.ts";
import gameReducer from "./gameReducer";
import groupFightReducer from "./groupFightReducer";
import propertyReducer from "./propertyReducer.ts";

import $ from "../action_types";

const appReducer = combineReducers({
    auth: authReducer,
    character: characterReducer,
    game: gameReducer,
    property: propertyReducer,
    encounters: encounterReducer,
    boosts: boostReducer,
    chat: chatReducer,
    groupFight: groupFightReducer,
});

const rootReducer = (state: any, action: any) => {
    if (action.type === $.RESET_STATES) {
        state = undefined;
    }
    return appReducer(state, action);
};

export default rootReducer;
