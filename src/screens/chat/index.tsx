import React, {useEffect, useRef, useState} from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    View,
} from "react-native";

import {useDispatch, useSelector} from "react-redux";

import {authApis} from "@apis/index";
import {gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {
    AppImage,
    AppInput,
    AppText,
    ScreenContainer,
    TitleHeader,
    TooltipDropdown,
} from "@components/index.ts";
import {chatActions} from "@redux/actions/index.ts";
import {RootState} from "@redux/index.ts";
import ChatMessageItem from "@screens/chat/ChatMessageItem.tsx";
import {getChatList} from "@screens/chat/logic.ts";
import Messages from "@screens/chat/Messages/Messages.tsx";
import TabButton from "@screens/chat/TabButton.tsx";
import {showToast} from "@utils/helperFunctions.ts";
import {commonStyles, strings} from "@utils/index.ts";
import {chatWebSocketV2} from "@utils/websocket_v2";

const Chat = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const blockedUsers = useSelector(
        (state: RootState) => state.auth.blockedUsers,
    );
    const currentChatIndex = useSelector(
        (state: RootState) => state.chat.currentChatIndex,
    );
    const gameChatMessages = useSelector(
        (state: RootState) => state.chat.gameChatMessages,
    );
    const gangChatMessages = useSelector(
        (state: RootState) => state.chat.gangChatMessages,
    );
    const loading = useSelector((state: RootState) => state.chat.loading);
    const [messageSending, setMessageSending] = useState(false);
    const [tab, setTab] = useState(1);
    const [communicationBanAsMinutes, setCommunicationBanAsMinutes] =
        useState(0);
    const [message, setMessage] = useState("");
    const scrolled = useRef(false);

    const chatList = getChatList(user);

    const messageFieldRef = useRef<TextInput>(null);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        getUserBans();
    }, []);

    useEffect(() => {
        establishConnections();

        return () => {
            readChatMessages();
        };
    }, []);

    useEffect(() => {
        if (isLastMessageIsMine()) {
            scrollToBottom();
        }
    }, [currentChatIndex, gameChatMessages, gangChatMessages]);

    useEffect(() => {
        scrollToBottom();
        readChatMessages();
    }, [currentChatIndex]);

    function getUserBans() {
        authApis.getUserBans().then(res => {
            if (res.data.bans) {
                setCommunicationBanAsMinutes(res.data.bans.communication);
            }
        });
    }

    function isLastMessageIsMine() {
        let lastMessage;
        if (currentChatIndex === 0) {
            lastMessage = gameChatMessages[gameChatMessages.length - 1];
        } else {
            lastMessage = gangChatMessages[gangChatMessages.length - 1];
        }
        return lastMessage?.user_id === user.id;
    }

    function readChatMessages() {
        if (currentChatIndex === 0) {
            dispatch(chatActions.setGameChatMessagesRead(true));
        } else {
            dispatch(chatActions.setGangChatMessagesRead(true));
        }
    }

    function establishConnections() {
        chatWebSocketV2.connectGameChannel(chatList[0].reference);
        chatList[1]?.reference &&
            chatWebSocketV2.connectGangChannel(chatList[1].reference);
    }

    function onChatRoomSwitch(index: number) {
        if (index !== currentChatIndex) {
            dispatch(chatActions.setCurrentChatIndex(index));
            scrolled.current = false;
        }
    }

    function sendMessage() {
        if (communicationBanAsMinutes > 0) {
            showToast(
                `You are banned from sending messages for ${communicationBanAsMinutes} minutes`,
                "",
                "warning",
            );
            return;
        }

        const finalMessageContent = message.trim();

        if (!finalMessageContent || messageSending) {
            return;
        }

        // Create message payload matching the expected format
        const messageData = {
            message: finalMessageContent,
            user_name: user.name,
            user_id: user.id,
            img_url: user.img_url,
            avatar_frame_id: user.avatar_frame_id,
        };

        setMessageSending(true);

        // Send message through WebSocket (it will add to Redux)
        const wasSent = chatWebSocketV2.sendMessage(
            messageData,
            chatList[currentChatIndex].reference,
        );

        if (wasSent) {
            setMessage("");
        } else {
            // Don't clear input, allow user to retry. Message was not sent.
            // setMessageSending(false); // It was never set to true for this attempt
            showToast(
                "Message not sent. Connection issue?",
                "Please wait a moment and try again.",
                "warning",
            );
        }
        setTimeout(() => setMessageSending(false), 1000);
    }

    function onTagPress(userName: string) {
        const currentMessage = message || "";
        const taggedUserName = "@" + userName.replaceAll(" ", "");
        let newMessage = "";

        if (currentMessage.includes(taggedUserName)) {
            // Tag exists, remove all instances and clean up spacing
            newMessage = currentMessage.replaceAll(taggedUserName, "");
            // Normalize spaces: trim, then replace multiple spaces with single space
            newMessage = newMessage.trim().replace(/\s\s+/g, " ");
        } else {
            // Tag does not exist, add it
            const trimmedCurrentMessage = currentMessage.trim();
            if (trimmedCurrentMessage.length === 0) {
                newMessage = taggedUserName;
            } else {
                newMessage = trimmedCurrentMessage + " " + taggedUserName;
            }
        }

        // Final adjustment for trailing space and ensuring message isn't just spaces
        if (newMessage.trim().length > 0) {
            // If there's actual content, ensure it ends with a space for easy typing.
            // Trim any existing trailing spaces first to avoid "word  " if it was "word ".
            newMessage = newMessage.trim() + " ";
        } else {
            // If newMessage became empty or all spaces (e.g. after removing the only tag)
            newMessage = "";
        }

        setMessage(newMessage);
    }

    function scrollToBottom() {
        setTimeout(
            () => flatListRef.current?.scrollToEnd({animated: true}),
            500,
        );
    }

    const _renderMessage = ({item}: {item: any}) => (
        <ChatMessageItem messageObject={item} onPress={onTagPress} />
    );

    function getChatListNames() {
        let listNames: {name: string}[] = [];
        chatList.forEach(each => listNames.push({name: each.name}));
        return listNames;
    }

    function getMessages() {
        if (currentChatIndex === 0) {
            return gameChatMessages;
        } else {
            return gangChatMessages;
        }
    }

    return (
        <ScreenContainer>
            <TitleHeader title={"Game Chat"} arrowLeftMargin={gapSize.size3L} />
            <View
                style={{
                    alignSelf: "center",
                    flexDirection: "row",
                    marginTop: gapSize.sizeL,
                }}>
                <TabButton
                    text={strings.chat.messages}
                    isSelected={tab === 2}
                    onPress={() => setTab(2)}
                />
                <TabButton
                    text={strings.chat.chat}
                    isSelected={tab === 1}
                    onPress={() => setTab(1)}
                />
            </View>
            {tab === 2 && <Messages />}
            {tab === 1 && (
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{flex: 1}}>
                    <View
                        style={{
                            padding: gapSize.size3L,
                            alignItems: "center",
                            flex: 1,
                        }}>
                        <View
                            style={[
                                commonStyles.flexRowAlignCenter,
                                {marginBottom: gapSize.sizeL},
                            ]}>
                            <TooltipDropdown
                                selectedIndex={currentChatIndex}
                                onSelect={i => onChatRoomSwitch(i)}
                                options={getChatListNames()}>
                                <AppText
                                    text={
                                        chatList[currentChatIndex]?.name || ""
                                    }
                                    color={"#fff"}
                                    type={TextTypes.BodyBold}
                                    style={{marginRight: gapSize.sizeS}}
                                />
                            </TooltipDropdown>
                            <AppImage
                                source={images.icons.arrowDown}
                                size={13}
                            />
                        </View>

                        {/* Messages List */}
                        <FlatList
                            ref={flatListRef}
                            data={getMessages().filter(
                                (message: any) =>
                                    !blockedUsers.some(
                                        (blockedUser: any) =>
                                            blockedUser.user_id ===
                                            message.user_id,
                                    ),
                            )}
                            getItemLayout={(data, index) => ({
                                length: 100,
                                offset: 100 * index,
                                index,
                            })}
                            renderItem={_renderMessage}
                            ListEmptyComponent={() => {
                                if (loading) {
                                    return (
                                        <ActivityIndicator
                                            style={{marginTop: "55%"}}
                                        />
                                    );
                                }
                                return <></>;
                            }}
                            style={{
                                width: "100%",
                                flex: 1, // Use flex instead of fixed height
                            }}
                            contentContainerStyle={{
                                flexGrow: 1,
                                paddingBottom: gapSize.sizeM,
                            }}
                            maintainVisibleContentPosition={{
                                minIndexForVisible: 0,
                            }}
                        />

                        {/* Input Field */}
                        <AppInput
                            onFocus={scrollToBottom}
                            loading={messageSending}
                            onRef={messageFieldRef}
                            onSubmitEditing={sendMessage}
                            value={message}
                            onChangeText={setMessage}
                            rightIconSource={images.icons.sendMessageArrow}
                            onRightIconPress={sendMessage}
                            placeholder={strings.chat.message}
                        />
                    </View>
                </KeyboardAvoidingView>
            )}
        </ScreenContainer>
    );
};

export default Chat;
