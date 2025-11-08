import React from "react";
import {View} from "react-native";

import {colors} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {AppText} from "@components/index.ts";

const ItemAmount = ({amount = 0, style}: {amount: number; style?: any}) => {
    if (amount > 1) {
        return (
            <View
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: 27,
                    height: 27,
                    bottom: "0%",
                    position: "absolute",
                    right: "0%",
                    backgroundColor: colors.secondary500,
                    borderRadius: 15,
                    ...style,
                }}>
                <AppText
                    text={amount > 99 ? "+99" : amount}
                    type={TextTypes.H5}
                    color={colors.grey900}
                    fontSize={amount > 99 ? 12 : undefined}
                />
            </View>
        );
    }
    return <></>;
};

export default ItemAmount;
