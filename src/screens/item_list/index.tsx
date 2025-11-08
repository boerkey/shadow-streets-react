import React, {useState} from "react";
import {FlatList, View} from "react-native";
import {useSelector} from "react-redux";

import {colors, gapSize} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {
    AppImage,
    AppText,
    Divider,
    ScreenContainer,
    TabSelector,
    TitleHeader,
} from "@components/index";
import {ItemType} from "@interfaces/GameInterface";
import {RootState} from "@redux/index";
import {renderNumber} from "@utils/helperFunctions";
import {SCREEN_HEIGHT, strings} from "@utils/index";
import {getItemImage} from "@utils/itemHelpers";

const ItemList = () => {
    const gameItems = useSelector((state: RootState) => state.game.gameItems);
    const [selectedTab, setSelectedTab] = useState(0);

    console.log(gameItems);

    function getItemList() {
        switch (selectedTab) {
            case 0:
                return gameItems.consumables;
            case 1:
                return gameItems.goods;
            case 2:
                return gameItems.weapons;
            case 3:
                return gameItems.armors;
            case 4:
                return gameItems.materials;
            case 5:
                return gameItems.helmets;
        }
    }

    const _renderItem = ({item}) => {
        function renderProperties() {
            const list = [];
            if (item.required_level) {
                list.push(
                    <AppText
                        text={`${strings.common.gameKeys.required_level}: `}
                        postText={item.required_level}
                    />,
                );
            }
            if (item.energy) {
                list.push(
                    <AppText
                        text={`${strings.common.gameKeys.energy}: `}
                        postText={item.energy}
                        style={{marginTop: gapSize.sizeS}}
                    />,
                );
            }
            if (item.health) {
                list.push(
                    <AppText
                        text={`${strings.common.gameKeys.health}: `}
                        postText={item.health}
                        style={{marginTop: gapSize.sizeS}}
                    />,
                );
            }
            if (item.damage) {
                list.push(
                    <AppText
                        text={`${strings.common.gameKeys.damage}: `}
                        postText={item.damage}
                        style={{marginTop: gapSize.sizeS}}
                    />,
                );
            }
            if (item.defence) {
                list.push(
                    <AppText
                        text={`${strings.common.gameKeys.defence}: `}
                        postText={item.defence}
                        style={{marginTop: gapSize.sizeS}}
                    />,
                );
            }
            if (item.price) {
                list.push(
                    <AppText
                        text={`${strings.common.price}: `}
                        postText={renderNumber(item.price, 1)}
                        style={{marginTop: gapSize.sizeS}}
                    />,
                );
            }
            return list;
        }
        return (
            <View
                key={item.id}
                style={{
                    flexDirection: "row",
                    paddingTop: gapSize.sizeS,
                    paddingBottom: gapSize.sizeL,
                }}>
                <AppImage
                    source={getItemImage(item)}
                    size={65}
                    style={{alignSelf: "center"}}
                />
                <View style={{marginLeft: gapSize.sizeL}}>
                    <AppText
                        text={item.name}
                        type={TextTypes.H6}
                        style={{marginBottom: gapSize.sizeXS}}
                    />
                    {renderProperties()}
                </View>
            </View>
        );
    };

    return (
        <ScreenContainer>
            <View style={{padding: gapSize.size3L}}>
                <TitleHeader
                    title={strings.itemList.title}
                    style={{marginTop: gapSize.sizeM}}
                />
                <TabSelector
                    items={[
                        strings.common.itemTypeNames[ItemType.Consumable],
                        strings.common.itemTypeNames[ItemType.Goods],
                        strings.common.itemTypeNames[ItemType.Weapon],
                        strings.common.itemTypeNames[ItemType.Armor],
                        strings.common.itemTypeNames[ItemType.Material],
                        strings.common.itemTypeNames[ItemType.Helmet],
                    ]}
                    selectedIndex={selectedTab}
                    onSelect={index => {
                        setSelectedTab(index);
                    }}
                    style={{marginTop: gapSize.sizeM}}
                />
                <FlatList
                    data={getItemList()}
                    renderItem={_renderItem}
                    keyExtractor={item => item.id.toString()}
                    ItemSeparatorComponent={() => (
                        <Divider
                            width={"100%"}
                            marginVertical={gapSize.sizeS}
                        />
                    )}
                    style={{
                        padding: gapSize.sizeL,
                        borderWidth: 1,
                        borderColor: colors.secondary500,
                        marginTop: gapSize.sizeM,
                        height: SCREEN_HEIGHT * 0.7,
                    }}
                />
            </View>
        </ScreenContainer>
    );
};

export default ItemList;
