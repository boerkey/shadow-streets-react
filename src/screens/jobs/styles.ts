import {colors, gapSize} from "@assets/index.ts";
import {StyleSheet} from "react-native";

const styles = StyleSheet.create({
    mainContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: colors.borderColor,
    },
    requirementsContainer: {
        padding: gapSize.sizeL,
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: colors.borderColor,
        width: "100%",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
});

export default styles;
