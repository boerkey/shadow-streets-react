import {User} from "@interfaces/UserInterface.ts";
import {MessageObjectInterface} from "@screens/chat/ChatMessageItem.tsx";
import {strings} from "@utils/index.ts";

export function getChatList(user: User) {
    const chatList = [
        {
            reference: `Chat/${user.lang}`,
            name: strings.chat.gameChat,
        },
    ];
    if (user.gang_id) {
        chatList.push({
            reference: `Chat/gang/${user.gang_id}`,
            name: strings.chat.gangChat,
        });
    }
    return chatList;
}

export function getTimeAgo(message: MessageObjectInterface) {
    const current_date = Date.now();

    // Handle missing createdAt field
    if (!message.createdAt) {
        return strings.chat.justNow;
    }

    const messageDate = new Date(message.createdAt).getTime();
    const difference = current_date - messageDate;
    let date;
    let ago;

    let days = Math.floor(difference / (60 * 60 * 24 * 1000));
    let hours = Math.floor(difference / (60 * 60 * 1000));
    let mins = Math.floor(difference / (60 * 1000));
    let secs = Math.floor(difference / 1000);

    if (days > 0) {
        date = days;
        ago = strings.chat.daysAgo;
    } else if (days < 1 && hours > 0) {
        date = hours;
        ago = strings.chat.hoursAgo;
    } else if (hours < 1 && mins > 0) {
        date = mins;
        ago = strings.chat.minutesAgo;
    } else if (mins < 1 && secs >= 0) {
        date = secs === 0 ? 1 : secs;
        ago = strings.chat.secondsAgo;
    }

    return `${date} ${ago}`;
}
