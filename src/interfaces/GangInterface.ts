// Gang related interfaces
export interface Gang {
    id: number;
    name: string;
    owner_id: number;
    img_url: string;
    bounty_point: number;
    money: number;
    member_amount: number;
    total_prestige: number;
    leader_name: string;

    applications?: GangApplication[];
    upgrades?: GangUpgrade[];
}

export interface GangUpgrade {
    id: number;
    gang_id: number;
    upgrade_id: number;
    level: number;
}

export enum GangMemberRoles {
    JOIN_REQUEST,
    MEMBER,
    OWNER,
}

export interface GangMember {
    id: number;
    name: string;
    level: number;
    role: GangMemberRoles;
    user_id: number;
    last_active_ago: string;
    avatar_frame_id: number;
    img_url: string;
}

export interface GangApplication {
    id: number;
    gang_id: number;
    user_id: number;
    name: string;
    level: number;
}

export interface GangUpgrade {
    id: number;
    gang_id: number;
    upgrade_id: number;
    level: number;
}

export interface GangUpgradeData {
    id: number;
    name: string;
    description: string;
    cost: number[];
    bounty_point_cost: number[];
    bonus: number[];
    normalizer_multiplier: number;
    bonus_indicator_start_character: string;
    bonus_indicator_end_character: string;
    max_level: number;
}

export interface BoostData {
    id: number;
    name: string;
    description: string;
    duration: number;
    price: number;
    image_id?: number;
}
