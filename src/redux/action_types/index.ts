import * as authActionTypes from "./authActionTypes.ts";
import * as boostActionTypes from "./boostActionTypes";
import * as characterActionTypes from "./characterActionTypes";
import * as chatActionTypes from "./chatActionTypes";
import * as encounterActionTypes from "./encounterActionTypes";
import * as groupFightActionTypes from "./groupFightActionTypes";
import * as gameActionTypes from "./gameActionTypes";
import * as itemActionTypes from "./itemActionTypes";
import * as propertyActionTypes from "./propertyActionTypes";
import * as timerActionTypes from "./timerActionTypes.ts";

const $ = {
    ...authActionTypes,
    ...characterActionTypes,
    ...gameActionTypes,
    ...timerActionTypes,
    ...itemActionTypes,
    ...propertyActionTypes,
    ...encounterActionTypes,
    ...boostActionTypes,
    ...chatActionTypes,
    ...groupFightActionTypes,
};

export default $;
