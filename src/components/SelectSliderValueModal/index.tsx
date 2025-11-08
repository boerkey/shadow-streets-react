import React, {useState} from "react";
import {View} from "react-native";

import Slider from "@react-native-community/slider";

import {colors, gapSize} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {AppButton, AppModal, AppText} from "@components/index.ts";
import {SCREEN_HEIGHT, SCREEN_WIDTH, strings} from "@utils/index";

interface SelectSliderValueModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSelect: (value: number) => void;
    title: string;
    description: string;
    postSliderValueCharacter?: string;
    value?: number;
}

const defaultSliderValue = 20;

const SelectSliderValueModal = ({
    isVisible,
    onClose,
    onSelect,
    title = "Title",
    value = defaultSliderValue,
    description = "",
    postSliderValueCharacter = "%",
}: SelectSliderValueModalProps) => {
    const [sliderValue, setSliderValue] = useState(value);

    return (
        <AppModal isVisible={isVisible} onClose={onClose}>
            <View
                style={{
                    height: SCREEN_HEIGHT * 0.33,
                    width: SCREEN_WIDTH * 0.8,
                    borderWidth: 1,
                    borderColor: colors.secondary500,
                    backgroundColor: colors.black,
                    alignItems: "center",
                    padding: gapSize.sizeL,
                }}>
                <AppText text={title} type={TextTypes.H2} />
                <Slider
                    style={{width: "90%", marginTop: gapSize.sizeM}}
                    minimumValue={0}
                    maximumValue={100}
                    step={1}
                    value={sliderValue}
                    onSlidingComplete={value => {
                        setSliderValue(value);
                    }}
                    minimumTrackTintColor={colors.secondary500}
                />
                <AppText
                    text={sliderValue}
                    postText={postSliderValueCharacter}
                    type={TextTypes.H2}
                    color={colors.secondary500}
                    fontSize={22}
                />
                <AppText
                    text={description}
                    type={TextTypes.Body}
                    style={{marginTop: gapSize.sizeM}}
                />
                <View style={{marginTop: gapSize.size2L}}>
                    <AppButton
                        text={strings.common.select}
                        onPress={() => {
                            onClose();
                            onSelect(sliderValue);
                        }}
                    />
                </View>
            </View>
        </AppModal>
    );
};

export default SelectSliderValueModal;
