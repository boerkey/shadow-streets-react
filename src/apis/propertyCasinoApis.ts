import {axiosModule} from "@utils/index.ts";
import {BlackjackAction} from "@screens/property_details/Casino/Blackjack.tsx";

export function getCasinoDetails(property_id: number) {
    return axiosModule.get("property/get_casino_details", {
        params: {
            property_id,
        },
    });
}

export function startBlackjackBet(property_id: number, bet_amount: number) {
    return axiosModule.post("property/start_blackjack_bet", {
        property_id,
        bet_amount,
    });
}

export function doBlackjackAction(bet_id: number, action: BlackjackAction) {
    return axiosModule.post("property/do_blackjack_action", {
        bet_id,
        action,
    });
}
