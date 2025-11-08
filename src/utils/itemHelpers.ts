import {images} from "@assets/index.ts";
import {ItemType} from "@interfaces/GameInterface.ts";
import {strings} from "@utils/index.ts";

export function getItemTypeName(type: ItemType): string {
    return strings.common.itemTypeName[type];
}

export function getItemImage(item: any) {
    if (!item) return null;
    const basePath = images.items[item?.item_type ?? item.type];
    const extensionPath = [item?.item_id ?? item.id];
    if (basePath) {
        return basePath[extensionPath];
    }
}

export function getItemByTypeAndId(gameItems: any, item: any) {
    const type = item?.item_type ?? item?.type;
    if (type !== undefined) {
        switch (type) {
            case ItemType.Consumable:
                return gameItems.consumables.find(
                    gameItem => gameItem.id === item.item_id,
                );
            case ItemType.Weapon:
                return gameItems.weapons.find(
                    gameItem => gameItem.id === item.item_id,
                );
            case ItemType.Armor:
                return gameItems.armors.find(
                    gameItem => gameItem.id === item.item_id,
                );
            case ItemType.Goods:
                return gameItems.goods.find(
                    gameItem => gameItem.id === item.item_id,
                );
            case ItemType.Material:
                return gameItems.materials.find(
                    gameItem => gameItem.id === item.item_id,
                );
            case ItemType.Helmet:
                return gameItems.helmets.find(
                    gameItem => gameItem.id === item.item_id,
                );
        }
    }
}
