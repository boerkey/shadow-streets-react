export interface JobResult {
    message: string;
    succeeded: boolean;
    experience_yield: number;
    message_yield: number;
    status_yield: number;
    money_yield: number;
    shadow_coin_yield: number;
    stats_gain: {
        strength: number;
        dexterity: number;
        intelligence: number;
        charisma: number;
    };
}

export interface PartyJobResult {
    message: string;
    succeeded: boolean;
    experience_yield: number;
    message_yield: number;
    status_yield: number;
    money_yield: number;
    strength_yield: number;
    dexterity_yield: number;
    intelligence_yield: number;
    charisma_yield: number;
    health_damage: number;
    item_found: boolean;
    items_yield?: {item_id: number; item_type: number; user_id: number}[];
}
