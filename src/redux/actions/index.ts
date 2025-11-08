import * as authActions from "./authActions";
import * as characterActions from "./characterActions";
import * as chatActions from "./chatActions";
import * as encounterActions from "./encounterActions";
import * as gameActions from "./gameActions";
import * as itemActions from "./itemActions";
import * as propertyActions from "./propertyActions";
import * as timerActions from "./timerActions";
import * as boostActions from "./boostActions";
import * as groupFightActions from "./groupFightActions";

export interface ActionType {
    type: string;
    payload?: any;
}

export {
    authActions,
    characterActions,
    chatActions,
    encounterActions,
    gameActions,
    itemActions,
    propertyActions,
    timerActions,
    boostActions,
    groupFightActions,
};
