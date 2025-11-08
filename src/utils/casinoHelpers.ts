import {BlackjackCard} from "@interfaces/CasinoInterface.ts";

export function mapCardNumberToCard(cardNumber: number): BlackjackCard {
    const zeroBasedCardNumber = cardNumber - 1; // Adjust for 1-based index from backend
    const suitIndex = Math.floor(zeroBasedCardNumber / 13); // 0-3
    const rankIndex = zeroBasedCardNumber % 13; // 0-12

    const suits = ["hearts", "diamonds", "clubs", "spades"];
    const ranks = [
        "A",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K",
    ];

    return {
        id: cardNumber,
        suit: suits[suitIndex] as BlackjackCard["suit"],
        rank: ranks[rankIndex] as BlackjackCard["rank"],
        value: getCardValue(ranks[rankIndex]),
    };
}

export function getImageNumber(cardNumber: number) {
    const zeroBasedCardNumber = cardNumber - 1; // Adjust for 1-based index from backend
    const suitIndex = Math.floor(zeroBasedCardNumber / 13); // 0-3
    const rankIndex = zeroBasedCardNumber % 13; // 0-12

    // Calculate the image number (1-52)
    let lastNumber = suitIndex * 13 + rankIndex + 1;
    if (lastNumber > 52) {
        lastNumber = 52;
    }
    if (lastNumber < 1) {
        lastNumber = 1;
    }
    return lastNumber;
}

// Helper function to get card value
function getCardValue(rank: string): number {
    if (rank === "A") return 11; // Ace can be 1 or 11
    if (["J", "Q", "K"].includes(rank)) return 10;
    return parseInt(rank);
}

// Function to calculate hand total (handling Aces)
export function calculateHandTotal(cards: BlackjackCard[]): number {
    let total = 0;
    let aces = 0;

    // First pass: count all cards except aces
    cards.forEach(card => {
        if (card.rank === "A") {
            aces++;
        } else {
            total += card.value;
        }
    });

    // Second pass: handle aces
    for (let i = 0; i < aces; i++) {
        if (total + 11 <= 21) {
            total += 11;
        } else {
            total += 1;
        }
    }

    return total;
}
