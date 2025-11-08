import React, {useEffect, useState} from "react";
import {FlatList, ScrollView, StyleSheet, View} from "react-native";

import {useDispatch, useSelector} from "react-redux";

import {RootState} from "@redux/index.ts";

import {profileApis} from "@apis/index.ts";
import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import BarContainer from "@components/Header/BarContainer.tsx";
import LevelAvatar from "@components/Header/LevelAvatar.tsx";
import StatsContainer from "@components/Header/StatsContainer.tsx";
import {
    AppButton,
    AppText,
    Divider,
    ScreenContainer,
    TabSelector,
    TitleHeader,
} from "@components/index.ts";
import {ArmorItem, Classes, WeaponItem} from "@interfaces/GameInterface.ts";
import {authActions} from "@redux/actions";
import {renderNumber} from "@utils/helperFunctions.ts";
import {characterHelpers, commonStyles, strings} from "@utils/index.ts";
import {SCREEN_NAMES, navigate} from "../../router.tsx";
import Presets from "./Presets.tsx";

const Character = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const userBonuses = useSelector(
        (state: RootState) => state.auth.userBonuses,
    );
    const [playerStatistics, setPlayerStatistics] = useState();
    const healthRatio = user.health / userBonuses.max_health;

    const equippedWeapon = user.items_weapons.find(
        (each: WeaponItem) => each.is_equipped,
    );
    const equippedArmor = user.items_armors.find(
        (each: ArmorItem) => each.is_equipped,
    );

    const [selectedTab, setSelectedTab] = useState(0);
    const canChangeClass = user.class !== Classes.NO_CLASS;

    useEffect(() => {
        dispatch(authActions.getUserBonuses());
        profileApis.getUserProfile(user.id).then(res => {
            const {stats} = res.data;
            setPlayerStatistics(stats);
        });
    }, []);

    function getStatList() {
        const list = [];
        list.push({
            name: strings.character.character,
            value: strings.character.classes[user.class],
            color: colors.red,
        });

        for (let i = 0; i <= 5; i++) {
            let value: string | number = "0";
            switch (i) {
                case 0:
                    value = characterHelpers.calculateDamage(
                        user,
                        healthRatio,
                        user.items_weapons,
                        user.items_armors,
                    );
                    break;
                case 1:
                    if (equippedWeapon) {
                        value = equippedWeapon.damage;
                    }
                    break;
                case 2:
                    value = characterHelpers.calculateStatDamageContribution(
                        user,
                        equippedWeapon,
                        equippedArmor,
                    );
                    break;
                case 3:
                    value = characterHelpers.calculateDefence(
                        user,
                        healthRatio,
                        user.items_weapons,
                        user.items_armors,
                    );
                    break;
                case 4:
                    if (equippedArmor) {
                        value = equippedArmor.defence;
                    }
                    break;
                case 5:
                    value = characterHelpers.calculateStatDefenceContribution(
                        user,
                        equippedWeapon,
                        equippedArmor,
                    );
                    break;
            }
            if (typeof value === "number") {
                value = renderNumber(value, 2);
            }
            list.push({
                name: strings.character.statList[i],
                value,
            });
        }
        list.push({
            name: strings.common.prestige,
            value: user.prestige,
        });
        list.push({
            name: strings.common.experience,
            value:
                renderNumber(user.experience, 2) +
                "/" +
                renderNumber(user.required_experience, 1),
        });
        if (userBonuses) {
            list.push({
                name: strings.character.bonuses,
                value: "",
                color: colors.green,
            });
            Object.keys(userBonuses).forEach(key => {
                const keyString = strings.character.bonusList[key];
                const keyStringStartIndicator =
                    strings.character.bonusListStartCharacter[key] ?? "";
                const keyStringLastIndicator =
                    strings.character.bonusListEndCharacter[key] ?? "";

                if (keyString) {
                    let value = userBonuses[key];
                    const lastValue =
                        value > 0
                            ? `${keyStringStartIndicator}${renderNumber(
                                  value,
                                  2,
                              )}${keyStringLastIndicator}`
                            : renderNumber(value, 2);
                    list.push({
                        name: keyString,
                        value: lastValue,
                        numberValue: value,
                        showColor: !!keyStringStartIndicator,
                    });
                }
            });
        }
        if (playerStatistics) {
            list.push({
                name: strings.character.statistics,
                value: "",
                color: colors.orange,
            });

            Object.keys(playerStatistics).forEach(key => {
                const keyString = strings.playerProfile.stats[key];
                if (keyString) {
                    const value = renderNumber(playerStatistics[key], 0);
                    list.push({
                        name: keyString,
                        value,
                    });
                }
            });
        }
        return list;
    }

    const _renderItem = ({item}) => {
        return (
            <View style={commonStyles.flexRowSpaceBetween}>
                <AppText
                    text={item.name}
                    color={item.color ? item.color : colors.white}
                    fontSize={item.color ? 16 : undefined}
                />
                <AppText
                    text={item.value}
                    type={TextTypes.BodyBold}
                    color={
                        item.showColor && item.numberValue > 0
                            ? colors.green
                            : colors.white
                    }
                />
            </View>
        );
    };

    return (
        <ScreenContainer source={images.backgrounds.characterBlurred}>
            <View style={{padding: gapSize.size3L}}>
                <TitleHeader title={user.name} />
                <TabSelector
                    selectedIndex={selectedTab}
                    items={[
                        strings.character.character,
                        strings.character.presets,
                    ]}
                    onSelect={setSelectedTab}
                    style={{alignSelf: "center", marginTop: gapSize.sizeM}}
                />
            </View>
            <ScrollView
                style={{
                    width: "100%",
                    paddingHorizontal: gapSize.sizeL,
                    marginTop: -gapSize.sizeL,
                }}>
                {selectedTab === 0 && (
                    <>
                        <View
                            style={[
                                commonStyles.flexRowAlignCenter,
                                {zIndex: 2},
                            ]}>
                            <LevelAvatar
                                showName={false}
                                size={100}
                                scaledSize
                                frameId={user.avatar_frame_id}
                            />
                            <View style={{marginLeft: gapSize.sizeM}}>
                                <BarContainer />
                            </View>
                        </View>
                        <StatsContainer
                            user={user}
                            containerStyle={{
                                borderWidth: 0,
                                borderRadius: 4,
                                backgroundColor: "rgba(24, 21, 21, 0.8)",
                            }}
                        />
                        <FlatList
                            style={[
                                styles.listContainer,
                                {height: canChangeClass ? "51%" : "59%"},
                            ]}
                            contentContainerStyle={{
                                paddingBottom: gapSize.sizeL,
                            }}
                            data={getStatList()}
                            renderItem={_renderItem}
                            ItemSeparatorComponent={() => (
                                <Divider
                                    width={"100%"}
                                    marginVertical={gapSize.sizeM}
                                />
                            )}
                        />
                        {canChangeClass && (
                            <AppButton
                                text={strings.character.changeClass}
                                width={250}
                                onPress={() =>
                                    navigate(SCREEN_NAMES.SELECT_CLASS)
                                }
                                style={{
                                    marginHorizontal: gapSize.sizeL,
                                    marginTop: gapSize.sizeM,
                                    alignSelf: "center",
                                }}
                            />
                        )}
                    </>
                )}
                {selectedTab === 1 && <Presets />}
            </ScrollView>
        </ScreenContainer>
    );
};

export default Character;

const styles = StyleSheet.create({
    listContainer: {
        marginTop: gapSize.sizeM,
        backgroundColor: "rgba(24, 21, 21, 0.8)",
        padding: gapSize.sizeL,
    },
});
