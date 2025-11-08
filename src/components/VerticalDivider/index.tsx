import React from "react";
import {View} from "react-native";

import {colors} from "@assets/index.ts";
import {scaledValue} from "@utils/index.ts";

const VerticalDivider = ({
    hidden = false,
    style = {},
    marginHorizontal = scaledValue(12),
}) => {
    return (
        <View
            style={{
                height: scaledValue(74),
                width: 1,
                backgroundColor: hidden ? "transparent" : colors.grey500,
                marginHorizontal,
                ...style,
            }}
        />
    );
};

export default VerticalDivider;
