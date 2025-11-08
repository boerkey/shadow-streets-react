import React, {useEffect} from "react";
import {ActivityIndicator, SafeAreaView} from "react-native";

import {useDispatch} from "react-redux";

import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from "react-native-device-info";

import {colors, images} from "@assets/index.ts";
import {AppImage} from "@components/index.ts";
import {BLOCKED_USERS_KEY} from "@constants/keys.ts";
import {authActions, gameActions} from "@redux/actions/index.ts";
import {setHeaders} from "@utils/axios";
import {getDeviceLanguage} from "@utils/strings.ts";

const Splash = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(gameActions.getGameConfig());
        dispatch(gameActions.getGameStreets());
        dispatch(gameActions.getGameItems());
        dispatch(gameActions.getGamePropertyUpgrades());
        dispatch(gameActions.getGameGangUpgrades());
        dispatch(gameActions.getGameMissions());
        checkToken();
        checkBlockedUsers();
        checkFavoriteItems();
    }, []);

    function checkFavoriteItems() {
        AsyncStorage.getItem("favoriteItems").then(favoriteItems => {
            if (favoriteItems) {
                dispatch(
                    authActions.setFavoriteItems(JSON.parse(favoriteItems)),
                );
            }
        });
    }

    async function checkBlockedUsers() {
        const blockedUsers = await AsyncStorage.getItem(BLOCKED_USERS_KEY);
        if (blockedUsers) {
            dispatch(authActions.setBlockedUsers(JSON.parse(blockedUsers)));
        }
    }

    async function checkToken() {
        let authCredentials = await AsyncStorage.getItem("@authCredentials");
        if (authCredentials) {
            authCredentials = await JSON.parse(authCredentials);
            setHeaders(authCredentials);
            setTimeout(() => {
                dispatch(authActions.getUser(true));
            }, 250);
        } else {
            triggerSilentAuth();
        }
    }

    function triggerSilentAuth() {
        DeviceInfo.getUniqueId()
            .then(deviceId => {
                const lang = getDeviceLanguage();
                dispatch(authActions.silentAuth(deviceId, lang));
            })
            .catch(console.error);
    }
    return (
        <SafeAreaView
            style={{
                backgroundColor: "#09090A",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
            }}>
            <AppImage source={images.icons.bigLogo} size={321} />
            <ActivityIndicator
                animating={true}
                color={colors.primary500}
                style={{top: 50}}
            />
        </SafeAreaView>
    );
};
export default Splash;
