import axiosModule from "@utils/axios";

export function getMyTickets() {
    return axiosModule.get("/support/get_my_tickets");
}

export function createTicket(
    topic: number,
    message: string,
    img_urls: string[],
) {
    return axiosModule.post("/support/create_ticket", {
        topic,
        message,
        img_urls: img_urls.join("|"),
    });
}

export function answerTicket(ticket_id: number, message: string) {
    return axiosModule.post("/support/answer_ticket", {
        ticket_id,
        message,
    });
}

export function changeTicketStatus(ticket_id: number, status: string) {
    return axiosModule.post("/support/change_ticket_status", {
        ticket_id,
        status,
    });
}

export function getAllReports() {
    return axiosModule.get("/support/get_all_reports");
}

export function createReport(
    type: number,
    content: string,
    reported_user_id: number,
) {
    return axiosModule.post("/support/create_report", {
        type,
        content,
        reported_user_id,
    });
}

export function takeActionOnReport(report_id: number, action: number) {
    return axiosModule.post("/support/take_action_on_report", {
        report_id,
        action,
    });
}
