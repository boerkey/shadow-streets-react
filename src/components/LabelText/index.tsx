import React from "react";
import {ImageBackground, ViewStyle} from "react-native";

import {images} from "@assets/index.ts";
import {AppText} from "@components/index.ts";
import {scaledValue} from "@utils/index.ts";

interface LabelTextProps {
    text: string;
    labelColor?: "green" | "red";
    style?: ViewStyle;
    width?: number;
}

const LabelText = ({
    text,
    labelColor = "green",
    width = 73,
    style,
}: LabelTextProps) => {
    return (
        <ImageBackground
            style={{
                alignItems: "center",
                justifyContent: "center",
                width: scaledValue(width),
                height: scaledValue(34),
                ...style,
            }}
            resizeMode={"stretch"}
            source={
                labelColor === "green"
                    ? images.containers.greenLabel
                    : images.containers.redLabel
            }>
            <AppText text={text} />
        </ImageBackground>
    );
};

export default LabelText;
