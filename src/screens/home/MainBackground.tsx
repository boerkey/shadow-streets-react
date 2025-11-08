import React, {useEffect, useState} from "react";
import {
    Image,
    ImageBackground,
    Platform,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from "react-native";

import {
    DrawerActions,
    useIsFocused,
    useNavigation,
} from "@react-navigation/native";
import {useCopilot} from "react-native-copilot";
import {NotificationWillDisplayEvent} from "react-native-onesignal";
import {useDispatch, useSelector} from "react-redux";

import {authApis} from "@apis/index.ts";
import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {
    AccessBlockedModal,
    AppImage,
    AppText,
    BottomBar,
    CopilotContainer,
    Header,
} from "@components/index.ts";
import {useNotificationInitializingModule} from "@hooks/useNotificationInitializingModule";
import {GameStreet} from "@interfaces/GameInterface";
import {GroupFight} from "@interfaces/GroupFight.ts";
import {authActions, groupFightActions} from "@redux/actions/index.ts";
import {RootState} from "@redux/index.ts";
import QuestsModal from "@screens/home/quest/QuestModal.tsx";
import {
    getAsyncAndTriggerIfNotExists,
    saveAsyncWithoutValue,
    showToast,
} from "@utils/helperFunctions.ts";
import {commonStyles, scaledValue, strings} from "@utils/index.ts";
import {ONE_SIGNAL_APP_ID} from "constants/keys.ts";
import {navigate, SCREEN_NAMES} from "../../router.tsx";

type BuildingIndexKey = "1" | "2" | "3" | "4" | "5" | "6" | "7";
const copilotHomeKey = "@copilotHomeKey";

const MainBackground = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const notificationModule = useNotificationInitializingModule();
    const copilot = useCopilot();
    const activeFightsInCurrentDistrict = useSelector(
        (state: RootState) => state.groupFight.activeFightsInCurrentDistrict,
    );
    console.log("activeFightsInCurrentDistrict", activeFightsInCurrentDistrict);
    const user = useSelector((state: RootState) => state.auth.user);
    const gameStreets = useSelector(
        (state: RootState) => state.game.gameStreets,
    );

    const [showAuthWarningModal, setShowAuthWarningModal] = useState(false);
    const [showQuestModal, setShowQuestModal] = useState(false);

    const canClaimQuestReward = user?.can_claim_quest_reward;
    const activeFightInStreet = activeFightsInCurrentDistrict?.find(
        (each: GroupFight) =>
            each.location_x === user.location_x &&
            each.location_y === user.location_y &&
            each.location_b === 0 &&
            each.property_id === 0,
    );
    console.log("activeFightInStreet", activeFightInStreet);

    useEffect(() => {
        const shouldShowWarning =
            user.class > 0 && user.auth.is_registered === false;

        setShowAuthWarningModal(shouldShowWarning);
    }, [user.class]);

    useEffect(() => {
        if (user.level >= 4) {
            initNotification();
        }
        return () => {};
    }, [user.level]);

    useEffect(() => {
        if (isFocused) {
            dispatch(groupFightActions.getActiveFightsInCurrentDistrict());
            dispatch(authActions.getUser());
        }
    }, [isFocused]);

    useEffect(() => {
        // Only setup notification listeners if notifications are initialized
        if (!notificationModule.isInitialized()) {
            return () => {};
        }

        const handleForegroundNotification = (
            event: NotificationWillDisplayEvent,
        ) => {
            // Prevent OneSignal's default display
            event.preventDefault();

            // Show your custom toast
            const {title, body} = event.notification;
            showToast(title || "Notification", body || "");
        };

        try {
            notificationModule.addEventListener(
                "foregroundWillDisplay",
                handleForegroundNotification,
            );
        } catch (error) {}

        // Cleanup: Remove the listener when the component unmounts
        return () => {
            try {
                notificationModule.removeEventListener(
                    "foregroundWillDisplay",
                    handleForegroundNotification,
                );
            } catch (error) {}
        };
    }, [notificationModule]);

    async function initNotification() {
        try {
            // Initialize OneSignal with your app ID
            notificationModule.initialize(ONE_SIGNAL_APP_ID);

            // Wait a moment to ensure initialization completes
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (!notificationModule.isInitialized()) {
                console.error("OneSignal failed to initialize properly");
                return;
            }

            // Request notification permission
            const hasPermission = await notificationModule.requestPermission();
            if (hasPermission) {
                // Get device state and store it if needed
                const deviceState = await notificationModule.getDeviceState();
                const deviceId = await deviceState.getIdAsync();
                authApis.savePushNotificationID(deviceId);
            } else {
            }
        } catch (error) {
            console.error("Error in initNotification:", error);
        }
    }

    // Define the handler for the 'stop' event
    const handleCopilotStop = () => {
        saveAsyncWithoutValue(copilotHomeKey);
    };

    // Effect to manage the Copilot event listener lifecycle
    useEffect(() => {
        dispatch(authActions.saveUserMarketingInfo());
        // Register the listener when the component mounts or copilot changes
        copilot.copilotEvents.on("stop", handleCopilotStop);

        // Return a cleanup function to remove the listener when the component unmounts
        return () => {
            copilot.copilotEvents.off("stop", handleCopilotStop);
        };
    }, [copilot]); // Dependency array ensures this runs if copilot instance changes

    // Function to start the Copilot tour
    function startCopilot() {
        // No need to register the listener here anymore
        getAsyncAndTriggerIfNotExists(copilotHomeKey, () => {
            setTimeout(() => {
                copilot.start();
            }, 750);
        });
    }

    function getStylesForOS(i: number): ViewStyle {
        switch (i) {
            case 1:
                return {
                    top: Platform.OS === "ios" ? "-3%" : "-8%",
                };
            case 2:
                return {
                    top: Platform.OS === "ios" ? "10%" : "6%",
                };
            case 3:
                return {
                    top: Platform.OS === "ios" ? "-2%" : "-7%",
                };
            case 4:
                return {
                    top: Platform.OS === "ios" ? "10%" : "5%",
                };
            case 5:
                return {
                    top: Platform.OS === "ios" ? "-2%" : "-8%",
                };
            case 6:
                return {
                    top: Platform.OS === "ios" ? "10%" : "6%",
                };
            case 7:
                return {
                    top: Platform.OS === "ios" ? "-2%" : "-8%",
                };
            default:
                return {position: "relative"};
        }
    }
    function getBuildingLocations(i: number): ViewStyle {
        switch (i) {
            case 1: {
                return {
                    position: "absolute",
                    left: scaledValue(-65),
                    zIndex: 1,
                    ...getStylesForOS(i),
                };
            }
            case 2: {
                return {
                    position: "absolute",
                    left: scaledValue(-75),
                    ...getStylesForOS(i),
                };
            }
            case 3: {
                return {
                    position: "absolute",
                    right: scaledValue(-75),
                    ...getStylesForOS(i),
                    zIndex: 1,
                };
            }
            case 4: {
                return {
                    position: "absolute",
                    right: scaledValue(-75),
                    ...getStylesForOS(i),
                };
            }
            case 5: {
                return {
                    position: "absolute",
                    left: scaledValue(-75),
                    bottom: "26%",
                    zIndex: 1,
                };
            }
            case 6: {
                return {
                    position: "absolute",
                    left: scaledValue(-75),
                    bottom: "12%",
                };
            }
            case 7: {
                return {
                    position: "absolute",
                    right: scaledValue(-85),
                    bottom: "15%",
                };
            }
            default:
                return {position: "relative"};
        }
    }

    function navigateWithParams(locationB: number) {
        navigate(SCREEN_NAMES.PROPERTY, {locationB});
    }

    function getMyStreetName() {
        const myStreet = gameStreets.find(
            (each: GameStreet) =>
                each.location_x === user.location_x &&
                each.location_y === user.location_y,
        );
        if (myStreet) {
            return myStreet.name;
        }
        return "";
    }

    return (
        <ImageBackground
            onLayout={startCopilot}
            source={images.backgrounds.mainBackground}
            style={{flex: 1}}>
            <Header showStats={true} allowRefresh={true} />
            <AccessBlockedModal
                isVisible={showAuthWarningModal}
                onClose={() => setShowAuthWarningModal(false)}
            />
            <QuestsModal
                isVisible={showQuestModal}
                onClose={() => setShowQuestModal(false)}
            />
            {[1, 2, 3, 4, 5, 6, 7].map(buildingIndex => (
                <TouchableOpacity
                    key={buildingIndex}
                    onPress={() => navigateWithParams(buildingIndex)}
                    style={[
                        getBuildingLocations(buildingIndex),
                        styles.touchableBuildingStyle,
                    ]}>
                    <Image
                        source={
                            images.buildings[
                                String(buildingIndex) as BuildingIndexKey
                            ]?.["1"] ?? images.icons.backArrow
                        }
                        style={styles.eachBuilding}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            ))}
            <CopilotContainer
                uniqueId={"home-1"}
                text={strings.copilot.home[1]}
                containerStyle={{
                    position: "absolute",
                    top: "47.5%",
                    alignSelf: "center",
                }}
                orderNumber={1}>
                <TouchableOpacity
                    hitSlop={commonStyles.bigHitSlop}
                    onPress={() => {
                        if (activeFightInStreet) {
                            return navigate(SCREEN_NAMES.GROUP_FIGHT, {
                                fightId: activeFightInStreet.id,
                            });
                        }
                        navigate(SCREEN_NAMES.DISTRICTS);
                    }}
                    style={[
                        commonStyles.flexRowAlignCenter,
                        {marginLeft: gapSize.sizeM, zIndex: 3},
                    ]}>
                    <AppText
                        text={getMyStreetName()}
                        type={TextTypes.H2}
                        color={
                            activeFightInStreet ? colors.orange : colors.white
                        }
                    />
                    {activeFightInStreet && (
                        <AppImage
                            source={images.icons.fightVs}
                            size={25}
                            style={{marginLeft: gapSize.sizeS}}
                        />
                    )}
                </TouchableOpacity>
            </CopilotContainer>
            <CopilotContainer
                uniqueId={"home-3"}
                text={strings.copilot.home[3]}
                containerStyle={{
                    position: "absolute",
                    left: -5,
                    top: "46%",
                    zIndex: 4,
                }}
                orderNumber={3}>
                <AppImage
                    onPress={() =>
                        navigation.dispatch(DrawerActions.openDrawer())
                    }
                    source={images.icons.drawer}
                    hitSlop={commonStyles.bigHitSlop}
                    size={60}
                />
            </CopilotContainer>
            <CopilotContainer
                uniqueId={"home-2"}
                text={strings.copilot.home[2]}
                containerStyle={{
                    position: "absolute",
                    right: -5,
                    top: "46%",
                    zIndex: 4,
                }}
                orderNumber={2}>
                <TouchableOpacity onPress={() => setShowQuestModal(true)}>
                    <AppImage
                        source={images.icons.quest}
                        hitSlop={commonStyles.bigHitSlop}
                        size={60}
                    />
                    {canClaimQuestReward && (
                        <AppImage
                            source={images.icons.greenDot}
                            size={8}
                            style={{
                                position: "absolute",
                                right: "20%",
                                top: "30%",
                            }}
                        />
                    )}
                </TouchableOpacity>
            </CopilotContainer>
            <BottomBar />
        </ImageBackground>
    );
};

export default MainBackground;

const styles = StyleSheet.create({
    touchableBuildingStyle: {
        width: scaledValue(256),
        height: scaledValue(256),
    },
    eachBuilding: {
        width: "100%",
        height: "100%",
    },
});
