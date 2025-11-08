import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";

import { gapSize } from "@assets/index.ts";

const InnerContainer = ({ children, style }: { children: React.ReactNode, style?: StyleProp<ViewStyle> }) => {
    return <View style={[style, {paddingHorizontal: gapSize.size3L}]}>{children}</View>;
};

export default InnerContainer;