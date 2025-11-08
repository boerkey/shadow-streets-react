import React, {useState} from "react";
import {TouchableOpacity, View} from "react-native";

import {useDispatch} from "react-redux";

import {authApis} from "@apis/index.ts";
import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText/index.tsx";
import {
    AppButton,
    AppImage,
    AppInput,
    AppText,
    Divider,
    Prompt,
} from "@components/index.ts";
import {authActions, gameActions} from "@redux/actions";
import {setHeaders} from "@utils/axios.ts";
import {showToast} from "@utils/helperFunctions.ts";
import {commonStyles, scaledValue, strings} from "@utils/index.ts";
import {navigate, SCREEN_NAMES} from "../../router.tsx";

const Login = ({onScreenChange}) => {
    const dispatch = useDispatch();
    const [emailOrUserName, setEmailOrUserName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPasswordResetPrompt, setShowPasswordResetPrompt] =
        useState(false);

    async function login() {
        if (emailOrUserName && password && !loading) {
            setLoading(true);
            authApis
                .login(emailOrUserName, password, "")
                .then(res => {
                    resetState();
                    setHeaders([
                        {key: "Authorization", value: res.data.login_token},
                        {key: "Accept-Language", value: res.data.user.lang},
                        {key: "uid", value: res.data.user.id},
                    ]);
                    dispatch(authActions.getUserBonuses());
                    dispatch(authActions.setUser(res.data.user));
                    setTimeout(() => {
                        navigate(SCREEN_NAMES.HOME);
                    }, 500);
                    reFetchAllGameData();
                })
                .catch(e => {
                    console.log(e.message);
                })
                .finally(() => {
                    setTimeout(() => setLoading(false), 300);
                });
        }
    }

    function reFetchAllGameData() {
        dispatch(gameActions.getGameConfig());
        dispatch(gameActions.getGameStreets());
        dispatch(gameActions.getGameItems());
        dispatch(gameActions.getGamePropertyUpgrades());
        dispatch(gameActions.getGameGangUpgrades());
    }

    function resetPassword(email) {
        authApis.resetPassword(email).then(res => {
            showToast(res.data.message);
        });
    }

    function resetState() {
        setEmailOrUserName("");
        setPassword("");
    }

    return (
        <View style={commonStyles.container}>
            <AppInput
                isRequired
                label={strings.auth.emailOrUsername}
                style={{marginVertical: gapSize.size4L}}
                onChangeText={setEmailOrUserName}
            />
            <AppInput
                onChangeText={setPassword}
                isRequired
                label={strings.auth.password}
                secureTextEntry
            />
            <TouchableOpacity
                onPress={() => setShowPasswordResetPrompt(true)}
                style={[
                    commonStyles.flexRowSpaceBetween,
                    {marginTop: gapSize.sizeL, marginLeft: gapSize.sizeS},
                ]}>
                {/*<CheckBox
                    onPress={() => setRememberMe(!rememberMe)}
                    isChecked={rememberMe}
                    text={strings.auth.rememberMe}
                />*/}
                <AppText
                    text={strings.auth.forgotPassword}
                    type={TextTypes.BodyLarge}
                    color={colors.white}
                    style={{textDecorationLine: "underline"}}
                />
            </TouchableOpacity>
            <View style={commonStyles.centeredContainer}>
                <AppButton
                    style={{marginTop: gapSize.size6L}}
                    text={strings.auth.login}
                    onPress={login}
                    loading={loading}
                />
                <View style={{opacity: 0}}>
                    <Divider text={"Or"} marginVertical={gapSize.size4L} />
                    <AppImage
                        source={images.icons.google}
                        size={scaledValue(42)}
                    />
                </View>
                <TouchableOpacity
                    onPress={onScreenChange}
                    style={{marginTop: gapSize.size6L}}>
                    <AppText
                        text={
                            strings.auth.alreadyHaveAccount +
                            strings.auth.register
                        }
                        highlightStyle={{color: colors.white}}
                        wordsToHighlight={[strings.auth.register]}
                        color={colors.grey400}
                        type={TextTypes.BodyLarge}
                    />
                </TouchableOpacity>
            </View>
            <Prompt
                isVisible={showPasswordResetPrompt}
                onClose={() => setShowPasswordResetPrompt(false)}
                title={strings.auth.resetPassword}
                inputValidation="any"
                placeholder={strings.auth.email}
                confirmButtonText={strings.auth.reset}
                onConfirm={resetPassword}
            />
        </View>
    );
};

export default Login;
