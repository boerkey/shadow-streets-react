import AsyncStorage from "@react-native-async-storage/async-storage";
import {handleResponseFail} from "@utils/helperFunctions.ts";
import {strings} from "@utils/index.ts";
import axios from "axios";
import {Platform} from "react-native";
import Config from "react-native-config";

axios.defaults.headers.common["version"] = 1;
axios.defaults.headers.common["os"] = Platform.OS;

// ---------------------------------------------
// API ENDPOINTS
// ---------------------------------------------
// • Production   : live HTTPS server
// • Dev (iOS)    : http://localhost:8080/api
// • Dev (Android): http://192.168.1.23:8080/api
//   (Replace the IP with your computer's Wi‑Fi address when testing
//    on a physical Android device.)
const PRODUCTION_API =
    Config.PRODUCTION_API_URL ||
    "https://seal-app-hnrij.ondigitalocean.app/api/";
const DEV_API = Config.DEV_API_URL || "http://localhost:8080/api/";

/** Returns the correct base URL for the current build & platform. */
export const getBaseURL = (): string => {
    if (!__DEV__) {
        return PRODUCTION_API;
    }
    return DEV_API;
};

const instance = axios.create({
    baseURL: getBaseURL(),
    timeout: 15000,
    headers: {
        version: 8,
        os: Platform.OS.toLowerCase(),
    },
});

instance.interceptors.response.use(
    function (response) {
        // Optional: Do something with response data
        return response;
    },
    function (error) {
        // Do whatever you want with the response error here:
        handleResponseFail(error);

        // But, be SURE to return the rejected promise, so the caller still has
        // the option of additional specialized handling at the call-site:
        return Promise.reject(error);
    },
);

export function setHeaders(
    keyValueList: {key: string; value: string}[],
    updateLanguage?: string,
) {
    // 1. Determine the language to set
    const initialLangPair = keyValueList.find(
        pair => pair.key === "Accept-Language",
    );
    const languageToSet = updateLanguage || initialLangPair?.value || "en"; // Default to 'en' if not found

    // 2. Create headers object and update language
    const headers: {[key: string]: string} = {};
    keyValueList.forEach(pair => {
        headers[pair.key] = pair.value;
    });
    headers["Accept-Language"] = languageToSet; // Ensure correct language is set

    // 3. Apply headers to axios instance
    // It's generally safer to assign the whole object rather than mutating the existing one
    instance.defaults.headers.common = {
        ...instance.defaults.headers.common, // Keep existing non-conflicting headers if any
        ...headers,
    };

    // 4. Prepare data for AsyncStorage (convert back to list if needed)
    // Storing the object directly might be simpler if retrieval logic handles it
    const headersToStore = Object.entries(headers).map(([key, value]) => ({
        key,
        value,
    }));
    AsyncStorage.setItem("@authCredentials", JSON.stringify(headersToStore));

    // 5. Set i18n language
    strings.setLanguage(languageToSet);
}

export default instance;
