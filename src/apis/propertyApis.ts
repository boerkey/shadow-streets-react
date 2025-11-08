import {ItemType} from "@interfaces/GameInterface.ts";
import {axiosModule} from "@utils/index.ts";

export function getProperties(location_b: number) {
    return axiosModule.get("property/get_properties", {
        params: {
            location_b,
        },
    });
}

export function getPropertyDetails(property_id: number) {
    return axiosModule.get("property/get_property_details", {
        params: {
            property_id,
        },
    });
}

export function buyItemFromProperty(
    id: number,
    amount = 1,
    target_inventory: number,
) {
    return axiosModule.post("property/buy_item_from_property", {
        id,
        amount,
        target_inventory,
    });
}

export function sellItemToProperty(
    property_id: number,
    item_id: number,
    type: number,
    amount: number,
    inventory_target: number, // 0 public - 1 user specific
) {
    return axiosModule.post("property/sell_item_to_property", {
        property_id,
        item_id,
        type,
        amount,
        inventory_target,
    });
}

export function leaveMessageToProperty(property_id: number, message: string) {
    return axiosModule.post("property/leave_message_to_property", {
        property_id,
        message,
    });
}

export function buyProperty(
    property_id: number,
    location_b: number,
    name: string,
) {
    return axiosModule.post("property/buy_property", {
        property_id,
        location_b,
        name,
    });
}

export function buyPropertyFromUser(property_id: number) {
    return axiosModule.post("property/buy_property_from_user", {
        property_id,
    });
}

export function changePropertyName(property_id: number, new_name: string) {
    return axiosModule.post("property/change_property_name", {
        property_id,
        new_name,
    });
}

export function addItemToPublicInventoryForSale(
    property_id: number,
    user_item_id: number,
    item_id: number,
    type: ItemType,
    amount: number,
    price: number,
    is_buying = false,
) {
    return axiosModule.post("property/add_item_to_public_inventory_for_sale", {
        property_id,
        user_item_id,
        item_id,
        type,
        amount,
        price,
        is_buying,
    });
}

export function removeItemFromPublicInventory(id: number) {
    return axiosModule.post("property/remove_item_from_public_inventory", {
        id,
    });
}

export function putOnSale(property_id: number, price: number) {
    return axiosModule.post("property/put_on_sale", {
        property_id,
        price,
    });
}

export function removeFromSale(property_id: number) {
    return axiosModule.post("property/remove_from_sale", {
        property_id,
    });
}

export function makeUpgrade(property_id: number, upgrade_id: number) {
    return axiosModule.post("property/make_upgrade", {property_id, upgrade_id});
}

export function depositMoneyToProperty(property_id: number, money: number) {
    return axiosModule.post("property/deposit_money_to_property", {
        property_id,
        money,
    });
}

export function withdrawMoneyFromProperty(property_id: number, money: number) {
    return axiosModule.post("property/withdraw_money_from_property", {
        property_id,
        money,
    });
}

export function getPropertyItemProductionList(property_id: number) {
    return axiosModule.get("property/get_property_item_production_list", {
        params: {
            property_id,
        },
    });
}

export function addItemToProduction(
    property_id: number,
    item_id: number,
    item_type: ItemType,
) {
    return axiosModule.post("property/add_item_to_production", {
        property_id,
        item_id,
        item_type,
    });
}

export function stopItemProduction(
    property_id: number,
    item_id: number,
    item_type: ItemType,
) {
    return axiosModule.post("property/stop_item_production", {
        property_id,
        item_id,
        item_type,
    });
}

export function takeProducedItem(
    property_id: number,
    item_id: number,
    item_type: ItemType,
) {
    return axiosModule.post("property/take_produced_item", {
        property_id,
        item_id,
        item_type,
    });
}
export function takeAllProducedItems(property_id: number) {
    return axiosModule.post("property/take_all_produced_items", {
        property_id,
    });
}

export function removeItemFromProduction(
    property_id: number,
    item_id: number,
    item_type: ItemType,
) {
    return axiosModule.post("property/remove_item_from_production", {
        property_id,
        item_id,
        item_type,
    });
}

export function findPropertyToSellItem(item_id: number, item_type: ItemType) {
    return axiosModule.post("property/find_property_to_sell_item", {
        item_id,
        item_type,
    });
}

export function getPriceFromDealer(user_item_id: number, type: ItemType) {
    return axiosModule.post("property/get_price_from_dealer", {
        user_item_id,
        type,
    });
}

export function sellItemToDealer(
    items: {user_item_id: number; type: ItemType}[],
) {
    return axiosModule.post("property/sell_item_to_dealer", {
        items,
    });
}

export function disassembleItems(
    items: {user_item_id: number; type: ItemType}[],
) {
    return axiosModule.post("property/disassemble_items", {
        items,
    });
}

export function craft(
    property_id: number,
    item_id: number,
    item_type: ItemType,
    amount: number,
) {
    return axiosModule.post("property/craft", {
        property_id,
        item_id,
        item_type,
        amount,
    });
}

export function setUsageFee(property_id: number, usage_fee: number) {
    return axiosModule.post("property/set_usage_fee", {
        property_id,
        usage_fee,
    });
}

export function deleteProperty(property_id: number) {
    return axiosModule.post("property/delete_property", {
        property_id,
    });
}

export function changePropertyLocation(
    property_id: number,
    street_id: number,
    building_id: number,
) {
    return axiosModule.post("property/change_property_location", {
        property_id,
        street_id,
        building_id,
    });
}

export function putItemOnAuction(
    property_id: number,
    user_item_id: number,
    item_type: ItemType,
    auction_entrance_price: number,
) {
    return axiosModule.post("property/put_item_on_auction", {
        property_id,
        user_item_id,
        item_type,
        auction_entrance_price,
    });
}

export function cancelAuction(property_id: number, public_item_id: number) {
    return axiosModule.post("property/cancel_auction", {
        property_id,
        public_item_id,
    });
}

export function bidOnAuction(
    property_id: number,
    public_item_id: number,
    bid_amount: number,
) {
    console.log("bid_amount", bid_amount);
    console.log("public_item_id", public_item_id);
    console.log("property_id", property_id);

    return axiosModule.post("property/bid_on_auction", {
        property_id,
        public_item_id,
        bid_amount,
    });
}

export function getMyBid(property_id: number, public_item_id: number) {
    return axiosModule.post("property/get_my_bid", {
        property_id,
        public_item_id,
    });
}