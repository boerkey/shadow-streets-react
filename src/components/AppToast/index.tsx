import React from "react";
import {View} from "react-native";

import {scaledValue, SCREEN_WIDTH} from "@utils/index.ts";
import {AppImage, AppText} from "@components/index.ts";
import {colors, images} from "@assets/index.ts";
import {JobResult} from "@interfaces/JobInterface.ts";
import {TextTypes} from "@components/AppText";

interface AppToastProps {
    text1?: string;
    text2?: string;
    type?: "success" | "warning" | "error";
    jobResult?: JobResult;
}

export const AppToast = ({text1, text2, type = "success"}: AppToastProps) => {
    function getTypeColor() {
        switch (type) {
            case "success":
                return colors.green;
            case "warning":
                return colors.orange;
            case "error":
                return colors.red;
        }
    }

    function getIcon() {
        switch (type) {
            case "success":
                return images.icons.toastSuccess;
            case "warning":
                return images.icons.toastWarning;
            case "error":
                return images.icons.toastError;
        }
    }

    return (
        <View
            style={{
                paddingVertical: 12,
                paddingHorizontal: 16,
                backgroundColor: colors.black,
                height: scaledValue(76),
                width: SCREEN_WIDTH * 0.87,
                flexDirection: "row",
                top: scaledValue(15),
            }}>
            <View
                style={{
                    position: "absolute",
                    left: 0,
                    height: scaledValue(76),
                    width: 2,
                    backgroundColor: getTypeColor(),
                }}
            />
            <AppImage source={getIcon()} size={30} />
            <View style={{marginLeft: 12, width: "90%"}}>
                <AppText
                    text={text1}
                    type={TextTypes.BodyBold}
                    color={getTypeColor()}
                />
                <AppText
                    text={text2}
                    color={colors.white}
                    fontSize={12}
                    style={{width: "90%", marginTop: 4}}
                />
            </View>
        </View>
    );
};
