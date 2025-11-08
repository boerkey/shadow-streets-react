import {MessageObjectInterface} from "@screens/chat/ChatMessageItem";
import $ from "../action_types";

export const setCurrentChatIndex = (chatIndex: number) => ({
    type: $.SET_CURRENT_CHAT_INDEX,
    payload: chatIndex,
});

export const setGameChatMessages = (messages: MessageObjectInterface[]) => ({
    type: $.SET_GAME_CHAT_MESSAGES,
    payload: messages,
});

export const setGameChatMessagesRead = (isRead: boolean) => ({
    type: $.SET_GAME_CHAT_MESSAGES_READ,
    payload: isRead,
});

export const setGangChatMessagesRead = (isRead: boolean) => ({
    type: $.SET_GANG_CHAT_MESSAGES_READ,
    payload: isRead,
});

export const setGangChatMessages = (messages: MessageObjectInterface[]) => ({
    type: $.SET_GANG_CHAT_MESSAGES,
    payload: messages,
});

export const setChatLoading = (loading: boolean) => ({
    type: $.SET_CHAT_LOADING,
    payload: loading,
});
