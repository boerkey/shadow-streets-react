import React, {useState} from "react";
import {ScrollView} from "react-native";

import {colors, gapSize} from "@assets/index.ts";
import {AppText, ScreenContainer} from "@components/index.ts";
import {useRoute} from "@react-navigation/native";
import {strings} from "@utils/index.ts";
import Login from "./Login.tsx";
import Register from "./Register.tsx";

const Auth = () => {
    const {params} = useRoute();
    const {authType} = params || {};
    const [screen, setScreen] = useState(authType ?? "login");
    return (
        <ScreenContainer>
            <ScrollView
                contentContainerStyle={{
                    alignItems: "center",
                    paddingBottom: gapSize.size6L,
                }}>
                <AppText
                    text={
                        strings.auth[
                            screen === "register" ? "registration" : "login"
                        ]
                    }
                    style={{marginVertical: gapSize.size3L}}
                    color={colors.white}
                    type={"title"}
                />
                {screen === "register" && (
                    <Register onScreenChange={() => setScreen("login")} />
                )}
                {screen === "login" && (
                    <Login onScreenChange={() => setScreen("register")} />
                )}
            </ScrollView>
        </ScreenContainer>
    );
};

export default Auth;
