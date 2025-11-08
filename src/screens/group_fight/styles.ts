import {colors, gapSize} from "@assets/index";
import {StyleSheet} from "react-native";

const styles = StyleSheet.create({
    progressBar: {
        padding: 2,
        paddingHorizontal: 4,
        backgroundColor: colors.grey900,
        marginTop: gapSize.sizeS / 2,
    },
});

export default styles;
