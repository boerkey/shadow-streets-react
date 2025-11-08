import Config from "react-native-config";

// OneSignal App ID - Get from https://onesignal.com
export const ONE_SIGNAL_APP_ID =
    Config.ONESIGNAL_APP_ID || "your-onesignal-app-id-here";

// AsyncStorage keys (not sensitive, safe to keep)
export const AUTH_CREDENTIALS_KEY = "@authCredentials";

export const BLOCKED_USERS_KEY = "@blockedUsers";
