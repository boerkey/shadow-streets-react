import React, {useEffect} from "react";
import {Alert, LogBox, Platform, StatusBar} from "react-native";

import ReactNativeBlobUtil from "react-native-blob-util";
import {CopilotProvider} from "react-native-copilot";
import hotUpdate from "react-native-ota-hot-update";
import Toast from "react-native-toast-message";
import {Provider} from "react-redux";

import AppJobResultToast from "@components/AppJobResultToast";
import {AppToast} from "@components/AppToast";
import {getDarkBackground, showToast} from "@utils/helperFunctions.ts";

import {strings} from "@utils/index.ts";
import store from "./src/redux";
import Router from "./src/router.tsx";

// Add this near the top of your file or in your app's entry point
LogBox.ignoreLogs([
    "VirtualizedLists should never be nested inside plain ScrollViews",
]);

const toastConfig = {
    success: (props: any) => <AppToast {...props} />,
    warning: (props: any) => <AppToast {...props} type={"warning"} />,
    error: (props: any) => <AppToast {...props} type={"error"} />,
    jobResult: ({props}: {props: any}) => (
        <AppJobResultToast jobResult={props.jobResult} />
    ),
};

function App() {
    useEffect(() => {
        // 1. Fetch and parse update.json
        fetch(
            "https://firebasestorage.googleapis.com/v0/b/shadow-streets.firebasestorage.app/o/Updates%2Fupdate.json?alt=media",
        )
            .then(response => response.json())
            .then(async updateData => {
                const serverVersion = updateData.version;
                const downloadUrl =
                    Platform.OS === "ios"
                        ? updateData.downloadIosUrl
                        : updateData.downloadAndroidUrl;
                const shouldDownload =
                    Platform.OS === "ios"
                        ? updateData.shouldDownloadIos
                        : updateData.shouldDownloadAndroid;

                // 2. Get current installed OTA version
                const currentVersion = await hotUpdate.getCurrentVersion();
                console.log(
                    `Current OTA Version: ${currentVersion}, Server Version: ${serverVersion}`,
                );

                // 3. Only download if server version is newer
                if (serverVersion > currentVersion && shouldDownload) {
                    Alert.alert(
                        strings.updating.updateAvailable,
                        strings.updating.wouldYouLikeToUpdate,
                        [
                            {
                                text: strings.common.later,
                                onPress: () =>
                                    console.log("User declined update"),
                                style: "cancel",
                            },
                            {
                                text: strings.updating.updateNow,
                                onPress: () => {
                                    showToast(
                                        strings.updating.updatingApp,
                                        strings.updating.downloadingNewVersion,
                                        "success",
                                        6000,
                                    );
                                    console.log(
                                        `Attempting to download update version: ${serverVersion}`,
                                    );
                                    // 4. Call downloadBundleUri with the correct version
                                    hotUpdate.downloadBundleUri(
                                        ReactNativeBlobUtil,
                                        downloadUrl,
                                        serverVersion, // Pass the actual version from update.json (e.g., 1)
                                        {
                                            updateSuccess: () => {
                                                console.log(
                                                    "Update successful!",
                                                );
                                            },
                                            updateFail: message => {
                                                console.error(
                                                    "Download bundle fail",
                                                    message,
                                                );
                                                showToast(
                                                    strings.updating
                                                        .updatingApp,
                                                    strings.updating
                                                        .updateFailed,
                                                    "error",
                                                );
                                            },
                                            restartAfterInstall: true,
                                        },
                                    );
                                },
                            },
                        ],
                        {cancelable: false},
                    );
                } else {
                    console.log("App is up to date or download not enforced.");
                }
            })
            .catch(error => console.error("Error during update check:", error));
    }, []);
    return (
        <CopilotProvider
            labels={{
                next: strings.copilot.next,
                previous: strings.copilot.back,
                skip: strings.copilot.skip,
                finish: strings.copilot.finish,
            }}
            backdropColor={getDarkBackground()}
            verticalOffset={StatusBar.currentHeight}
            overlay={"view"}>
            <Provider store={store}>
                <Router />
                <Toast config={toastConfig} />
            </Provider>
        </CopilotProvider>
    );
}
export default App;
