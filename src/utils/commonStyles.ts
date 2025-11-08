import {StyleSheet} from "react-native";

const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centeredContainer: {
        flex: 1,
        alignItems: "center",
    },
    fullCenteredContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    flexRow: {
        flexDirection: "row",
    },
    flexRowAlignCenter: {
        flexDirection: "row",
        alignItems: "center",
    },
    flexRowAlignStartSpaceBetween: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
    },
    flexRowReverseAlignCenter: {
        flexDirection: "row-reverse",
        alignItems: "center",
    },
    flexRowSpaceBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    flexRowSpaceEvenly: {
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    flexRowSpaceBetweenAlignCenter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    flexRowAlignEnd: {
        flexDirection: "row",
        alignItems: "flex-end",
    },
    alignCenter: {
        alignSelf: "center",
    },
    alignItemsCenter: {
        alignItems: "center",
    },
    alignAllCenter: {
        alignItems: "center",
        justifyContent: "center",
    },
    hitSlop: {
        top: 8,
        left: 8,
        bottom: 8,
        right: 8,
    },
    bigHitSlop: {
        top: 16,
        left: 16,
        bottom: 16,
        right: 16,
    },
    modalContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
});

export default commonStyles;
