import React, {useState} from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native";

import FastImage from "react-native-fast-image";
import {useSelector} from "react-redux";

import {supportApis} from "@apis/index";
import {colors, gapSize, images} from "@assets/index";
import AppText, {TextTypes} from "@components/AppText";
import {
    AppImage,
    AppInput,
    Divider,
    FullScreenImageViewModal,
} from "@components/index";
import StatusChip from "@components/StatusChip";
import TooltipDropdown from "@components/TooltipDropdown";
import {
    TicketStatus,
    UserRoles,
    UserTicket,
    UserTicketMessage,
} from "@interfaces/UserInterface";
import {RootState} from "@redux/index";
import {getDarkBackground} from "@utils/helperFunctions";
import {commonStyles, scaledValue, strings} from "@utils/index";

const TicketItem = ({
    ticket,
    getMyTickets,
    updateTicketStatus,
    onExpand,
    isExpanded,
}: {
    ticket: UserTicket;
    getMyTickets: () => void;
    updateTicketStatus: (ticketId: number, status: string) => void;
    onExpand: () => void;
    isExpanded: boolean;
}) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const isModeratorOrAdmin =
        user?.role === UserRoles.MODERATOR || user?.role === UserRoles.ADMIN;
    const [message, setMessage] = useState("");
    const [selectedImageUrl, setSelectedImageUrl] = useState<any>("");

    function getBorderStyle() {
        switch (ticket.status) {
            case TicketStatus.Closed:
                return {borderColor: "#5E5E5E"};
            case TicketStatus.Pending:
                return {borderColor: colors.yellow};
            case TicketStatus.Answered:
                return {borderColor: colors.green};
        }
    }

    function getStatusColor(
        status: TicketStatus,
        getPlainColor = false,
    ): string | "Grey" | "Yellow" | "Green" {
        switch (status) {
            case TicketStatus.Closed:
                return getPlainColor ? colors.grey500 : "Grey";
            case TicketStatus.Pending:
                return getPlainColor ? colors.yellow : "Yellow";
            case TicketStatus.Answered:
                return getPlainColor ? colors.green : "Green";
        }
    }

    function getStatusDropdownOptions() {
        if (!isModeratorOrAdmin) return [];
        const options: {id: number; name: string; textColor: string}[] = [];
        const changeStatusTo = strings.support.changeStatusTo;
        ticket.status !== TicketStatus.Closed &&
            options.push({
                id: TicketStatus.Closed,
                name:
                    changeStatusTo +
                    " " +
                    strings.support.ticketStatus[TicketStatus.Closed],
                textColor: getStatusColor(TicketStatus.Closed, true) as string,
            });
        /*
        options.push({
            id: TicketStatus.Pending,
            name:
                changeStatusTo +
                " " +
                strings.support.ticketStatus[TicketStatus.Pending],
            textColor: getStatusColor(TicketStatus.Pending, true) as string,
        });
        options.push({
            id: TicketStatus.Answered,
            name:
                changeStatusTo +
                " " +
                strings.support.ticketStatus[TicketStatus.Answered],
            textColor: getStatusColor(TicketStatus.Answered, true) as string,
        });
        */
        return options;
    }

    function answerTicket() {
        if (message.trim() === "") return;
        supportApis.answerTicket(ticket.id, message).then(() => {
            setMessage("");
            getMyTickets();
        });
    }

    function renderTicketImages() {
        const img_urls = ticket.img_urls.split("|");
        return img_urls.map(url => {
            if (!url) return null;
            return (
                <TouchableOpacity
                    onPress={() => setSelectedImageUrl({uri: url})}
                    key={url}>
                    <FastImage
                        source={{uri: url}}
                        style={{
                            width: scaledValue(45),
                            height: scaledValue(45),
                            marginBottom: gapSize.sizeS,
                            marginRight: gapSize.sizeM,
                        }}
                    />
                </TouchableOpacity>
            );
        });
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{
                height: scaledValue(isExpanded ? 600 : 80),
                borderWidth: 1,
                ...getBorderStyle(),
                padding: scaledValue(12),
                backgroundColor: getDarkBackground(66),
                marginBottom: gapSize.sizeM,
            }}>
            <FullScreenImageViewModal
                isVisible={!!selectedImageUrl}
                onClose={() => setSelectedImageUrl("")}
                imageUrl={selectedImageUrl}
            />
            <View style={commonStyles.flexRowSpaceBetweenAlignCenter}>
                <TouchableOpacity
                    style={commonStyles.flexRowAlignCenter}
                    onPress={() => {
                        onExpand();
                    }}>
                    <AppText
                        text={
                            strings.support.topics.find(
                                (topic: any) => topic.id === ticket.topic,
                            )?.name
                        }
                        type={TextTypes.BodyBold}
                    />
                    <AppImage
                        source={images.icons.arrowDown}
                        size={12}
                        style={{marginLeft: gapSize.sizeS}}
                    />
                </TouchableOpacity>
                <TooltipDropdown
                    options={getStatusDropdownOptions()}
                    dropdownWidth={scaledValue(200)}
                    textType={TextTypes.Body}
                    onSelect={(index, item) => {
                        updateTicketStatus(ticket.id, item.id);
                    }}>
                    <StatusChip
                        status={
                            getStatusColor(ticket.status) as
                                | "Grey"
                                | "Yellow"
                                | "Green"
                        }
                        text={strings.support.ticketStatus[ticket.status]}
                        width={scaledValue(90)}
                        rightIcon={
                            isModeratorOrAdmin
                                ? images.icons.arrowDown
                                : undefined
                        }
                        rightIconSize={12}
                    />
                </TooltipDropdown>
            </View>
            <AppText
                text={ticket.time_ago}
                color={colors.grey500}
                style={{marginTop: scaledValue(4)}}
            />

            {isExpanded && (
                <View style={{flex: 1, marginTop: gapSize.sizeM}}>
                    <Divider width={"100%"} marginVertical={gapSize.sizeM} />
                    <View style={{flexDirection: "row", flexWrap: "wrap"}}>
                        {renderTicketImages()}
                    </View>
                    <ScrollView
                        nestedScrollEnabled
                        style={{
                            marginVertical: gapSize.sizeM,
                        }}
                        contentContainerStyle={{
                            paddingBottom: scaledValue(10),
                        }}>
                        {ticket.messages.map(messageItem => (
                            <TicketMessageItem
                                key={messageItem.id}
                                message={messageItem}
                                isMyMessage={messageItem.user_id === user?.id}
                            />
                        ))}
                    </ScrollView>
                    {ticket.status !== TicketStatus.Closed && (
                        <AppInput
                            placeholder={strings.support.writeMessage}
                            onChangeText={setMessage}
                            value={message}
                            width={"100%"}
                            rightIconSource={images.icons.sendMessageArrow}
                            onRightIconPress={answerTicket}
                            style={{
                                marginBottom: gapSize.sizeL,
                            }}
                        />
                    )}
                </View>
            )}
        </KeyboardAvoidingView>
    );
};

export default TicketItem;

const TicketMessageItem = ({
    message,
    isMyMessage = false,
}: {
    message: UserTicketMessage;
    isMyMessage: boolean;
}) => {
    function getContainerStyle() {
        if (isMyMessage) {
            return {backgroundColor: colors.secondaryTwo500};
        }
        return {
            backgroundColor: getDarkBackground(66),
            borderWidth: 1,
            borderColor: colors.secondary500,
        };
    }
    return (
        <View
            style={{
                paddingVertical: scaledValue(8),
                paddingHorizontal: scaledValue(12),
                borderRadius: scaledValue(8),
                ...getContainerStyle(),
                marginBottom: scaledValue(8),
            }}>
            <View style={commonStyles.flexRowSpaceBetweenAlignCenter}>
                <AppText
                    text={message.user_name}
                    type={TextTypes.BodyBold}
                    color={isMyMessage ? colors.green : colors.secondary500}
                />
                <AppText
                    text={message.time_ago}
                    type={TextTypes.Caption2}
                    color={colors.grey500}
                />
            </View>
            <AppText
                text={message.message}
                style={{marginTop: scaledValue(4)}}
            />
        </View>
    );
};
