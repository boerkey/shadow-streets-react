import {StyleSheet} from "react-native";
import {colors, gapSize} from "@assets/index.ts";
import {scaledValue, SCREEN_HEIGHT} from "@utils/index.ts";
import {getDarkBackground} from "@utils/helperFunctions.ts";

const styles = StyleSheet.create({
    sectionContainer: {
        borderColor: colors.borderColor,
        borderWidth: 0.5,
        height: SCREEN_HEIGHT * 0.75,
        width: "100%",
        padding: gapSize.sizeL,
    },
    noBackgroundSectionContainer: {
        height: SCREEN_HEIGHT * 0.75,
        width: "100%",
        padding: gapSize.sizeL,
    },
    visitorMessageContainer: {
        backgroundColor: colors.secondaryTwo700,
        paddingVertical: gapSize.sizeS,
        paddingHorizontal: gapSize.sizeM,
        borderTopLeftRadius: gapSize.sizeM,
        borderTopRightRadius: gapSize.sizeM,
        borderBottomRightRadius: gapSize.sizeM,
        minWidth: scaledValue(115),
        maxWidth: scaledValue(155),
        position: "absolute",
        left: gapSize.size6L,
        top: -gapSize.sizeM,
        zIndex: 2,
    },
});

export default styles;
