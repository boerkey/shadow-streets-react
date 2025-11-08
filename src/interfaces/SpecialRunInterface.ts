import {ItemType} from "./GameInterface";

// Enums
export enum RiskLevel {
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
}

export enum DifficultyLevel {
    SHORT = 1, // Easy
    MEDIUM = 2, // Medium
    LONG = 3, // Hard
}

export enum CategoryType {
    HEIST = 1,
    INFILTRATION = 2,
    NEGOTIATION = 3,
    SABOTAGE = 4,
    INTELLIGENCE = 5,
    TERRITORY = 6,
}

export enum SpecialRunResult {
    SUCCESS = "success",
    FAILURE = "failure",
    IMPRISONED = "imprisoned",
    HOSPITALIZED = "hospitalized",
    CANCELLED = "cancelled",
}

// Error Types for MakeChoice responses
export enum ChoiceErrorType {
    STAT_REQUIREMENT_FAILED = "stat_requirement_failed",
    INSUFFICIENT_MONEY = "insufficient_money",
    INVALID_CHOICE = "invalid_choice",
    GENERAL_ERROR = "general_error",
}

// Base Interfaces
export interface StatRequirements {
    strength?: number;
    dexterity?: number;
    intelligence?: number;
    charisma?: number;
    level?: number;
    money?: number;
    damage?: number;
    defence?: number;
}

export interface SessionEffects {
    prison_chance: number;
    hospital_chance: number;
    taken_damage: number;
    gained_experience: number;
    gained_strength: number;
    gained_dexterity: number;
    gained_intelligence: number;
    gained_charisma: number;
    gained_money: number;
    gained_shadow_coin: number;
}

export interface SpecialRunChoice {
    choice_id: number;
    choice_text: string;
    risk_level: RiskLevel;
    flavor_text: string;
    requirements: StatRequirements;
}

export interface SpecialRunNode {
    node_id: number;
    title: string;
    story_text: string;
    is_end_node: boolean;
    choices?: SpecialRunChoice[];
}

export interface CurrentSpecialRun {
    session_id: number;
    operation: string;
    difficulty: DifficultyLevel;
    is_completed: boolean;
    current_node: SpecialRunNode;
    accumulated_effects: SessionEffects;
    created_at: string;
}

export interface SpecialRunDifficulty {
    difficulty: DifficultyLevel;
    name: string;
    description: string;
    required_level: number;
    required_prestige: number;
    required_energy: number;
    can_access: boolean;
}

export interface SpecialRunCategory {
    category: CategoryType;
    name: string;
    description: string;
}

// Main API Response Interfaces
export interface GetSpecialRunListResponse {
    difficulties: SpecialRunDifficulty[];
    categories: SpecialRunCategory[];
    daily_usage: number;
    daily_limit: number;
    current_special_run?: CurrentSpecialRun;
    last_special_run_rewards?: LastSpecialRunRewards;
}

export interface LastSpecialRunRewards {
    category_id: number;
    completed_at_ago: string;
    difficulty: DifficultyLevel;
    operation_name: string;
    session_id: number;
    was_success: boolean;
    rewards: {
        gained_money: number;
        gained_experience: number;
        gained_shadow_coin: number;
        gained_strength: number;
        gained_dexterity: number;
        gained_intelligence: number;
        gained_charisma: number;
        taken_damage: number;
    };
    dropped_items?: {
        item_id: number;
        amount: number;
        item_type: ItemType;
    }[];
}

export interface StartSpecialRunRequest {
    difficulty: DifficultyLevel;
    category: CategoryType;
}

export interface StartSpecialRunResponse {
    message: string;
    session_id: number;
    operation: string;
    current_node: SpecialRunNode;
}

export interface MakeSpecialRunChoiceRequest {
    choice_id: number;
}

// Updated: Simplified response that relies on GetSpecialRunList for state updates
export interface MakeSpecialRunChoiceResponse {
    message: string;
    type: "choice_success";
    operation_completed: boolean;
}

// Error response for MakeChoice API
export interface MakeSpecialRunChoiceErrorResponse {
    error: string;
    type: ChoiceErrorType;
}

// Your requested interface (updated with complete structure)
export interface CurrentSpecialRunProps {
    current_node: {
        node_id: number;
        title: string;
        story_text: string;
        is_end_node: boolean;
        choices?: {
            choice_id: number;
            choice_text: string;
            flavor_text: string;
            requirements: StatRequirements;
            risk_level: RiskLevel;
        }[];
    };
}

// Additional utility interfaces for better type safety
export interface SpecialRunState {
    isLoading: boolean;
    currentSpecialRun: CurrentSpecialRun | null;
    difficulties: SpecialRunDifficulty[];
    categories: SpecialRunCategory[];
    dailyUsage: number;
    dailyLimit: number;
    error: string | null;
}

export interface SpecialRunProgress {
    sessionId: number;
    operationName: string;
    isCompleted: boolean;
    currentNodeId: number;
    accumulatedEffects: SessionEffects;
}

// API Error Response
export interface ApiErrorResponse {
    error: string;
    type?: string;
}

// Axios response wrappers
export interface AxiosResponse<T> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: any;
}

// Complete API service interface - Updated to reflect Axios responses
export interface SpecialRunAPI {
    getList(): Promise<AxiosResponse<GetSpecialRunListResponse>>;
    startSpecialRun(
        request: StartSpecialRunRequest,
    ): Promise<AxiosResponse<StartSpecialRunResponse>>;
    makeChoice(
        request: MakeSpecialRunChoiceRequest,
    ): Promise<AxiosResponse<MakeSpecialRunChoiceResponse>>;
}

// Type guards for error handling (works on response.data)
export function isMakeChoiceError(
    data: any,
): data is MakeSpecialRunChoiceErrorResponse {
    return data.error && data.type;
}

// Utility type for handling the choice API response data
export type MakeChoiceResult =
    | MakeSpecialRunChoiceResponse
    | MakeSpecialRunChoiceErrorResponse;
