import {ItemType} from "@interfaces/GameInterface";
import {User, UserBonuses, UserSettings} from "@interfaces/UserInterface.ts";
import {ActionType} from "@redux/actions";
import $ from "../action_types";

const initialState: {
    user: User;
    userBonuses: UserBonuses;
    userLoading: boolean;
    blockedUsers: string[];
    botRestriction: boolean;
    userSettings: UserSettings;
    jobCaptchaActive: boolean;
    partyJobCaptchaActive: boolean;
    favoriteItems: {id: number; type: ItemType}[];
} = {
    user: {} as User, // Ensure initial user object matches expected type
    userLoading: false,
    userBonuses: {} as UserBonuses,
    blockedUsers: [],
    botRestriction: false,
    userSettings: {} as UserSettings,
    jobCaptchaActive: false,
    partyJobCaptchaActive: false,
    favoriteItems: [],
};

const authReducer = (state = initialState, action: ActionType) => {
    const {type, payload} = action;

    switch (type) {
        case $.SET_USER_LOADED: {
            return {
                ...state,
                userLoading: payload,
            };
        }
        case $.SET_USER: {
            return {
                ...state,
                user: {
                    ...state.user, // Preserve existing state
                    ...payload.user, // Merge new user data

                    // Only update items if they are not null
                    items_armors:
                        payload.user.items_armors !== null
                            ? payload.user.items_armors
                            : state.user.items_armors,
                    items_weapons:
                        payload.user.items_weapons !== null
                            ? payload.user.items_weapons
                            : state.user.items_weapons,
                    items_goods:
                        payload.user.items_goods !== null
                            ? payload.user.items_goods
                            : state.user.items_goods,
                    items_consumables:
                        payload.user.items_consumables !== null
                            ? payload.user.items_consumables
                            : state.user.items_consumables,
                    items_materials:
                        payload.user.items_materials !== null
                            ? payload.user.items_materials
                            : state.user.items_materials,
                    items_helmets:
                        payload.user.items_helmets !== null
                            ? payload.user.items_helmets
                            : state.user.items_helmets,
                },
            };
        }
        case $.SET_USER_BONUSES: {
            return {
                ...state,
                user: {
                    ...state.user,
                    bonuses: action.payload.bonuses,
                },
                userBonuses: action.payload.bonuses,
            };
        }
        case $.SET_BLOCKED_USERS: {
            return {
                ...state,
                blockedUsers: payload,
            };
        }
        case $.SET_BOT_RESTRICTION: {
            return {
                ...state,
                botRestriction: payload,
            };
        }
        case $.SET_USER_SETTINGS: {
            return {
                ...state,
                userSettings: payload,
            };
        }
        case $.SET_JOB_CAPTCHA_ACTIVE: {
            return {
                ...state,
                jobCaptchaActive: payload,
            };
        }
        case $.SET_PARTY_JOB_CAPTCHA_ACTIVE: {
            return {
                ...state,
                partyJobCaptchaActive: payload,
            };
        }
        case $.SET_FAVORITE_ITEMS: {
            return {
                ...state,
                favoriteItems: payload,
            };
        }
        default:
            return state;
    }
};

export default authReducer;
