import React from "react";
import {TouchableOpacity} from "react-native";
import {scaledValue} from "@utils/index.ts";
import {AppText} from "@components/index.ts";
import {colors} from "@assets/index.ts";

interface TabButtonProps {
    text: string;
    isSelected: boolean;
    onPress(): void;
}

const TabButton = ({text, isSelected, onPress}: TabButtonProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                width: scaledValue(108),
                height: scaledValue(38),
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: colors.secondary500,
                backgroundColor: isSelected ? colors.secondary500 : "#35434E",
                marginRight: 12,
            }}>
            <AppText
                text={text}
                type={"h6"}
                fontSize={12}
                color={isSelected ? colors.grey900 : colors.secondary500}
            />
        </TouchableOpacity>
    );
};

export default TabButton;
