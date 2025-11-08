import {scaledValue} from "@utils/index.ts";
import React from "react";
import {Image, StyleProp, TouchableOpacity} from "react-native";

interface Props {
    source: any;
    size?: number;
    style?: StyleProp<any>;
    containerStyle?: StyleProp<any>;
    resizeMode?: "cover" | "contain";
    onPress?(): void;
    hitSlop?: {top: number; left: number; bottom: number; right: number};
}

const AppImage = ({
    source,
    onPress,
    size = 30,
    style,
    containerStyle,
    resizeMode = "contain",
    hitSlop,
}: Props) => {
    if (onPress) {
        return (
            <TouchableOpacity
                style={containerStyle}
                onPress={onPress}
                hitSlop={hitSlop}>
                <Image
                    source={source}
                    style={{
                        width: scaledValue(size),
                        height: scaledValue(size),
                        ...style,
                    }}
                    resizeMode={resizeMode}
                />
            </TouchableOpacity>
        );
    }

    return (
        <Image
            source={source}
            style={{
                width: scaledValue(size),
                height: scaledValue(size),
                ...style,
            }}
            resizeMode={resizeMode}
        />
    );
};

export default AppImage;
