import React from "react";
import {ImageBackground, StyleSheet} from "react-native";

import FastImage from "react-native-fast-image";

import {colors, images} from "@assets/index.ts";

interface AvatarProps {
    source?: string;
    size?: number;
    frameId?: number;
    noFrame?: boolean;
    defaultSource?: string;
}

const Avatar = ({
    source,
    size = 50,
    frameId = 0,
    noFrame = false,
    defaultSource = images.examples.pp,
}: AvatarProps) => {
    return (
        <ImageBackground
            source={
                noFrame ? undefined : images.cosmetics.avatarFrames[frameId]
            }
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                },
            ]}>
            <FastImage
                source={source ? {uri: source} : defaultSource}
                style={[
                    styles.image,
                    {
                        width: noFrame ? size : size * 0.72,
                        height: noFrame ? size : size * 0.72,
                        zIndex: 1,
                        borderRadius: size / 2,
                        borderWidth: noFrame ? 1 : 0,
                        borderColor: colors.secondary500,
                    },
                ]}
                resizeMode="cover"
            />
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        backgroundColor: "transparent",
    },
});

export default Avatar;
