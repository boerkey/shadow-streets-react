import React, {ReactNode, useEffect, useState} from "react";
import {
    FlatList,
    Pressable,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import {useSelector} from "react-redux";

import {colors, fonts, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {
    AppButton,
    AppImage,
    AppInput,
    AppModal,
    AppText,
    CheckBox,
    QualityChip,
} from "@components/index.ts";
import {
    ArmorItem,
    ConsumableItem,
    GoodsItem,
    ItemType,
    WeaponItem,
} from "@interfaces/GameInterface.ts";
import {RootState} from "@redux/index.ts";
import VerticalDivider from "@screens/inventory/VerticalDivider";
import {removeCommas, renderNumber} from "@utils/helperFunctions.ts";
import {
    commonStyles,
    helperFunctions,
    scaledValue,
    strings,
} from "@utils/index.ts";
import {getItemImage, getItemTypeName} from "@utils/itemHelpers.ts";

interface ItemPickerModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSelect: ({
        selectedItem,
        amount,
        price,
        isBuying,
        isAuctioning,
    }: {
        selectedItem: WeaponItem | ArmorItem | GoodsItem | ConsumableItem;
        amount: number;
        price: number;
        isBuying: boolean;
        isAuctioning: boolean;
    }) => void;
    canPurchase?: boolean;
    canAuction?: boolean;
    loading: boolean;
    onlySelect?: boolean;
    itemTypes?: ItemType[];
    actionButtonText?: string;
}

const ItemPickerModal = ({
    isVisible,
    onClose,
    onSelect,
    canPurchase = false,
    canAuction = false,
    loading,
    onlySelect = false,
    itemTypes = [],
    actionButtonText = strings.common.select,
}: ItemPickerModalProps) => {
    const gameItems = useSelector((state: RootState) => state.game.gameItems);
    const gameConfig = useSelector((state: RootState) => state.game.gameConfig);
    const user = useSelector((state: RootState) => state.auth.user);

    const [showItems, setShowItems] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [filterText, setFilterText] = useState("");
    const [price, setPrice] = useState("");
    const [amount, setAmount] = useState("");
    const [amountEditable, setAmountEditable] = useState(false);
    const [isBuying, setIsBuying] = useState(false);
    const [isAuctioning, setIsAuctioning] = useState(false);

    const maxAmount = selectedItem?.amount;
    const maxAmountText =
        maxAmount > 1 && !isBuying ? `(Max: ${maxAmount})` : "";
    const isEquippableItem =
        selectedItem?.type === ItemType.Weapon ||
        selectedItem?.type === ItemType.Armor ||
        selectedItem?.type === ItemType.Helmet;

    useEffect(() => {
        resetStates();
    }, [isVisible]);

    useEffect(() => {
        if (selectedItem) {
            if (selectedItem?.amount > 1) {
                setAmountEditable(true);
                setAmount("");
            } else {
                setAmount("1");
                setAmountEditable(false);
            }
        }
    }, [selectedItem]);

    function resetStates() {
        setSelectedItem(null);
        setAmount("");
        setPrice("");
        setAmountEditable(true);
        setFilterText("");
    }

    function hardResetStates() {
        setSelectedItem(null);
        setAmount("");
        setPrice("");
        setAmountEditable(true);
        setIsBuying(false);
        setIsAuctioning(false);
        setFilterText("");
    }

    const _renderItem = ({item, index}) => (
        <ItemPickerModalItem
            item={item}
            index={index}
            key={item.id}
            onSelect={() => {
                setShowItems(false);
                if (isBuying) {
                    setSelectedItem({...item, item_id: item.id, id: -1});
                    return;
                }
                setSelectedItem(item);
            }}
        />
    );

    function getItemList() {
        if (itemTypes.length > 0) {
            const list: (
                | WeaponItem
                | ArmorItem
                | GoodsItem
                | ConsumableItem
            )[] = [];
            itemTypes.forEach(type => {
                switch (type) {
                    case ItemType.Weapon:
                        list.push(...user.items_weapons);
                        break;
                    case ItemType.Armor:
                        list.push(...user.items_armors);
                        break;
                    case ItemType.Helmet:
                        list.push(...user.items_helmets);
                        break;
                    case ItemType.Consumable:
                        list.push(...user.items_consumables);
                }
            });
            return list;
        }
        if (isBuying) {
            return [
                ...gameItems.consumables,
                ...gameItems.goods,
                ...gameItems.materials,
            ].filter(each =>
                each.name.toLowerCase().includes(filterText.toLowerCase()),
            );
        }
        if (isAuctioning) {
            return [
                ...user?.items_weapons,
                ...user?.items_armors,
                ...user?.items_helmets,
            ].filter(
                each =>
                    each.name
                        .toLowerCase()
                        .includes(filterText.toLowerCase()) &&
                    !each.is_equipped,
            );
        }
        return [
            ...user?.items_consumables,
            ...user?.items_goods,
            // ...(!isAuctioning ? [] : user?.items_weapons),
            //...(!isAuctioning ? [] : user?.items_armors),
            ...user?.items_materials,
        ].filter(each =>
            each.name.toLowerCase().includes(filterText.toLowerCase()),
        );
    }

    function renderSelectedItem() {
        if (selectedItem) {
            return (
                <TouchableOpacity
                    onPress={() => setShowItems(prev => !prev)}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "100%",
                    }}>
                    <AppImage source={getItemImage(selectedItem)} size={31} />
                    <View style={{marginHorizontal: gapSize.sizeM}}>
                        <AppText
                            preText={
                                selectedItem.grade
                                    ? `+${selectedItem.grade} `
                                    : ""
                            }
                            text={selectedItem.name}
                            type={TextTypes.H6}
                        />
                        <AppText
                            text={`(${getItemTypeName(selectedItem.type)})`}
                            color={colors.grey500}
                            type={TextTypes.BodySmall}
                        />
                    </View>
                    {isEquippableItem && (
                        <QualityChip quality={selectedItem.quality} />
                    )}
                    <TouchableOpacity
                        onPress={resetStates}
                        style={{position: "absolute", right: 0}}
                        hitSlop={commonStyles.hitSlop}>
                        <AppText
                            text={"X"}
                            type={TextTypes.H6}
                            color={colors.grey500}
                            fontSize={20}
                        />
                    </TouchableOpacity>
                </TouchableOpacity>
            );
        } else {
            return (
                <Pressable
                    onPress={() => setShowItems(prev => !prev)}
                    style={[commonStyles.flexRowAlignCenter]}>
                    <AppImage
                        key={1}
                        source={images.icons.search}
                        style={{width: 15, height: 15, marginRight: 15}}
                    />
                    <TextInput
                        key={2}
                        onTouchStart={() => setShowItems(prev => !prev)}
                        selectionColor={colors.grey500}
                        onChangeText={setFilterText}
                        value={filterText}
                        style={{
                            width: "85%",
                            color: colors.white,
                            fontFamily: fonts.RalewayRegular,
                        }}
                        autoCorrect={false}
                    />
                    {filterText.length > 0 && (
                        <TouchableOpacity
                            onPress={() => setFilterText("")}
                            style={{position: "absolute", right: 0}}
                            hitSlop={commonStyles.hitSlop}>
                            <AppText
                                text={"X"}
                                type={TextTypes.H6}
                                fontSize={20}
                                color={colors.grey500}
                            />
                        </TouchableOpacity>
                    )}
                </Pressable>
            );
        }
    }

    function getProperties() {
        const propertyList = [];
        const isEquippableItem =
            selectedItem.type === ItemType.Weapon ||
            selectedItem.type === ItemType.Armor ||
            selectedItem.type === ItemType.Helmet;
        switch (selectedItem.type) {
            case ItemType.Weapon:
                propertyList.push(
                    <View
                        key={`weapon-${selectedItem.id}`}
                        style={[commonStyles.flexRow, {marginBottom: 2}]}>
                        <AppText
                            text={`• ${strings.common.gameKeys.damage}: `}
                            color={colors.white}
                            fontSize={13}
                        />
                        <AppText
                            text={selectedItem.damage}
                            type={TextTypes.BodyBold}
                            color={colors.white}
                        />
                    </View>,
                );
                break;
            case ItemType.Armor:
                propertyList.push(
                    <View
                        key={`armor-${selectedItem.id}`}
                        style={[commonStyles.flexRow, {marginBottom: 2}]}>
                        <AppText
                            text={`• ${strings.common.gameKeys.defence}: `}
                            color={colors.white}
                            fontSize={13}
                        />
                        <AppText
                            text={selectedItem.defence}
                            type={TextTypes.BodyBold}
                            color={colors.white}
                        />
                    </View>,
                );
                break;
            case ItemType.Consumable:
            case ItemType.Helmet:
                selectedItem.energy > 0 &&
                    propertyList.push(
                        <View
                            key={`consumable-energy-${selectedItem.id}`}
                            style={[commonStyles.flexRow, {marginBottom: 2}]}>
                            <AppText
                                text={`• ${strings.common.gameKeys.energy}: `}
                                color={colors.white}
                                fontSize={13}
                            />
                            <AppText
                                text={selectedItem.energy}
                                type={TextTypes.BodyBold}
                                color={colors.white}
                            />
                        </View>,
                    );
                selectedItem.health > 0 &&
                    propertyList.push(
                        <View
                            key={`consumable-health-${selectedItem.id}`}
                            style={[commonStyles.flexRow, {marginBottom: 2}]}>
                            <AppText
                                text={`• ${strings.common.gameKeys.health}: `}
                                color={colors.white}
                                fontSize={13}
                            />
                            <AppText
                                text={selectedItem.health}
                                type={TextTypes.BodyBold}
                                color={colors.white}
                            />
                        </View>,
                    );
        }
        if (isEquippableItem) {
            propertyList.push(
                <View
                    key={`grade-${selectedItem.id}`}
                    style={[commonStyles.flexRow, {marginBottom: 2}]}>
                    <AppText
                        text={`• ${strings.common.grade}: +`}
                        color={colors.white}
                    />
                    <AppText
                        text={selectedItem.grade}
                        type={TextTypes.BodyBold}
                        color={colors.white}
                    />
                </View>,
            );
            propertyList.push(
                <View
                    key={`required-level-${selectedItem.id}`}
                    style={[commonStyles.flexRow, {marginBottom: 2}]}>
                    <AppText
                        text={`• ${strings.common.gameKeys.required_level}: `}
                        color={colors.white}
                        fontSize={13}
                    />
                    <AppText
                        text={selectedItem.required_level}
                        type={TextTypes.BodyBold}
                        color={colors.white}
                    />
                </View>,
            );
            if (selectedItem.durability) {
                propertyList.push(
                    <View
                        key={`durability-${selectedItem.id}`}
                        style={[commonStyles.flexRow, {marginBottom: 2}]}>
                        <AppText
                            text={`• ${strings.common.gameKeys.durability}: `}
                            color={colors.white}
                            fontSize={13}
                        />
                        <AppText
                            text={selectedItem.durability}
                            postText="%"
                            type={TextTypes.BodyBold}
                            color={colors.white}
                        />
                    </View>,
                );
            }
        }
        return propertyList;
    }

    function getSubProperties() {
        if ("properties" in selectedItem && selectedItem.properties) {
            const list: ReactNode[] = [];
            Object.entries(selectedItem.properties).map(
                ([key, value], index) => {
                    const multiplier = strings.common.gameKeysMultiplier[key];
                    list.push(
                        <View
                            key={`sub-property-${index}`}
                            style={[commonStyles.flexRow, {marginBottom: 2}]}>
                            <AppText
                                text={`• ${strings.common.gameKeys[key]}`}
                                color={colors.green}
                                fontSize={11}
                                type={TextTypes.BodyBold}
                            />
                            <AppText
                                color={colors.green}
                                fontSize={11}
                                type={TextTypes.BodyBold}
                                text={
                                    ": +" +
                                    renderNumber(value * (multiplier ?? 1), 2)
                                }
                                postText={
                                    strings.common.gameKeysPostText[key] ?? ""
                                }
                            />
                        </View>,
                    );
                },
            );
            return list;
        }
        return undefined;
    }

    function renderAuctionItem() {
        if (isAuctioning && selectedItem) {
            return (
                <View
                    style={[
                        commonStyles.flexRow,
                        {marginBottom: gapSize.sizeL},
                    ]}>
                    <View style={{width: "40%"}}>{getProperties()}</View>
                    {getSubProperties() && <VerticalDivider />}
                    <View style={{width: "40%"}}>{getSubProperties()}</View>
                </View>
            );
        }
    }

    function renderAuctionEntryFee() {
        if (isAuctioning && selectedItem) {
            return (
                <AppText
                    preText={strings.propertyDetails.auctionStartFee}
                    text={` ${renderNumber(
                        gameConfig.auction_start_fee *
                            parseInt(removeCommas(price)),
                        1,
                    )}$`}
                    color={colors.orange}
                    style={{marginBottom: gapSize.sizeL}}
                />
            );
        }
    }

    return (
        <AppModal
            isVisible={isVisible}
            onClose={() => {
                hardResetStates();
                onClose();
            }}>
            <View
                style={{
                    backgroundColor: "#000",
                    width: scaledValue(345),
                    paddingHorizontal: gapSize.size2L,
                    paddingVertical: gapSize.size4L,
                    borderWidth: 1,
                    borderColor: colors.secondary500,
                    alignItems: "center",
                    marginBottom: gapSize.size3L,
                }}>
                <AppText
                    text={strings.common.selectItem}
                    type={TextTypes.TitleSmall}
                    style={{marginBottom: gapSize.sizeM}}
                />
                <View
                    style={{
                        paddingHorizontal: gapSize.sizeL,
                        borderBottomWidth: 1,
                        borderColor: colors.grey500,
                        backgroundColor: "#191717",
                        height: scaledValue(51),
                        width: scaledValue(300),
                        alignItems: "center",
                        flexDirection: "row",
                        marginBottom: gapSize.size2L,
                    }}>
                    {renderSelectedItem()}
                </View>
                {showItems && (
                    <FlatList
                        data={getItemList()}
                        renderItem={_renderItem}
                        keyExtractor={(item, index) => `${item.id}-${index}`}
                        style={{
                            position: "absolute",
                            top: scaledValue(140),
                            zIndex: 1,
                            height: scaledValue(200),
                            width: scaledValue(320),
                            backgroundColor: "black",
                        }}
                        ItemSeparatorComponent={() => (
                            <View
                                style={{
                                    height: 0.5,
                                    backgroundColor: colors.lineColor,
                                    width: "95%",
                                    alignSelf: "center",
                                }}
                            />
                        )}
                    />
                )}
                {renderAuctionItem()}
                {isAuctioning && !onlySelect && (
                    <AppInput
                        width={scaledValue(290)}
                        label={strings.propertyDetails.minimumAuctionEntryPrice}
                        placeholder={strings.common.enterPrice}
                        style={{marginBottom: gapSize.sizeL}}
                        keyboardType={"number-pad"}
                        value={price}
                        onChangeText={val => {
                            setPrice(helperFunctions.formatInputNumber(val));
                        }}
                        fontSize={16}
                        maxLength={10}
                    />
                )}
                {renderAuctionEntryFee()}
                {!isAuctioning && !onlySelect && (
                    <>
                        <AppInput
                            width={scaledValue(290)}
                            label={strings.common.price}
                            placeholder={strings.common.enterPrice}
                            style={{marginBottom: gapSize.size2L}}
                            keyboardType={"number-pad"}
                            value={price}
                            onChangeText={val =>
                                setPrice(helperFunctions.formatInputNumber(val))
                            }
                            fontSize={16}
                            maxLength={8}
                        />
                        <AppInput
                            width={scaledValue(290)}
                            label={strings.common.amount}
                            placeholder={
                                strings.common.enterAmount + " " + maxAmountText
                            }
                            style={{marginBottom: gapSize.size2L}}
                            onChangeText={val => {
                                // Remove non-numeric characters first to prevent issues
                                let numericText = val.replace(/[^0-9]/g, "");

                                // Ensure the value is a number before comparing
                                const numericVal = parseInt(numericText, 10);

                                if (
                                    !isNaN(numericVal) &&
                                    selectedItem?.amount
                                ) {
                                    if (
                                        numericVal > selectedItem.amount &&
                                        !isBuying
                                    ) {
                                        numericText =
                                            selectedItem.amount.toString();
                                    }
                                }

                                setAmount(
                                    helperFunctions.formatInputNumber(
                                        numericText,
                                    ),
                                );
                            }}
                            maxLength={4}
                            value={amount}
                            editable={isBuying || amountEditable}
                            keyboardType={"number-pad"}
                            fontSize={16}
                        />
                    </>
                )}

                <View
                    style={[commonStyles.flexRow, {marginTop: gapSize.sizeM}]}>
                    {canPurchase && (
                        <CheckBox
                            text={strings.propertyDetails.buyOrder}
                            isChecked={isBuying}
                            onPress={() => {
                                resetStates();
                                setIsBuying(prev => !prev);
                                setIsAuctioning(false);
                            }}
                        />
                    )}
                    {canAuction && (
                        <CheckBox
                            text={strings.propertyDetails.auctionOrder}
                            isChecked={isAuctioning}
                            onPress={() => {
                                resetStates();
                                setIsAuctioning(prev => !prev);
                                setIsBuying(false);
                            }}
                            style={{marginLeft: gapSize.sizeM}}
                        />
                    )}
                </View>
                <View
                    style={[
                        commonStyles.flexRowSpaceBetween,
                        {width: "100%", marginTop: gapSize.size4L},
                    ]}>
                    <AppButton
                        onPress={onClose}
                        text={strings.common.cancel}
                        type={"redSmall"}
                        width={scaledValue(140)}
                    />
                    <AppButton
                        onPress={() =>
                            onSelect({
                                selectedItem,
                                amount: removeCommas(amount),
                                price: removeCommas(price),
                                isBuying,
                                isAuctioning,
                            })
                        }
                        disabled={
                            onlySelect
                                ? !selectedItem
                                : !selectedItem || !amount || !price || loading
                        }
                        text={actionButtonText ?? strings.common.select}
                        width={scaledValue(140)}
                    />
                </View>
            </View>
        </AppModal>
    );
};

export default ItemPickerModal;

const ItemPickerModalItem = ({item, index, onSelect}) => {
    const amountText = item.amount > 1 ? ` (${item.amount})` : "";
    const isEquippableItem =
        item.type === ItemType.Weapon ||
        item.type === ItemType.Armor ||
        item.type === ItemType.Helmet;
    return (
        <TouchableOpacity
            onPress={onSelect}
            style={{
                padding: gapSize.sizeM,
                flexDirection: "row",
                alignItems: "center",
            }}>
            <AppImage source={getItemImage(item)} size={48} />
            <View style={{marginLeft: gapSize.sizeM}}>
                <View style={commonStyles.flexRow}>
                    <AppText
                        preText={item.grade ? `+${item.grade} ` : ""}
                        text={item.name + amountText}
                        type={TextTypes.H6}
                        style={{marginRight: gapSize.sizeS}}
                    />
                    {isEquippableItem && <QualityChip quality={item.quality} />}
                </View>
                <AppText
                    text={`(${getItemTypeName(item.type)})`}
                    color={colors.grey500}
                    type={TextTypes.BodySmall}
                />
            </View>
        </TouchableOpacity>
    );
};
