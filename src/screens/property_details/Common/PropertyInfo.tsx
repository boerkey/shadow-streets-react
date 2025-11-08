import React, {useState} from "react";
import {View} from "react-native";

import {useDispatch} from "react-redux";

import {propertyApis} from "@apis/index.ts";
import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {
    AppButton,
    AppImage,
    AppText,
    Avatar,
    Prompt,
    SelectSliderValueModal,
} from "@components/index.ts";
import {PropertyType} from "@interfaces/GameInterface.ts";
import {UserProperty} from "@interfaces/PropertyInterface.ts";
import {authActions} from "@redux/actions";
import styles from "@screens/property_details/styles.ts";
import {renderNumber, showToast} from "@utils/helperFunctions.ts";

import {
    commonStyles,
    helperFunctions,
    scaledValue,
    strings,
} from "@utils/index.ts";
import {navigateBack} from "../../../router.tsx";
import ChangeLocationModal from "./ChangeLocationModal.tsx";

enum MoneyAction {
    NONE,
    DEPOSIT,
    WITHDRAW,
}

interface PropertyInfoProps {
    property: UserProperty;
    isOwner: boolean;
    getPropertyDetails: () => void;
}

const PropertyInfo = ({
    property,
    isOwner,
    getPropertyDetails,
}: PropertyInfoProps) => {
    const dispatch = useDispatch();
    const [putOnSalePrompt, setPutOnSalePrompt] = useState(false);
    const [deletePropertyPrompt, setDeletePropertyPrompt] = useState(false);
    const [moneyPrompt, setMoneyPrompt] = useState(MoneyAction.NONE);
    const [showSliderModal, setShowSliderModal] = useState(false);
    const [changeLocationModal, setChangeLocationModal] = useState(false);
    const isOnSale = property?.sale_price > 0;
    const canWithdrawMoney = property.type !== PropertyType.Production;

    function buyPropertyFromUser() {
        propertyApis.buyPropertyFromUser(property.id).then(res => {
            showToast(res.data.message);
            getPropertyDetails();
        });
    }

    function renderOnSale() {
        if (isOnSale) {
            return (
                <View style={{alignItems: "center", marginTop: gapSize.sizeM}}>
                    <AppText
                        text={strings.propertyDetails.listedForSale}
                        type={TextTypes.H4}
                        fontSize={24}
                        color={colors.secondary500}
                    />
                    <View style={commonStyles.flexRowAlignCenter}>
                        <AppText
                            text={`${strings.propertyDetails.salePrice}: `}
                        />
                        <AppImage source={images.icons.money} />
                        <AppText
                            preText={" $"}
                            text={helperFunctions.formatNumberWithCommas(
                                property?.sale_price,
                            )}
                            type={TextTypes.BodyBold}
                        />
                    </View>
                </View>
            );
        }
    }

    function putOnSale(price: number) {
        propertyApis.putOnSale(property.id, price).then(res => {
            showToast(res.data.message);
            getPropertyDetails();
        });
    }

    function removeFromSale() {
        propertyApis.removeFromSale(property.id).then(res => {
            showToast(res.data.message);
            getPropertyDetails();
        });
    }

    function depositOrWithdrawMoney(moneyAction: MoneyAction, money: number) {
        if (moneyAction === MoneyAction.DEPOSIT) {
            propertyApis
                .depositMoneyToProperty(property.id, money)
                .then(res => {
                    showToast(res.data.message);
                    dispatch(authActions.getUser());
                    getPropertyDetails();
                });
        } else if (moneyAction === MoneyAction.WITHDRAW) {
            propertyApis
                .withdrawMoneyFromProperty(property.id, money)
                .then(res => {
                    showToast(res.data.message);
                    getPropertyDetails();
                });
        }
    }

    function setUsageFee(fee: number) {
        propertyApis.setUsageFee(property.id, fee / 100).then(res => {
            showToast(res.data.message);
            getPropertyDetails();
        });
    }

    function changePropertyLocation(streetId: number, buildingId: number) {
        propertyApis
            .changePropertyLocation(property.id, streetId, buildingId)
            .then(res => {
                showToast(res.data.message);
                getPropertyDetails();
                navigateBack();
                setTimeout(() => {
                    navigateBack();
                }, 500);
            });
    }

    return (
        <View style={styles.sectionContainer}>
            {isOwner && (
                <AppImage
                    hitSlop={commonStyles.hitSlop}
                    source={
                        isOnSale
                            ? images.icons.removeFromSale
                            : images.icons.putOnSale
                    }
                    size={40}
                    containerStyle={{position: "absolute", right: 5, top: 10}}
                    onPress={() => setPutOnSalePrompt(true)}
                />
            )}
            {isOwner && (
                <AppImage
                    hitSlop={commonStyles.hitSlop}
                    source={images.icons.change}
                    size={40}
                    containerStyle={{position: "absolute", right: 45, top: 10}}
                    onPress={() => setChangeLocationModal(true)}
                />
            )}

            {isOwner && (
                <AppImage
                    hitSlop={commonStyles.hitSlop}
                    source={images.icons.trash}
                    size={25}
                    containerStyle={{position: "absolute", left: 5, top: 10}}
                    onPress={() => setDeletePropertyPrompt(true)}
                />
            )}
            <ChangeLocationModal
                property={property}
                isVisible={changeLocationModal}
                onClose={() => setChangeLocationModal(false)}
                onSelect={(streetId, buildingId) => {
                    changePropertyLocation(streetId, buildingId);
                }}
            />

            <Prompt
                inputValidation={"any"}
                placeholder={strings.propertyDetails.writeDeleteToDelete}
                isVisible={deletePropertyPrompt}
                onClose={() => setDeletePropertyPrompt(false)}
                onConfirm={text => {
                    if (text === "Delete") {
                        propertyApis.deleteProperty(property.id).then(res => {
                            showToast(res.data.message);
                            navigateBack();
                        });
                    }
                }}
                title={strings.propertyDetails.deleteProperty}
            />
            <Prompt
                inputValidation={"number-only"}
                formatNumber
                placeholder={"$"}
                isVisible={moneyPrompt > MoneyAction.NONE}
                onClose={() => setMoneyPrompt(MoneyAction.NONE)}
                onConfirm={price => {
                    depositOrWithdrawMoney(moneyPrompt, price);
                    setMoneyPrompt(MoneyAction.NONE);
                }}
                title={
                    moneyPrompt === MoneyAction.DEPOSIT
                        ? strings.common.deposit
                        : strings.common.withdraw
                }
            />
            <Prompt
                isVisible={putOnSalePrompt}
                formatNumber
                inputValidation={isOnSale ? undefined : "number-only"}
                placeholder={strings.common.price}
                onClose={() => setPutOnSalePrompt(false)}
                onConfirm={val => {
                    setPutOnSalePrompt(false);
                    if (isOnSale) {
                        return removeFromSale();
                    }
                    putOnSale(val);
                }}
                title={
                    isOnSale
                        ? strings.propertyDetails.removeFromSale
                        : strings.propertyDetails.putOnSale
                }
                text={
                    isOnSale
                        ? strings.propertyDetails.removeFromSaleDetails
                        : strings.propertyDetails.putOnSaleDetails
                }
            />
            <SelectSliderValueModal
                isVisible={showSliderModal}
                onClose={() => setShowSliderModal(false)}
                onSelect={value => {
                    setUsageFee(value);
                }}
                title={strings.propertyDetails.setUsageFee}
                description={strings.propertyDetails.usageFeeDescription}
                value={property.usage_fee * 100}
            />
            <View style={{alignItems: "center"}}>
                <Avatar source={property?.user_img_url} size={72} />
                <AppText
                    text={property?.user_name}
                    type={TextTypes.H6}
                    style={{marginTop: gapSize.sizeM}}
                />
                <AppText
                    text={strings.propertyDetails.owner}
                    type={TextTypes.BodySmall}
                    color={colors.grey400}
                />
                {renderOnSale()}
            </View>
            {property.usage_fee > 0 && property.type == PropertyType.Garage && (
                <View
                    style={[commonStyles.flexRow, {marginTop: gapSize.sizeM}]}>
                    <AppText text={`${strings.propertyDetails.usageFee}: `} />
                    <AppText
                        preText={"%"}
                        text={renderNumber(property.usage_fee * 100)}
                        type={TextTypes.BodyBold}
                    />
                </View>
            )}
            {isOwner && (
                <View style={{marginTop: gapSize.sizeM, flex: 1}}>
                    <View style={commonStyles.flexRow}>
                        <AppText
                            text={`${strings.propertyDetails.maintenanceCost}: `}
                        />
                        <AppText
                            preText={"$"}
                            text={property.maintenance_cost}
                            type={TextTypes.BodyBold}
                        />
                    </View>
                    <View
                        style={[
                            commonStyles.flexRow,
                            {marginTop: gapSize.sizeM},
                        ]}>
                        <AppText
                            text={`${strings.propertyDetails.moneyInProperty}: `}
                        />
                        <AppText
                            preText={"$"}
                            formatNumberWithCommas
                            text={property.money}
                            type={TextTypes.BodyBold}
                        />
                    </View>
                    <View
                        style={{
                            position: "absolute",
                            bottom: 0,
                            width: "100%",
                            alignItems: "center",
                        }}>
                        {property.type == PropertyType.Garage && (
                            <AppButton
                                text={strings.propertyDetails.setUsageFee}
                                width={scaledValue(210)}
                                style={{marginBottom: gapSize.sizeL}}
                                onPress={() => setShowSliderModal(true)}
                            />
                        )}

                        {canWithdrawMoney && (
                            <AppButton
                                text={strings.common.withdraw + " $"}
                                width={scaledValue(210)}
                                style={{marginBottom: gapSize.sizeL}}
                                onPress={() =>
                                    setMoneyPrompt(MoneyAction.WITHDRAW)
                                }
                            />
                        )}
                        <AppButton
                            text={strings.common.deposit + " $"}
                            width={scaledValue(210)}
                            onPress={() => setMoneyPrompt(MoneyAction.DEPOSIT)}
                        />
                    </View>
                </View>
            )}
            {!isOwner && isOnSale && (
                <AppButton
                    style={{
                        position: "absolute",
                        bottom: 15,
                        alignSelf: "center",
                    }}
                    text={strings.propertyDetails.buyProperty}
                    width={scaledValue(210)}
                    onPress={buyPropertyFromUser}
                    promptTitle={strings.propertyDetails.buyPropertySure}
                />
            )}
        </View>
    );
};

export default PropertyInfo;
