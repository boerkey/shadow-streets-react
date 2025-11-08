import React from "react";
import {FlatList, TouchableOpacity, View} from "react-native";

import {colors, gapSize} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {AppImage, AppText} from "@components/index.ts";
import {scaledValue} from "@utils/index.ts";

interface DropdownProps {
    options?: Array<string>;
    selectedIndex?: number;
    onSelect: (index: number, item: string) => void;
    width?: number;
    textType?: TextTypes;
}

const Dropdown = ({
    options,
    selectedIndex,
    onSelect,
    width = 163,
    textType = TextTypes.H6,
}: DropdownProps) => {
    const isSelected = (i: number) => selectedIndex === i;
    const _renderItem = ({item, index}) => (
        <TouchableOpacity
            onPress={() => onSelect(index, item)}
            key={index}
            style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isSelected(index)
                    ? colors.secondary500
                    : "#181515",
                paddingHorizontal: scaledValue(8),
                paddingVertical: scaledValue(14),
                flexDirection: "row",
            }}>
            <AppText
                text={item.name}
                type={textType}
                color={
                    item.textColor
                        ? item.textColor
                        : isSelected(index)
                        ? colors.grey900
                        : colors.white
                }
            />
            {item.icon && (
                <AppImage
                    source={item.icon}
                    size={18}
                    style={{marginLeft: gapSize.sizeM}}
                />
            )}
        </TouchableOpacity>
    );
    return (
        <FlatList
            contentContainerStyle={{
                width: scaledValue(width),
                borderWidth: 1,
                borderColor: colors.secondary500,
                backgroundColor: colors.lineColor,
            }}
            data={options}
            renderItem={_renderItem}
            ItemSeparatorComponent={() => (
                <View
                    style={{
                        height: 1,
                        backgroundColor: colors.lineColor,
                        width: "85%",
                        alignSelf: "center",
                    }}
                />
            )}
        />
    );
};

export default Dropdown;
