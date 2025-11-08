import React, {useEffect, useState} from "react";
import {FlatList, RefreshControl, View} from "react-native";

import {useRoute} from "@react-navigation/native";

import {propertyApis} from "@apis/index.ts";
import {colors, gapSize, images} from "@assets/index.ts";
import {
    AppImage,
    Header,
    ScreenContainer,
    TabSelector,
    TitleHeader,
} from "@components/index.ts";
import {PropertyType} from "@interfaces/GameInterface.ts";
import {RootState} from "@redux/index.ts";
import BuyPropertyModal from "@screens/property/BuyPropertyModal.tsx";
import {commonStyles, SCREEN_HEIGHT, strings} from "@utils/index.ts";
import {useSelector} from "react-redux";
import PropertyItem from "./PropertyItem.tsx";

const Property = () => {
    const filterItems = [
        {
            name: strings.common.all,
            id: 0,
        },
        {
            name: strings.common.mine,
            id: 99,
        },
        {
            name: strings.common.propertyTypeNames[PropertyType.Flat],
            id: PropertyType.Flat,
        },
        {
            name: strings.common.propertyTypeNames[PropertyType.Shop],
            id: PropertyType.Shop,
        },
        {
            name: strings.common.propertyTypeNames[PropertyType.Production],
            id: PropertyType.Production,
        },
        {
            name: strings.common.propertyTypeNames[PropertyType.Casino],
            id: PropertyType.Casino,
        },
        {
            name: strings.common.propertyTypeNames[PropertyType.WeaponDealer],
            id: PropertyType.WeaponDealer,
        },
        {
            name: strings.common.propertyTypeNames[PropertyType.Garage],
            id: PropertyType.Garage,
        },
    ];

    const user = useSelector((state: RootState) => state.auth.user);
    const {params} = useRoute();
    const locationB = params?.locationB || "";

    const [properties, setProperties] = useState([]);
    const [filter, setFilter] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showBuyPropertyModal, setShowBuyPropertyModal] = useState(false);
    const filterIndex = filterItems.findIndex(each => each.id === filter);

    useEffect(() => {
        fetchProperties();
    }, []);

    function fetchProperties() {
        setLoading(true);
        propertyApis
            .getProperties(locationB)
            .then(res => {
                setProperties(res.data.properties ?? []);
            })
            .finally(() => {
                setTimeout(() => setLoading(false), 1000);
            });
    }

    const _renderItem = ({item, index}) => <PropertyItem item={item} />;

    function getProperties() {
        if (filter === 0) {
            return properties;
        }
        if (filter === 99) {
            return properties.filter(each => each.user_id === user.id);
        }
        return properties.filter(each => each.type === filter);
    }

    return (
        <ScreenContainer>
            <View style={{padding: gapSize.size3L}}>
                <Header isAbsolute={false} showName={false} />
                <TitleHeader
                    title={`${strings.propertyDetails.building} - ${locationB}`}
                    style={{marginTop: gapSize.sizeM}}
                    rightComponent={
                        <AppImage
                            hitSlop={commonStyles.hitSlop}
                            source={images.icons.buyProperty}
                            size={32}
                            containerStyle={{position: "absolute", right: 0}}
                            onPress={() => setShowBuyPropertyModal(true)}
                        />
                    }
                />
                <TabSelector
                    items={filterItems}
                    selectedIndex={filterIndex}
                    onSelect={(i, item) => setFilter(item.id)}
                    style={{
                        marginVertical: gapSize.sizeM,
                    }}
                />
                <FlatList
                    refreshControl={
                        <RefreshControl
                            tintColor={colors.white}
                            refreshing={loading}
                            onRefresh={fetchProperties}
                        />
                    }
                    data={getProperties().sort((a, b) =>
                        a.status > b.status ? -1 : 1,
                    )}
                    renderItem={_renderItem}
                    contentContainerStyle={{
                        paddingBottom: SCREEN_HEIGHT * 0.2,
                    }}
                />
                <BuyPropertyModal
                    locationB={locationB}
                    isVisible={showBuyPropertyModal}
                    onClose={() => setShowBuyPropertyModal(false)}
                    onSuccess={fetchProperties}
                />
            </View>
        </ScreenContainer>
    );
};

export default Property;
