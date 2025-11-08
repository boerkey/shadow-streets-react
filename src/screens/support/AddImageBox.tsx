import React from "react";
import {Image, TouchableOpacity} from "react-native";

import {colors} from "@assets/index";
import AppText, {TextTypes} from "@components/AppText";
import {commonStyles, helperFunctions, scaledValue} from "@utils/index";

const AddImageBox = ({
    onImageSelected,
    style,
    imageToDisplay,
}: {
    onImageSelected: (image: any) => void;
    style?: any;
    imageToDisplay?: any;
}) => {
    function chooseImage() {
        helperFunctions.pickImage(5000000, "photo", false).then(image => {
            onImageSelected(image);
        });
    }

    return (
        <TouchableOpacity
            onPress={chooseImage}
            style={[
                commonStyles.alignAllCenter,
                {
                    backgroundColor: "#191717",
                    borderColor: colors.grey500,
                    borderWidth: 1,
                    width: scaledValue(80),
                    height: scaledValue(80),
                },
                style,
            ]}>
            {imageToDisplay ? (
                <Image
                    source={{uri: imageToDisplay?.path}}
                    style={{width: scaledValue(65), height: scaledValue(65)}}
                />
            ) : (
                <AppText
                    text={"+"}
                    type={TextTypes.H2}
                    color={colors.grey500}
                    fontSize={44}
                />
            )}
        </TouchableOpacity>
    );
};

export default AddImageBox;
