import React from "react";
import {
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText/index.tsx";
import {AppText, Avatar} from "@components/index.ts";
import {RootState} from "@redux/index.ts";
import {getTimeAgo} from "@screens/chat/logic.ts";
import {commonStyles, scaledValue} from "@utils/index.ts";
import {useSelector} from "react-redux";
import {navigate, SCREEN_NAMES} from "../../router.tsx";

export interface MessageObjectInterface {
    user_name: string;
    message: string;
    user_id: number;
    img_url?: string;
    createdAt: string; // ISO date string
    avatar_frame_id?: number;
}

export interface MessageItemInterface {
    messageObject: MessageObjectInterface;
    onPress?: (userName: string) => void;
}

const ChatMessageItem = ({
    messageObject = {
        user_name: "Boerkey",
        message:
            "Adminim ben kardeşim, sen anlıyor musun? Adminim ben kardeşim, sen anlıyor musun? Adminim ben kardeşim, sen anlıyor musun? ",
        user_id: 0,
        img_url: "",
        createdAt: new Date().toISOString(),
        avatar_frame_id: 0,
    },
    onPress = () => {},
}: MessageItemInterface) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const side = messageObject.user_id === user.id ? "right" : "left";
    function getBackground() {
        return side === "left"
            ? images.containers.chatBubble2
            : images.containers.chatBubble1;
    }

    function getExtraHeight() {
        const messageLength = messageObject.message.length;
        if (messageLength > 60) {
            return (messageLength - 60) * scaledValue(0.55);
        }
        return 0;
    }

    function getTaggedTexts(sourceStr: string) {
        const tagIndexes = [...sourceStr.matchAll(new RegExp("@", "gi"))].map(
            a => a.index,
        );
        const emptySpaceIndexes = [
            ...sourceStr.matchAll(new RegExp(" ", "gi")),
        ].map(a => a.index);

        let highlightedStrings = [];
        if (tagIndexes.length > 0) {
            for (let i = 0; i < tagIndexes.length; i++) {
                const tagIndexPosition = tagIndexes[i];
                let nextSpacePosition = sourceStr.length;

                for (let k = 0; k < emptySpaceIndexes.length; k++) {
                    const emptySpacePosition = emptySpaceIndexes[k];
                    if (emptySpacePosition > tagIndexPosition) {
                        nextSpacePosition = emptySpacePosition;
                        break;
                    }
                }

                highlightedStrings.push(
                    sourceStr.substring(tagIndexPosition, nextSpacePosition),
                );
            }
        }

        return highlightedStrings;
    }

    return (
        <View
            style={
                side === "left" ? styles.leftContainer : styles.rightContainer
            }>
            <TouchableOpacity
                onPress={() =>
                    navigate(SCREEN_NAMES.PLAYER_PROFILE, {
                        user_id: messageObject.user_id,
                        chatMessage: messageObject.message,
                    })
                }>
                <Avatar
                    source={messageObject.img_url}
                    frameId={messageObject.avatar_frame_id}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPress(messageObject.user_name)}>
                <ImageBackground
                    source={getBackground()}
                    resizeMode={"stretch"}
                    style={{
                        height: scaledValue(76 + getExtraHeight()),
                        width: scaledValue(290),
                        paddingHorizontal: scaledValue(12),
                        paddingVertical: scaledValue(8),
                    }}>
                    <View style={commonStyles.flexRowSpaceBetween}>
                        <AppText
                            text={messageObject.user_name}
                            type={TextTypes.BodyBold}
                            color={colors.secondary500}
                        />
                        <AppText
                            text={getTimeAgo(messageObject)}
                            type={TextTypes.Caption}
                            color={colors.grey400}
                        />
                    </View>
                    <AppText
                        text={messageObject.message}
                        wordsToHighlight={getTaggedTexts(messageObject.message)}
                        highlightStyle={{
                            color: colors.green,
                        }}
                    />
                </ImageBackground>
            </TouchableOpacity>
        </View>
    );
};

export default ChatMessageItem;

const styles = StyleSheet.create({
    leftContainer: {
        flexDirection: "row-reverse",
        alignItems: "flex-end",
        marginBottom: gapSize.sizeM,
    },
    rightContainer: {
        ...commonStyles.flexRowAlignEnd,
        marginBottom: gapSize.sizeM,
    },
});
