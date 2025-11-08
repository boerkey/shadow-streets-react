import {useCallback} from "react";
import {Platform} from "react-native";
import {
    LogLevel,
    NotificationWillDisplayEvent,
    OneSignal,
} from "react-native-onesignal";

// Define the expected event name type as a union of literals
type OneSignalNotificationEventName =
    | "click"
    | "foregroundWillDisplay"
    | "permissionChange"
    | "pushSubscriptionChange";

interface NotificationInitializingModuleHook {
    initialize: (appId: string) => void;
    requestPermission: () => Promise<boolean>;
    getDeviceState: () => Promise<any>;
    sendTag: (key: string, value: string) => Promise<void>;
    removeTag: (key: string) => Promise<void>;
    addEventListener: (
        eventName: OneSignalNotificationEventName,
        callback: (event: NotificationWillDisplayEvent) => void,
    ) => void;
    removeEventListener: (
        eventName: OneSignalNotificationEventName,
        callback: (event: NotificationWillDisplayEvent) => void,
    ) => void;
    isInitialized: () => boolean;
}

export const useNotificationInitializingModule =
    (): NotificationInitializingModuleHook => {
        // Add a variable to track initialization state
        let initialized = false;

        const initialize = useCallback((appId: string) => {
            try {
                // Enable verbose logging for debugging (remove in production)
                OneSignal.Debug.setLogLevel(LogLevel.Verbose);
                // Initialize with your OneSignal App ID
                OneSignal.initialize(appId);
                initialized = true;
            } catch (error) {
                console.error("Failed to initialize OneSignal:", error);
                initialized = false;
            }
        }, []);

        const isInitialized = useCallback(() => {
            // For Android, we need to check more carefully due to the context requirement
            if (Platform.OS === "android") {
                try {
                    // Attempt a simple operation to see if OneSignal is properly initialized
                    // This should throw an error if not initialized with context
                    const state = OneSignal.User.pushSubscription;
                    return initialized && !!state;
                } catch (error) {
                    return false;
                }
            }
            return initialized;
        }, [initialized]);

        const requestPermission = useCallback(async (): Promise<boolean> => {
            try {
                const permission =
                    await OneSignal.Notifications.requestPermission(false);
                return permission;
            } catch (error) {
                console.error(
                    "Error requesting notification permission:",
                    error,
                );
                return false;
            }
        }, []);

        const getDeviceState = useCallback(async () => {
            try {
                const deviceState = await OneSignal.User.pushSubscription;
                return deviceState;
            } catch (error) {
                console.error("Error getting device state:", error);
                throw error;
            }
        }, []);

        const sendTag = useCallback(
            async (key: string, value: string): Promise<void> => {
                try {
                    await OneSignal.User.addTag(key, value);
                } catch (error) {
                    console.error("Error sending tag:", error);
                    throw error;
                }
            },
            [],
        );

        const removeTag = useCallback(async (key: string): Promise<void> => {
            try {
                await OneSignal.User.removeTag(key);
            } catch (error) {
                console.error("Error removing tag:", error);
                throw error;
            }
        }, []);

        const addEventListener = useCallback(
            (
                eventName: OneSignalNotificationEventName,
                callback: (event: NotificationWillDisplayEvent) => void,
            ) => {
                // Type assertion might be needed if TS still complains, but try without first
                OneSignal.Notifications.addEventListener(
                    eventName as any,
                    callback,
                );
            },
            [],
        );

        const removeEventListener = useCallback(
            (
                eventName: OneSignalNotificationEventName,
                callback: (event: NotificationWillDisplayEvent) => void,
            ) => {
                // Type assertion might be needed if TS still complains, but try without first
                OneSignal.Notifications.removeEventListener(
                    eventName as any,
                    callback,
                );
            },
            [],
        );

        return {
            initialize,
            requestPermission,
            getDeviceState,
            sendTag,
            removeTag,
            addEventListener,
            removeEventListener,
            isInitialized,
        };
    };
