export interface GroupFight {
    id: number;
    status: number;
    status_text: string;
    round: number;
    end_round: number;
    location_x: number;
    location_y: number;
    location_b: number;
    location_name: string;
    property_id: number;
    type: number;
    goal: number;
    grade: number;
    winner_side: number;
    average_strength: number;
    average_dexterity: number;
    average_intelligence: number;
    average_charisma: number;
    average_health: number;
    average_damage: number;
    average_defence: number;
    created_at: string;
    updated_at: string;
    starts_at: string | null;
}

export interface GroupFightParticipant {
    user_id: number;
    user_name: string;
    level: number;
    health: number;
    max_health: number;
    status: number;
    damage: number;
    defence: number;
    total_dealt_damage: number;
    total_received_damage: number;
    gained_money: number;
    gained_shadow_coin: number;
    gained_experience: number;
    gained_prestige: number;
    avatar_frame_id: number;
    img_url: string;
}

export interface GroupFightSide {
    name: string;
    total_damage: number;
    total_defence: number;
    total_health: number;
    participants: GroupFightParticipant[] | null;
    total_participants: number;
}

export interface GroupFightDetails {
    group_fight: GroupFight;
    sides: {
        attacker: GroupFightSide;
        defender: GroupFightSide;
    };
}

// For the list endpoints (GetGroupFights, GetActiveGroupFightsInCurrentDistrict)
export interface GroupFightResponse {
    id: number;
    status: number;
    round: number;
    location_x: number;
    location_y: number;
    location_b: number;
    location_name: string;
    property_id: number;
    created_at: string;
    status_text: string;
    attacker_name: string;
    defender_name: string;
    is_active: boolean;
    grade: number;
}
