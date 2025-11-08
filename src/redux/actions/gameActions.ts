import {
    GameConfig,
    GameMission,
    GameStreet,
} from "@interfaces/GameInterface.ts";
import $ from "../action_types";

export function getGameConfig() {
    return {
        type: $.GET_GAME_CONFIG,
    };
}

export function setGameConfig(data: GameConfig) {
    return {
        type: $.SET_GAME_CONFIG,
        payload: {data},
    };
}

export function getGameStreets() {
    return {
        type: $.GET_GAME_STREETS,
    };
}

export function setGameStreets(streets: GameStreet[]) {
    return {
        type: $.SET_GAME_STREETS,
        payload: {streets},
    };
}

export function getGameItems() {
    return {
        type: $.GET_GAME_ITEMS,
    };
}

export function setGameItems(items: any) {
    return {
        type: $.SET_GAME_ITEMS,
        payload: {
            items,
        },
    };
}

export function getGamePropertyUpgrades() {
    return {
        type: $.GET_GAME_PROPERTY_UPGRADES,
    };
}

export function setGamePropertyUpgrades(properties: any, upgrades: any) {
    return {
        type: $.SET_GAME_PROPERTY_UPGRADES,
        payload: {
            properties,
            upgrades,
        },
    };
}

export function getGameGangUpgrades() {
    return {
        type: $.GET_GAME_GANG_UPGRADES,
    };
}

export function setGameGangUpgrades(upgrades: any) {
    return {
        type: $.SET_GAME_GANG_UPGRADES,
        payload: {upgrades},
    };
}

export function getGameMissions() {
    return {
        type: $.GET_GAME_MISSIONS,
    };
}

export function setGameMissions(missions: GameMission[]) {
    return {
        type: $.SET_GAME_MISSIONS,
        payload: {missions},
    };
}
