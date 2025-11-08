import React, {useEffect, useState} from "react";
import {StyleSheet, TouchableOpacity, View} from "react-native";

import auth from "@react-native-firebase/auth";
import {useRoute} from "@react-navigation/native";
import * as Progress from "react-native-progress";
import {useDispatch} from "react-redux";

import {guardApis} from "@apis/index";
import {colors, gapSize, images} from "@assets/index";
import {TextTypes} from "@components/AppText";
import LevelAvatar from "@components/Header/LevelAvatar";
import {
    AppImage,
    AppText,
    Divider,
    Prompt,
    ScreenContainer,
    TitleHeader,
} from "@components/index";
import {UserGuard} from "@interfaces/GameInterface";
import {characterActions} from "@redux/actions";
import commonStyles from "@utils/commonStyles";
import {maxLength12} from "@utils/constants";
import {pickImageAndUpload, renderNumber} from "@utils/helperFunctions";
import {scaledValue, strings} from "@utils/index";
import GuardOne from "./GuardOne";
import GuardTwo from "./GuardTwo";

const GuardDetails = () => {
    const dispatch = useDispatch();

    const {params} = useRoute();
    const {guard: guardData, guardUpgrades} = params || {};
    const [guard, setGuard] = useState<UserGuard>(guardData as UserGuard);
    const [changeName, setChangeName] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userProperties, setUserProperties] = useState<any[]>([]);

    const healthRate = guard.health / (guard.max_health ?? 100);
    const energyRate = guard.energy / (guard.max_energy ?? 100);

    useEffect(() => {
        dispatch(characterActions.getJobs());
        getGuard();
    }, []);

    function getGuard() {
        setLoading(true);
        guardApis
            .getGuards()
            .then(res => {
                setGuard(
                    res.data.user_guards.find(
                        (g: UserGuard) => g.id === guardData.id,
                    ),
                );
                setUserProperties(res.data.user_properties);
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 500);
            });
    }

    function changeGuardName(name: string) {
        guardApis.updateGuardName(guard.id, name).then(res => {
            getGuard();
        });
    }

    async function ensureAnonymousLogin() {
        const currentUser = auth().currentUser;
        if (!currentUser) {
            await auth().signInAnonymously();
        }
        return auth().currentUser?.uid;
    }

    async function pickImageAndUpdate() {
        const fbUserId = await ensureAnonymousLogin();
        pickImageAndUpload(250000, "ProfileImages/" + fbUserId).then(
            img_url => {
                if (!img_url) return;
                guardApis.updateGuardImage(guard.id, img_url).then(res => {
                    getGuard();
                });
            },
        );
    }

    function renderGuards() {
        switch (guard.type) {
            case 1:
                return (
                    <GuardOne
                        guard={guard}
                        getGuard={getGuard}
                        guardUpgradesData={guardUpgrades}
                        loading={loading}
                    />
                );
            case 2:
                return (
                    <GuardTwo
                        guard={guard}
                        getGuard={getGuard}
                        guardUpgradesData={guardUpgrades}
                        loading={loading}
                        userProperties={userProperties}
                    />
                );
            default:
                return null;
        }
    }

    return (
        <ScreenContainer>
            <View style={{padding: gapSize.size2L}}>
                <TitleHeader
                    title={guard.name}
                    rightComponent={
                        <AppImage
                            size={25}
                            onPress={() => setChangeName(true)}
                            source={images.icons.edit}
                            containerStyle={{
                                position: "absolute",
                                right: 0,
                            }}
                        />
                    }
                />
                <Prompt
                    isVisible={changeName}
                    onClose={() => {
                        setChangeName(false);
                    }}
                    title={strings.guards.changeName}
                    inputValidation="any"
                    maxLength={maxLength12}
                    onConfirm={changeGuardName}
                />
                <View style={commonStyles.flexRow}>
                    <TouchableOpacity onPress={pickImageAndUpdate}>
                        <LevelAvatar
                            overrideUser={{...guard}}
                            showName={false}
                            showStatus
                            scaledSize
                            size={178}
                            style={{marginLeft: -gapSize.sizeL}}
                        />
                    </TouchableOpacity>
                    <View style={{marginLeft: gapSize.sizeL}}>
                        <View style={{height: 12}} />
                        <View>
                            <View style={commonStyles.flexRowSpaceBetween}>
                                <AppText text={strings.gameKeys.hp} />
                                <AppText
                                    text={`${renderNumber(
                                        guard.health ?? 100,
                                        0,
                                    )}`}
                                    postText={`/ ${renderNumber(
                                        guard.max_health ?? 100,
                                        0,
                                    )}`}
                                />
                            </View>
                            <Progress.Bar
                                height={4}
                                progress={healthRate}
                                width={scaledValue(175)}
                                borderRadius={1}
                                borderColor={colors.special}
                                unfilledColor={colors.secondaryTwo500}
                                color={colors.green}
                                style={styles.progressBar}
                            />
                        </View>
                        <View style={{marginTop: gapSize.sizeS}}>
                            <View style={commonStyles.flexRowSpaceBetween}>
                                <AppText text={strings.gameKeys.energy} />
                                <AppText
                                    text={`${renderNumber(
                                        guard.energy ?? 100,
                                        0,
                                    )}`}
                                    postText={`/ ${renderNumber(
                                        guard.max_energy ?? 100,
                                        0,
                                    )}`}
                                />
                            </View>
                            <Progress.Bar
                                height={4}
                                progress={energyRate}
                                width={scaledValue(175)}
                                borderRadius={1}
                                borderColor={colors.special}
                                unfilledColor={colors.secondaryTwo500}
                                color={colors.orange}
                                style={styles.progressBar}
                            />
                        </View>
                        <View
                            style={[
                                commonStyles.flexRowSpaceBetween,
                                {marginTop: gapSize.sizeS},
                            ]}>
                            <AppText text={strings.guards.salary} />
                            <AppText
                                preText="$"
                                text={`${renderNumber(guard.salary ?? 100, 0)}`}
                                postText=" / h"
                                type={TextTypes.BodyBold}
                                color={colors.borderColor}
                            />
                        </View>
                        <Divider
                            width={"100%"}
                            marginVertical={gapSize.sizeS}
                        />
                        <View style={[commonStyles.flexRowSpaceBetween]}>
                            <AppText text={strings.common.experience} />
                            <AppText
                                text={`${renderNumber(
                                    guard.experience ?? 100,
                                    0,
                                )} `}
                                postText={`/ ${renderNumber(
                                    guard.required_experience ?? 100,
                                    0,
                                )}`}
                                type={TextTypes.BodyBold}
                                color={colors.borderColor}
                            />
                        </View>
                        <Divider
                            width={"100%"}
                            marginVertical={gapSize.sizeS}
                        />
                        <View
                            style={[
                                commonStyles.flexRowSpaceBetweenAlignCenter,
                            ]}>
                            <AppText
                                text={strings.common.lastActivity}
                                fontSize={12.5}
                            />
                            <AppText
                                text={`${guard.last_activity_ago}`}
                                type={TextTypes.BodyBold}
                                color={colors.borderColor}
                                fontSize={12.5}
                            />
                        </View>
                        <Divider
                            width={"100%"}
                            marginVertical={gapSize.sizeS}
                        />
                        <View
                            style={[
                                commonStyles.flexRowSpaceBetweenAlignCenter,
                            ]}>
                            <AppText
                                text={strings.common.status}
                                fontSize={12.5}
                            />
                            <AppText
                                text={`${
                                    guard.status == 0
                                        ? strings.common.active
                                        : strings.common.idle
                                }`}
                                type={TextTypes.BodyBold}
                                color={colors.borderColor}
                                fontSize={12.5}
                            />
                        </View>
                    </View>
                </View>
                {renderGuards()}
            </View>
        </ScreenContainer>
    );
};

export default GuardDetails;

const styles = StyleSheet.create({
    progressBar: {
        padding: 2,
        backgroundColor: colors.grey900,
        marginTop: gapSize.sizeS / 2,
    },
});
