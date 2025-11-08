import React, {useState} from "react";
import {
    FlatList,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import {useRoute} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";

import InnerContainer from "@components/InnerContainer";
import ScreenContainer from "@components/ScreenContainer";
import TitleHeader from "@components/TitleHeader";

import {itemApis} from "@apis/index";
import {colors, gapSize} from "@assets/index";
import AppImage from "@components/AppImage";
import {TextTypes} from "@components/AppText";
import {AppText} from "@components/index";
import {authActions} from "@redux/actions";
import {RootState} from "@redux/index";
import {commonStyles, scaledValue, strings} from "@utils/index.ts";
import {getItemImage} from "@utils/itemHelpers";

import {ItemType} from "@interfaces/GameInterface";

import CustomProgressBarUpgradeCircle from "./CustomProgressBarUpgradeCircle";
import SelectedItemView from "./SelectedItemView";

const UpgradeItem = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const userLoading = useSelector(
        (state: RootState) => state.auth.userLoading,
    );
    const {params} = useRoute();
    const {item} = params || {};

    const [selectedItem, setSelectedItem] = useState<any>(item);
    const [triggerUpgrade, setTriggerUpgrade] = useState(false);
    const [upgradeResult, setUpgradeResult] = useState<null | boolean>(null);
    const [upgradeMessage, setUpgradeMessage] = useState<string>("");
    const [isButtonLoading, setIsButtonLoading] = useState(false);

    // Function to generate a unique ID from item type and ID
    function getItemUniqueId(item: any): string {
        if (!item) return "";
        return `${item.type}_${item.id}`;
    }

    function getUpgradableItems() {
        const upgradableItems = [
            ...user?.items_weapons,
            ...user?.items_armors,
            ...user?.items_helmets,
        ];
        return upgradableItems;
    }

    const handleUpgradeAnimation = () => {
        // Start the animation and clear any previous results
        setTriggerUpgrade(true);
        setUpgradeResult(null);
        setUpgradeMessage("...");
    };

    function upgradeItem(useSafety: boolean) {
        // Set button to loading state immediately
        setIsButtonLoading(true);

        // First make the API call
        itemApis
            .upgradeItem(selectedItem.id, selectedItem.type, useSafety)
            .then(res => {
                // This is an actual upgrade attempt, start the animation
                handleUpgradeAnimation();
                setTimeout(() => {
                    setUpgradeResult(res.data.success);
                    setUpgradeMessage(res.data.message);
                    setSelectedItem(res.data.updated_item);
                    dispatch(authActions.getUser());
                }, 1500);
            })
            .catch(err => {
                setIsButtonLoading(false);
            });
    }

    function handleUpgradeFinished() {
        // Clean up after animation completes
        setTriggerUpgrade(false);
        setUpgradeResult(null);
        setUpgradeMessage("");
        setIsButtonLoading(false);
    }

    const _renderUpgradableItem = ({item, index}) => {
        const isSelected =
            selectedItem?.id === item?.id && selectedItem?.type === item?.type;
        return (
            <TouchableOpacity
                onPress={() => {
                    setSelectedItem(isSelected ? null : item);
                }}
                style={{
                    width: scaledValue(80),
                    height: scaledValue(80),
                    borderRadius: scaledValue(85 / 2),
                    marginHorizontal: gapSize.sizeM,
                    borderWidth: 1,
                    borderColor: isSelected
                        ? colors.green
                        : colors.secondary500,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: -2,
                }}>
                <AppImage
                    source={getItemImage(item)}
                    size={55}
                    style={styles.itemImage}
                />
            </TouchableOpacity>
        );
    };

    return (
        <ScreenContainer>
            <InnerContainer>
                <TitleHeader
                    title={strings.upgradeItem.title}
                    money={user.money}
                />

                <View style={[commonStyles.alignItemsCenter]}>
                    <View
                        style={{
                            width: "100%",
                            height: scaledValue(85),
                            marginTop: gapSize.sizeL,
                            marginBottom:
                                Platform.OS === "ios"
                                    ? gapSize.size2L
                                    : gapSize.sizeL,
                        }}>
                        <FlatList
                            horizontal
                            data={getUpgradableItems()}
                            renderItem={_renderUpgradableItem}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={item => getItemUniqueId(item)}
                        />
                    </View>
                    <View style={styles.circleContainer}>
                        <AppText
                            text={selectedItem?.name}
                            type={TextTypes.H2}
                            style={{marginBottom: gapSize.sizeL}}
                            centered
                        />
                        <CustomProgressBarUpgradeCircle
                            size={
                                Platform.OS === "ios"
                                    ? scaledValue(180)
                                    : scaledValue(170)
                            }
                            strokeWidth={6}
                            unfilledColor={colors.secondaryTwo500}
                            triggerUpgrade={triggerUpgrade}
                            upgradeResult={upgradeResult}
                            onUpgradeFinished={handleUpgradeFinished}>
                            <AppImage
                                source={getItemImage(selectedItem)}
                                size={90}
                                style={styles.itemImage}
                            />
                            {!userLoading && selectedItem && (
                                <AppText
                                    text={`+${selectedItem.grade}`}
                                    type={TextTypes.H1}
                                    style={{
                                        position: "absolute",
                                        bottom: scaledValue(25),
                                        right: scaledValue(25),
                                    }}
                                    fontSize={45}
                                    centered
                                />
                            )}
                        </CustomProgressBarUpgradeCircle>
                    </View>
                    <AppText
                        text={`${upgradeMessage}`}
                        type={TextTypes.BodyBold}
                        fontSize={12}
                        centered
                        color={
                            upgradeResult === null
                                ? colors.white
                                : upgradeResult === true
                                ? colors.green
                                : colors.red
                        }
                        style={{
                            marginVertical:
                                Platform.OS === "ios"
                                    ? gapSize.sizeL
                                    : gapSize.sizeM,
                        }}
                    />
                    {selectedItem && (
                        <SelectedItemView
                            item={selectedItem}
                            onUpgrade={upgradeItem}
                            isUpgrading={isButtonLoading}
                        />
                    )}
                </View>
            </InnerContainer>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    circleContainer: {
        shadowColor: colors.orange,
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
        width: "80%",
        alignItems: "center",
    },
    itemImage: {
        transform: [{scale: 1.05}],
    },
    upgradeButton: {
        backgroundColor: colors.orange,
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 8,
        marginTop: 20,
    },
    disabledButton: {
        opacity: 0.6,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    resultText: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 10,
        textAlign: "center",
    },
    warningText: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.orange,
        marginTop: 10,
        marginBottom: 10,
        textAlign: "center",
    },
});

export default UpgradeItem;
