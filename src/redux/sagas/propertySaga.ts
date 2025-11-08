import {propertyApis} from "@apis/index.ts";
import {ActionType, propertyActions} from "@redux/actions";
import {showToast} from "@utils/helperFunctions.ts";
import {call, delay, put, takeLatest} from "redux-saga/effects";
import $ from "../action_types";

function* addItemToProduction(action: ActionType) {
    try {
        const {property_id, item_id, item_type} = action.payload;
        const {data} = yield call(
            propertyApis.addItemToProduction,
            property_id,
            item_id,
            item_type,
        );
        showToast(data.message);
        yield put(propertyActions.getPropertyItemProductionList(property_id));
    } catch (error) {}
}

function* getPropertyItemProductionList(action: ActionType) {
    try {
        const {propertyId, isInitial} = action.payload;
        if (!isInitial) {
            yield delay(1000);
        }
        const {data} = yield call(
            propertyApis.getPropertyItemProductionList,
            propertyId,
        );
        yield put(
            propertyActions.setPropertyProductionList(
                data.productions,
                data.max_production_limit,
                data.each_production_cycle_as_seconds,
            ),
        );
    } catch (error) {}
}

function* takeProducedItemFromProperty(action: ActionType) {
    try {
        const {property_id, item_id, item_type} = action.payload;
        const {data} = yield call(
            propertyApis.takeProducedItem,
            property_id,
            item_id,
            item_type,
        );
        showToast(data.message);
        yield put(propertyActions.getPropertyItemProductionList(property_id));
    } catch (error) {}
}

function* stopItemProductionInProperty(action: ActionType) {
    try {
        const {property_id, item_id, item_type} = action.payload;
        const {data} = yield call(
            propertyApis.stopItemProduction,
            property_id,
            item_id,
            item_type,
        );
        showToast(data.message);
        yield put(propertyActions.getPropertyItemProductionList(property_id));
    } catch (error) {}
}

function* removeItemFromProduction(action: ActionType) {
    try {
        const {property_id, item_id, item_type} = action.payload;
        const {data} = yield call(
            propertyApis.removeItemFromProduction,
            property_id,
            item_id,
            item_type,
        );
        showToast(data.message);
        yield put(propertyActions.getPropertyItemProductionList(property_id));
    } catch (error) {}
}

function* takeAllProducedItemsFromProperty(action: ActionType) {
    try {
        const {property_id} = action.payload;
        const {data} = yield call(
            propertyApis.takeAllProducedItems,
            property_id,
        );
        showToast(data.message);
        yield put(propertyActions.getPropertyItemProductionList(property_id));
    } catch (error) {}
}

const propertySaga = [
    takeLatest($.ADD_ITEM_TO_PRODUCTION, addItemToProduction),
    takeLatest(
        $.GET_PROPERTY_ITEM_PRODUCTION_LIST,
        getPropertyItemProductionList,
    ),
    takeLatest(
        $.TAKE_PRODUCED_ITEM_FROM_PROPERTY,
        takeProducedItemFromProperty,
    ),
    takeLatest(
        $.STOP_ITEM_PRODUCTION_IN_PROPERTY,
        stopItemProductionInProperty,
    ),
    takeLatest($.REMOVE_ITEM_FROM_PRODUCTION, removeItemFromProduction),
    takeLatest(
        $.TAKE_ALL_PRODUCED_ITEMS_FROM_PROPERTY,
        takeAllProducedItemsFromProperty,
    ),
];

export default propertySaga;
