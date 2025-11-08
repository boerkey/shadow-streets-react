import {View} from "react-native";

import {useDispatch} from "react-redux";

import {guardApis} from "@apis/index";
import {colors, gapSize, images} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {AppButton, AppImage, AppText, Divider} from "@components/index";
import RequiredMaterialsView from "@components/RequiredMaterialsView";
import {GuardUpgrade, UserGuard} from "@interfaces/GameInterface";
import {User} from "@interfaces/UserInterface";
import {authActions} from "@redux/actions";
import {renderNumber, showToast} from "@utils/helperFunctions";
import {commonStyles, strings} from "@utils/index";

const GuardUpgrades = ({
    guardUpgradesData,
    user,
    guard,
    getGuard,
    showUpgradeIndicator,
}: {
    guardUpgradesData: GuardUpgrade[];
    user: User;
    guard: UserGuard;
    getGuard: () => void;
    showUpgradeIndicator?: boolean;
}) => {
    const dispatch = useDispatch();

    function upgradeGuard(upgradeId: number) {
        guardApis.upgradeGuard(guard.id, upgradeId).then(res => {
            showToast(res.data.message);
            getGuard();
            dispatch(authActions.getUser());
        });
    }
    // Helper function to calculate upgrade data
    function getUpgradeCalculations(upgradeData: GuardUpgrade) {
        const myGuardHasThisUpgrade = guard.upgrades.find(
            guardUpgrade => upgradeData.id === guardUpgrade.upgrade_id,
        );
        const currentLevel = myGuardHasThisUpgrade?.level || 0;
        const nextLevel = currentLevel + 1;

        // Fix: Check if nextLevel is within bounds (arrays are 0-indexed, but levels start from 1)
        // So for level 1, we access bonus[0], for level 2, we access bonus[1], etc.
        const hasNextLevel = nextLevel < upgradeData.bonus.length + 1;

        // Fix: For current bonus, if level is 0, no bonus. Otherwise use bonus[level-1]
        const currentBonusValue =
            currentLevel > 0 ? upgradeData.bonus[currentLevel - 1] : 0;
        const currentBonus = renderNumber(
            (upgradeData.base_value + currentBonusValue) *
                upgradeData.normalizer_multiplier,
        );

        const nextBonus = hasNextLevel
            ? renderNumber(
                  (upgradeData.base_value + upgradeData.bonus[nextLevel - 1]) *
                      upgradeData.normalizer_multiplier,
              )
            : 0;

        const finalText =
            upgradeData.normalizer_multiplier === 100 ? "%" : "/min";

        // Fix: Make sure we don't access out of bounds arrays
        const cost = upgradeData.cost[currentLevel] || 0;
        const requiredLevel = upgradeData.required_level[currentLevel] || 0;
        const requiredMaterials =
            upgradeData.required_materials_to_upgrade[currentLevel] || [];
        const isUpgradeable = guard.level >= requiredLevel;

        return {
            currentLevel,
            nextLevel,
            hasNextLevel,
            currentBonus,
            nextBonus,
            finalText,
            cost,
            requiredLevel,
            requiredMaterials,
            isUpgradeable,
        };
    }
    // Component for rendering upgrade header
    function renderUpgradeHeader(upgradeData: GuardUpgrade, calculations: any) {
        const {hasNextLevel, currentBonus, nextBonus, finalText} = calculations;

        return (
            <View style={commonStyles.flexRowSpaceBetween}>
                <View style={{width: showUpgradeIndicator ? "60%" : "100%"}}>
                    <AppText
                        text={upgradeData.name}
                        preText={`(${calculations.currentLevel}) `}
                        type={TextTypes.BodyBold}
                    />
                    <AppText text={upgradeData.description} />
                </View>
                {showUpgradeIndicator && (
                    <View>
                        <AppText
                            preText={!hasNextLevel ? "Max: " : ""}
                            text={currentBonus}
                            postText={
                                (hasNextLevel ? " -> " + nextBonus : "") +
                                finalText
                            }
                            type={TextTypes.BodyBold}
                            color={colors.borderColor}
                        />
                    </View>
                )}
            </View>
        );
    }

    // Component for rendering upgrade requirements and cost
    function renderUpgradeDetails(
        upgradeData: GuardUpgrade,
        calculations: any,
    ) {
        const {requiredLevel, requiredMaterials, cost, isUpgradeable} =
            calculations;

        return (
            <View style={commonStyles.flexRowSpaceBetweenAlignCenter}>
                <View style={{marginBottom: gapSize.sizeM}}>
                    <AppText
                        text={`${strings.common.requiredLevel}: ${requiredLevel}`}
                        type={TextTypes.BodyBold}
                        style={{
                            marginTop: gapSize.sizeM,
                            marginBottom: gapSize.sizeS,
                        }}
                        color={isUpgradeable ? colors.green : colors.red}
                    />
                    <RequiredMaterialsView
                        requiredMaterials={requiredMaterials}
                    />
                </View>
                <View style={commonStyles.alignItemsCenter}>
                    <View
                        style={[
                            commonStyles.flexRowAlignCenter,
                            {marginBottom: gapSize.sizeS},
                        ]}>
                        <AppImage source={images.icons.shadowCoin} size={25} />
                        <AppText
                            text={cost}
                            style={{marginLeft: gapSize.sizeS}}
                            type={TextTypes.BodyBold}
                            color={
                                user.shadow_coin >= cost
                                    ? colors.green
                                    : colors.red
                            }
                        />
                    </View>
                    <AppButton
                        text={strings.common.improve}
                        onPress={() => upgradeGuard(upgradeData.id)}
                        width={121}
                        height={42}
                        fontSize={20}
                    />
                </View>
            </View>
        );
    }

    // Main upgrade item component
    function renderUpgradeItem(upgradeData: GuardUpgrade) {
        const calculations = getUpgradeCalculations(upgradeData);

        return (
            <View
                key={upgradeData.id}
                style={{
                    width: "100%",
                    borderWidth: 1,
                    borderColor: colors.borderColor,
                    backgroundColor: colors.black,
                    padding: gapSize.sizeM,
                    marginBottom: gapSize.sizeM,
                }}>
                {renderUpgradeHeader(upgradeData, calculations)}
                {calculations.hasNextLevel &&
                    renderUpgradeDetails(upgradeData, calculations)}
            </View>
        );
    }
    return (
        <View style={{width: "100%"}}>
            <Divider
                width={380}
                marginVertical={gapSize.sizeL}
                text={strings.common.improvements}
            />
            {guardUpgradesData.map(upgradeData =>
                renderUpgradeItem(upgradeData),
            )}
        </View>
    );
};

export default GuardUpgrades;
