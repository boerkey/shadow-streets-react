import {useCallback, useEffect} from "react";
import {NotificationClickEvent, OneSignal} from "react-native-onesignal";

interface NotificationHandlingModuleHook {
    onNotificationReceived: (callback: (event: any) => void) => void;
    onNotificationOpened: (
        callback: (event: NotificationClickEvent) => void,
    ) => void;
}

export const useNotificationHandlingModule =
    (): NotificationHandlingModuleHook => {
        const onNotificationReceived = useCallback(
            (callback: (event: any) => void) => {
                OneSignal.Notifications.addEventListener(
                    "foregroundWillDisplay",
                    callback,
                );
            },
            [],
        );

        const onNotificationOpened = useCallback(
            (callback: (event: NotificationClickEvent) => void) => {
                OneSignal.Notifications.addEventListener("click", callback);
            },
            [],
        );

        // Cleanup listeners on unmount
        useEffect(() => {
            return () => {
                OneSignal.Notifications.removeEventListener(
                    "foregroundWillDisplay",
                    () => {},
                );
                OneSignal.Notifications.removeEventListener("click", () => {});
            };
        }, []);

        return {
            onNotificationReceived,
            onNotificationOpened,
        };
    };
