import React from "react";
import {View} from "react-native";

import {useSelector} from "react-redux";

import HeaderMoney from "@components/MiniHeader/HeaderMoney.tsx";
import {AppImage} from "@components/index.ts";
import {gapSize, images} from "@assets/index.ts";
import {commonStyles, scaledValue} from "@utils/index.ts";
import {RootState} from "@redux/index.ts";

import {navigateBack} from "../../router.tsx";

const MiniHeader = ({noBackgroundStyle = false}) => {
    const user = useSelector((state: RootState) => state.auth.user);
    return (
        <View
            style={{
                width: "87.7%",
                flexDirection: "row",
                height: scaledValue(40),
                justifyContent: "space-between",
                alignSelf: "center",
                padding: gapSize.sizeM,
                alignItems: "center",
            }}>
            <AppImage
                onPress={navigateBack}
                source={images.icons.backArrow}
                size={scaledValue(38)}
                hitSlop={commonStyles.bigHitSlop}
            />
            <HeaderMoney
                money={user?.money}
                noBackgroundStyle={noBackgroundStyle}
            />
        </View>
    );
};

export default MiniHeader;
