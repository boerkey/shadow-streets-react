import React from "react";
import {ImageBackground, TouchableOpacity, View} from "react-native";

import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {AppImage, AppText} from "@components/index.ts";
import {
    ArmorItem,
    ConsumableItem,
    GoodsItem,
    ItemType,
    WeaponItem,
} from "@interfaces/GameInterface.ts";
import {PropertySaleItem} from "@interfaces/PropertyInterface.ts";
import {InventoryTarget} from "@screens/property_details/Shop/ShopInventory.tsx";
import {renderNumber} from "@utils/helperFunctions.ts";
import {commonStyles, scaledValue, strings} from "@utils/index.ts";
import {getItemImage} from "@utils/itemHelpers.ts";

interface ItemProps {
    item:
        | ConsumableItem
        | GoodsItem
        | WeaponItem
        | ArmorItem
        | PropertySaleItem;
    onPress(): void;
    isSelected?: boolean;
    noPriceAndAmount?: boolean;
}

const Item = ({item, onPress, isSelected, noPriceAndAmount}: ItemProps) => {
    const isBuyingItem = item.buy_price > 0;
    const isUserSpecificItem =
        item?.inventoryTarget === InventoryTarget.USER_SPECIFIC;
    const price = noPriceAndAmount ? false : (item.price || isBuyingItem) ?? 0;
    const hasAmount = noPriceAndAmount
        ? false
        : item.type === ItemType.Consumable ||
          item.type === ItemType.Goods ||
          item.type === ItemType.Material;
    const getBuyingOrSalePrice =
        item.buy_price > 0 ? item.buy_price : item.price;
    const isEquipped = item.is_equipped;

    function getImageSize() {
        if (price > 0 && hasAmount) {
            return 48;
        }
        if (hasAmount || price) {
            return 65;
        }
        return 74;
    }

    function renderPriceModifier() {
        if (item.price_modifier) {
            let color = item.price_modifier > 0 ? colors.green : colors.red;
            return (
                <View
                    style={[
                        commonStyles.flexRowAlignCenter,
                        {position: "absolute", left: 8, top: 8},
                    ]}>
                    <View
                        style={{
                            width: 6,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: color,
                            marginRight: 1.5,
                        }}
                    />
                    <AppText
                        postText={"%"}
                        text={renderNumber(
                            Math.abs(item.price_modifier) * 100,
                            0,
                        )}
                        type={TextTypes.Caption2}
                        fontSize={9.5}
                    />
                </View>
            );
        }
        if (item.auction_time_remaining) {
            return (
                <View
                    style={[
                        commonStyles.flexRowAlignCenter,
                        {position: "absolute", left: 9, top: 9},
                    ]}>
                    <AppImage source={images.icons.redTime} size={12} />
                    <AppText
                        text={item.auction_time_remaining}
                        type={TextTypes.Caption2}
                        fontSize={9}
                        color={colors.red}
                    />
                </View>
            );
        }
    }

    function renderBuyingIcon() {
        if (isBuyingItem) {
            return (
                <>
                    <AppImage
                        source={images.icons.buyItem}
                        style={{position: "absolute", right: 5, top: 6}}
                        size={20}
                    />
                    {isUserSpecificItem && (
                        <AppImage
                            source={images.icons.user}
                            style={{position: "absolute", right: 8, top: 28}}
                            size={16}
                        />
                    )}
                </>
            );
        }
        if (isUserSpecificItem) {
            return (
                <AppImage
                    source={images.icons.user}
                    style={{position: "absolute", right: 8, top: 10}}
                    size={16}
                />
            );
        }
    }

    function renderSalePrice() {
        if (getBuyingOrSalePrice && !noPriceAndAmount) {
            return (
                <View style={commonStyles.flexRow}>
                    <AppImage source={images.icons.money} size={21} />
                    <AppText
                        text={renderNumber(getBuyingOrSalePrice, 1)}
                        preText="$"
                        style={{marginLeft: gapSize.sizeS / 2}}
                    />
                </View>
            );
        }
        if (item.auction_entrance_price > 0) {
            return (
                <View style={commonStyles.flexRow}>
                    <AppImage source={images.icons.money} size={21} />
                    <AppText
                        text={renderNumber(item.auction_entrance_price, 1)}
                        preText="$"
                        style={{marginLeft: gapSize.sizeS / 2}}
                    />
                </View>
            );
        }
    }

    return (
        <TouchableOpacity onPress={onPress}>
            <ImageBackground
                source={
                    images.containers.itemQuality[
                        item.quality ? item.quality : 0
                    ]
                }
                resizeMode="stretch"
                imageStyle={{
                    backgroundColor: "transparent",
                }}
                style={{
                    width: scaledValue(105),
                    height: scaledValue(130),
                    marginRight: 8,
                    marginBottom: 8,
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                {renderPriceModifier()}
                {renderBuyingIcon()}
                <AppImage source={getItemImage(item)} size={getImageSize()} />
                <AppText
                    text={item.name}
                    type={TextTypes.H6}
                    color={colors.white}
                    minifyLength={8}
                    shortenLength={13}
                    style={{marginTop: gapSize.sizeS}}
                />
                {hasAmount && (
                    <AppText
                        text={`${strings.common.quantity}: ${renderNumber(
                            item.amount,
                            undefined,
                            true,
                        )}`}
                        fontSize={12}
                    />
                )}
                {renderSalePrice()}
                {(isEquipped || isSelected) && (
                    <AppImage
                        source={
                            isSelected
                                ? images.icons.blueDot
                                : images.icons.redDot
                        }
                        size={12}
                        style={{position: "absolute", right: 8, top: 10}}
                    />
                )}
            </ImageBackground>
        </TouchableOpacity>
    );
};

export default Item;
