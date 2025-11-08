import React from "react";
import {View} from "react-native";

import FastImage from "react-native-fast-image";

import AppModal from "@components/AppModal";
import {SCREEN_WIDTH} from "@utils/index";

const FullScreenImageViewModal = ({
    isVisible,
    onClose,
    imageUrl,
}: {
    isVisible: boolean;
    onClose: () => void;
    imageUrl: string;
}) => {
    return (
        <AppModal isVisible={isVisible} onClose={onClose}>
            <View
                style={{
                    width: SCREEN_WIDTH * 0.85,
                    height: SCREEN_WIDTH * 0.85,
                }}>
                <FastImage
                    source={imageUrl}
                    style={{
                        alignSelf: "center",
                        width: "100%",
                        height: "100%",
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />
            </View>
        </AppModal>
    );
};

export default FullScreenImageViewModal;
