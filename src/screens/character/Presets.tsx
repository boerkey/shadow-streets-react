import React, {useState} from "react";
import {ImageBackground, TouchableOpacity, View} from "react-native";

import {useDispatch, useSelector} from "react-redux";

import {colors, gapSize, images} from "@assets/index";
import AppImage from "@components/AppImage";
import AppText, {TextTypes} from "@components/AppText";
import ItemPickerModal from "@components/ItemPickerModal";
import {
    ArmorItem,
    ConsumableItem,
    GoodsItem,
    ItemType,
    WeaponItem,
} from "@interfaces/GameInterface";
import {itemActions} from "@redux/actions";
import {RootState} from "@redux/index";
import commonStyles from "@utils/commonStyles";
import {strings} from "@utils/index";
import {getItemImage} from "@utils/itemHelpers";

const Presets = () => {
    const dispatch = useDispatch();

    const [selectedItemType, setSelectedItemType] = useState<ItemType | null>(
        null,
    );
    function equipItem(
        item: WeaponItem | ArmorItem | GoodsItem | ConsumableItem,
    ) {
        dispatch(itemActions.useItem(item.id, item.type, 1));
        setSelectedItemType(null);
    }

    return (
        <View style={commonStyles.flexRowSpaceBetween}>
            <ItemPickerModal
                isVisible={!!selectedItemType}
                onClose={() => setSelectedItemType(null)}
                onSelect={({selectedItem}) => equipItem(selectedItem)}
                itemTypes={[selectedItemType]}
                onlySelect
                actionButtonText={strings.common.equip}
            />
            <View>
                <ItemBox
                    itemType={ItemType.Weapon}
                    onPress={() => setSelectedItemType(ItemType.Weapon)}
                />
                <ItemBox
                    itemType={ItemType.Armor}
                    onPress={() => setSelectedItemType(ItemType.Armor)}
                />
            </View>
            <View>
                <ItemBox
                    itemType={ItemType.Helmet}
                    onPress={() => setSelectedItemType(ItemType.Helmet)}
                />
                <ItemBox />
            </View>
        </View>
    );
};

export default Presets;

const ItemBox = ({
    itemType,
    onPress,
}: {
    itemType?: ItemType;
    onPress: () => void;
}) => {
    const user = useSelector((state: RootState) => state.auth.user);

    function getEquippedItem() {
        switch (itemType) {
            case ItemType.Weapon:
                return user.items_weapons.find(item => item.is_equipped);
            case ItemType.Armor:
                return user.items_armors.find(item => item.is_equipped);
            case ItemType.Helmet:
                return user.items_helmets.find(item => item.is_equipped);
        }
    }

    const equippedItem = getEquippedItem();

    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                width: 75,
                height: 75,
                marginBottom: gapSize.sizeL,
            }}>
            <ImageBackground
                resizeMode="stretch"
                source={
                    images.containers.itemDetails[equippedItem?.quality ?? 0]
                }
                onPress={onPress}
                style={{
                    width: 75,
                    height: 75,
                    marginBottom: gapSize.sizeL,
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                {equippedItem && equippedItem.grade > 0 && (
                    <AppText
                        preText="+"
                        text={equippedItem?.grade}
                        type={TextTypes.H6}
                        color={colors.white}
                        style={{
                            position: "absolute",
                            top: 2,
                            left: 5,
                        }}
                    />
                )}
                {equippedItem && (
                    <AppImage source={getItemImage(equippedItem)} size={55} />
                )}
            </ImageBackground>
        </TouchableOpacity>
    );
};
