import React from "react";
import {ImageBackground, TouchableOpacity} from "react-native";

import FastImage from "react-native-fast-image";
import {useSelector} from "react-redux";

import {districtApis} from "@apis/index";
import {colors, gapSize, images} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {AppButton, AppImage, AppText, LabelText} from "@components/index";
import {RootState} from "@redux/index";
import {showToast} from "@utils/helperFunctions";
import {SCREEN_WIDTH, strings} from "@utils/index";
import CollectedTributesView from "./CollectedTributesView";

import {DistrictFightPhaseTypes} from ".";

const size = SCREEN_WIDTH * 0.42;

interface DistrictItemProps {
    item: any;
    onPress: () => void;
    onBattleIconPress: () => void;
    isMyStreet: boolean;
    phase: DistrictFightPhaseTypes;
    isGangOwner: boolean;
    ownerGang: any;
    isTarget: boolean;
    onDistrictSelected: () => void;
}

const DistrictItem = ({
    item,
    onPress,
    onBattleIconPress,
    isMyStreet,
    phase,
    isGangOwner,
    ownerGang,
    isTarget,
    onDistrictSelected,
}: DistrictItemProps) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const isPreparationPhase = phase === DistrictFightPhaseTypes.PREPARATION;
    const isFightPhase = phase === DistrictFightPhaseTypes.FIGHT;
    const isOwningPhase = phase === DistrictFightPhaseTypes.OWNING;
    const isOwnerGangIsMyGang = ownerGang?.owner_gang_id === user?.gang_id;
    console.log("user", user);
    console.log("isOwnerGangIsMyGang", isOwnerGangIsMyGang);
    const isStreetDistrict = item.id <= 4;

    function onDistrictSelect() {
        districtApis.createOrUpdateTargetDistrict(item.id).then(res => {
            showToast(res.data.message);
            onDistrictSelected();
        });
    }
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={!item.name}
            style={{
                borderWidth: 1,
                borderColor: isMyStreet ? colors.green : "transparent",
                marginBottom: gapSize.sizeM,
                marginRight: gapSize.sizeM,
            }}>
            <ImageBackground
                key={item.id}
                source={images.districts[item.id]}
                style={{
                    width: size,
                    height: size,
                    opacity: item.name ? 1 : 0.35,
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                {isTarget && isStreetDistrict && !isOwningPhase && (
                    <LabelText
                        width={size * 0.6}
                        text="Target"
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                        }}
                    />
                )}
                {isFightPhase && isStreetDistrict && (
                    <AppImage
                        onPress={onBattleIconPress}
                        source={images.icons.fightVs}
                        size={32}
                        containerStyle={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                        }}
                    />
                )}
                <AppText
                    text={item.name}
                    type={TextTypes.H6}
                    color={colors.black}
                    style={{
                        top: 1,
                    }}
                />
                {isOwningPhase && isStreetDistrict && ownerGang && (
                    <CollectedTributesView
                        isMyGang={isOwnerGangIsMyGang}
                        text={ownerGang?.owner_gang_name}
                        collectedTributes={ownerGang?.collected_tribute_amount}
                        showCollectedTributes={isOwnerGangIsMyGang}
                    />
                )}
                {isPreparationPhase && isGangOwner && item.id < 5 && (
                    <AppButton
                        onPress={onDistrictSelect}
                        text={strings.common.select}
                        style={{
                            position: "absolute",
                            bottom: 5,
                            alignSelf: "center",
                        }}
                        width={size * 0.8}
                        height={52}
                    />
                )}
                {ownerGang && isStreetDistrict && (
                    <FastImage
                        source={
                            ownerGang?.owner_gang_img_url
                                ? {uri: ownerGang?.owner_gang_img_url}
                                : images.examples.gang
                        }
                        style={{
                            position: "absolute",
                            bottom: 4,
                            left: 4,
                            borderRadius: 50,
                            width: 44,
                            height: 44,
                            borderWidth: 1,
                            borderColor: colors.secondary500,
                        }}
                    />
                )}
            </ImageBackground>
        </TouchableOpacity>
    );
};

export default DistrictItem;
