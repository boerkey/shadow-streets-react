import React from "react";
import {View, Text, StyleSheet, ImageBackground} from "react-native";
import {colors, images} from "@assets/index";
import {CheckBox, Header, AppText, AppInput, AppButton} from "@components/index";

const Test = () => {
    return (
        <ImageBackground
            source={images.backgrounds.blurMainBackground}
            style={{
                flex: 1,
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
            }}>
            <Header />
            <AppInput />
            <AppInput label={"HEY"} isRequired secureTextEntry />
            <AppInput invalid label={"HEY"} isRequired secureTextEntry />
            <AppButton />
        </ImageBackground>
    );
};

export default Test;
