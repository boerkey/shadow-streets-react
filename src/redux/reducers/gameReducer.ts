import {
    ArmorItem,
    ConsumableItem,
    GameConfig,
    GameMission,
    GamePropertyUpgrade,
    GameStreet,
    GoodsItem,
    HelmetItem,
    MaterialItem,
    WeaponItem,
} from "@interfaces/GameInterface.ts";
import {GangUpgradeData} from "@interfaces/GangInterface.ts";
import {ActionType} from "@redux/actions";
import $ from "../action_types";

const initialState: {
    gameConfig: GameConfig;
    gameStreets: GameStreet[];
    gameItems: {
        consumables: ConsumableItem[];
        goods: GoodsItem[];
        weapons: WeaponItem[];
        armors: ArmorItem[];
        materials: MaterialItem[];
        helmets: HelmetItem[];
    };
    gameProperties: any;
    gamePropertyUpgrades: GamePropertyUpgrade[];
    gameGangUpgrades: GangUpgradeData[];
    gameMissions: GameMission[];
} = {
    gameConfig: {
        default_health: 100,
        default_energy: 100,
        energy_per_level: 5,
        health_per_level: 5,
        energy_per_minute: 2,
        health_per_minute: 0.2,
        countdown_seconds_to_next_job: 3,
        countdown_seconds_to_next_party_job: 10,
        property_name_change_cost: 1000,
        gang_creation_cost: 1000,
        gang_max_member_amount: 5,
        one_shadow_coin_to_money_ratio: 1000,
        change_property_location_cost: 200,
    },
    gameItems: {
        consumables: [],
        goods: [],
        weapons: [],
        armors: [],
        materials: [],
        helmets: [],
    },
    gameProperties: [],
    gamePropertyUpgrades: [],
    gameStreets: [],
    gameGangUpgrades: [],
    gameMissions: [],
};

const gameReducer = (state = initialState, action: ActionType) => {
    const {type, payload} = action;

    switch (type) {
        case $.SET_GAME_CONFIG: {
            return {
                ...state,
                gameConfig: payload.data,
            };
        }
        case $.SET_GAME_STREETS: {
            return {
                ...state,
                gameStreets: payload.streets,
            };
        }
        case $.SET_GAME_ITEMS: {
            return {
                ...state,
                gameItems: payload.items,
            };
        }
        case $.SET_GAME_PROPERTY_UPGRADES: {
            return {
                ...state,
                gameProperties: payload.properties,
                gamePropertyUpgrades: payload.upgrades,
            };
        }
        case $.SET_GAME_GANG_UPGRADES: {
            return {
                ...state,
                gameGangUpgrades: payload.upgrades,
            };
        }
        case $.SET_GAME_MISSIONS: {
            return {
                ...state,
                gameMissions: payload.missions,
            };
        }
        default:
            return state;
    }
};

export default gameReducer;
