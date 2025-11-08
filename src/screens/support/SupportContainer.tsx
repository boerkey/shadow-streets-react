import React, {useEffect, useState} from "react";
import {FlatList, ScrollView} from "react-native";

import {changeTicketStatus, getMyTickets} from "@apis/supportApis";
import {AppButton} from "@components/index";
import {strings} from "@utils/index.ts";
import TicketItem from "./TicketItem";

import {UserRoles, UserTicket} from "@interfaces/UserInterface";
import {RootState} from "@redux/index";

import {useSelector} from "react-redux";
import CreateTicketModal from "./CreateTicketModal";

const SupportContainer = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [isVisible, setIsVisible] = useState(false);
    const [expandedTicketId, setExpandedTicketId] = useState(-1);
    const [tickets, setTickets] = useState<UserTicket[]>([]);

    const isModeratorOrAdmin =
        user?.role === UserRoles.MODERATOR || user?.role === UserRoles.ADMIN;

    useEffect(() => {
        getTickets();
    }, [isVisible]);

    function getTickets() {
        getMyTickets().then(res => {
            setTickets(res.data.tickets);
        });
    }

    function updateTicketStatus(ticketId: number, status: string) {
        changeTicketStatus(ticketId, status).then(() => {
            getTickets();
        });
    }

    const _renderTicketItem = ({item}: {item: UserTicket}) => {
        return (
            <TicketItem
                ticket={item}
                getMyTickets={getTickets}
                updateTicketStatus={updateTicketStatus}
                onExpand={() =>
                    setExpandedTicketId(
                        expandedTicketId === item.id ? -1 : item.id,
                    )
                }
                isExpanded={expandedTicketId === item.id}
            />
        );
    };
    return (
        <>
            <CreateTicketModal
                isVisible={isVisible}
                onClose={() => setIsVisible(false)}
            />
            <ScrollView>
                <FlatList
                    data={tickets.filter(
                        ticket =>
                            expandedTicketId === -1 ||
                            expandedTicketId === ticket.id,
                    )}
                    renderItem={_renderTicketItem}
                    scrollEnabled={expandedTicketId === -1}
                    nestedScrollEnabled={true}
                />
            </ScrollView>
            {expandedTicketId === -1 && !isModeratorOrAdmin && (
                <AppButton
                    text={strings.support.createTicket}
                    width={225}
                    onPress={() => setIsVisible(true)}
                    style={{
                        alignSelf: "center",
                        position: "absolute",
                        bottom: 15,
                    }}
                />
            )}
        </>
    );
};

export default SupportContainer;
