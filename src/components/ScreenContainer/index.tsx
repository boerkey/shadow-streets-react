import React, {ReactNode} from "react";
import {ImageSourcePropType, SafeAreaView, StyleProp} from "react-native";

import {images} from "@assets/index.ts";
import {commonStyles} from "@utils/index.ts";
import FastImage from "react-native-fast-image";

interface ScreenContainerProps {
    children: ReactNode[] | ReactNode;
    style?: StyleProp<any>;
    isSafeAreaView?: boolean;
    source?: ImageSourcePropType;
}

const ScreenContainer = ({
    children,
    style,
    isSafeAreaView = true,
    source = images.backgrounds.blurMainBackground,
}: ScreenContainerProps) => {
    if (!isSafeAreaView) {
        return (
            <FastImage source={source} style={commonStyles.container}>
                {children}
            </FastImage>
        );
    }
    return (
        <FastImage source={source} style={commonStyles.container}>
            <SafeAreaView style={style ? style : commonStyles.container}>
                {children}
            </SafeAreaView>
        </FastImage>
    );
};

export default ScreenContainer;
