export enum ItemQuality {
    Common,
    Rare,
    Epic,
    Legendary,
}

export enum ItemType {
    Consumable = 1,
    Goods = 2,
    Weapon = 3,
    Armor = 4,
    Material = 5,
    Helmet = 6,
}

export enum PropertyType {
    Vehicle = 0,
    Flat = 1,
    Shop = 2,
    Production = 3,
    Casino = 4,
    WeaponDealer = 5,
    Garage = 6,
}

export enum PropertyStatus {
    Passive,
    Active,
}

export enum QuestRewardType {
    Money,
    Exp,
    Stat,
    Item,
}

export enum SubPropertyKeys {
    Damage = "damage",
    Defence = "defence",
    MaxHealth = "max_health",
    HealthRegen = "health_regen",
    MaxEnergy = "max_energy",
    EnergyRegen = "energy_regen",
}

export interface SubProperty {
    [key in SubPropertyKeys]?: number;
}

export interface BaseItem {
    id: number; // primary key
    item_id: number; // foreign key to item
    user_id: number;
    type: ItemType;
    name: string; // item name
}

export interface GoodsItem extends BaseItem {
    amount: number; // quantity available
    materials_to_yield_on_destroy: MaterialToCraft[];
}

export interface EquipableItem extends BaseItem {
    quality: ItemQuality;
    is_equipped: boolean;
    properties?: SubProperty[];
}

export interface WeaponItem extends EquipableItem {
    damage: number; // damage capability of weapon
    required_materials_to_upgrade: MaterialToCraft[];
    required_materials_to_repair: MaterialToCraft[];
    materials_to_yield_on_destroy: MaterialToCraft[];
}

export interface HelmetItem extends EquipableItem {
    health: number; // health capability of helmet
    required_materials_to_upgrade: MaterialToCraft[];
    required_materials_to_repair: MaterialToCraft[];
    materials_to_yield_on_destroy: MaterialToCraft[];
}

export interface ArmorItem extends EquipableItem {
    defence: number; // defense capability of armor
    required_materials_to_upgrade: MaterialToCraft[];
    required_materials_to_repair: MaterialToCraft[];
    materials_to_yield_on_destroy: MaterialToCraft[];
}

export interface ConsumableItem {
    id: number; // primary key
    item_id: number; // foreign key to item
    user_id: number;

    type: ItemType;
    name: string; // item name
    energy: number; // energy value
    health: number; // health value
    amount: number; // quantity available
}

export interface MaterialToCraft {
    item_id: number;
    amount: number;
}

export interface MaterialItem extends BaseItem {
    amount: number; // quantity available
    required_materials_to_craft: MaterialToCraft[];
}

export interface Stats {
    strength: number;
    dexterity: number;
    intelligence: number;
    charisma: number;
}

export interface Job {
    id: number;
    name: string;
    required_level: number;
    required_energy: number;
    recommended_stats: Partial<Stats>;
}

export interface PartyJob {
    id: number;
    name: string;
    description: string;
    required_level: number;
    required_energy: number;
    recommended_stats: Partial<Stats>;
    required_crew: number;
}

export enum Classes {
    NO_CLASS,
    GANGSTER,
    DETECTIVE,
    BUSINESSMAN,
    PARTY = 10,
}

export interface GameConfig {
    default_health: number;
    health_per_level: number;
    health_per_minute: number;
    default_energy: number;
    energy_per_level: number;
    energy_per_minute: number;
    countdown_seconds_to_next_job: number;
    countdown_seconds_to_next_party_job: number;
    property_name_change_cost: number;
    gang_creation_cost: number;
    gang_max_member_amount: number;
    one_shadow_coin_to_money_ratio: number;
    change_property_location_cost: number;
}

export interface GameStreet {
    id: number;
    name: string;
    location_x: number;
    location_y: number;
    economic_bonus: number;
    stat_gain_bonus: number;
    money_gain_bonus: number;
    description: string;
}

export interface GamePropertyUpgrade {
    id: number;
    name: string;
    description: string;
    type: PropertyType;
    cost: number[];
    bonus: number[];
    bonuses: Record<string, number>[];
    normalizer_multiplier: number;
    bonus_indicator_start_character: string;
    bonus_indicator_end_character: string;
    required_materials_to_upgrade: MaterialToCraft[];
    max_level: number;
    index: number; // for frontend
    isUpgradeable: boolean; // for frontend
}

export interface UpgradeInfo {
    can_upgrade: boolean;
    upgrade_cost: number;
    total_safety_cost: number;
    current_grade: number;
    next_grade: number;
    max_grade: number;
    success_chance: number;
    stat_increase: number; // 0.01 means 1%
    projected_stats: any;
    max_level: number;
    required_upgrade_materials: MaterialToCraft[];
}

export interface GameMission {
    id: number;
    name: string;
    description: string;
    required_level: number;
    required_energy: number;
    rounds: number;
    damage_per_round: number;
    total_health: number;
}

export interface Guard {
    id: number;
    name: string;
    description: string;
    cost: number;
    salary: number;
    type: number;
    upgrades: GuardUpgrade[];
}

export interface UserGuard {
    id: number;
    name: string;
    img_url: string;
    level: number;
    experience: number;
    required_experience: number;
    health: number;
    max_health: number;
    energy: number;
    max_energy: number;
    strength: number;
    dexterity: number;
    intelligence: number;
    charisma: number;
    type: number;
    status: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    last_activity: string;
    last_activity_ago: string;
    upgrades: UserGuardUpgrade[];
    tasks: GuardTask[];
    statistics: GuardStatistics;
    auto_eat: boolean;
}

export interface GuardUpgrade {
    id: number;
    name: string;
    description: string;
    base_value: number;
    bonus: number[];
    cost: number[];
    required_level: number[];
    required_materials_to_upgrade: MaterialToCraft[][];
    normalizer_multiplier: number;
}

export interface UserGuardUpgrade {
    id: number;
    guard_id: number;
    upgrade_id: number;
    level: number;
}

export interface GuardTask {
    id: number;
    guard_id: number;
    task_id: number;
    task_value: number;
}

export interface GuardStatistics {
    id: number;
    jobs: number;
    party_jobs: number;
    money_gain: number;
    experience_gain: number;
}
