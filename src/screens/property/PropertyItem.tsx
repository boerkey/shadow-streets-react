import React from "react";
import {ImageBackground, TouchableOpacity, View} from "react-native";

import {useSelector} from "react-redux";

import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {AppText, LabelText} from "@components/index.ts";
import {PropertyStatus, PropertyType} from "@interfaces/GameInterface.ts";
import {UserProperty} from "@interfaces/PropertyInterface.ts";
import {RootState} from "@redux/index.ts";
import {getDarkBackground, getStreetName} from "@utils/helperFunctions.ts";
import {commonStyles, scaledValue, strings} from "@utils/index.ts";
import {navigate, SCREEN_NAMES} from "../../router.tsx";

const PropertyItem = ({
    item,
    showStreetName = false,
}: {
    item: UserProperty;
    showStreetName?: boolean;
}) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const isMyPlace = user.id === item.user_id;
    const isOnSale = item.sale_price > 0;
    const isClosed = item.status === PropertyStatus.Passive;
    const gameStreets = useSelector(
        (state: RootState) => state.game.gameStreets,
    );
    const streetName = getStreetName(gameStreets, item);

    function getBackgroundImage() {
        switch (item.type) {
            case PropertyType.Flat:
                return images.backgrounds.propertyFlat;
            case PropertyType.Casino:
                return images.backgrounds.propertyCasino;
            case PropertyType.WeaponDealer:
                return images.backgrounds.propertyWeaponDealer;
            case PropertyType.Production:
                return images.backgrounds.propertyProductionSite;
            case PropertyType.Garage:
                return images.backgrounds.propertyGarage;
        }
        return images.backgrounds.propertyShop;
    }

    return (
        <TouchableOpacity
            onPress={() => {
                navigate(SCREEN_NAMES.PROPERTY_DETAILS, {
                    id: item.id,
                });
            }}>
            <ImageBackground
                source={getBackgroundImage()}
                resizeMode={"cover"}
                style={{
                    borderWidth: 1,
                    borderColor: isMyPlace ? colors.green : colors.borderColor,
                    marginBottom: gapSize.sizeM,
                    opacity: isClosed ? 0.6 : 1,
                }}>
                {(isOnSale || isClosed) && (
                    <LabelText
                        width={isClosed ? 115 : 73}
                        labelColor={"red"}
                        style={{
                            position: "absolute",
                            left: gapSize.sizeS,
                            top: isMyPlace ? gapSize.size6L : gapSize.sizeS,
                        }}
                        text={
                            isClosed
                                ? strings.propertyDetails.maintenance
                                : strings.common.onSale
                        }
                    />
                )}
                {isMyPlace && (
                    <LabelText
                        labelColor={"green"}
                        style={{
                            position: "absolute",
                            left: gapSize.sizeS,
                            top: gapSize.sizeS,
                        }}
                        text={strings.common.owned}
                    />
                )}
                {isOnSale && (
                    <LabelText
                        labelColor={"red"}
                        style={{
                            position: "absolute",
                            left: gapSize.sizeS,
                            top: gapSize.sizeS,
                        }}
                        text={strings.common.onSale}
                    />
                )}
                <View
                    style={{
                        padding: 8,
                        width: "100%",
                        height: scaledValue(88),
                        backgroundColor: getDarkBackground(2),
                    }}>
                    <View style={commonStyles.flexRowSpaceBetween}>
                        <View style={commonStyles.flexRow}>
                            <AppText text={""} type={TextTypes.BodySmall} />
                        </View>
                        <View style={{alignItems: "flex-end"}}>
                            <AppText
                                text={
                                    strings.common.propertyTypeNames[item.type]
                                }
                            />
                            {showStreetName && <AppText text={streetName} />}
                        </View>
                    </View>
                    <AppText
                        type={TextTypes.H5}
                        text={item.name}
                        style={{
                            position: "absolute",
                            alignSelf: "center",
                            top: "48%",
                        }}
                    />
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
};
export default PropertyItem;
