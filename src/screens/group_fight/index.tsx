import React, {useEffect, useState} from "react";
import {ActivityIndicator, FlatList, View} from "react-native";

import {useRoute} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";

import {colors, gapSize, images} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {
    AppButton,
    AppImage,
    AppText,
    Divider,
    ScreenContainer,
    TitleHeader,
} from "@components/index";
import {groupFightActions} from "@redux/actions";
import VerticalDivider from "@screens/inventory/VerticalDivider";
import {commonStyles, scaledValue, SCREEN_HEIGHT, strings} from "@utils/index";

import {RootState} from "@redux/index";
import FightDetailsHeader from "./FightDetailsHeader";
import FighterDetailsModal from "./FighterDetailsModal";
import FighterItem from "./FighterItem";

enum GroupFightStatus {
    PREPARING = 0,
    IN_PROGRESS = 1,
    FINISHED = 2,
}

const GroupFight = () => {
    const dispatch = useDispatch();
    const {params} = useRoute();
    const groupFightDetailsLoading = useSelector(
        (state: RootState) => state.groupFight.groupFightDetailsLoading,
    );
    const groupFightDetails = useSelector(
        (state: RootState) => state.groupFight.groupFightDetails,
    );

    const [selectedFighter, setSelectedFighter] = useState(false);
    const {fightId} = params || {};

    useEffect(() => {
        if (fightId) {
            getGroupFightDetails();
        }
    }, []);

    function getGroupFightDetails() {
        console.log("fightId", fightId);
        dispatch(groupFightActions.getGroupFightDetails(fightId));
    }

    function joinFight() {
        dispatch(groupFightActions.joinGroupFight(fightId, 2));
    }

    return (
        <ScreenContainer>
            <View style={{padding: gapSize.sizeL}}>
                <TitleHeader
                    title=""
                    rightComponent={
                        <AppImage
                            containerStyle={{
                                position: "absolute",
                                right: 0,
                            }}
                            hitSlop={commonStyles.hitSlop}
                            source={images.icons.reload}
                            size={25}
                            style={{marginRight: gapSize.sizeM}}
                            onPress={getGroupFightDetails}
                        />
                    }
                />
                {groupFightDetailsLoading ? (
                    <ActivityIndicator
                        style={{
                            marginTop: SCREEN_HEIGHT * 0.4,
                            alignSelf: "center",
                        }}
                    />
                ) : (
                    <View style={{marginTop: gapSize.sizeM}}>
                        <FightDetailsHeader />
                        <AppText
                            text={groupFightDetails?.group_fight.status_text}
                            centered
                            type={TextTypes.H4}
                            color={colors.secondary500}
                            style={{marginVertical: gapSize.sizeL}}
                        />
                        <View
                            style={{
                                height: scaledValue(331),
                                borderWidth: 1,
                                borderColor: colors.secondary500,
                                padding: gapSize.sizeM,
                            }}>
                            <View style={commonStyles.flexRowSpaceBetween}>
                                <View style={{width: "45%"}}>
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        data={
                                            groupFightDetails?.sides.attacker
                                                ?.participants
                                        }
                                        renderItem={({item}) => (
                                            <FighterItem
                                                fighter={item}
                                                onPress={() =>
                                                    setSelectedFighter(item)
                                                }
                                            />
                                        )}
                                        ItemSeparatorComponent={() => (
                                            <Divider
                                                width={"100%"}
                                                marginVertical={gapSize.sizeM}
                                            />
                                        )}
                                    />
                                </View>
                                <VerticalDivider style={{height: "100%"}} />
                                <View style={{width: "45%"}}>
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        data={
                                            groupFightDetails?.sides.defender
                                                ?.participants
                                        }
                                        renderItem={({item}) => (
                                            <FighterItem
                                                fighter={item}
                                                onPress={() =>
                                                    setSelectedFighter(item)
                                                }
                                            />
                                        )}
                                        ItemSeparatorComponent={() => (
                                            <Divider
                                                width={"100%"}
                                                marginVertical={gapSize.sizeM}
                                            />
                                        )}
                                    />
                                </View>
                            </View>
                        </View>
                        {groupFightDetails?.group_fight.status <
                            GroupFightStatus.FINISHED && (
                            <AppButton
                                onPress={joinFight}
                                text={strings.groupFight.joinFight}
                                width={200}
                                style={{
                                    marginTop: gapSize.sizeL,
                                    alignSelf: "center",
                                }}
                            />
                        )}
                    </View>
                )}
                <FighterDetailsModal
                    isVisible={!!selectedFighter}
                    onClose={() => setSelectedFighter(false)}
                    fighter={selectedFighter}
                />
            </View>
        </ScreenContainer>
    );
};

export default GroupFight;
