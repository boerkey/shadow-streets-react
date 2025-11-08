import {JobResult} from "./JobInterface";

export interface User {
    statistic: Statistic;
    auth: Auth;
    status: UserStatuses;
    encounters: UserEncounter[];
    messages: UserMessage[];
    bonuses: UserBonuses;

    id: number;
    name: string;
    class: number;
    level: number;
    bounty_level: number;
    experience: number;
    health: number;
    energy: number;
    strength: number;
    dexterity: number;
    intelligence: number;
    charisma: number;
    money: number;
    shadow_coin: number;
    status_block_until: string;
    location_x: number;
    location_y: number;
    last_job_at: string;
    lang: string;
    gang_id: number;
    properties: any; // Replace `any` with a more specific type if you know the structure
    items: any; // Replace `any` with a more specific type if you know the structure
    items_armors: any;
    items_weapons: any;
    items_goods: any;
    items_consumables: any;
    items_materials: any;
    items_helmets: any;
    CreatedAt: string;
    UpdatedAt: string;
    img_url: string;
    unread_encounters: number;
    unread_messages: number;
}

export enum UserRoles {
    USER = 1,
    BOT = 2,
    MODERATOR = 3,
    ADMIN = 4,
}

export enum UserStatuses {
    FREE = 0,
    HOSPITALIZED = 1,
    IN_JAIL = 2,
    SALARY_UNPAID = 5,
}

export interface Statistic {
    id: number;
    total_jobs: number;
    user_id: number;
}

export interface Auth {
    id: number;
    email: string;
    device_id: string;
    user_id: number;
    is_registered: boolean;
}

export interface UserMessage {
    id: number;
    sender_id: number;
    sender_name: string;
    user_id: number;
    title: string;
    message: string;
    time_ago: string;
    created_at: string;
    is_read: boolean;
}

export interface UserEncounter {
    id: number;
    user_id: number;
    encountered_user_id: number;
    encountered_user_name: string;
    encountered_user_level: number;
    encountered_user_img_url: string;
    encountered_user_avatar_frame_id: number;
    has_searched: boolean;
    has_investigated: boolean;
    location_name: string;
    encounter_location_x: number;
    encounter_location_y: number;
    encounter_location_b: number;
    encounter_location_f: number;
    found_location_x: number;
    found_location_y: number;
    created_at: string; // ISO string format (Date can be used if parsing is handled)
    updated_at: string; // ISO string format (Date can be used if parsing is handled)
    time_ago: string;
}

export interface UserStoryQuest {
    id: number;
    name: string;
    is_claimed: boolean;
    description: string;
    user_id: number;
    quest_id: number;
    required_amount: number;
    completed_amount: number;
    rewards: UserQuestReward[];
}

export interface UserDailyQuest {
    id: number;
    name: string;
    is_claimed: boolean;
    description: string;
    user_id: number;
    type: number;
    required_amount: number;
    completed_amount: number;
    rewards: UserQuestReward[];
    quest_id: number;
}

export interface UserQuestReward
    extends Record<QuestRewardType, number | UserQuestItemReward> {}

export enum QuestRewardType {
    MONEY = 1,
    EXPERIENCE = 2,
    STAT = 3,
    ITEM = 4,
    SHADOW_COIN = 5,
    RANDOM_ITEM_BY_QUALITY = 6,
}

export interface UserQuestItemReward {
    item_id: number;
    type: number;
    amount: number;
}

export interface UserBonuses {
    id: number;
    user_id: number;
    trade_efficiency: number;
    production_efficiency: number;
    max_health: number;
    max_energy: number;
    health_regen: number;
    energy_regen: number;
}

export interface Fight {
    id: number;
    attacker_id: number;
    defender_id: number;
    winner_id: number;
    attacker_health: number;
    defender_health: number;
    attacker_max_health: number;
    defender_max_health: number;
    attacker_damage: number;
    defender_damage: number;
    attacker_defence: number;
    defender_defence: number;
    attacker_level: number;
    defender_level: number;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    result_type: FightResultType;
    messages: FightMessage[];
    result: FightResult[];
    attacker_avatar_frame_id: number;
    defender_avatar_frame_id: number;
}

export interface FightMessage {
    id: number;
    fight_id: number;
    messages: Record<string, any>; // JSON map equivalent
    highlighted_words: string[];
}

export enum FightResultType {
    RESULT_TYPE_DEFENDER_CHARISMA_DODGE = 1,
    RESULT_TYPE_DEFENDER_WIN = 2,
    RESULT_TYPE_ATTACKER_WIN = 3,
    RESULT_TYPE_END_AFTER_TURNS = 4,
    RESULT_TYPE_UNEXPECTED_SYSTEM_ERROR = 5,
}

export interface FightResult {
    id: number;
    fight_id: number;
    user_id: number;
    strength_gain: number;
    dexterity_gain: number;
    intelligence_gain: number;
    charisma_gain: number;
    money_gain: number;
    experience_gain: number;
    prestige_gain: number;
    damage_dealt: number;
    damage_taken: number;
    bounty_gain: number;
}

export interface UserBoost {
    id: number;
    user_id: number;
    boost_id: number;
    created_at: string;
    updated_at: string;
    ends_at: string;
    ends_at_seconds: number;
}

export enum TicketStatus {
    Closed = 0,
    Pending = 1,
    Answered = 2,
}

export interface UserTicket {
    id: number;
    user_id: number;
    status: TicketStatus;
    topic: number;
    created_at: string;
    updated_at: string;
    messages: UserTicketMessage[];
    time_ago: string;
    img_urls: string;
}

export interface UserTicketMessage {
    id: number;
    ticket_id: number;
    message: string;
    created_at: string;
    updated_at: string;
    user_name: string;
    time_ago: string;
    user_id: number;
}

export enum MissionStatus {
    PREPARING = 0,
    ACTIVE = 1,
    COMPLETED = 2,
    FAILED = 3,
}

export interface UserMission {
    id: number;
    status: MissionStatus;
    round: number;
    max_rounds: number;
    user_id: number;
    mission_id: number;
    damage_dealt: number;
    damage_received: number;
    created_at: string;
    updated_at: string;
    outcome: UserMissionResult;
}

export interface UserMissionResult {
    id: number;
    user_id: number;
    mission_id: number;
    outcome: JobResult;
    created_at: string;
    updated_at: string;
}

interface UserPacks {
    id: number;
    user_id: number;
    daily_pack_1: number;
    daily_pack_2: number;
    sound_pack_1: number;
}

export interface UserSettings {
    user_id: number;
    auto_eat: number;
    auto_job_id: number;
    auto_job_amount: number;
    auto_party_job_id: number;
}
