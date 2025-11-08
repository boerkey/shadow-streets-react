import React, {useState} from "react";
import {View} from "react-native";

import {useSelector} from "react-redux";

import {colors, gapSize, images} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {
    AppButton,
    AppImage,
    AppModal,
    AppText,
    TooltipDropdown,
} from "@components/index.ts";
import {UserProperty} from "@interfaces/PropertyInterface";
import {RootState} from "@redux/index";
import {SCREEN_WIDTH, strings} from "@utils/index";

const ChangeLocationModal = ({
    property,
    isVisible,
    onClose,
    onSelect,
}: {
    property: UserProperty;
    isVisible: boolean;
    onClose: () => void;
    onSelect: (streetId: number, buildingId: number) => void;
}) => {
    const gameConfig = useSelector((state: RootState) => state.game.gameConfig);
    const user = useSelector((state: RootState) => state.auth.user);
    const gameStreets = useSelector(
        (state: RootState) => state.game.gameStreets,
    );
    const [selectedStreet, setSelectedStreet] = useState({
        id: 0,
        name: strings.propertyDetails.chooseNewLocation,
    });
    const [selectedBuilding, setSelectedBuilding] = useState({
        id: 0,
        name: strings.propertyDetails.chooseNewBuilding,
    });
    
    return (
        <AppModal isVisible={isVisible} onClose={onClose}>
            <View
                style={{
                    width: SCREEN_WIDTH * 0.8,
                    backgroundColor: colors.black,
                    borderWidth: 1,
                    borderColor: colors.secondary500,
                    borderRadius: 2,
                    padding: gapSize.sizeL,
                    alignItems: "center",
                }}>
                <AppText
                    text={strings.propertyDetails.changeLocation}
                    type={TextTypes.H2}
                />
                <TooltipDropdown
                    paddingHorizontal={0}
                    onSelect={(index, item) => {
                        setSelectedStreet(item);
                    }}
                    options={gameStreets
                        .filter(
                            street =>
                                street.location_x !== property.location_x ||
                                street.location_y !== property.location_y,
                        )
                        .map(street => ({
                            name: street.name,
                            id: street.id,
                        }))}>
                    <View
                        style={{
                            width: SCREEN_WIDTH * 0.65,
                            height: 40,
                            borderWidth: 1,
                            borderColor:
                                selectedStreet.id === 0
                                    ? colors.secondary500
                                    : colors.green,
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: gapSize.sizeL,
                        }}>
                        <AppText
                            text={selectedStreet.name}
                            type={TextTypes.Body}
                        />
                    </View>
                </TooltipDropdown>
                <TooltipDropdown
                    paddingHorizontal={0}
                    onSelect={(index, item) => {
                        setSelectedBuilding(item);
                    }}
                    dropdownWidth={200}
                    maxHeight={200}
                    options={[1, 2, 3, 4, 5, 6, 7].map(item => ({
                        name: "Building " + item.toString(),
                        id: item,
                    }))}>
                    <View
                        style={{
                            width: SCREEN_WIDTH * 0.65,
                            height: 40,
                            borderWidth: 1,
                            borderColor:
                                selectedBuilding.id === 0
                                    ? colors.secondary500
                                    : colors.green,
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: gapSize.sizeL,
                        }}>
                        <AppText
                            text={selectedBuilding.name}
                            type={TextTypes.Body}
                        />
                    </View>
                </TooltipDropdown>
                <View
                    style={{
                        width: SCREEN_WIDTH * 0.65,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginVertical: gapSize.sizeL,
                    }}>
                    <AppText
                        text={strings.propertyDetails.changeLocationCost.replace(
                            "{cost}",
                            gameConfig?.change_property_location_cost,
                        )}
                        type={TextTypes.BodyBold}
                        color={colors.red}
                    />
                    <AppImage
                        source={images.icons.shadowCoin}
                        size={20}
                        style={{marginLeft: gapSize.sizeS}}
                    />
                </View>
                <AppButton
                    disabled={
                        selectedStreet.id === 0 || selectedBuilding.id === 0
                    }
                    text={strings.common.change}
                    onPress={() => {
                        onSelect(selectedStreet.id, selectedBuilding.id);
                    }}
                />
            </View>
        </AppModal>
    );
};

export default ChangeLocationModal;
