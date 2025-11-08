import React, {useEffect} from "react";
import {
    Linking,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import {CommonActions} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";

import {settingsApis} from "@apis/index.ts";
import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {
    AppImage,
    AppText,
    ScreenContainer,
    TitleHeader,
    TooltipDropdown,
} from "@components/index.ts";
import {authActions} from "@redux/actions";
import {RootState} from "@redux/index.ts";
import {commonStyles, scaledValue, strings} from "@utils/index.ts";

import {COUNTRIES} from "@constants/countries.ts";
import {BLOCKED_USERS_KEY} from "@constants/keys.ts";
import {setHeaders} from "@utils/axios.ts";
import {SCREEN_NAMES} from "../../router.tsx";

const Settings = ({navigation}) => {
    const dispatch = useDispatch();
    const gameConfig = useSelector(
        (state: RootState) => state.game?.gameConfig,
    );
    const blockedUsers = useSelector(
        (state: RootState) => state.auth.blockedUsers,
    );
    const user = useSelector((state: RootState) => state.auth.user);
    const userSettings = useSelector(
        (state: RootState) => state.auth.userSettings,
    );

    const autoEatOff = userSettings?.auto_eat == 0;
    const autoHealOff = userSettings?.auto_heal == 0;
    const passiveGrindingEnabled = userSettings?.auto_job_id > 0;

    useEffect(() => {
        getUserSettings();
    }, []);

    function updateLang(lang: string) {
        settingsApis
            .updateUserLang(lang)
            .then(res => {
                dispatch(
                    authActions.setUser({
                        ...user,
                        lang,
                    }),
                );
                updateAuthCredentials(lang);
            })
            .finally(() => {});
    }

    async function updateAuthCredentials(lang: string) {
        let authCredentials = await AsyncStorage.getItem("@authCredentials");
        if (authCredentials) {
            authCredentials = JSON.parse(authCredentials);
            setHeaders(authCredentials, lang);
        }
    }

    function getUserSettings() {
        dispatch(authActions.getUserSettings());
    }

    function updateAutoEat(number: number) {
        settingsApis.updateAutoEat(number).then(() => {
            getUserSettings();
        });
    }

    function updateAutoHeal(number: number) {
        settingsApis.updateAutoHeal(number).then(() => {
            getUserSettings();
        });
    }

    function updateAutoJobAmount(number: number) {
        settingsApis.updateAutoJobAmount(number).then(() => {
            getUserSettings();
        });
    }

    function getLanguages() {
        let languages: {name: string}[] = [];
        gameConfig.languages?.forEach((lang: string) => {
            languages.push({
                name: strings.settings.languages[lang],
                lang: lang.toLowerCase(),
            });
        });
        return languages;
    }

    function getAutoEatText() {
        let message = strings.settings.eatBelow;
        message = message.replace("{energy}", userSettings?.auto_eat);
        return message;
    }

    function getAutoHealText() {
        let message = strings.settings.healBelow;
        message = message.replace("{health}", userSettings?.auto_heal);
        return message;
    }

    function logout() {
        AsyncStorage.setItem("@loggedOut", "1");

        dispatch(authActions.resetStates());

        navigation.dispatch(
            CommonActions.reset({
                index: 0, // Set the first screen in the new stack
                routes: [{name: SCREEN_NAMES.AUTH}], // Replace with Login screen
            }),
        );
    }

    function removeBlockedUser(user_id: string) {
        const newBlockedUsers = blockedUsers.filter(
            user => user.user_id !== user_id,
        );
        dispatch(authActions.setBlockedUsers(newBlockedUsers));
        AsyncStorage.setItem(
            BLOCKED_USERS_KEY,
            JSON.stringify(newBlockedUsers),
        );
    }

    function getAutoJobAmountList() {
        let list = [];
        for (let i = 1; i <= userSettings?.max_auto_job_amount; i++) {
            list.push({
                name: i + "x " + strings.settings.jobPerMinute,
            });
        }
        return list;
    }

    function updateUserCountry(country: string) {
        settingsApis.updateUserCountry(country).then(() => {
            getUserSettings();
        });
    }

    function setAutoJob(jobId: number) {
        settingsApis.updateAutoJob(jobId).then(() => {
            dispatch(authActions.getUserSettings());
        });
        settingsApis.updateAutoPartyJob(jobId).then(() => {
            dispatch(authActions.getUserSettings());
        });
    }

    return (
        <ScreenContainer>
            <ScrollView>
                <View style={{padding: gapSize.size3L}}>
                    <TitleHeader title={strings.settings.title} />
                    <AppText
                        text={strings.settings.general}
                        type={TextTypes.Caption2}
                        style={{marginTop: gapSize.size3L}}
                    />
                    <View style={styles.sectionContainer}>
                        <TooltipDropdown
                            paddingHorizontal={0}
                            selectedIndex={-1}
                            textType={TextTypes.BodyBold}
                            options={getLanguages()}
                            onSelect={(index, item) => updateLang(item.lang)}>
                            <View style={commonStyles.flexRowSpaceBetween}>
                                <View style={commonStyles.flexRowAlignCenter}>
                                    <AppImage
                                        source={images.icons.language}
                                        size={13}
                                        style={{marginRight: gapSize.size2S}}
                                    />
                                    <AppText
                                        text={`${
                                            strings.settings.language
                                        } (${user.lang.toUpperCase()})`}
                                    />
                                </View>
                                <AppImage
                                    source={images.icons.arrowDown}
                                    size={18}
                                />
                            </View>
                        </TooltipDropdown>
                        <View style={styles.divider} />
                        <TooltipDropdown
                            paddingHorizontal={0}
                            selectedIndex={-1}
                            textType={TextTypes.BodyBold}
                            options={COUNTRIES.map(country => ({
                                name: country.name,
                                code: country.code,
                                icon: images.countries[country.code],
                            }))}
                            dropdownWidth={scaledValue(280)}
                            maxHeight={400}
                            onSelect={(index, item) =>
                                updateUserCountry(item.code)
                            }>
                            <View style={commonStyles.flexRowSpaceBetween}>
                                <View style={commonStyles.flexRowAlignCenter}>
                                    <AppImage
                                        source={
                                            images.countries[
                                                userSettings.country
                                            ]
                                        }
                                        size={20}
                                        style={{marginRight: gapSize.size2S}}
                                    />
                                    <AppText
                                        text={`${
                                            strings.settings.country
                                        } (${userSettings.country?.toUpperCase()})`}
                                    />
                                </View>
                                <AppImage
                                    source={images.icons.arrowDown}
                                    size={18}
                                />
                            </View>
                        </TooltipDropdown>
                    </View>

                    <AppText
                        text={strings.settings.gameplay}
                        type={TextTypes.Caption2}
                        style={{marginTop: gapSize.size3L}}
                    />
                    <View style={styles.sectionContainer}>
                        <TouchableOpacity
                            onPress={() => updateAutoEat(autoEatOff ? 70 : 0)}
                            hitSlop={commonStyles.hitSlop}
                            style={commonStyles.flexRowSpaceBetween}>
                            <View style={commonStyles.flexRowAlignCenter}>
                                <AppImage
                                    source={images.icons.energy}
                                    size={13}
                                    style={{marginRight: gapSize.size2S}}
                                />
                                <AppText text={strings.settings.autoEatFood} />
                            </View>
                            <AppText
                                text={
                                    strings.settings[autoEatOff ? "off" : "on"]
                                }
                            />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        {!autoEatOff && (
                            <>
                                <View>
                                    <View
                                        style={commonStyles.flexRowAlignCenter}>
                                        <AppImage
                                            source={images.icons.energy}
                                            size={13}
                                            style={{
                                                marginRight: gapSize.size2S,
                                            }}
                                        />
                                        <AppText text={getAutoEatText()} />
                                    </View>
                                </View>
                                <Slider
                                    value={userSettings?.auto_eat * 0.01}
                                    onSlidingComplete={val => {
                                        const lastVal =
                                            parseFloat(val.toFixed(2)) * 100;
                                        updateAutoEat(lastVal);
                                    }}
                                    lowerLimit={0.1}
                                    upperLimit={0.9}
                                    thumbTintColor={colors.secondary500}
                                    maximumTrackTintColor={"#424242"}
                                    minimumTrackTintColor={colors.secondary500}
                                />
                            </>
                        )}
                        <TouchableOpacity
                            onPress={() => updateAutoHeal(autoHealOff ? 70 : 0)}
                            hitSlop={commonStyles.hitSlop}
                            style={commonStyles.flexRowSpaceBetween}>
                            <View style={commonStyles.flexRowAlignCenter}>
                                <AppImage
                                    source={images.icons.health}
                                    size={13}
                                    style={{marginRight: gapSize.size2S}}
                                />
                                <AppText text={strings.settings.autoHeal} />
                            </View>
                            <AppText
                                text={
                                    strings.settings[autoHealOff ? "off" : "on"]
                                }
                            />
                        </TouchableOpacity>
                        {!autoHealOff && (
                            <>
                                <View style={styles.divider} />
                                <View>
                                    <View
                                        style={commonStyles.flexRowAlignCenter}>
                                        <AppImage
                                            source={images.icons.health}
                                            size={13}
                                            style={{
                                                marginRight: gapSize.size2S,
                                            }}
                                        />
                                        <AppText text={getAutoHealText()} />
                                    </View>
                                </View>
                                <Slider
                                    value={userSettings?.auto_heal * 0.01}
                                    onSlidingComplete={val => {
                                        const lastVal =
                                            parseFloat(val.toFixed(2)) * 100;
                                        updateAutoHeal(lastVal);
                                    }}
                                    lowerLimit={0.1}
                                    upperLimit={0.9}
                                    thumbTintColor={colors.secondary500}
                                    maximumTrackTintColor={"#424242"}
                                    minimumTrackTintColor={colors.secondary500}
                                />
                            </>
                        )}
                        <View style={styles.divider} />
                        <TouchableOpacity
                            onPress={() =>
                                setAutoJob(passiveGrindingEnabled ? 0 : 1)
                            }
                            hitSlop={commonStyles.hitSlop}
                            style={commonStyles.flexRowSpaceBetween}>
                            <View style={commonStyles.flexRowAlignCenter}>
                                <AppImage
                                    source={images.icons.energy}
                                    size={13}
                                    style={{marginRight: gapSize.size2S}}
                                />
                                <AppText
                                    text={strings.settings.passiveGrindingMode}
                                />
                            </View>
                            <AppText
                                text={
                                    strings.settings[
                                        passiveGrindingEnabled ? "on" : "off"
                                    ]
                                }
                            />
                        </TouchableOpacity>
                        {passiveGrindingEnabled && (
                            <>
                                <View style={styles.divider} />
                                <TooltipDropdown
                                    paddingHorizontal={0}
                                    textType={TextTypes.BodyBold}
                                    options={getAutoJobAmountList()}
                                    onSelect={(index, item) => {
                                        updateAutoJobAmount(index + 1);
                                    }}>
                                    <View
                                        style={
                                            commonStyles.flexRowSpaceBetween
                                        }>
                                        <View
                                            style={
                                                commonStyles.flexRowAlignCenter
                                            }>
                                            <AppImage
                                                source={images.icons.energy}
                                                size={13}
                                                style={{
                                                    marginRight: gapSize.size2S,
                                                }}
                                            />
                                            <AppText
                                                text={
                                                    strings.settings
                                                        .jobPerMinute
                                                }
                                            />
                                        </View>
                                        <AppText
                                            text={userSettings.auto_job_amount}
                                        />
                                    </View>
                                </TooltipDropdown>
                            </>
                        )}
                        <View style={styles.divider} />
                        <AppText
                            text={strings.settings.jobInfo}
                            color={colors.secondary500}
                        />
                    </View>

                    <AppText
                        text={strings.settings.privacy}
                        type={TextTypes.Caption2}
                        style={{marginTop: gapSize.size3L}}
                    />
                    <View style={styles.sectionContainer}>
                        <TooltipDropdown
                            paddingHorizontal={0}
                            textType={TextTypes.BodyBold}
                            dropdownWidth={scaledValue(250)}
                            options={blockedUsers.map(user => ({
                                name: user.name + " | " + strings.common.remove,
                                user_id: user.user_id,
                            }))}
                            onSelect={(index, item) =>
                                removeBlockedUser(item.user_id)
                            }>
                            <View style={commonStyles.flexRowSpaceBetween}>
                                <View style={commonStyles.flexRowAlignCenter}>
                                    <AppImage
                                        source={images.icons.block}
                                        size={13}
                                        style={{marginRight: gapSize.size2S}}
                                    />
                                    <AppText
                                        text={strings.settings.blockedUsers}
                                    />
                                </View>
                                <View style={commonStyles.flexRowAlignCenter}>
                                    <AppText
                                        text={blockedUsers.length}
                                        type={TextTypes.BodyBold}
                                    />
                                    <AppImage
                                        source={images.icons.arrowDown}
                                        size={13}
                                        style={{marginLeft: gapSize.size2S}}
                                    />
                                </View>
                            </View>
                        </TooltipDropdown>
                        <View style={styles.divider} />
                        <TouchableOpacity
                            onPress={() =>
                                Linking.openURL(
                                    "https://shadowstreets.online/privacy_policy",
                                )
                            }
                            style={commonStyles.flexRowSpaceBetween}>
                            <View style={commonStyles.flexRowAlignCenter}>
                                <AppImage
                                    source={images.icons.info}
                                    size={13}
                                    style={{marginRight: gapSize.size2S}}
                                />
                                <AppText
                                    text={strings.settings.privacyPolicy}
                                />
                            </View>
                            <AppImage
                                source={images.icons.arrowDown}
                                size={13}
                                style={{
                                    marginLeft: gapSize.size2S,
                                    transform: [{rotate: "-90deg"}],
                                }}
                            />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity
                            onPress={() =>
                                Linking.openURL(
                                    "https://shadowstreets.online/eula",
                                )
                            }
                            style={commonStyles.flexRowSpaceBetween}>
                            <View style={commonStyles.flexRowAlignCenter}>
                                <AppImage
                                    source={images.icons.info}
                                    size={13}
                                    style={{marginRight: gapSize.size2S}}
                                />
                                <AppText text={strings.settings.eula} />
                            </View>
                            <AppImage
                                source={images.icons.arrowDown}
                                size={13}
                                style={{
                                    marginLeft: gapSize.size2S,
                                    transform: [{rotate: "-90deg"}],
                                }}
                            />
                        </TouchableOpacity>
                    </View>

                    <AppText
                        text={strings.settings.login}
                        type={TextTypes.Caption2}
                        style={{marginTop: gapSize.size3L}}
                    />
                    <View style={styles.sectionContainer}>
                        <TouchableOpacity
                            onPress={logout}
                            style={commonStyles.flexRowSpaceBetween}>
                            <View style={commonStyles.flexRowAlignCenter}>
                                <AppImage
                                    source={images.icons.logout}
                                    size={13}
                                    style={{marginRight: gapSize.size2S}}
                                />
                                <AppText text={strings.settings.logout} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{height: 50}} />
            </ScrollView>
        </ScreenContainer>
    );
};

export default Settings;

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: gapSize.sizeM,
        backgroundColor: "#191717",
        width: "100%",
        padding: gapSize.sizeL,
        borderWidth: 1,
        borderColor: colors.secondary500,
    },
    divider: {
        width: "100%",
        height: 0.5,
        marginVertical: 12,
        backgroundColor: colors.lineColor,
    },
});
