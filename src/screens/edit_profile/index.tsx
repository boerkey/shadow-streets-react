import React, {useEffect, useRef, useState} from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    TextInput,
    TouchableOpacity,
} from "react-native";

import auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import {useDispatch, useSelector} from "react-redux";

import {authApis} from "@apis/index.ts";
import {colors, gapSize} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import LevelAvatar from "@components/Header/LevelAvatar.tsx";
import {
    AppButton,
    AppInput,
    AppText,
    Prompt,
    ScreenContainer,
    TitleHeader,
} from "@components/index.ts";
import {CommonActions} from "@react-navigation/native";
import {authActions} from "@redux/actions";
import {RootState} from "@redux/index.ts";
import {maxLength12} from "@utils/constants.ts";
import {pickImageAndUpload, showToast} from "@utils/helperFunctions.ts";
import {scaledValue, strings} from "@utils/index.ts";
import {SCREEN_NAMES} from "../../router.tsx";

const EditProfile = ({navigation}) => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const [imageLoading, setImageLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const userNameInput = useRef<TextInput>(null);
    const emailInput = useRef<TextInput>(null);

    const [username, setUsername] = useState(user.name);
    const [email, setEmail] = useState(user.auth.email);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showDeleteAccountPrompt, setShowDeleteAccountPrompt] =
        useState(false);

    useEffect(() => {
        userNameInput.current?.setNativeProps({
            text: user.name,
        });
        emailInput.current?.setNativeProps({
            text: user.auth?.email,
        });
    }, []);

    async function ensureAnonymousLogin() {
        const currentUser = auth().currentUser;
        if (!currentUser) {
            await auth().signInAnonymously();
        }
        return auth().currentUser?.uid;
    }

    async function pickImageAndUpdate() {
        setImageLoading(true);
        const fbUserId = await ensureAnonymousLogin();
        deletePreviousImageFromFirebase();
        pickImageAndUpload(250000, "ProfileImages/" + fbUserId)
            .then(img_url => {
                if (!img_url) return;
                authApis
                    .updateUserPicture(img_url)
                    .then(res => {
                        if (res.data.profile_picture) {
                            dispatch(
                                authActions.setUser({
                                    ...user,
                                    img_url: res.data.profile_picture,
                                }),
                            );
                        }
                    })
                    .finally(() => setImageLoading(false));
            })
            .finally(() => setImageLoading(false));
    }

    function deletePreviousImageFromFirebase() {
        if (user.img_url) {
            function getStoragePathFromUrl(url: string): string | null {
                const match = decodeURIComponent(url).match(/\/o\/(.*?)\?/);
                return match ? match[1] : null;
            }
            const path = getStoragePathFromUrl(user.img_url); // "ProfileImages/TQUD3hCV.jpg"
            if (path) {
                storage().ref(path).delete();
            }
        }
    }

    function handleUpdateInformation() {
        setLoading(true);
        authApis
            .updateUserInformation(username, email)
            .then(res => {
                showToast(res.data.message);
                dispatch(
                    authActions.setUser({
                        ...user,
                        name: username,
                        auth: {...user.auth, email},
                    }),
                );
            })
            .catch(err => {
                showToast(
                    strings.common.error,
                    err.response?.data?.error ||
                        strings.common.somethingWentWrong,
                    "warning",
                );
            })
            .finally(() => setLoading(false));
    }

    function handleChangePassword() {
        if (!newPassword) {
            return;
        }

        setLoading(true);
        authApis
            .updatePassword(oldPassword, newPassword)
            .then(res => {
                showToast(res.data.message);
                setOldPassword("");
                setNewPassword("");
            })
            .catch(err => {
                showToast(
                    strings.common.error,
                    err.response?.data?.error ||
                        strings.common.somethingWentWrong,
                    "warning",
                );
            })
            .finally(() => setLoading(false));
    }

    function handleDeleteAccount() {
        authApis.deleteMyAccount().then(res => {
            dispatch(authActions.resetStates());
            navigation.dispatch(
                CommonActions.reset({
                    index: 0, // Set the first screen in the new stack
                    routes: [{name: SCREEN_NAMES.AUTH}], // Replace with Login screen
                }),
            );
            setTimeout(() => {
                Alert.alert(strings.common.warning, res.data.message);
            }, 500);
        });
    }

    return (
        <ScreenContainer>
            <TitleHeader
                title={strings.editProfile.header}
                arrowLeftMargin={gapSize.size3L}
            />
            <Prompt
                isVisible={showDeleteAccountPrompt}
                onClose={() => setShowDeleteAccountPrompt(false)}
                title={strings.common.warning}
                text={strings.editProfile.yourAccountWillBeDeleted}
                onConfirm={handleDeleteAccount}
            />
            <ScrollView
                style={{padding: gapSize.size3L}}
                contentContainerStyle={{alignItems: "center"}}>
                <TouchableOpacity
                    onPress={pickImageAndUpdate}
                    style={{alignItems: "center"}}>
                    <LevelAvatar
                        size={scaledValue(100)}
                        scaledSize={true}
                        showStatus={false}
                        showName={false}
                        frameId={user.avatar_frame_id}
                    />
                    {imageLoading ? (
                        <ActivityIndicator
                            style={{
                                marginTop: gapSize.sizeM,
                                marginLeft: gapSize.sizeM,
                            }}
                        />
                    ) : (
                        <AppText
                            text={strings.editProfile.editPicture}
                            type={TextTypes.Caption2}
                            color={colors.textColor}
                            style={{
                                marginLeft: gapSize.sizeM,
                            }}
                        />
                    )}
                </TouchableOpacity>
                <AppText
                    text={strings.editProfile.accountInformation}
                    type={TextTypes.H4}
                    fontSize={24}
                    style={{marginVertical: gapSize.size3L}}
                />
                <AppInput
                    label={strings.auth.username}
                    onChangeText={setUsername}
                    onRef={userNameInput}
                    style={{marginBottom: gapSize.size3L}}
                    maxLength={maxLength12}
                />
                <AppInput
                    label={strings.auth.email}
                    onChangeText={setEmail}
                    onRef={emailInput}
                    style={{marginBottom: gapSize.size3L}}
                />
                <AppButton
                    text={strings.editProfile.saveChanges}
                    width={224}
                    resizeMode={"stretch"}
                    style={{marginBottom: gapSize.size6L}}
                    onPress={handleUpdateInformation}
                />
                <AppText
                    text={strings.editProfile.changePassword}
                    type={TextTypes.H4}
                    fontSize={24}
                    style={{marginBottom: gapSize.size3L}}
                />
                <AppInput
                    label={strings.editProfile.currentPassword}
                    onChangeText={setOldPassword}
                    style={{marginBottom: gapSize.size3L}}
                    secureTextEntry
                />
                <AppInput
                    label={strings.editProfile.newPassword}
                    onChangeText={setNewPassword}
                    style={{marginBottom: gapSize.size3L}}
                    secureTextEntry
                />
                <AppButton
                    text={strings.editProfile.saveChanges}
                    width={224}
                    resizeMode={"stretch"}
                    style={{marginBottom: gapSize.size6L}}
                    onPress={handleChangePassword}
                />
                <TouchableOpacity
                    onPress={() => setShowDeleteAccountPrompt(true)}>
                    <AppText
                        text={strings.editProfile.deleteAccount}
                        type={TextTypes.BodyBold}
                        color={"#E12648"}
                        style={{textDecorationLine: "underline"}}
                    />
                </TouchableOpacity>
            </ScrollView>
        </ScreenContainer>
    );
};

export default EditProfile;
