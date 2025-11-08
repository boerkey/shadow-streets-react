import React from "react";
import {View} from "react-native";

import {colors, gapSize, images} from "@assets/index";
import {TextTypes} from "@components/AppText";
import Avatar from "@components/Avatar";
import {AppButton, AppImage, AppText} from "@components/index";
import {Guard} from "@interfaces/GameInterface";
import {scaledValue, strings} from "@utils/index";

const GuardItem = ({
    guard,
    guardData,
    isMyGuard = false,
    onPress,
}: {
    guard: Guard;
    guardData: Guard;
    isMyGuard: boolean;
    onPress: () => void;
}) => {
    const imgUrl = isMyGuard ? guard?.img_url : images.guards[guard.id];
    return (
        <View
            style={{
                width: "100%",
                minHeight: scaledValue(110),
                backgroundColor: colors.black,
                borderWidth: 1,
                borderColor: colors.secondary500,
                alignItems: "center",
                flexDirection: "row",
                marginBottom: gapSize.sizeM,
                paddingVertical: gapSize.sizeM,
                paddingHorizontal: gapSize.sizeM,
            }}>
            {isMyGuard && <Avatar source={imgUrl} size={70} />}
            {!isMyGuard && <AppImage source={imgUrl} size={80} />}
            <View
                style={{
                    width: isMyGuard ? "45%" : "45%",
                    marginLeft: isMyGuard ? gapSize.sizeM : 0,
                }}>
                <AppText text={guard.name} type={TextTypes.H5} />
                {guardData.description && (
                    <AppText
                        text={guardData.description}
                        type={TextTypes.Body2}
                    />
                )}
            </View>
            <View style={{marginLeft: gapSize.sizeM, alignItems: "center"}}>
                {!isMyGuard && (
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginLeft: gapSize.sizeM,
                        }}>
                        <AppImage source={images.icons.shadowCoin} size={24} />
                        <AppText
                            text={guard.cost}
                            type={TextTypes.BodyBold}
                            style={{marginLeft: gapSize.sizeS}}
                        />
                    </View>
                )}
                <AppButton
                    text={
                        isMyGuard ? strings.common.check : strings.guards.hire
                    }
                    width={90}
                    height={40}
                    fontSize={20}
                    style={{marginTop: gapSize.sizeM}}
                    onPress={onPress}
                />
            </View>
        </View>
    );
};

export default GuardItem;
