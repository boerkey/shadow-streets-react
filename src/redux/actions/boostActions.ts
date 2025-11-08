import actionTypes from "../action_types";

export const getMyBoostsRequest = () => ({
    type: actionTypes.GET_MY_BOOSTS_REQUEST,
});

export const getMyBoostsSuccess = (boosts: any[]) => ({
    type: actionTypes.GET_MY_BOOSTS_SUCCESS,
    payload: boosts,
});

export const getMyBoostsFailure = (error: any) => ({
    type: actionTypes.GET_MY_BOOSTS_FAILURE,
    payload: error,
});

export const getPacks = () => ({
    type: actionTypes.GET_PACKS,
});

export const setPacks = (
    dailyPacks: any[],
    soundPacks: any[],
    userPacks: any[],
) => ({
    type: actionTypes.SET_PACKS,
    payload: {dailyPacks, soundPacks, userPacks},
});
