import { PropertyType } from "./GameInterface";

export interface UserProperty {
    id: number;
    user_id: number;
    status: number;
    health: number;
    name: string;
    money: number;
    type: PropertyType;
    location_x: number;
    location_y: number;
    location_b: number;
    location_f: number;
    sale_price: number;
    maintenance_cost: number;
    private_items: PropertyItem[];
    public_items: PropertySaleItem[];
    user_specific_items: any;
    upgrades: PropertyUpgrade[];
    visitors: PropertyVisitor[];
    production_cost_multiplier: number;
    usage_fee: number;
}

export interface PropertyItem {
    id: number;
    property_id: number;
    name: string;
    amount: number;
    type: number;
    item_id: number;
}

export interface PropertySaleItem {
    id: number;
    property_id: number;
    name: string;
    amount: number;
    type: number;
    item_id: number;
    price: number;
}

export interface PropertyUpgrade {
    id: number;
    property_id: number;
    type: number;
    upgrade_id: number;
    level: number;
}

export interface PropertyVisitor {
    id: number;
    property_id: number;
    user_id: number;
    name: string;
    message: string;
    time_ago: string | null; // ISO date string or null
}

export interface PropertyProductionItem {
    id: number;
    property_id: number;
    status: number;
    item_id: number;
    item_type: number;
    production_cost: number;
    produced_amount: number;
    production_end_at: string;
    production_end_as_seconds: number;
    created_at: number;
    updated_at: number;
}

export enum PropertyProductionStatus {
    PASSIVE = 0,
    PREPARING = 1,
    ACTIVE,
}
