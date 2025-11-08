import React, {useEffect, useState} from "react";
import {ActivityIndicator, View} from "react-native";

import {useRoute} from "@react-navigation/native";
import {useSelector} from "react-redux";

import {propertyApis} from "@apis/index.ts";
import {colors, gapSize, images} from "@assets/index.ts";
import {
    AppImage,
    Prompt,
    ScreenContainer,
    TabSelector,
    TitleHeader,
} from "@components/index.ts";
import {PropertyType} from "@interfaces/GameInterface.ts";
import {UserProperty} from "@interfaces/PropertyInterface.ts";
import {RootState} from "@redux/index.ts";
import {SCREEN_HEIGHT, strings} from "@utils/index.ts";

import Casino from "@screens/property_details/Casino/Casino.tsx";
import ProductionList from "@screens/property_details/Production_Site/ProductionList.tsx";
import Workshop from "@screens/property_details/Production_Site/Workshop.tsx";
import {getDarkBackground} from "@utils/helperFunctions.ts";
import PropertyInfo from "./Common/PropertyInfo.tsx";
import Upgrades from "./Common/Upgrades.tsx";
import Visitors from "./Common/Visitors.tsx";
import Garage from "./Garage/index.tsx";
import ShopInventory from "./Shop/ShopInventory.tsx";
import DealerInventory from "./Weapon_Dealer/DealerInventory.tsx";

enum TAB_IDS {
    PROPERTY_DETAILS,
    UPGRADES,
    INVENTORY,
    VISITORS,
    WORKSHOP,
    PRODUCTION_LIST,
    CASINO,
    WEAPON_DEALER,
    GARAGE,
}

const PropertyDetails = () => {
    const FLAT_TABS = [
        {
            id: TAB_IDS.PROPERTY_DETAILS,
            name: strings.propertyDetails.propertyDetails,
        },
        {
            id: TAB_IDS.UPGRADES,
            name: strings.propertyDetails.upgrades,
            ownerOnly: true,
        },
    ];

    const SHOP_TABS = [
        {id: TAB_IDS.INVENTORY, name: strings.propertyDetails.inventory},
        {id: TAB_IDS.VISITORS, name: strings.propertyDetails.visitors},
        {
            id: TAB_IDS.PROPERTY_DETAILS,
            name: strings.propertyDetails.propertyDetails,
        },
        {
            id: TAB_IDS.UPGRADES,
            name: strings.propertyDetails.upgrades,
            ownerOnly: true,
        },
    ];

    const PRODUCTION_SITE_TABS = [
        {
            id: TAB_IDS.WORKSHOP,
            name: strings.propertyDetails.workshop,
            ownerOnly: true,
        },
        {
            id: TAB_IDS.PRODUCTION_LIST,
            name: strings.propertyDetails.productionList,
            ownerOnly: true,
        },
        {
            id: TAB_IDS.PROPERTY_DETAILS,
            name: strings.propertyDetails.propertyDetails,
        },
        {
            id: TAB_IDS.UPGRADES,
            name: strings.propertyDetails.upgrades,
            ownerOnly: true,
        },
    ];

    const CASINO_TABS = [
        {id: TAB_IDS.CASINO, name: strings.propertyDetails.gamble},
        {id: TAB_IDS.VISITORS, name: strings.propertyDetails.visitors},
        {
            id: TAB_IDS.PROPERTY_DETAILS,
            name: strings.propertyDetails.propertyDetails,
        },
        {
            id: TAB_IDS.UPGRADES,
            name: strings.propertyDetails.upgrades,
            ownerOnly: true,
        },
    ];

    const WEAPON_DEALER_TABS = [
        {id: TAB_IDS.WEAPON_DEALER, name: strings.propertyDetails.inventory},
        {id: TAB_IDS.VISITORS, name: strings.propertyDetails.visitors},
        {
            id: TAB_IDS.PROPERTY_DETAILS,
            name: strings.propertyDetails.propertyDetails,
        },
    ];

    const GARAGE_TABS = [
        {id: TAB_IDS.GARAGE, name: strings.propertyDetails.garage},
        {id: TAB_IDS.VISITORS, name: strings.propertyDetails.visitors},
        {
            id: TAB_IDS.PROPERTY_DETAILS,
            name: strings.propertyDetails.propertyDetails,
        },
        {
            id: TAB_IDS.UPGRADES,
            name: strings.propertyDetails.upgrades,
            ownerOnly: true,
        },
    ];

    const gameConfig = useSelector((state: RootState) => state.game.gameConfig);
    const user = useSelector((state: RootState) => state.auth.user);
    const {params} = useRoute();
    const propertyId = params?.id;
    const preSelectedItem = params?.preSelectedItem;

    const [property, setProperty] = useState<UserProperty | any>({});
    const [tabIndex, setTabIndex] = useState(-1);
    const [showNameChangePrompt, setShowNameChangePrompt] = useState(false);
    const [loading, setLoading] = useState(true);

    const isOwner = user.id === property?.user_id;
    const isOnSale = property?.sale_price > 0;

    useEffect(() => {
        getPropertyDetails();
    }, []);

    useEffect(() => {
        if (getTabList().length) {
            setTabIndex(tabIndex !== -1 ? tabIndex : getTabList()[0].id);
        }
    }, [property]);

    function getPropertyDetails() {
        setLoading(true);
        propertyApis.getPropertyDetails(propertyId).then(res => {
            const propertyData = res.data.property;
            setProperty(propertyData);
            setTimeout(() => {
                setLoading(false);
            }, 100);
        });
    }

    function changePropertyName(newName: string) {
        setShowNameChangePrompt(false);
        propertyApis.changePropertyName(property.id, newName).then(() => {
            setTimeout(getPropertyDetails, 500);
        });
    }

    function renderTabs() {
        if (getTabList().length === 1) {
            return (
                <PropertyInfo
                    getPropertyDetails={getPropertyDetails}
                    isOwner={isOwner}
                    property={property}
                />
            );
        }
        switch (tabIndex) {
            case TAB_IDS.WEAPON_DEALER:
                return <DealerInventory preSelectedItem={preSelectedItem} />;
            case TAB_IDS.INVENTORY:
                return (
                    <ShopInventory
                        loading={loading}
                        isOwner={isOwner}
                        property={property}
                        getPropertyDetails={getPropertyDetails}
                        buyingItem={preSelectedItem}
                    />
                );
            case TAB_IDS.VISITORS:
                return (
                    <Visitors
                        visitors={property?.visitors ?? []}
                        property_id={property?.id}
                        getPropertyDetails={getPropertyDetails}
                    />
                );
            case TAB_IDS.PROPERTY_DETAILS:
                return (
                    <PropertyInfo
                        getPropertyDetails={getPropertyDetails}
                        property={property}
                        isOwner={isOwner}
                    />
                );
            case TAB_IDS.UPGRADES:
                return (
                    <Upgrades
                        property={property}
                        getPropertyDetails={getPropertyDetails}
                    />
                );
            case TAB_IDS.WORKSHOP:
                return <Workshop property={property} />;
            case TAB_IDS.PRODUCTION_LIST:
                return <ProductionList property={property} />;
            case TAB_IDS.CASINO:
                return <Casino property={property} />;
            case TAB_IDS.GARAGE:
                return <Garage property={property} />;
        }
    }

    function getBackgroundImage() {
        switch (property.type) {
            case PropertyType.Shop:
                return images.backgrounds.propertyDetailsShop;
            case PropertyType.Production:
                return images.backgrounds.propertyDetailsProductionSite;
            case PropertyType.Garage:
                return images.backgrounds.propertyDetailsGarage;
        }
    }

    function getTabList() {
        let list: any = [];
        if (Object.keys(property).length > 0) {
            switch (property.type) {
                case PropertyType.Flat:
                    list = FLAT_TABS;
                    break;
                case PropertyType.Shop:
                    list = SHOP_TABS;
                    break;
                case PropertyType.Production:
                    list = PRODUCTION_SITE_TABS;
                    break;
                case PropertyType.Casino:
                    list = CASINO_TABS;
                    break;
                case PropertyType.WeaponDealer:
                    list = WEAPON_DEALER_TABS;
                    break;
                case PropertyType.Garage:
                    list = GARAGE_TABS;
                    break;
            }
            list = list.filter((each: any) => {
                if (isOnSale && each.id === TAB_IDS.UPGRADES) {
                    return true;
                }
                if (each.ownerOnly) {
                    return isOwner;
                }
                return true;
            });
        }
        return list;
    }

    const selectedTabIdToIndex = getTabList().findIndex(
        each => each.id === tabIndex,
    );

    function shouldShowMoney() {
        if (selectedTabIdToIndex !== TAB_IDS.PROPERTY_DETAILS) {
            return false;
        }
        return (
            property?.type === PropertyType.Shop ||
            (property?.type === PropertyType.Garage &&
                tabIndex !== TAB_IDS.PROPERTY_DETAILS)
        );
    }

    return (
        <ScreenContainer
            source={getBackgroundImage()}
            style={{backgroundColor: getDarkBackground(5), flex: 1}}>
            <View style={{padding: gapSize.sizeL}}>
                <TitleHeader
                    title={property?.name}
                    money={shouldShowMoney() ? user?.money : undefined}
                    rightComponent={
                        isOwner &&
                        tabIndex === TAB_IDS.PROPERTY_DETAILS && (
                            <AppImage
                                source={images.icons.edit}
                                size={30}
                                onPress={() => setShowNameChangePrompt(true)}
                                containerStyle={{
                                    position: "absolute",
                                    right: 0,
                                }}
                            />
                        )
                    }
                />
                <Prompt
                    isVisible={showNameChangePrompt}
                    inputValidation={"any"}
                    placeholder={"..."}
                    maxLength={12}
                    onConfirm={changePropertyName}
                    onClose={() => setShowNameChangePrompt(false)}
                    text={strings.propertyDetails.changeNameCost.replace(
                        "{cost}",
                        "$" + gameConfig.property_name_change_cost,
                    )}
                    title={strings.propertyDetails.changeName}
                />
                {!loading && (
                    <>
                        <View
                            style={{
                                alignItems: "center",
                                marginTop: gapSize.sizeS,
                            }}>
                            {getTabList() && getTabList().length > 1 && (
                                <TabSelector
                                    selectedIndex={selectedTabIdToIndex}
                                    onSelect={(i, item) => setTabIndex(item.id)}
                                    items={getTabList()}
                                    style={{
                                        width: "98%",
                                        marginTop: gapSize.sizeS,
                                    }}
                                />
                            )}
                        </View>
                        {renderTabs()}
                    </>
                )}
                {loading && (
                    <ActivityIndicator
                        size={"large"}
                        style={{marginTop: SCREEN_HEIGHT * 0.4}}
                        color={colors.white}
                    />
                )}
            </View>
        </ScreenContainer>
    );
};

export default PropertyDetails;
