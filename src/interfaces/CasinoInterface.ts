export interface BlackjackCard {
    id: number; // 1-52
    suit: "hearts" | "diamonds" | "clubs" | "spades";
    rank:
        | "A"
        | "2"
        | "3"
        | "4"
        | "5"
        | "6"
        | "7"
        | "8"
        | "9"
        | "10"
        | "J"
        | "Q"
        | "K";
    value: number; // For blackjack calculations
}
