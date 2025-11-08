import React from "react";
import {Platform, View, ViewStyle} from "react-native";

import {gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {AppImage, AppText} from "@components/index.ts";
import HeaderMoney from "@components/MiniHeader/HeaderMoney.tsx";
import {scaledValue} from "@utils/index.ts";
import {useDispatch} from "react-redux";
import {navigateBack} from "../../router.tsx";

import {authActions} from "@redux/actions";

interface TitleHeaderProps {
    title?: string;
    style?: ViewStyle;
    arrowLeftMargin?: number;
    money?: number;
    rightComponent?: React.ReactNode;
    onBackPressed?: () => void;
    refreshOnBack?: boolean;
}
const TitleHeader = ({
    title = "",
    style,
    arrowLeftMargin = gapSize.sizeS,
    money = 0,
    rightComponent,
    onBackPressed,
    refreshOnBack = false,
}: TitleHeaderProps) => {
    const dispatch = useDispatch();
    function handleBackPressed() {
        if (refreshOnBack) {
            dispatch(authActions.getUser());
        }
        if (onBackPressed) {
            return onBackPressed();
        }
        return navigateBack();
    }
    return (
        <View
            style={{
                paddingHorizontal: gapSize.size3L,
                height: scaledValue(40),
                alignItems: "center",
                justifyContent: "center",
                marginTop: scaledValue(Platform.OS === "ios" ? 0 : 15),
                ...style,
            }}>
            <AppImage
                source={images.icons.backArrow}
                size={39}
                containerStyle={{position: "absolute", left: arrowLeftMargin}}
                onPress={handleBackPressed}
            />
            <AppText
                text={title}
                type={TextTypes.TitleSmall}
                centered
                style={{marginLeft: money > 0 ? "-15%" : 0}}
            />
            {money > 0 && (
                <View style={{position: "absolute", right: -gapSize.sizeS}}>
                    <HeaderMoney
                        iconSize={30}
                        width={100}
                        paddingHorizontal={5}
                        money={money}
                    />
                </View>
            )}
            {rightComponent && rightComponent}
        </View>
    );
};

export default TitleHeader;
