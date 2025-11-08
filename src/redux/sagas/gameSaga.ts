import {call, put, takeLatest} from "redux-saga/effects";

import {gameActions} from "@redux/actions";
import {gameApis} from "../../apis";
import $ from "../action_types";

function* getGameConfig() {
    try {
        const {data} = yield call(gameApis.getGameConfig);
        yield put(gameActions.setGameConfig(data));
    } catch (e) {}
}

function* getGameStreets() {
    try {
        const {data} = yield call(gameApis.getGameStreets);
        yield put(gameActions.setGameStreets(data));
    } catch (e) {}
}

function* getGameItemList() {
    try {
        const {data} = yield call(gameApis.getGameItemList);
        console.log(data);
        yield put(gameActions.setGameItems(data));
    } catch (e) {}
}

function* getGamePropertyUpgrades() {
    try {
        const {data} = yield call(gameApis.getGamePropertyUpgrades);
        const {upgrades, properties} = data;
        yield put(gameActions.setGamePropertyUpgrades(properties, upgrades));
    } catch (e) {}
}

function* getGameGangUpgrades() {
    try {
        const {data} = yield call(gameApis.getGameGangUpgrades);
        yield put(gameActions.setGameGangUpgrades(data.gang_upgrades));
    } catch (e) {}
}

function* getGameMissions() {
    try {
        const {data} = yield call(gameApis.getGameMissions);
        yield put(gameActions.setGameMissions(data.missions));
    } catch (e) {}
}

const gameSaga = [
    takeLatest($.GET_GAME_CONFIG, getGameConfig),
    takeLatest($.GET_GAME_STREETS, getGameStreets),
    takeLatest($.GET_GAME_ITEMS, getGameItemList),
    takeLatest($.GET_GAME_PROPERTY_UPGRADES, getGamePropertyUpgrades),
    takeLatest($.GET_GAME_GANG_UPGRADES, getGameGangUpgrades),
    takeLatest($.GET_GAME_MISSIONS, getGameMissions),
];

export default gameSaga;
