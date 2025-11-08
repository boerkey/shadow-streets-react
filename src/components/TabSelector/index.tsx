import React, {useRef} from "react";
import {
    Platform,
    ScrollView,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

import {colors, gapSize} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {AppText} from "@components/index.ts";
import {commonStyles, scaledValue} from "@utils/index.ts";

interface TabSelectorProps {
    items: any[]; // List of tab titles.
    selectedIndex?: number; // 0-based index of the currently selected tab.
    onSelect?(index: number, item: any): void; // Called when a tab is pressed.
    style?: ViewStyle;
}

export const TabSelector = ({
    items,
    selectedIndex,
    onSelect,
    style,
}: TabSelectorProps) => {
    const isSelected = (i: number) => i === selectedIndex;
    const scrollRef = useRef<ScrollView>(null);

    function getTypeStylesForContainer(i: number) {
        return {
            marginRight: 4,
            backgroundColor: isSelected(i) ? colors.borderColor : "#35434E",
            alignItems: "center",
            justifyContent: "center",
            minWidth: scaledValue(65),
            paddingHorizontal: gapSize.sizeM,
            height: scaledValue(31),
        };
    }

    function getTextColor(i: number) {
        return isSelected(i) ? "#151515" : colors.grey50;
    }

    return (
        <View
            style={{
                zIndex: 2,
                ...style,
                height: 35,
                marginBottom: gapSize.sizeM,
            }}>
            <ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={[commonStyles.flexRow]}>
                {items.map((item, i) => (
                    <TouchableOpacity
                        key={i}
                        onPress={() => {
                            onSelect?.(i, item);
                            setTimeout(() => {
                                scrollRef.current?.scrollTo({
                                    x: i * scaledValue(40 + i * 5),
                                    y: 0,
                                    animated: true,
                                });
                            }, 100);
                        }}
                        style={getTypeStylesForContainer(i)}>
                        <AppText
                            text={item?.name ? item?.name : item}
                            type={TextTypes.BodyBold}
                            color={getTextColor(i)}
                            style={{
                                marginTop: Platform.OS === "android" ? -2 : 0,
                            }}
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export default TabSelector;
