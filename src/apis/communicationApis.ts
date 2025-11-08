import {axiosModule} from "@utils/index";

export function getMessages() {
    return axiosModule.get(`communication/get_messages`);
}

export function deleteMessage(messageId: number) {
    return axiosModule.get(`communication/delete_message/${messageId}`);
}

export function readMessage(messageId: number) {
    return axiosModule.get(`communication/read_message/${messageId}`);
}

export function applyBotRestriction() {
    return axiosModule.post(`communication/apply_bot_restriction`);
}
