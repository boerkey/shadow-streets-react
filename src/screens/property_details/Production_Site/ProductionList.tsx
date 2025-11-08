import React, {useEffect} from "react";
import {FlatList, RefreshControl, View} from "react-native";

import {useDispatch, useSelector} from "react-redux";

import {colors, gapSize} from "@assets/index.ts";
import {Divider, SmallButton} from "@components/index.ts";
import {UserProperty} from "@interfaces/PropertyInterface.ts";
import {propertyActions} from "@redux/actions";
import {RootState} from "@redux/index.ts";
import ProductionItem from "@screens/property_details/Production_Site/ProductionItem.tsx";
import styles from "@screens/property_details/styles.ts";
import {strings} from "@utils/index";

interface ProductionListProps {
    property: UserProperty;
}

const ProductionList = ({property}: ProductionListProps) => {
    const dispatch = useDispatch();
    const itemProductionLoading = useSelector(
        (state: RootState) => state.property.itemProductionLoading,
    );

    const itemProductionList = useSelector(
        (state: RootState) => state.property.itemProductionList,
    );

    const hasAnyItemProduced = itemProductionList.some(
        item => item.produced_amount > 0,
    );

    useEffect(() => {
        dispatch(
            propertyActions.getPropertyItemProductionList(property.id, true),
        );
    }, []);

    function getItemProductionList() {
        dispatch(propertyActions.getPropertyItemProductionList(property.id));
    }

    const _renderItem = ({item}) => {
        return (
            <ProductionItem
                item={item}
                key={item.id}
                onRefresh={getItemProductionList}
            />
        );
    };

    return (
        <View style={styles.sectionContainer}>
            <FlatList
                ListHeaderComponent={() =>
                    hasAnyItemProduced && (
                        <SmallButton
                            text={strings.common.takeAll}
                            onPress={() => {
                                dispatch(
                                    propertyActions.takeAllProducedItemsFromProperty(
                                        property.id,
                                    ),
                                );
                            }}
                            width={100}
                            style={{
                                marginBottom: gapSize.sizeL,
                                alignSelf: "flex-end",
                            }}
                        />
                    )
                }
                refreshControl={
                    <RefreshControl
                        tintColor={colors.white}
                        refreshing={itemProductionLoading}
                        onRefresh={getItemProductionList}
                    />
                }
                data={itemProductionList}
                renderItem={_renderItem}
                ItemSeparatorComponent={() => <Divider width={"95%"} />}
            />
        </View>
    );
};

export default ProductionList;
