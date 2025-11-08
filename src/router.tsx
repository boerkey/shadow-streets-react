import React from "react";
import {Platform} from "react-native";

import {createDrawerNavigator} from "@react-navigation/drawer";
import {
    NavigationContainer,
    createNavigationContainerRef,
} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

import Blackjack from "@screens/property_details/Casino/Blackjack.tsx";
import {SCREEN_WIDTH} from "@utils/index.ts";
import {
    Announcements,
    Auth,
    Boosts,
    BuyShadowCoin,
    Character,
    Chat,
    ConfinedPeople,
    Cosmetics,
    Districts,
    Drawer as DrawerScreen, // Custom Drawer
    EditProfile,
    Encounters,
    Faq,
    Fights,
    Gangs,
    GroupFight,
    GuardDetails,
    Guards,
    Home,
    Inventory,
    ItemList,
    Jobs,
    ModerationPanel,
    PartyDetails,
    PlayerProfile,
    Property,
    PropertyDetails,
    Rankings,
    SelectClass,
    Settings,
    Splash,
    Support,
    UpgradeItem,
} from "./screens";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export const navigationRef = createNavigationContainerRef();
export function navigate(name: string, params = {}) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    }
}

export function navigateBack() {
    if (navigationRef.canGoBack()) {
        navigationRef.goBack();
    }
}

export const SCREEN_NAMES = {
    SPLASH: "SPLASH",
    ANNOUNCEMENTS: "ANNOUNCEMENTS",
    JOBS: "JOBS",
    SELECT_CLASS: "SELECT_CLASS",
    INVENTORY: "INVENTORY",
    AUTH: "AUTH",
    HOME: "HOME",
    HOME_MAIN: "HOME_MAIN",
    CHAT: "CHAT",
    EDIT_PROFILE: "EDIT_PROFILE",
    PROPERTY: "PROPERTY",
    PROPERTY_DETAILS: "PROPERTY_DETAILS",
    ENCOUNTERS: "ENCOUNTERS",
    GANGS: "GANGS",
    SETTINGS: "SETTINGS",
    CONFINED_PEOPLE: "CONFINED_PEOPLE",
    RANKING: "RANKING",
    PLAYER_PROFILE: "PLAYER_PROFILE",
    PARTY_DETAILS: "PARTY_DETAILS",
    DISTRICTS: "DISTRICTS",
    CHARACTER: "CHARACTER",
    BLACKJACK: "BLACKJACK",
    FIGHTS: "FIGHTS",
    BOOSTS: "BOOSTS",
    UPGRADE_ITEM: "UPGRADE_ITEM",
    SUPPORT: "SUPPORT",
    MODERATION_PANEL: "MODERATION_PANEL",
    FAQ: "FAQ",
    BUY_SHADOW_COIN: "BUY_SHADOW_COIN",
    COSMETICS: "COSMETICS",
    ITEM_LIST: "ITEM_LIST",
    GUARDS: "GUARDS",
    GUARD_DETAILS: "GUARD_DETAILS",
    GROUP_FIGHT: "GROUP_FIGHT",
};

// Drawer Navigation only for HomeScreen with a custom DrawerScreen
function HomeDrawer() {
    return (
        <Drawer.Navigator
            drawerContent={props => <DrawerScreen {...props} />} // Custom drawer content
            screenOptions={{
                headerShown: false,
                drawerType: "front",
                overlayColor: "transparent",

                drawerStyle: {
                    width: SCREEN_WIDTH * 0.5, // Set the drawer width here
                    backgroundColor: "transparent",
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                },
            }}>
            <Drawer.Screen name={SCREEN_NAMES.HOME_MAIN} component={Home} />
        </Drawer.Navigator>
    );
}

export default function Router() {
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                initialRouteName={SCREEN_NAMES.SPLASH}
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: true,
                    animation: Platform.OS === "android" ? "none" : "default",
                }}>
                <Stack.Screen name={SCREEN_NAMES.SPLASH} component={Splash} />
                <Stack.Screen
                    name={SCREEN_NAMES.ANNOUNCEMENTS}
                    component={Announcements}
                />
                <Stack.Screen name={SCREEN_NAMES.JOBS} component={Jobs} />
                <Stack.Screen
                    name={SCREEN_NAMES.SELECT_CLASS}
                    component={SelectClass}
                />
                <Stack.Screen
                    name={SCREEN_NAMES.INVENTORY}
                    component={Inventory}
                />
                <Stack.Screen name={SCREEN_NAMES.AUTH} component={Auth} />
                {/* Home now includes the drawer */}
                <Stack.Screen name={SCREEN_NAMES.HOME} component={HomeDrawer} />
                <Stack.Screen name={SCREEN_NAMES.CHAT} component={Chat} />
                <Stack.Screen
                    name={SCREEN_NAMES.EDIT_PROFILE}
                    component={EditProfile}
                />
                <Stack.Screen
                    name={SCREEN_NAMES.PROPERTY}
                    component={Property}
                />
                <Stack.Screen
                    name={SCREEN_NAMES.PROPERTY_DETAILS}
                    component={PropertyDetails}
                />
                <Stack.Screen
                    name={SCREEN_NAMES.ENCOUNTERS}
                    component={Encounters}
                />
                <Stack.Screen name={SCREEN_NAMES.GANGS} component={Gangs} />
                <Stack.Screen
                    name={SCREEN_NAMES.SETTINGS}
                    component={Settings}
                />
                <Stack.Screen
                    name={SCREEN_NAMES.CONFINED_PEOPLE}
                    component={ConfinedPeople}
                />
                <Stack.Screen
                    name={SCREEN_NAMES.PLAYER_PROFILE}
                    component={PlayerProfile}
                />
                <Stack.Screen
                    name={SCREEN_NAMES.PARTY_DETAILS}
                    component={PartyDetails}
                />
                <Stack.Screen
                    name={SCREEN_NAMES.DISTRICTS}
                    component={Districts}
                />
                <Stack.Screen
                    name={SCREEN_NAMES.CHARACTER}
                    component={Character}
                />
                <Stack.Screen
                    name={SCREEN_NAMES.RANKING}
                    component={Rankings}
                />
                <Stack.Screen
                    name={SCREEN_NAMES.BLACKJACK}
                    component={Blackjack}
                />
                <Stack.Screen name={SCREEN_NAMES.FIGHTS} component={Fights} />
                <Stack.Screen name={SCREEN_NAMES.BOOSTS} component={Boosts} />
                <Stack.Screen
                    name={SCREEN_NAMES.UPGRADE_ITEM}
                    component={UpgradeItem}
                />
                <Stack.Screen name={SCREEN_NAMES.SUPPORT} component={Support} />
                <Stack.Screen
                    name={SCREEN_NAMES.MODERATION_PANEL}
                    component={ModerationPanel}
                />
                <Stack.Screen name={SCREEN_NAMES.FAQ} component={Faq} />
                <Stack.Screen
                    name={SCREEN_NAMES.BUY_SHADOW_COIN}
                    component={BuyShadowCoin}
                />
                <Stack.Screen
                    name={SCREEN_NAMES.COSMETICS}
                    component={Cosmetics}
                />
                <Stack.Screen
                    name={SCREEN_NAMES.ITEM_LIST}
                    component={ItemList}
                />
                <Stack.Screen name={SCREEN_NAMES.GUARDS} component={Guards} />
                <Stack.Screen
                    name={SCREEN_NAMES.GUARD_DETAILS}
                    component={GuardDetails}
                />
                <Stack.Screen
                    name={SCREEN_NAMES.GROUP_FIGHT}
                    component={GroupFight}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
