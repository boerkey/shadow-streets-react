import {MessageObjectInterface} from "@screens/chat/ChatMessageItem";
import $ from "../action_types";

interface ChatState {
    currentChatIndex: number;
    isChatMessagesRead: boolean;
    isGangChatMessagesRead: boolean;
    gameChatMessages: MessageObjectInterface[];
    gangChatMessages: MessageObjectInterface[];
    loading: boolean;
}

const initialState: ChatState = {
    currentChatIndex: 0,
    isChatMessagesRead: true,
    isGangChatMessagesRead: true,
    gameChatMessages: [],
    gangChatMessages: [],
    loading: false,
};

const chatReducer = (state = initialState, action: any): ChatState => {
    switch (action.type) {
        case $.SET_CURRENT_CHAT_INDEX:
            return {
                ...state,
                currentChatIndex: action.payload,
            };
        case $.SET_GAME_CHAT_MESSAGES_READ:
            return {
                ...state,
                isChatMessagesRead: action.payload,
            };
        case $.SET_GAME_CHAT_MESSAGES:
            return {
                ...state,
                gameChatMessages: action.payload,
            };
        case $.ADD_CHAT_MESSAGE:
            return {
                ...state,
                gameChatMessages: [...state.gameChatMessages, action.payload],
            };
        case $.SET_CHAT_LOADING:
            return {
                ...state,
                loading: action.payload,
            };
        case $.SET_GANG_CHAT_MESSAGES_READ:
            return {
                ...state,
                isGangChatMessagesRead: action.payload,
            };
        case $.SET_GANG_CHAT_MESSAGES:
            return {
                ...state,
                gangChatMessages: action.payload,
            };
        default:
            return state;
    }
};

export default chatReducer;
