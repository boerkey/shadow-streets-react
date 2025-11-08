import React from "react";
import {ImageBackground, View} from "react-native";

import {useDispatch, useSelector} from "react-redux";

import {confinedApis} from "@apis/index.ts";
import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import LevelAvatar from "@components/Header/LevelAvatar.tsx";
import {AppButton, AppText} from "@components/index.ts";
import {UserStatuses} from "@interfaces/UserInterface.ts";
import {authActions} from "@redux/actions";
import {RootState} from "@redux/index.ts";
import {
    calculateRequiredEnergy,
    calculateRequiredMoney,
} from "@screens/confined_people/logic.ts";
import {getDarkBackground, showToast} from "@utils/helperFunctions.ts";
import {commonStyles, scaledValue, strings} from "@utils/index.ts";
import useCountdown from "../../hooks/useCountdown.ts";

export interface ConfinedUser {
    id: number;
    user_id: number;
    name: string;
    status: UserStatuses.IN_JAIL | UserStatuses.HOSPITALIZED;
    duration: number;
    level: number;
    img_url: string;
    avatar_frame_id: number;
    type: number;
}

const ConfinedItem = ({
    item,
    onRefresh,
}: {
    item: ConfinedUser;
    onRefresh(): void;
}) => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const gameConfig = useSelector((state: RootState) => state.game.gameConfig);
    const {seconds, formatted} = useCountdown(item.duration);
    const isHospital = item.status === UserStatuses.HOSPITALIZED;

    const requiredEnergy = calculateRequiredEnergy(
        item.level,
        gameConfig.energy_per_level,
    );
    const requiredMoney = calculateRequiredMoney(item.level);

    function saveConfinedUser() {
        confinedApis.saveConfinedPerson(item.id, item.type).then(res => {
            showToast(res.data.message);
            dispatch(
                authActions.setUser({
                    ...user,
                    money: res.data.remaining_money,
                    energy: res.data.remaining_energy,
                }),
            );
            onRefresh();
        });
    }

    return (
        <View
            style={{
                borderWidth: 1,
                borderColor: colors.secondary500,
                width: "100%",
                height: scaledValue(103),
                marginBottom: gapSize.sizeM,
            }}>
            <ImageBackground
                resizeMode={"cover"}
                style={{
                    width: "100%",
                    height: "100%",
                }}
                source={images.backgrounds.confinedStatuses[item.status]}>
                <View
                    style={{
                        padding: gapSize.sizeM,
                        zIndex: 2,
                        backgroundColor: getDarkBackground(isHospital ? 6 : 1),
                        height: "100%",
                    }}>
                    <View style={commonStyles.flexRow}>
                        <View style={{...commonStyles.flexRow, width: "45%"}}>
                            <LevelAvatar
                                overrideUser={item}
                                size={62}
                                showStatus
                                showName={false}
                                scaledSize
                                frameId={item.avatar_frame_id}
                            />
                            <View style={{marginLeft: 12}}>
                                <AppText
                                    text={item.name}
                                    type={TextTypes.H6}
                                    fontSize={12}
                                />
                                <View style={{marginTop: gapSize.sizeS}}>
                                    <AppText
                                        text={
                                            strings.confinedPeople.remainingTime
                                        }
                                        type={TextTypes.Caption}
                                    />
                                    <AppText text={formatted} />
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                backgroundColor: "#B1B1B1",
                                height: "80%",
                                width: 1,
                                marginHorizontal: gapSize.sizeL,
                            }}
                        />
                        <View
                            style={{
                                width: "45%",
                                justifyContent: "space-between",
                            }}>
                            <View style={commonStyles.flexRowSpaceBetween}>
                                <View style={commonStyles.alignItemsCenter}>
                                    <AppText
                                        text={`${requiredMoney}$`}
                                        fontSize={16}
                                    />
                                    <AppText
                                        text={
                                            item.status == 2
                                                ? strings.confinedPeople
                                                      .ransomPrice
                                                : strings.confinedPeople
                                                      .treatmentCosts
                                        }
                                        type={TextTypes.Caption}
                                    />
                                </View>
                                <View style={commonStyles.alignItemsCenter}>
                                    <AppText
                                        text={`${requiredEnergy}`}
                                        fontSize={16}
                                    />
                                    <AppText
                                        text={
                                            strings.confinedPeople
                                                .requiredEnergy
                                        }
                                        type={TextTypes.Caption}
                                    />
                                </View>
                            </View>
                            {(user.id !== item.user_id || item.type == 2) && (
                                <AppButton
                                    onPress={saveConfinedUser}
                                    text={strings.confinedPeople.rescue}
                                    type={"primarySmall"}
                                    height={45}
                                    style={{
                                        ...commonStyles.alignCenter,
                                        top: gapSize.sizeS,
                                    }}
                                />
                            )}
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

export default ConfinedItem;
