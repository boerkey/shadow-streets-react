import React, {useState} from "react";
import {FlatList, TouchableOpacity, View} from "react-native";

import {useSelector} from "react-redux";

import {
    AppButton,
    AppImage,
    AppInput,
    AppModal,
    AppText,
    Divider,
} from "@components/index.ts";
import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {commonStyles, scaledValue, strings} from "@utils/index.ts";
import {RootState} from "@redux/index.ts";
import {propertyApis} from "@apis/index.ts";
import {showToast} from "@utils/helperFunctions.ts";
import useCooldownToRunFunction from "@hooks/useCooldownToRunFunction.ts";

interface BuyPropertyModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    locationB: number;
}

const BuyPropertyModal = ({
    isVisible,
    onClose,
    onSuccess,
    locationB,
}: BuyPropertyModalProps) => {
    const gameProperties = useSelector(
        (state: RootState) => state.game.gameProperties,
    );
    const [selectedProperty, setSelectedProperty] = useState({});
    const [showPropertyList, setShowPropertyList] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [propertyName, setPropertyName] = useState<string>("");

    const triggerWithCooldown = useCooldownToRunFunction(2000);

    const isPropertySelected = selectedProperty?.name;

    function renderPropertySelector() {
        return (
            <TouchableOpacity
                onPress={() => setShowPropertyList(prev => !prev)}
                style={[
                    commonStyles.flexRow,
                    {
                        paddingHorizontal: gapSize.sizeL,
                        borderBottomWidth: 1,
                        borderColor: colors.grey500,
                        backgroundColor: "#191717",
                        width: "100%",
                        height: scaledValue(51),
                        alignItems: "center",
                        flexDirection: "row",
                        marginVertical: gapSize.size2L,
                    },
                ]}>
                <AppImage
                    key={1}
                    source={
                        isPropertySelected
                            ? images.icons.propertyType[selectedProperty.type]
                            : images.icons.search
                    }
                    style={{
                        width: isPropertySelected ? 31 : 15,
                        height: isPropertySelected ? 31 : 15,
                        marginRight: gapSize.sizeL,
                    }}
                />
                <AppText
                    text={
                        selectedProperty?.name ??
                        strings.propertyModal.chooseProperty
                    }
                    type={isPropertySelected ? TextTypes.H6 : TextTypes.Body}
                    color={isPropertySelected ? colors.white : colors.grey500}
                />
                {showPropertyList ||
                    (isPropertySelected && (
                        <TouchableOpacity
                            onPress={() => {
                                setShowPropertyList(false);
                                setSelectedProperty({});
                            }}
                            style={{position: "absolute", right: gapSize.sizeL}}
                            hitSlop={commonStyles.hitSlop}>
                            <AppText
                                text={"X"}
                                type={TextTypes.H6}
                                fontSize={20}
                                color={colors.grey500}
                            />
                        </TouchableOpacity>
                    ))}
            </TouchableOpacity>
        );
    }

    function renderPropertyList() {
        if (showPropertyList) {
            return (
                <FlatList
                    data={gameProperties}
                    renderItem={({item}) => {
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedProperty(item);
                                    setShowPropertyList(false);
                                }}
                                style={commonStyles.flexRowAlignCenter}>
                                <AppImage
                                    source={
                                        images.icons.propertyType[item.type]
                                    }
                                    size={48}
                                />
                                <AppText
                                    text={item.name}
                                    style={{marginLeft: gapSize.sizeM}}
                                    type={TextTypes.H6}
                                />
                            </TouchableOpacity>
                        );
                    }}
                    style={{
                        zIndex: 1,
                        marginBottom: gapSize.sizeL,
                    }}
                    ItemSeparatorComponent={() => <Divider width={"100%"} />}
                />
            );
        }
    }

    function renderPropertyNameInput() {
        if (isPropertySelected) {
            return (
                <AppInput
                    onChangeText={setPropertyName}
                    label={strings.propertyModal.propertyName}
                    placeholder={strings.propertyModal.enterName}
                    width={"100%"}
                    maxLength={12}
                />
            );
        }
    }

    function renderPropertyInfo() {
        if (isPropertySelected) {
            return (
                <View style={{marginTop: gapSize.size2L, alignItems: "center"}}>
                    <AppText text={selectedProperty?.description} centered />
                    <View
                        style={[
                            commonStyles.flexRow,
                            {
                                marginTop: gapSize.size2L,
                            },
                        ]}>
                        <View style={[commonStyles.flexRow]}>
                            <AppImage
                                source={images.icons.money}
                                size={39}
                                style={{
                                    bottom: gapSize.sizeM,
                                    marginRight: gapSize.sizeM,
                                }}
                            />
                            <AppText
                                preText={"$"}
                                formatNumberWithCommas
                                text={selectedProperty.price}
                                type={TextTypes.BodyBold}
                                fontSize={18}
                            />
                        </View>
                    </View>
                </View>
            );
        }
    }

    function buyProperty() {
        setLoading(true);
        propertyApis
            .buyProperty(selectedProperty.id, locationB, propertyName)
            .then(res => {
                setTimeout(() => showToast(res.data.message), 500);
                onClose();
                onSuccess();
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            });
    }

    return (
        <AppModal isVisible={isVisible} onClose={onClose}>
            <View
                style={{
                    width: scaledValue(345),
                    minHeight: scaledValue(300),
                    maxHeight: scaledValue(750),
                    backgroundColor: "black",
                    padding: gapSize.size3L,
                    borderWidth: 1,
                    borderColor: colors.secondary500,
                }}>
                <AppText
                    text={strings.propertyModal.buyProperty}
                    type={TextTypes.TitleSmall}
                    centered
                />
                {renderPropertySelector()}
                {renderPropertyList()}
                {renderPropertyNameInput()}
                {renderPropertyInfo()}
                <View
                    style={[
                        commonStyles.flexRowSpaceBetween,
                        {marginTop: gapSize.size6L},
                    ]}>
                    <AppButton
                        onPress={onClose}
                        text={strings.common.cancel}
                        type={"redSmall"}
                        width={130}
                    />
                    <AppButton
                        onPress={() => {
                            triggerWithCooldown(() => {
                                buyProperty();
                            });
                        }}
                        loading={loading}
                        disabled={!isPropertySelected || !propertyName}
                        text={strings.common.buy}
                        width={130}
                    />
                </View>
            </View>
        </AppModal>
    );
};

export default BuyPropertyModal;
