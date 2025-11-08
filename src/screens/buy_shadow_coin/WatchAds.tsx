import React, {useEffect, useRef, useState} from "react";
import {Platform, TouchableOpacity} from "react-native";

import {
    MobileAds,
    RewardedAd,
    RewardedAdEventType,
    TestIds,
} from "react-native-google-mobile-ads";
import {PERMISSIONS, RESULTS, check, request} from "react-native-permissions";
import {useDispatch, useSelector} from "react-redux";

import {boostApis} from "@apis/index";
import {colors, gapSize, images} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {AppButton, AppImage, AppText} from "@components/index";
import {authActions} from "@redux/actions";
import {RootState} from "@redux/index";
import {showToast} from "@utils/helperFunctions";
import {scaledValue} from "@utils/index";

const WatchAds = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const [iosAdIds, setIosAdIds] = useState<string[]>([]);
    const [androidAdIds, setAndroidAdIds] = useState<string[]>([]);
    const [canGainReward, setCanGainReward] = useState<boolean>(false);
    const [adsLoaded, setAdsLoaded] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isInitializing, setIsInitializing] = useState<boolean>(true);
    const [adError, setAdError] = useState<string | null>(null);
    const [adEventListeners, setAdEventListeners] = useState<{
        unsubscribeLoaded?: (() => void) | null;
        unsubscribeEarned?: (() => void) | null;
        unsubscribeError?: (() => void) | null;
    }>({});

    const rewardedAdRef = useRef<RewardedAd | null>(null);

    useEffect(() => {
        getAdIds();

        return () => {
            // Clean up event listeners when component unmounts
            if (adEventListeners.unsubscribeLoaded) {
                adEventListeners.unsubscribeLoaded();
            }
            if (adEventListeners.unsubscribeEarned) {
                adEventListeners.unsubscribeEarned();
            }
            // No need to clean up unsubscribeError as we're not using it anymore
        };
    }, []);

    async function getAdIds() {
        try {
            setIsLoading(true);
            const res = await boostApis.getAdId();
            setIosAdIds(res.data.ios);
            setAndroidAdIds(res.data.android);
            setCanGainReward(res.data.can_gain_reward);

            if (res.data.can_gain_reward) {
                const isInitialized = await initializeAdSDK();
                if (isInitialized) {
                    const adUnitId = __DEV__
                        ? TestIds.REWARDED
                        : Platform.OS === "ios"
                        ? res.data.ios[0]
                        : res.data.android[0];

                    loadRewardedAd(adUnitId);
                }
            }
        } catch (error) {
            console.error("Error getting ad IDs:", error);
            setAdError("Failed to get ad configuration");
        } finally {
            setIsLoading(false);
        }
    }

    const initializeAdSDK = async () => {
        try {
            setIsInitializing(true);
            await MobileAds().setRequestConfiguration({
                testDeviceIdentifiers: ["EMULATOR"],
            });

            if (Platform.OS === "ios") {
                const result = await check(
                    PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY,
                );
                if (result === RESULTS.DENIED) {
                    await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
                }
            }

            await MobileAds().initialize();
            return true;
        } catch (error) {
            console.error("Error initializing Google Ads SDK: ", error);
            setAdError("Failed to initialize ad SDK");
            return false;
        } finally {
            setIsInitializing(false);
        }
    };

    const loadRewardedAd = (adUnitId: string) => {
        if (adEventListeners.unsubscribeLoaded) {
            adEventListeners.unsubscribeLoaded();
        }
        if (adEventListeners.unsubscribeEarned) {
            adEventListeners.unsubscribeEarned();
        }

        const rewardedAd = RewardedAd.createForAdRequest(adUnitId);

        const unsubscribeLoaded = rewardedAd.addAdEventListener(
            RewardedAdEventType.LOADED,
            () => {
                setAdsLoaded(true);
                setAdError(null);
            },
        );

        const unsubscribeEarned = rewardedAd.addAdEventListener(
            RewardedAdEventType.EARNED_REWARD,
            reward => {
                console.log("User earned reward: ", reward);
                setAdsLoaded(false);

                gainShadowCoinsWithAd().finally(() => {
                    rewardedAd.load();
                    console.log("Rewarded Ad Loaded");
                });
            },
        );

        setAdEventListeners({
            unsubscribeLoaded,
            unsubscribeEarned,
        });

        rewardedAdRef.current = rewardedAd;

        rewardedAd.load();

        setTimeout(() => {
            if (!adsLoaded && rewardedAdRef.current === rewardedAd) {
                console.log("Ad failed to load after timeout");
                setAdError("Ad loading timed out. Will retry.");
                rewardedAd.load();
            }
        }, 15000);
    };

    const showRewardAd = () => {
        if (!canGainReward) {
            showToast("You've reached the reward limit for today");
            return;
        }

        if (adError) {
            setAdError(null);
            const adUnitId = __DEV__
                ? TestIds.REWARDED
                : Platform.OS === "ios"
                ? iosAdIds[0]
                : androidAdIds[0];
            loadRewardedAd(adUnitId);
            showToast("Preparing new ad, please try again shortly");
            return;
        }

        if (rewardedAdRef.current && adsLoaded) {
            rewardedAdRef.current.show();
        } else if (isInitializing || isLoading) {
            showToast("Ad is still loading, please wait");
        } else {
            showToast("No ads available right now");
            getAdIds();
        }
    };

    async function gainShadowCoinsWithAd() {
        try {
            const res = await boostApis.gainShadowCoinsWithAd();
            const finalShadowCoin = res.data.final_shadow_coin;
            dispatch(
                authActions.setUser({
                    ...user,
                    shadow_coin: finalShadowCoin,
                }),
            );
            return true;
        } catch (error) {
            console.error("Error claiming reward:", error);
            showToast("Failed to claim reward");
            return false;
        }
    }

    if (!adsLoaded || !canGainReward) {
        return <></>;
    }

    return (
        <TouchableOpacity
            onPress={showRewardAd}
            style={{
                height: scaledValue(76),
                borderWidth: 1,
                borderColor: colors.secondary500,
                paddingHorizontal: scaledValue(12),
                width: "95%",
                alignSelf: "center",
                paddingVertical: gapSize.sizeM,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: colors.black,
                marginBottom: gapSize.size3L,
                overflow: "visible",
                zIndex: 1,
                marginLeft: gapSize.size2L,
            }}>
            <AppImage
                source={images.icons.video}
                size={96}
                style={{
                    marginLeft: -gapSize.size5L,
                    top: -gapSize.sizeS,
                    zIndex: 2,
                }}
            />
            <AppText text={"10 S-Coin"} type={TextTypes.ButtonSmall} />
            <AppButton
                text={"Free"}
                onPress={showRewardAd}
                width={100}
                height={42}
                textFont={TextTypes.ButtonSmall}
            />
        </TouchableOpacity>
    );
};

export default WatchAds;
