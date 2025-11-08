import React from "react";
import {TouchableOpacity, View} from "react-native";

import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {AppImage, AppText, Avatar} from "@components/index.ts";
import {RootState} from "@redux/index.ts";
import {FightListItemInterface} from "@screens/fights/index.tsx";
import {commonStyles, scaledValue} from "@utils/index.ts";
import {useSelector} from "react-redux";

const FightListItem = ({
    item,
    onPress,
}: {
    item: FightListItemInterface;
    onPress: () => void;
}) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const isMyFight =
        item.attacker_id === user.id || item.defender_id === user.id;
    console.log(item);
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                commonStyles.flexRowSpaceBetweenAlignCenter,
                {
                    width: "100%",
                    borderWidth: 1,
                    borderColor: isMyFight ? colors.white : colors.secondary500,
                    paddingVertical: gapSize.sizeS,
                    paddingHorizontal: gapSize.sizeS,
                    marginBottom: gapSize.sizeL,
                    backgroundColor: colors.black,
                },
            ]}>
            <View style={[{width: "35%"}]}>
                <Avatar
                    source={item.attacker_img_url}
                    frameId={item.attacker_avatar_frame_id}
                    size={45}
                />
                <AppText
                    text={item.attacker_name}
                    style={{marginLeft: scaledValue(2)}}
                />
            </View>
            <View
                style={[
                    commonStyles.alignItemsCenter,
                    {
                        width: "30%",
                    },
                ]}>
                <AppImage source={images.icons.fightVs} size={20} />
                <AppText
                    text={item?.status < 2 ? item.status_text : item.time_ago}
                    type={TextTypes.Caption2}
                />
                <AppText
                    text={item.location_name}
                    type={TextTypes.Caption}
                    color={colors.secondary500}
                />
            </View>
            <View style={[{width: "35%", alignItems: "flex-end"}]}>
                <Avatar
                    source={item.defender_img_url}
                    frameId={item.defender_avatar_frame_id}
                    size={45}
                />
                <AppText
                    text={item.defender_name}
                    style={{marginRight: scaledValue(2)}}
                />
            </View>
        </TouchableOpacity>
    );
};

export default FightListItem;
