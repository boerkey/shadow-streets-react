import React, {useEffect, useState} from "react";
import {FlatList, ImageBackground, View} from "react-native";

import {communicationApis} from "@apis/index";
import {colors, fonts, gapSize, images} from "@assets/index.ts";
import {AppText} from "@components/index.ts";
import {UserMessage} from "@interfaces/UserInterface.ts";
import {commonStyles, moderateScale, scaledValue} from "@utils/index.ts";

const Messages = () => {
    const [messages, setMessages] = useState<UserMessage[]>([]);

    useEffect(() => {
        getMessages();
    }, []);

    function getMessages() {
        communicationApis.getMessages().then(res => {
            setMessages(res.data.messages);
        });
    }

    const _renderItem = ({item}: {item: UserMessage}) => {
        return <MessageItem message={item} />;
    };
    return (
        <FlatList
            style={{padding: gapSize.size3L}}
            data={messages}
            renderItem={_renderItem}
        />
    );
};

export default Messages;

const MessageItem = ({message}: {message: UserMessage}) => {
    return (
        <ImageBackground
            source={images.containers.messageContainer}
            resizeMode={"stretch"}
            style={{
                minHeight: scaledValue(141),
                marginBottom: gapSize.sizeM,
                paddingHorizontal: gapSize.sizeM,
                paddingTop: gapSize.sizeL,
                paddingBottom: gapSize.size3L,
            }}>
            <AppText
                text={message.title}
                style={{
                    fontFamily: fonts.RockSalt,
                    fontSize: moderateScale(18),
                }}
                centered
                color={colors.grey900}
            />
            <AppText
                text={message.message}
                style={{
                    fontFamily: fonts.Gloria,
                    fontSize: moderateScale(14),
                    width: "95%",
                }}
                centered
                color={colors.grey900}
            />
            <View
                style={[
                    commonStyles.flexRowSpaceBetween,
                    {marginTop: gapSize.sizeS, marginHorizontal: gapSize.sizeM},
                ]}>
                <AppText
                    text={message.time_ago}
                    style={{
                        fontFamily: fonts.Gloria,
                        fontSize: moderateScale(14),
                    }}
                    color={colors.grey600}
                />
                <AppText
                    text={`- ${message.sender_name}`}
                    style={{
                        fontFamily: fonts.RockSalt,
                        fontSize: moderateScale(14),
                    }}
                    color={colors.grey900}
                />
            </View>
        </ImageBackground>
    );
};
