import React, {useState} from "react";
import {TouchableOpacity, View} from "react-native";

import {getUniqueId} from "react-native-device-info";
import {useDispatch} from "react-redux";

import {authApis} from "@apis/index.ts";
import {colors, gapSize, images} from "@assets/index.ts";
import {
    AppButton,
    AppImage,
    AppInput,
    AppText,
    Divider,
} from "@components/index.ts";
import {authActions} from "@redux/actions";
import {scaledValue, strings} from "@utils/index.ts";
import {navigate, SCREEN_NAMES} from "../../router.tsx";

const Register = ({onScreenChange}) => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [loading, setLoading] = useState(false);

    const validateUsername = () => {
        if (username.length < 3) {
            setUsernameError(strings.auth.usernameTooShort);
        } else {
            setUsernameError("");
            return false;
        }
        return true;
    };

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError(strings.auth.invalidEmail);
        } else {
            setEmailError("");
            return false;
        }
        return true;
    };

    const validatePassword = () => {
        if (password.length < 6) {
            setPasswordError(strings.auth.passwordTooShort);
        } else if (confirmPassword !== password) {
            setPasswordError(strings.auth.passwordsDoNotMatch);
        } else {
            setPasswordError("");
            return false;
        }
        return true;
    };

    const handleRegister = async () => {
        const usError = validateUsername();
        const emError = validateEmail();
        const paError = validatePassword();

        if (!usError && !emError && !paError && !loading) {
            setLoading(true);
            const uniqueId = await getUniqueId();
            authApis
                .register(username, password, email, uniqueId)
                .then(async res => {
                    dispatch(authActions.setUser(res.data.user));
                    navigate(SCREEN_NAMES.HOME);
                })
                .finally(() => setLoading(false));
        }
    };
    return (
        <>
            <AppInput
                label={strings.auth.username}
                isRequired
                style={{marginBottom: gapSize.size4L}}
                onChangeText={text => {
                    setUsername(text);
                }}
                invalid={!!usernameError}
                invalidText={usernameError}
            />
            <AppInput
                label={strings.auth.email}
                isRequired
                style={{marginBottom: gapSize.size4L}}
                onChangeText={text => {
                    setEmail(text);
                }}
                invalid={!!emailError}
                invalidText={emailError}
            />
            <AppInput
                label={strings.auth.password}
                isRequired
                style={{marginBottom: gapSize.size4L}}
                secureTextEntry
                onChangeText={text => {
                    setPassword(text);
                }}
                invalid={!!passwordError}
                invalidText={passwordError}
            />
            <AppInput
                label={strings.auth.confirmPassword}
                isRequired
                style={{marginBottom: gapSize.size6L}}
                secureTextEntry
                onChangeText={text => {
                    setConfirmPassword(text);
                }}
                invalid={!!passwordError}
                invalidText={passwordError}
            />

            <AppButton
                loading={loading}
                text={strings.auth.register}
                onPress={handleRegister}
            />
            <View style={{opacity: 0}}>
                <Divider text={"Or"} width={100} />
                <AppImage source={images.icons.google} size={scaledValue(42)} />
            </View>
            <TouchableOpacity
                onPress={onScreenChange}
                style={{marginTop: gapSize.size4L}}>
                <AppText
                    type="bodyLarge"
                    text={strings.auth.alreadyHaveAccount + strings.auth.login}
                    wordsToHighlight={[strings.auth.login]}
                    color={colors.grey400}
                    highlightStyle={{
                        color: colors.white,
                    }}
                />
            </TouchableOpacity>
        </>
    );
};

export default Register;
