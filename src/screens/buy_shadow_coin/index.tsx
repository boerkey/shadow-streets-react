import React, {useEffect, useState} from "react";
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native";

import Purchases, {
    CustomerInfo,
    LOG_LEVEL,
    PRODUCT_CATEGORY,
    PurchasesError,
    PurchasesStoreProduct,
} from "react-native-purchases";
import {useDispatch, useSelector} from "react-redux";

import {purchaseApis} from "@apis/index";
import {colors, gapSize, images} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {
    AppButton,
    AppImage,
    AppText,
    InnerContainer,
    ScreenContainer,
    TitleHeader,
} from "@components/index";
import {authActions} from "@redux/actions";
import {RootState} from "@redux/index";
import {renderNumber, showToast} from "@utils/helperFunctions";
import {scaledValue} from "@utils/index";
import strings from "@utils/strings";
import WatchAds from "./WatchAds";

const BuyShadowCoin = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const [products, setProducts] = useState<any[]>([]);
    const [productList, setProductList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [purchaseInProgress, setPurchaseInProgress] = useState(false);

    useEffect(() => {
        Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

        if (Platform.OS === "ios") {
            Purchases.configure({
                apiKey: "appl_izrjKyHnswnyMQSGzJQpLKMclqf",
                appUserID: user?.id.toString(),
            });
        } else if (Platform.OS === "android") {
            Purchases.configure({
                apiKey: "goog_KXwEsoiiYSqvNInTHHqFhnpkpeN",
                appUserID: user?.id.toString(),
            });
        }

        getProductList();

        const customerInfoUpdateListener = (info: CustomerInfo) => {
            dispatch(authActions.getUser());
        };

        Purchases.addCustomerInfoUpdateListener(customerInfoUpdateListener);

        return () => {
            Purchases.removeCustomerInfoUpdateListener(
                customerInfoUpdateListener,
            );
        };
    }, [user?.id]);

    useEffect(() => {
        if (productList.length > 0) {
            fetchProducts();
        }
    }, [productList]);

    function getProductList() {
        purchaseApis
            .getProductList()
            .then(res => {
                setProductList(res.data.products);
            })
            .catch(err => {
                showToast(
                    strings.common.warning,
                    strings.buyShadowCoin.productFetchFailed + " 1",
                    "warning",
                );
                setTimeout(() => {
                    setLoading(false);
                }, 500);
            });
    }

    async function fetchProducts() {
        try {
            const productIds = productList.map(item => item.product_id);
            const fetchedProducts = await Purchases.getProducts(
                productIds,
                PRODUCT_CATEGORY.NON_SUBSCRIPTION,
            );
            if (fetchedProducts.length > 0) {
                setProducts(fetchedProducts.sort((a, b) => a.price - b.price));
            }
        } catch (e) {
            console.log("error", e);
            showToast(
                strings.common.warning,
                strings.buyShadowCoin.productFetchFailed + " 2",
                "warning",
            );
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
    }

    async function purchaseProduct(product: PurchasesStoreProduct) {
        try {
            setPurchaseInProgress(true);
            await Purchases.purchaseStoreProduct(product);
        } catch (e) {
            const error = e as PurchasesError;
            if (!error.userCancelled) {
                console.error("Purchase Error:", error);
                showToast(strings.common.warning, error.message, "warning");
            }
        } finally {
            setPurchaseInProgress(false);
        }
    }

    const _renderItem = ({item}: {item: PurchasesStoreProduct}) => {
        const product = productList.find(p => p.product_id === item.identifier);
        let cleanTitle = item.title.replace("Shadow Coin", "S-Coin");
        cleanTitle = cleanTitle.replace("(Shadow Streets)", "");
        return (
            <TouchableOpacity
                onPress={() => purchaseProduct(item)}
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
                    source={images.icons.shadowCoinTilted}
                    size={96}
                    style={{
                        marginLeft: -gapSize.size5L,
                        zIndex: 2,
                    }}
                />
                <View style={{marginLeft: -gapSize.sizeM}}>
                    <AppText text={cleanTitle} type={TextTypes.ButtonSmall} />
                    <AppText
                        text={product?.short_description}
                        type={TextTypes.H5}
                        color={colors.secondary500}
                    />
                </View>
                <AppButton
                    text={item.priceString ?? "$0,99"}
                    onPress={() => purchaseProduct(item)}
                    width={Platform.OS === "ios" ? 100 : 115}
                    height={42}
                    textFont={TextTypes.ButtonSmall}
                />
            </TouchableOpacity>
        );
    };

    return (
        <ScreenContainer>
            <InnerContainer>
                <TitleHeader
                    title={strings.buyShadowCoin.title}
                    rightComponent={
                        <View
                            style={{
                                position: "absolute",
                                right: -5,
                                top: 5,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 10,
                            }}>
                            <AppImage source={images.icons.shadowCoin} />
                            <AppText
                                text={renderNumber(user?.shadow_coin)}
                                type={TextTypes.BodyBold}
                            />
                        </View>
                    }
                />
            </InnerContainer>
            <ScrollView
                style={{
                    paddingTop: gapSize.sizeL,
                    height: "85%",
                    paddingHorizontal: gapSize.size2L,
                }}>
                <WatchAds />
                {products.map((item, index) => (
                    <View key={`coin-package-${index}`}>
                        {_renderItem({item})}
                    </View>
                ))}
                {(loading || purchaseInProgress) && (
                    <ActivityIndicator
                        size="large"
                        color={colors.white}
                        style={{marginTop: "35%"}}
                    />
                )}
            </ScrollView>
        </ScreenContainer>
    );
};

export default BuyShadowCoin;
