import React, {useState} from "react";
import {TouchableOpacity, View} from "react-native";

import {useSelector} from "react-redux";

import {fightApis} from "@apis/index.ts";
import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {AppButton, AppImage, AppText, Avatar} from "@components/index.ts";
import useCooldownToRunFunction from "@hooks/useCooldownToRunFunction.ts";
import useCountdown from "@hooks/useCountdown.ts";
import {GameStreet} from "@interfaces/GameInterface.ts";
import {UserEncounter} from "@interfaces/UserInterface.ts";
import {RootState} from "@redux/index.ts";
import {showToast} from "@utils/helperFunctions.ts";
import {commonStyles, strings} from "@utils/index.ts";
import {navigate, SCREEN_NAMES} from "../../router.tsx";

interface EncounterItemProps {
    item: UserEncounter;
    onSearch: () => void;
    onInvestigate: () => void;
    onAttack: () => void;
    onRemove: () => void;
}

const EncounterItem = ({
    item,
    onSearch,
    onInvestigate,
    onRemove,
}: EncounterItemProps) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [loading, setLoading] = useState(false);
    const gameStreets = useSelector(
        (state: RootState) => state.game.gameStreets,
    );
    const {seconds, formatted} = useCountdown(
        item?.seconds_until_target_attackable ?? 0,
    );
    const levelDiff = user.level - item.encountered_user_level;

    const hasFound = item.found_location_x !== 0;
    const triggerWithCooldown = useCooldownToRunFunction(3000);

    function getLocationName() {
        if (hasFound) {
            const street = gameStreets.find(
                (each: GameStreet) =>
                    each.location_x === item.found_location_x &&
                    each.location_y === item.found_location_y,
            );
            if (street) {
                return street.name;
            }
            return "XXX ";
        }
        return "???";
    }

    function attack() {
        if (!loading) {
            setLoading(true);
            fightApis
                .attack(item.encountered_user_id)
                .then(res => {
                    showToast(res.data.message);
                    navigate(SCREEN_NAMES.FIGHTS, {
                        fightId: res.data.fight_id,
                    });
                })
                .catch(err => {
                    console.log(err.message);
                })
                .finally(() => {
                    setTimeout(() => {
                        setLoading(false);
                    }, 500);
                });
        }
    }

    return (
        <View style={{marginBottom: gapSize.sizeM}}>
            <TouchableOpacity
                onPress={() =>
                    navigate(SCREEN_NAMES.PLAYER_PROFILE, {
                        user_id: item.encountered_user_id,
                    })
                }>
                <View style={commonStyles.flexRow}>
                    <Avatar
                        size={60}
                        source={item.encountered_user_img_url}
                        frameId={item.encountered_user_avatar_frame_id}
                    />
                    <View style={{marginLeft: gapSize.sizeM, width: "70%"}}>
                        <View style={[commonStyles.flexRowSpaceBetween]}>
                            <AppText
                                text={item.encountered_user_name}
                                postText={` (${item.encountered_user_level})`}
                            />
                            <AppText
                                text={`${item.time_ago}`}
                                type={TextTypes.Caption2}
                                color={colors.grey500}
                            />
                        </View>
                        <View
                            style={[
                                commonStyles.flexRowSpaceBetweenAlignCenter,
                                {marginTop: gapSize.sizeM},
                            ]}>
                            <View style={[commonStyles.flexRow]}>
                                <AppImage
                                    source={images.icons.location}
                                    size={14}
                                />

                                <AppText
                                    text={`${
                                        strings.encounters.location
                                    }: ${getLocationName()}`}
                                    fontSize={12}
                                    style={{marginLeft: gapSize.sizeS}}
                                />
                            </View>
                            {seconds > 0 && (
                                <AppText
                                    text={formatted}
                                    fontSize={12}
                                    color={colors.red}
                                />
                            )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            <View
                style={[
                    commonStyles.flexRowSpaceEvenly,
                    {marginTop: gapSize.sizeL},
                ]}>
                <AppButton
                    onLongPress={onRemove}
                    minifyLength={3}
                    text={strings.common.remove}
                    type={"redSmall"}
                    width={125}
                />
                {!item.has_searched && !hasFound && (
                    <AppButton
                        onPress={onSearch}
                        minifyLength={3}
                        text={strings.encounters.search}
                        type={"primarySmall"}
                        width={125}
                    />
                )}
                {item.has_searched && !item.has_investigated && !hasFound && (
                    <AppButton
                        onPress={onInvestigate}
                        text={strings.encounters.investigate}
                        minifyLength={10}
                        type={"transparent"}
                        resizeMode={"stretch"}
                        width={160}
                    />
                )}
                {hasFound && (
                    <AppButton
                        onPress={() => {
                            triggerWithCooldown(() => {
                                attack();
                            });
                        }}
                        text={strings.encounters.attack}
                        type={"redSmall"}
                        disabled={loading}
                        promptTitle={
                            levelDiff > 3 ? strings.common.warning : undefined
                        }
                        promptText={
                            levelDiff > 3
                                ? strings.encounters.levelDiff
                                : undefined
                        }
                    />
                )}
            </View>
        </View>
    );
};

export default EncounterItem;
