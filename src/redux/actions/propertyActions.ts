import $ from "../action_types";
import {ItemType} from "@interfaces/GameInterface.ts";
import {REMOVE_ITEM_FROM_PRODUCTION} from "@redux/action_types/propertyActionTypes.ts";

export function addItemToProduction(
    property_id: number,
    item_id: number,
    item_type: ItemType,
) {
    return {
        type: $.ADD_ITEM_TO_PRODUCTION,
        payload: {
            property_id,
            item_id,
            item_type,
        },
    };
}

export function getPropertyItemProductionList(
    propertyId: number,
    isInitial = false,
) {
    return {
        type: $.GET_PROPERTY_ITEM_PRODUCTION_LIST,
        payload: {propertyId, isInitial},
    };
}

export function setPropertyProductionList(
    productionList: any,
    maxProductionLimit: number,
    eachProductionCycleAsSeconds: number,
) {
    return {
        type: $.SET_PROPERTY_ITEM_PRODUCTION_LIST,
        payload: {
            productionList,
            maxProductionLimit,
            eachProductionCycleAsSeconds,
        },
    };
}

export function stopItemProductionInProperty(
    property_id: number,
    item_id: number,
    item_type: ItemType,
) {
    return {
        type: $.STOP_ITEM_PRODUCTION_IN_PROPERTY,
        payload: {
            property_id,
            item_id,
            item_type,
        },
    };
}

export function takeProducedItemFromProperty(
    property_id: number,
    item_id: number,
    item_type: ItemType,
) {
    return {
        type: $.TAKE_PRODUCED_ITEM_FROM_PROPERTY,
        payload: {
            property_id,
            item_id,
            item_type,
        },
    };
}

export function takeAllProducedItemsFromProperty(property_id: number) {
    return {
        type: $.TAKE_ALL_PRODUCED_ITEMS_FROM_PROPERTY,
        payload: {property_id},
    };
}

export function removeItemFromProduction(
    property_id: number,
    item_id: number,
    item_type: ItemType,
) {
    return {
        type: $.REMOVE_ITEM_FROM_PRODUCTION,
        payload: {
            property_id,
            item_id,
            item_type,
        },
    };
}
