import {
    ArmorItem,
    ItemType,
    SubPropertyKeys,
    WeaponItem,
} from "@interfaces/GameInterface.ts";
import {User} from "@interfaces/UserInterface.ts";

const baseDamage = 2;
const baseDefence = 1.0;
const scalingFactor = 25.0;

const MAX_HEALTH_RATIO = 0.75;
const MIN_HEALTH_RATIO = 0.1;
const MAX_DAMAGE_MULTIPLIER = 1.0;
const MIN_DAMAGE_MULTIPLIER = 0.25;

// Stats influence on damage and defense
const STRENGTH_DMG_WEIGHT = 0.45; // Strength influence on damage
const DEXTERITY_DMG_WEIGHT = 0.25; // Dexterity influence on damage
const INTELLIGENCE_DMG_WEIGHT = 0.3; // Intelligence influence on damage

const STRENGTH_DEF_WEIGHT = 0.2; // Strength influence on defense
const DEXTERITY_DEF_WEIGHT = 0.4; // Dexterity influence on defense
const INTELLIGENCE_DEF_WEIGHT = 0.4; // Intelligence influence on defense

export const calculateHealthEffectOnDamageAndDefence = (
    healthRatio: number,
): number => {
    // If health ratio is above MAX_HEALTH_RATIO, return full damage
    if (healthRatio >= MAX_HEALTH_RATIO) {
        return MAX_DAMAGE_MULTIPLIER;
    }

    // If health ratio is below MIN_HEALTH_RATIO, return minimum damage
    if (healthRatio <= MIN_HEALTH_RATIO) {
        return MIN_DAMAGE_MULTIPLIER;
    }

    // Calculate how far along we are between MIN_HEALTH_RATIO and MAX_HEALTH_RATIO
    const progress =
        (healthRatio - MIN_HEALTH_RATIO) /
        (MAX_HEALTH_RATIO - MIN_HEALTH_RATIO);

    // Scale damage multiplier between MIN_DAMAGE_MULTIPLIER and MAX_DAMAGE_MULTIPLIER
    return (
        MIN_DAMAGE_MULTIPLIER +
        progress * (MAX_DAMAGE_MULTIPLIER - MIN_DAMAGE_MULTIPLIER)
    );
};

export function calculateDamage(
    user: User,
    healthRatio: number,
    itemsWeapons: WeaponItem[] | undefined,
    itemsArmors: ArmorItem[] | undefined,
): number {
    const weapon = getEquippedItem(itemsWeapons, ItemType.Weapon);
    const armor = getEquippedItem(itemsArmors, ItemType.Armor);

    return (
        calculateDamageStats(user, weapon, armor) *
        calculateHealthEffectOnDamageAndDefence(healthRatio)
    );
}

export function calculateDefence(
    user: User,
    healthRatio: number,
    itemsWeapons: WeaponItem[] | undefined,
    itemsArmors: ArmorItem[] | undefined,
): number {
    const weapon = getEquippedItem(itemsWeapons, ItemType.Weapon);
    const armor = getEquippedItem(itemsArmors, ItemType.Armor);

    return (
        calculateDefenceStats(user, weapon, armor) *
        calculateHealthEffectOnDamageAndDefence(healthRatio)
    );
}

export function calculateStatDamageContribution(
    user: User,
    weapon: WeaponItem | undefined,
    armor: ArmorItem | undefined,
): number {
    // Apply logarithmic scaling to stats for more balanced progression
    const effectiveStrength = scalingFactor * Math.log10(user.strength + 1);
    const effectiveDexterity = scalingFactor * Math.log10(user.dexterity + 1);
    const effectiveIntelligence =
        scalingFactor * Math.log10(user.intelligence + 1);

    // Compute the stat multiplier using logarithmically scaled stats
    const statMultiplier =
        effectiveStrength * STRENGTH_DMG_WEIGHT +
        effectiveDexterity * DEXTERITY_DMG_WEIGHT +
        effectiveIntelligence * INTELLIGENCE_DMG_WEIGHT;

    const bonusDamage =
        sumBonusProperty(weapon?.properties, SubPropertyKeys.Damage) +
        sumBonusProperty(armor?.properties, SubPropertyKeys.Damage);

    const totalWeaponDamage = (weapon?.damage || 0) + bonusDamage;

    const damageWithoutStats = baseDamage + totalWeaponDamage;
    const totalDamage = damageWithoutStats * (1 + statMultiplier / 100);

    return totalDamage - damageWithoutStats;
}

export function calculateStatDefenceContribution(
    user: User,
    weapon: WeaponItem | undefined,
    armor: ArmorItem | undefined,
): number {
    // Apply logarithmic scaling to stats for more balanced progression
    const effectiveStrength = scalingFactor * Math.log10(user.strength + 1);
    const effectiveDexterity = scalingFactor * Math.log10(user.dexterity + 1);
    const effectiveIntelligence =
        scalingFactor * Math.log10(user.intelligence + 1);

    // Compute the stat multiplier using logarithmically scaled stats
    const statMultiplier =
        effectiveStrength * STRENGTH_DEF_WEIGHT +
        effectiveDexterity * DEXTERITY_DEF_WEIGHT +
        effectiveIntelligence * INTELLIGENCE_DEF_WEIGHT;

    const bonusDefence =
        sumBonusProperty(weapon?.properties, SubPropertyKeys.Defence) +
        sumBonusProperty(armor?.properties, SubPropertyKeys.Defence);

    const totalArmorDefence = (armor?.defence || 0) + bonusDefence;

    const defenceWithoutStats = baseDefence + totalArmorDefence;
    const totalDefence = defenceWithoutStats * (1 + statMultiplier / 100);

    return totalDefence - defenceWithoutStats;
}
export function calculateDamageStats(
    user: User,
    weapon: WeaponItem | undefined,
    armor: ArmorItem | undefined,
): number {
    const effectiveStrength = scalingFactor * Math.log10(user.strength + 1);
    const effectiveDexterity = scalingFactor * Math.log10(user.dexterity + 1);
    const effectiveIntelligence =
        scalingFactor * Math.log10(user.intelligence + 1);

    // Compute the stat multiplier using logarithmically scaled stats
    const statMultiplier =
        effectiveStrength * STRENGTH_DMG_WEIGHT +
        effectiveDexterity * DEXTERITY_DMG_WEIGHT +
        effectiveIntelligence * INTELLIGENCE_DMG_WEIGHT;

    // Calculate bonus damage from weapon and armor sub-properties.
    const bonusDamage =
        sumBonusProperty(weapon?.properties, SubPropertyKeys.Damage) +
        sumBonusProperty(armor?.properties, SubPropertyKeys.Damage);

    // Calculate final weapon damage.
    const totalWeaponDamage = (weapon?.damage || 0) + bonusDamage;

    // Apply the stat multiplier and add base damage of 2.
    return (baseDamage + totalWeaponDamage) * (1 + statMultiplier / 100);
}

export function calculateDefenceStats(
    user: User,
    weapon: WeaponItem | undefined,
    armor: ArmorItem | undefined,
): number {
    const effectiveStrength = scalingFactor * Math.log10(user.strength + 1);
    const effectiveDexterity = scalingFactor * Math.log10(user.dexterity + 1);
    const effectiveIntelligence =
        scalingFactor * Math.log10(user.intelligence + 1);

    // Compute the stat multiplier using logarithmically scaled stats
    const statMultiplier =
        effectiveStrength * STRENGTH_DEF_WEIGHT +
        effectiveDexterity * DEXTERITY_DEF_WEIGHT +
        effectiveIntelligence * INTELLIGENCE_DEF_WEIGHT;

    // Calculate bonus damage from weapon and armor sub-properties.
    const bonusDefence =
        sumBonusProperty(weapon?.properties, SubPropertyKeys.Defence) +
        sumBonusProperty(armor?.properties, SubPropertyKeys.Defence);

    // Calculate final defence damage.
    const totalArmorDefence = (armor?.defence || 0) + bonusDefence;

    // Apply the stat multiplier and add base defence of 1.
    return (baseDefence + totalArmorDefence) * (1 + statMultiplier / 100);
}

interface Equippable {
    is_equipped: boolean;
}

export function getEquippedItems<T extends Equippable>(
    items: T[] | undefined,
): T[] {
    return items ? items.filter(item => item.is_equipped) : [];
}

export function getEquippedItem(
    items: WeaponItem[] | ArmorItem[] | undefined,
    typeToCheck?: number,
): WeaponItem | ArmorItem | undefined {
    if (!items || items.length === 0) return undefined;
    const equippedItems = getEquippedItems(items);
    return typeToCheck !== undefined
        ? equippedItems.find(item => item.type === typeToCheck)
        : equippedItems[0];
}

function sumBonusProperty(
    properties: any[] | undefined,
    propertyType: string,
): number {
    let bonus = 0;
    if (!properties || properties.length === 0) {
        return bonus;
    }
    Object.keys(properties).forEach(key => {
        if (key === propertyType) {
            bonus += properties[key];
        }
    });
    return bonus;
}
