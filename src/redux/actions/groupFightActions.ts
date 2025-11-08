import actionTypes from "../action_types";  

export const getGroupFights = () => ({
    type: actionTypes.GET_GROUP_FIGHTS,
});

export const setGroupFights = (groupFights: any) => ({
    type: actionTypes.SET_GROUP_FIGHTS,
    payload: groupFights,
});

export const getGroupFightDetails = (groupFightId: number) => ({
    type: actionTypes.GET_GROUP_FIGHT_DETAILS,
    payload: groupFightId,
});

export const setGroupFightDetails = (groupFightDetails: any) => ({
    type: actionTypes.SET_GROUP_FIGHT_DETAILS,
    payload: groupFightDetails,
});

export const joinGroupFight = (groupFightId: number, sideId: number) => ({  
    type: actionTypes.JOIN_GROUP_FIGHT,
    payload: {groupFightId, sideId},
});

export const leaveGroupFight = (groupFightId: number) => ({
    type: actionTypes.LEAVE_GROUP_FIGHT,
    payload: groupFightId,
});

export const getActiveFightsInCurrentDistrict = () => ({    
    type: actionTypes.GET_ACTIVE_FIGHTS_IN_CURRENT_DISTRICT,
});

export const setActiveFightsInCurrentDistrict = (activeFights: any) => ({
    type: actionTypes.SET_ACTIVE_FIGHTS_IN_CURRENT_DISTRICT,
    payload: activeFights,
});