import React, {useEffect, useState} from "react";
import {
    FlatList,
    Image,
    RefreshControl,
    TouchableOpacity,
    View,
} from "react-native";

import {useDispatch} from "react-redux";

import {propertyApis} from "@apis/index.ts";
import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {AppImage, AppText, ItemPickerModal, Prompt} from "@components/index.ts";
import {PropertySaleItem, UserProperty} from "@interfaces/PropertyInterface.ts";
import {authActions} from "@redux/actions";
import Item from "@screens/inventory/Item.tsx";
import ItemDetails from "@screens/inventory/ItemDetails.tsx";
import styles from "@screens/property_details/styles.ts";
import {renderNumber, showToast} from "@utils/helperFunctions.ts";
import {
    commonStyles,
    scaledValue,
    SCREEN_HEIGHT,
    strings,
} from "@utils/index.ts";

interface Props {
    property: UserProperty;
    getPropertyDetails: () => void;
    isOwner: boolean;
    loading: boolean;
    buyingItem: any;
}

export enum InventoryTarget {
    PUBLIC,
    USER_SPECIFIC,
    PRIVATE,
}

const ShopInventory = ({
    property,
    getPropertyDetails,
    isOwner,
    loading,
    buyingItem,
}: Props) => {
    const dispatch = useDispatch();
    const [showSelectedItem, setShowSelectedItem] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<any>();
    const [showItemPicker, setShowItemPicker] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedAmount, setSelectedAmount] = useState<number>(1);
    const [showBidPrompt, setShowBidPrompt] = useState<boolean>(false);
    const [myBid, setMyBid] = useState<number>(0);

    const hasPurchaseUpgrade = property?.upgrades.some(
        (upgrade: any) => upgrade.upgrade_id === 7,
    );
    const hasAuctionUpgrade = property?.upgrades.some(
        (upgrade: any) => upgrade.upgrade_id === 8,
    );

    useEffect(() => {
        if (buyingItem) {
            setSelectedItem(
                getAllItems().find(
                    (item: any) =>
                        item.item_id === buyingItem.item_id &&
                        item.type === buyingItem.type,
                ),
            );
        }
    }, [buyingItem]);

    useEffect(() => {
        if (selectedItem && selectedItem.auction_entrance_price) {
            setMyBid(0);
            propertyApis.getMyBid(property.id, selectedItem.id).then(res => {
                setMyBid(res.data.bid);
            });
        }
    }, [selectedItem]);

    function getAllItems() {
        let items: any = [];
        if (isOwner) {
            items.push({
                name: "DEF",
                addItemContainer: true,
            });
        }

        if (Array.isArray(property?.public_items)) {
            property.public_items.forEach((item: any) => {
                items.push({...item, inventoryTarget: InventoryTarget.PUBLIC});
            });
        }

        if (Array.isArray(property?.private_items) && isOwner) {
            property.private_items.forEach((item: any) => {
                items.push({...item, inventoryTarget: InventoryTarget.PRIVATE});
            });
        }

        if (Array.isArray(property?.user_specific_items)) {
            property.user_specific_items.forEach((item: any) => {
                items.push({
                    ...item,
                    inventoryTarget: InventoryTarget.USER_SPECIFIC,
                });
            });
        }

        return items;
    }

    function getActionText() {
        let text;
        if (isOwner) {
            if (
                selectedItem?.price ||
                selectedItem?.buy_price ||
                selectedItem?.auction_entrance_price
            ) {
                text = strings.common.remove;
            } else {
                text = strings.propertyDetails.putOnSale;
            }
        } else {
            if (selectedItem.auction_entrance_price) {
                text = strings.propertyDetails.bid;
            } else if (selectedItem?.buy_price) {
                text = strings.common.sell;
            } else {
                text = strings.propertyDetails.buy;
            }
        }
        return text;
    }

    function onActionButtonPressed(item, amount: number) {
        const isAuctioning = item.auction_entrance_price > 0;
        setShowSelectedItem(false);
        if (isOwner) {
            if (isAuctioning) {
                return propertyApis
                    .cancelAuction(item.property_id, item.id)
                    .then(res => {
                        showToast(res.data.message);
                        getPropertyDetails();
                        dispatch(authActions.getUser());
                    });
            }
            propertyApis.removeItemFromPublicInventory(item.id).then(res => {
                showToast(res.data.message);
                getPropertyDetails();
                dispatch(authActions.getUser());
            });
        } else {
            if (isAuctioning) {
                return setShowBidPrompt(true);
            }
            if (item.buy_price > 0) {
                return propertyApis
                    .sellItemToProperty(
                        property.id,
                        item.item_id,
                        item.type,
                        amount,
                        item.inventoryTarget,
                    )
                    .then(res => {
                        showToast(res.data.message);
                        getPropertyDetails();
                        dispatch(authActions.getUser());
                    });
            }
            propertyApis
                .buyItemFromProperty(item?.id, amount, item.inventoryTarget)
                .then(res => {
                    showToast(res.data.message);
                    getPropertyDetails();
                    dispatch(authActions.getUser());
                });
        }
    }

    function addToSale(
        item,
        amount: number,
        price: number,
        isBuying: boolean,
        isAuctioning: boolean,
    ) {
        setIsLoading(true);
        if (isAuctioning) {
            return propertyApis
                .putItemOnAuction(
                    property.id,
                    item.id,
                    item.type,
                    parseInt(price),
                )
                .then(res => {
                    setShowItemPicker(false);
                    showToast(res.data.message);
                    getPropertyDetails();
                    dispatch(authActions.getUser());
                })
                .finally(() => setTimeout(() => setIsLoading(false), 1000));
        }
        propertyApis
            .addItemToPublicInventoryForSale(
                property.id,
                item.id,
                item.item_id,
                item.type,
                parseInt(amount),
                parseInt(price),
                isBuying,
            )
            .then(res => {
                setShowItemPicker(false);
                showToast(res.data.message);
                getPropertyDetails();
                dispatch(authActions.getUser());
            })
            .finally(() => setTimeout(() => setIsLoading(false), 1000));
    }

    function onBidPressed(bidAmount: number) {
        propertyApis
            .bidOnAuction(property.id, selectedItem.id, bidAmount)
            .then(res => {
                showToast(res.data.message);
                getPropertyDetails();
                dispatch(authActions.getUser());
            });
    }

    const _renderItem = ({item}: {item: PropertySaleItem}) => {
        if (item?.addItemContainer) {
            return (
                <TouchableOpacity onPress={() => setShowItemPicker(true)}>
                    <Image
                        source={images.containers.addItem}
                        style={{
                            width: scaledValue(105),
                            height: scaledValue(130),
                            marginRight: 8,
                            marginBottom: 8,
                        }}
                    />
                </TouchableOpacity>
            );
        }
        return (
            <Item
                item={item}
                onPress={() => {
                    if (selectedItem?.id === item.id) {
                        setShowSelectedItem(false);
                        return setSelectedItem(null);
                    }
                    setSelectedItem(item);
                    setShowSelectedItem(true);
                    setSelectedAmount(1);
                }}
                isSelected={
                    selectedItem?.id === item.id &&
                    selectedItem?.type === item.type
                }
            />
        );
    };

    function renderBuyOrSellPrice() {
        let price = 0;
        let isSale = true;
        if (selectedItem?.buy_price) {
            price = selectedItem?.buy_price;
            isSale = false;
        } else if (selectedItem?.price) {
            price = selectedItem?.price;
        }
        if (price !== 0 || myBid !== 0) {
            return (
                <View
                    style={[
                        commonStyles.flexRowAlignCenter,
                        {position: "absolute", right: 0, top: 0},
                    ]}>
                    <AppImage source={images.icons.money} size={22} />
                    <AppText
                        preText={myBid ? "" : `${isSale ? "-" : "+"}`}
                        text={`$${renderNumber(
                            myBid ? myBid : price * selectedAmount,
                            1,
                        )}`}
                        type={TextTypes.BodyBold}
                        style={{marginLeft: gapSize.sizeS}}
                        color={
                            myBid
                                ? colors.white
                                : isSale
                                ? colors.red
                                : colors.green
                        }
                    />
                </View>
            );
        }
    }

    function changeSelectedAmount(newAmount: number) {
        setSelectedAmount(newAmount);
    }

    function getMinimumAllowedBidText() {
        if (selectedItem?.auction_entrance_price) {
            return `Minimum allowed bid is ${renderNumber(
                selectedItem?.auction_entrance_price,
                0,
            )}`;
        }
        return "";
    }

    return (
        <View style={styles.sectionContainer}>
            <FlatList
                refreshControl={
                    <RefreshControl
                        tintColor={colors.white}
                        refreshing={loading}
                        onRefresh={getPropertyDetails}
                    />
                }
                numColumns={3}
                data={getAllItems()}
                renderItem={_renderItem}
                style={{
                    height: selectedItem
                        ? SCREEN_HEIGHT * 0.53
                        : SCREEN_HEIGHT * 0.72,
                }}
                ListEmptyComponent={() => (
                    <View
                        style={{
                            height: SCREEN_HEIGHT * 0.61,
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                        <AppText
                            text={strings.propertyDetails.noItemsOnSale}
                            type={TextTypes.TitleSmall}
                        />
                    </View>
                )}
            />
            <Prompt
                isVisible={showBidPrompt}
                onClose={() => setShowBidPrompt(false)}
                onConfirm={onBidPressed}
                title={strings.propertyDetails.bid}
                text={getMinimumAllowedBidText()}
                inputValidation="number-only"
                formatNumber
            />
            {showSelectedItem && (
                <ItemDetails
                    rightTopComponent={!isOwner && renderBuyOrSellPrice()}
                    item={selectedItem}
                    showAmountSelector={!isOwner && selectedItem?.amount > 1}
                    actionButtonText={getActionText()}
                    onActionButtonPressed={onActionButtonPressed}
                    onAmountChange={changeSelectedAmount}
                />
            )}
            <ItemPickerModal
                canPurchase={hasPurchaseUpgrade}
                canAuction={hasAuctionUpgrade}
                isVisible={showItemPicker}
                onClose={() => setShowItemPicker(false)}
                onSelect={({
                    selectedItem,
                    amount,
                    price,
                    isBuying,
                    isAuctioning,
                }) =>
                    addToSale(
                        selectedItem,
                        amount,
                        price,
                        isBuying,
                        isAuctioning,
                    )
                }
                loading={isLoading}
            />
        </View>
    );
};

export default ShopInventory;
