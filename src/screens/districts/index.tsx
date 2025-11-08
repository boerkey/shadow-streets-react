import React, {useEffect, useState} from "react";
import {FlatList, SafeAreaView, View} from "react-native";

import {useDispatch, useSelector} from "react-redux";

import {districtApis, timeoutApis} from "@apis/index.ts";
import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {AppImage, AppText, Prompt, TitleHeader} from "@components/index.ts";
import useCountdown from "@hooks/useCountdown.ts";
import {GameStreet} from "@interfaces/GameInterface.ts";
import {authActions} from "@redux/actions";
import {RootState} from "@redux/index.ts";
import {showToast} from "@utils/helperFunctions.ts";
import {commonStyles, strings} from "@utils/index.ts";

import DistrictFightListModal from "./DistrictFightListModel";
import DistrictItem from "./DistrictItem";

export enum DistrictFightPhaseTypes {
    PREPARATION,
    FIGHT,
    OWNING,
}

interface DistrictFightPhase {
    district_owners: {
        id: number;
        district_id: number;
        collected_tribute_amount: number;
        owning_ends_at: number;
        owner_gang_name: string;
        owner_gang_img_url: string;
        owner_gang_id: number;
    }[];
    is_gang_owner: boolean;
    next_phase_at_as_seconds: number;
    phase: DistrictFightPhaseTypes;
    user_gang_district_target: {
        id: number;
        district_id: number;
        gang_id: number;
    };
}

const Districts = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const gameStreets = useSelector(
        (state: RootState) => state.game.gameStreets,
    );
    const [selectedStreet, setSelectedStreet] = useState<null | GameStreet>(
        null,
    );
    const [showPrompt, setShowPrompt] = useState(false);
    const [secondsToRelocate, setSecondsToRelocate] = useState(0);
    const [districtFightPhase, setDistrictFightPhase] =
        useState<DistrictFightPhase>({
            district_owners: [],
            is_gang_owner: false,
            next_phase_at_as_seconds: 0,
            phase: DistrictFightPhaseTypes.PREPARATION,
            user_gang_district_target: {
                id: 0,
                district_id: 0,
                gang_id: 0,
            },
        });
    const {seconds: timeLeft, formatted} = useCountdown(secondsToRelocate);
    const {formatted: districtFightFormatted} = useCountdown(
        districtFightPhase.next_phase_at_as_seconds,
        {
            onComplete: getDistrictFightPhase,
        },
    );
    const [districtId, setDistrictId] = useState(0);
    const [districtName, setDistrictName] = useState("");

    useEffect(() => {
        getTimeout();
        getDistrictFightPhase();
    }, []);

    function getTimeout() {
        timeoutApis.getUserTimeout().then(res => {
            const seconds = res.data.relocation_cooldown_seconds;
            setSecondsToRelocate(seconds);
        });
    }

    function getDistrictFightPhase() {
        districtApis.getDistrictFightPhase().then(res => {
            setDistrictFightPhase(res.data);
        });
    }

    function changeDistrict() {
        setShowPrompt(false);
        if (
            selectedStreet?.location_x == user.location_x &&
            selectedStreet?.location_y == user.location_y
        ) {
            return false;
        }

        districtApis
            .changeDistrict(
                selectedStreet?.location_x,
                selectedStreet?.location_y,
            )
            .then(res => {
                showToast(res.data.message);
                dispatch(authActions.getUser());
            });
    }

    function getOrderedStreets() {
        return [...gameStreets, {id: 71}, {id: 72}];
    }

    function renderTimeout() {
        if (timeLeft !== 0) {
            return (
                <View
                    style={[
                        commonStyles.flexRowAlignCenter,
                        {position: "absolute", right: -8, top: 4},
                    ]}>
                    <AppImage source={images.icons.redTime} size={25} />
                    <AppText
                        text={formatted}
                        type={TextTypes.H2}
                        color={"#F02323"}
                    />
                </View>
            );
        }
    }

    const _renderItem = ({item}) => {
        const districtId = gameStreets.find(
            (street: GameStreet) =>
                street.location_x === item.location_x &&
                street.location_y === item.location_y,
        )?.id;
        const isMyStreet =
            item.location_x === user.location_x &&
            item.location_y === user.location_y;
        const ownerGang = districtFightPhase.district_owners?.find(
            owner => owner.district_id === districtId,
        );
        const isTarget =
            districtFightPhase.user_gang_district_target?.district_id ===
            districtId;

        return (
            <DistrictItem
                item={item}
                onPress={() => {
                    setSelectedStreet(item);
                    setTimeout(() => setShowPrompt(true), 100);
                }}
                isMyStreet={isMyStreet}
                phase={districtFightPhase.phase}
                isGangOwner={districtFightPhase.is_gang_owner}
                ownerGang={ownerGang}
                isTarget={isTarget}
                onDistrictSelected={getDistrictFightPhase}
                onBattleIconPress={() => {
                    setDistrictName(item.name);
                    setDistrictId(item.id);
                }}
            />
        );
    };

    function getPromptText() {
        if (selectedStreet) {
            let bonusText = "";

            if (selectedStreet.economic_bonus > 0) {
                bonusText =
                    strings.districts["economic_bonus"] +
                    ": " +
                    selectedStreet.economic_bonus * 100 +
                    "%";
            }
            if (selectedStreet.stat_gain_bonus > 0) {
                bonusText =
                    strings.districts["stat_gain_bonus"] +
                    ": " +
                    selectedStreet.stat_gain_bonus * 100 +
                    "%";
            }
            if (selectedStreet.money_gain_bonus > 0) {
                bonusText =
                    strings.districts["money_gain_bonus"] +
                    ": " +
                    selectedStreet.money_gain_bonus * 100 +
                    "%";
            }

            const description = selectedStreet.description?.trim() || "";

            return [description + "\n\n" + bonusText, [bonusText]];
        }

        return ["", [""]];
    }

    function getPhaseText() {
        if (districtFightPhase.phase === DistrictFightPhaseTypes.PREPARATION) {
            return strings.districts.preparationPhase;
        }
        if (districtFightPhase.phase === DistrictFightPhaseTypes.FIGHT) {
            return strings.districts.fightPhase;
        }
        if (districtFightPhase.phase === DistrictFightPhaseTypes.OWNING) {
            return strings.districts.owningPhase;
        }
    }

    function getPhaseDescription() {
        if (districtFightPhase.phase === DistrictFightPhaseTypes.PREPARATION) {
            return strings.districts.preparationPhaseDescription;
        }
        if (districtFightPhase.phase === DistrictFightPhaseTypes.FIGHT) {
            return strings.districts.fightPhaseDescription;
        }
        if (districtFightPhase.phase === DistrictFightPhaseTypes.OWNING) {
            return strings.districts.owningPhaseDescription;
        }
    }

    function renderDistrictFightTimeoutContainer() {
        return (
            <>
                <View
                    style={{
                        backgroundColor: colors.secondaryTwo500,
                        height: 90,
                        width: "115%",
                        alignSelf: "center",
                        marginVertical: gapSize.sizeM,
                        alignItems: "center",
                        paddingVertical: gapSize.sizeM,
                    }}>
                    <AppText text={getPhaseText()} type={TextTypes.H2} />
                    <AppText
                        preText={strings.districts.endsIn + ": "}
                        text={districtFightFormatted}
                        type={TextTypes.H2}
                    />
                </View>
                {(districtFightPhase.is_gang_owner ||
                    districtFightPhase.phase !=
                        DistrictFightPhaseTypes.PREPARATION) && (
                    <AppText text={getPhaseDescription()} centered />
                )}
            </>
        );
    }

    return (
        <SafeAreaView
            style={{
                backgroundColor: colors.secondaryTwo900,
                flex: 1,
            }}>
            <DistrictFightListModal
                districtId={districtId}
                districtName={districtName}
                onClose={() => setDistrictId(0)}
            />
            <View
                style={{
                    padding: gapSize.size3L,
                }}>
                <TitleHeader
                    title={strings.districts.title}
                    rightComponent={renderTimeout()}
                />
                {renderDistrictFightTimeoutContainer()}
                <FlatList
                    style={{marginTop: gapSize.sizeL}}
                    data={getOrderedStreets()}
                    renderItem={_renderItem}
                    numColumns={2}
                />
                <Prompt
                    isVisible={showPrompt}
                    onClose={() => setShowPrompt(false)}
                    onConfirm={changeDistrict}
                    title={selectedStreet?.name}
                    text={getPromptText()[0]}
                    wordsToHighlight={getPromptText()[1]}
                    highlightStyle={{color: colors.green}}
                    confirmButtonText={strings.common.travel}
                />
            </View>
        </SafeAreaView>
    );
};

export default Districts;
