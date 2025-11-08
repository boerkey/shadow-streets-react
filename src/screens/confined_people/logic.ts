export function calculateRequiredEnergy(
    userLevel: number,
    gameConfigEnergyPerLevel: number,
) {
    const baseEnergy = 15;
    return baseEnergy + userLevel * gameConfigEnergyPerLevel * 0.3;
}

export function calculateRequiredMoney(userLevel: number) {
    const baseMoney = 200;
    const pricePerLevel = 100;
    return baseMoney + (userLevel - 1) * pricePerLevel;
}
