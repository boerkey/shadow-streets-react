import React, {ReactNode, useEffect, useState} from "react";
import {
    ImageBackground,
    Platform,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

import {useDispatch, useSelector} from "react-redux";

import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {
    AppButton,
    AppImage,
    AppText,
    QualityChip,
    TooltipDropdown,
} from "@components/index.ts";
import {
    ArmorItem,
    ConsumableItem,
    GoodsItem,
    ItemType,
    WeaponItem,
} from "@interfaces/GameInterface.ts";
import {itemActions} from "@redux/actions";
import {RootState} from "@redux/index";
import ItemAmount from "@screens/inventory/ItemAmount.tsx";
import VerticalDivider from "@screens/inventory/VerticalDivider.tsx";
import {renderNumber} from "@utils/helperFunctions";
import {
    commonStyles,
    scaledValue,
    SCREEN_WIDTH,
    strings,
} from "@utils/index.ts";
import {getItemImage} from "@utils/itemHelpers.ts";

type Props = {
    item: ConsumableItem | GoodsItem | WeaponItem | ArmorItem;
    containerStyle?: ViewStyle;
    showAmountSelector?: boolean;
    dropdownOptions?: {name: string; color: string}[];
    actionButtonText?: string;
    onActionButtonPressed?: () => void;
    actionButtonWidth?: number;
    rightComponent?: React.ReactNode;
    leftBottomComponent?: React.ReactNode;
    onDropdownOptionSelected?: (index: number, item: any) => void;
    onAmountChange?: (amount: number) => void;
    leftComponent?: React.ReactNode;
    underImageComponent?: React.ReactNode;
    rightTopComponent?: React.ReactNode;
};

const ItemDetails = ({
    item,
    containerStyle,
    showAmountSelector,
    dropdownOptions = [],
    actionButtonText,
    onActionButtonPressed,
    actionButtonWidth = 110,
    rightComponent,
    leftBottomComponent,
    onDropdownOptionSelected,
    onAmountChange,
    leftComponent,
    underImageComponent,
    rightTopComponent,
}: Props) => {
    const favoriteItems = useSelector(
        (state: RootState) => state.auth.favoriteItems,
    );
    const isFavorite = favoriteItems.some(
        each => each.id === item.id && each.type === item.type,
    );
    const [selectedAmount, setSelectedAmount] = useState<number>(1);
    const dispatch = useDispatch();

    useEffect(() => {
        setSelectedAmount(1);
        if (onAmountChange) {
            onAmountChange(1);
        }
    }, [item.id]);

    function getProperties() {
        const propertyList = [];
        const isEquippableItem =
            item.type === ItemType.Weapon ||
            item.type === ItemType.Armor ||
            item.type === ItemType.Helmet;
        switch (item.type) {
            case ItemType.Weapon:
                propertyList.push(
                    <View
                        key={`weapon-${item.id}`}
                        style={[commonStyles.flexRow, {marginBottom: 2}]}>
                        <AppText
                            text={`• ${strings.common.gameKeys.damage}: `}
                            color={colors.white}
                            fontSize={13}
                        />
                        <AppText
                            text={item.damage}
                            type={TextTypes.BodyBold}
                            color={colors.white}
                        />
                    </View>,
                );
                break;
            case ItemType.Armor:
                propertyList.push(
                    <View
                        key={`armor-${item.id}`}
                        style={[commonStyles.flexRow, {marginBottom: 2}]}>
                        <AppText
                            text={`• ${strings.common.gameKeys.defence}: `}
                            color={colors.white}
                            fontSize={13}
                        />
                        <AppText
                            text={item.defence}
                            type={TextTypes.BodyBold}
                            color={colors.white}
                        />
                    </View>,
                );
                break;
            case ItemType.Consumable:
            case ItemType.Helmet:
                item.energy > 0 &&
                    propertyList.push(
                        <View
                            key={`consumable-energy-${item.id}`}
                            style={[commonStyles.flexRow, {marginBottom: 2}]}>
                            <AppText
                                text={`• ${strings.common.gameKeys.energy}: `}
                                color={colors.white}
                                fontSize={13}
                            />
                            <AppText
                                text={item.energy}
                                type={TextTypes.BodyBold}
                                color={colors.white}
                            />
                        </View>,
                    );
                item.health > 0 &&
                    propertyList.push(
                        <View
                            key={`consumable-health-${item.id}`}
                            style={[commonStyles.flexRow, {marginBottom: 2}]}>
                            <AppText
                                text={`• ${strings.common.gameKeys.health}: `}
                                color={colors.white}
                                fontSize={13}
                            />
                            <AppText
                                text={item.health}
                                type={TextTypes.BodyBold}
                                color={colors.white}
                            />
                        </View>,
                    );
        }
        if (isEquippableItem) {
            propertyList.push(
                <View
                    key={`grade-${item.id}`}
                    style={[commonStyles.flexRow, {marginBottom: 2}]}>
                    <AppText
                        text={`• ${strings.common.grade}: +`}
                        color={colors.white}
                    />
                    <AppText
                        text={item.grade}
                        type={TextTypes.BodyBold}
                        color={colors.white}
                    />
                </View>,
            );
            propertyList.push(
                <View
                    key={`required-level-${item.id}`}
                    style={[commonStyles.flexRow, {marginBottom: 2}]}>
                    <AppText
                        text={`• ${strings.common.gameKeys.required_level}: `}
                        color={colors.white}
                        fontSize={13}
                    />
                    <AppText
                        text={item.required_level}
                        type={TextTypes.BodyBold}
                        color={colors.white}
                    />
                </View>,
            );
            if (item.durability) {
                propertyList.push(
                    <View
                        key={`durability-${item.id}`}
                        style={[commonStyles.flexRow, {marginBottom: 2}]}>
                        <AppText
                            text={`• ${strings.common.gameKeys.durability}: `}
                            color={colors.white}
                            fontSize={13}
                        />
                        <AppText
                            text={item.durability}
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
        if ("properties" in item && item.properties) {
            const list: ReactNode[] = [];
            Object.entries(item.properties).map(([key, value], index) => {
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
            });
            return list;
        }
        return undefined;
    }

    const subProperties = getSubProperties();

    function getActionText() {
        const isEquippableItem =
            item.type === ItemType.Weapon ||
            item.type === ItemType.Armor ||
            item.type === ItemType.Helmet;
        if (actionButtonText) {
            return actionButtonText;
        }
        if (isEquippableItem) {
            const isEquipped = item?.is_equipped;
            return isEquipped ? strings.common.unEquip : strings.common.equip;
        } else {
            return strings.common.use;
        }
    }

    function getItemTypeName() {
        return strings.common.itemTypeName[item.type];
    }

    function changeSelectedAmount(newAmount: number) {
        let lastNewAmount: number = selectedAmount + newAmount;
        if (lastNewAmount < 1) {
            lastNewAmount = 1;
        }
        if (lastNewAmount > item.amount) {
            lastNewAmount = item.amount;
        }
        setSelectedAmount(lastNewAmount);
        if (onAmountChange) {
            onAmountChange(lastNewAmount);
        }
    }

    function renderActionButton() {
        if (
            actionButtonText ||
            (item.type !== ItemType.Goods && item.type !== ItemType.Material)
        ) {
            return (
                <AppButton
                    onPress={() => {
                        if (onActionButtonPressed) {
                            return onActionButtonPressed(item, selectedAmount);
                        }
                        dispatch(
                            itemActions.useItem(
                                item.id,
                                item.type,
                                selectedAmount,
                            ),
                        );
                    }}
                    text={getActionText()}
                    type={"primarySmall"}
                    resizeMode={"stretch"}
                    width={actionButtonWidth}
                    height={42}
                    fontSize={20}
                />
            );
        }
    }

    return (
        <ImageBackground
            source={images.containers.itemDetails[item.quality ?? 0]}
            resizeMode={"stretch"}
            style={{
                height: scaledValue(Platform.OS === "ios" ? 195 : 202),
                width: SCREEN_WIDTH * 0.88,
                padding: scaledValue(8),
                ...containerStyle,
            }}>
            <View style={[commonStyles.flexRow]}>
                <View>
                    <AppText
                        text={item.name}
                        type={TextTypes.H5}
                        style={{marginRight: gapSize.sizeM}}
                        color={isFavorite ? colors.green : colors.white}
                    />
                    <AppText
                        text={`(${getItemTypeName()})`}
                        type={TextTypes.BodySmall}
                        color={colors.grey500}
                        style={{marginLeft: 2}}
                    />
                </View>
                <QualityChip quality={item.quality} />
                {rightTopComponent && rightTopComponent}
            </View>
            <View style={[commonStyles.flexRow]}>
                {getProperties().length > 0 && !leftComponent && (
                    <View style={{top: 10, width: "33%"}}>
                        {getProperties()}
                    </View>
                )}
                {leftComponent && leftComponent}
                <VerticalDivider
                    hidden={
                        (!subProperties && !rightComponent) || leftComponent
                    }
                    marginHorizontal={11}
                />

                {!leftComponent && (
                    <View>
                        <AppText
                            text={
                                subProperties
                                    ? strings.common.subProperties
                                    : ""
                            }
                            color={colors.secondary500}
                            type={TextTypes.BodyBold}
                        />
                        <View
                            style={{
                                marginTop: scaledValue(5),
                            }}>
                            {subProperties}
                            {rightComponent}
                        </View>
                    </View>
                )}
                <View
                    style={{
                        position: "absolute",
                        right: gapSize.sizeM,
                    }}>
                    <AppImage
                        source={getItemImage(item)}
                        size={70}
                        style={{
                            bottom: underImageComponent ? gapSize.sizeL : 0,
                        }}
                    />
                    <ItemAmount
                        amount={item.amount}
                        style={{
                            bottom: underImageComponent ? gapSize.sizeL : 0,
                        }}
                    />
                    {underImageComponent && underImageComponent}
                </View>
            </View>
            <View
                style={{
                    flexDirection: "row-reverse",
                    alignItems: "center",
                    marginTop: gapSize.size3L,
                    marginRight: gapSize.sizeS,
                }}>
                {dropdownOptions.length > 0 && (
                    <TooltipDropdown
                        selectedIndex={-1}
                        options={dropdownOptions}
                        placement={"top"}
                        maxHeight={325}
                        onSelect={onDropdownOptionSelected}>
                        <View
                            style={{
                                width: scaledValue(38),
                                height: scaledValue(38),
                                borderWidth: 1,
                                borderColor: colors.secondary500,
                                marginLeft: scaledValue(13),
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                            <AppText
                                text={"..."}
                                color={colors.secondary500}
                                type={TextTypes.ButtonSmall}
                            />
                        </View>
                    </TooltipDropdown>
                )}
                {renderActionButton()}
                {leftBottomComponent && leftBottomComponent}
                {showAmountSelector && (
                    <View
                        style={[
                            commonStyles.flexRowAlignCenter,
                            {left: gapSize.sizeL, position: "absolute"},
                        ]}>
                        <TouchableOpacity
                            hitSlop={commonStyles.hitSlop}
                            onPress={() => changeSelectedAmount(-1)}
                            onLongPress={() => changeSelectedAmount(-999)}>
                            <AppText
                                text={"-"}
                                type={TextTypes.H4}
                                fontSize={30}
                            />
                        </TouchableOpacity>
                        <View
                            style={{
                                minWidth: 60,
                                marginHorizontal: gapSize.sizeXS,
                            }}>
                            <AppText
                                text={selectedAmount}
                                type={TextTypes.H4}
                                fontSize={30}
                                style={{
                                    marginHorizontal: gapSize.sizeL,
                                }}
                                centered
                            />
                        </View>
                        <TouchableOpacity
                            hitSlop={commonStyles.hitSlop}
                            onPress={() => changeSelectedAmount(+1)}
                            onLongPress={() => changeSelectedAmount(+999)}>
                            <AppText
                                text={"+"}
                                type={TextTypes.H4}
                                fontSize={30}
                            />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ImageBackground>
    );
};

export default ItemDetails;
