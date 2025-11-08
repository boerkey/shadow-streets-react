import storage from "@react-native-firebase/storage";
import ImagePicker from "react-native-image-crop-picker";
import Toast from "react-native-toast-message";

import {GameStreet} from "@interfaces/GameInterface";
import {JobResult} from "@interfaces/JobInterface.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {strings} from "@utils/index.ts";
import { colors } from "@assets/index";

export function pickImageAndUpload(
    maxImgSize = 250000,
    folderName = "ProfileImages",
    cropping = true,
    compressImageQuality = 0.8,
) {
    const getExtensionFromMime = (mime: string) => {
        const mimeMap: any = {
            "image/jpeg": "jpg",
            "image/png": "png",
            "image/gif": "gif",
            "image/webp": "webp",
        };
        return mimeMap[mime] || "jpg"; // Default to jpg if unknown
    };
    return ImagePicker.openPicker({
        mediaType: "photo",
        compressImageQuality,
        cropperCircleOverlay: cropping,
        cropping,
    })
        .then(image => {
            const {size, mime, path} = image;

            if (size > maxImgSize) {
                return showToast(
                    strings.common.imageTooBig,
                    strings.common.maxImageSize +
                        " " +
                        maxImgSize / 1000 +
                        "KB",
                    "warning",
                );
            }
            return uploadImageWithFirebase(
                folderName,
                path,
                getRandomId() + "." + getExtensionFromMime(mime),
            );
        })
        .catch(err => {
            console.log("err", err);
        });
}

export function pickImage(
    maxImgSize = 250000,
    mediaType: "photo" | "video" | "any" = "photo",
    cropping = true,
) {
    return new Promise((resolve, reject) => {
        ImagePicker.openPicker({
            mediaType: mediaType,
            compressImageQuality: 0.8,
            cropperCircleOverlay: true,
            cropping,
        })
            .then(image => {
                const {size, mime, path} = image;

                if (size > maxImgSize) {
                    return showToast(
                        strings.common.imageTooBig,
                        strings.common.maxImageSize +
                            " " +
                            maxImgSize / 1000 +
                            "KB",
                        "warning",
                    );
                }
                resolve(image);
            })
            .catch(reject);
    });
}

export function uploadImageWithFirebase(
    folderName: string,
    uri: string,
    fileName: string,
) {
    let ref = storage().ref(folderName).child(fileName);
    return ref
        .putFile(uri)
        .then(() => {
            return ref.getDownloadURL();
        })
        .then(downloadURL => {
            return downloadURL;
        })
        .catch(e => console.log(e));
}

export function getRandomId(length = 8) {
    let result = "";
    let characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength),
        );
    }
    return result;
}

export function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function showToast(
    text1: string,
    text2: string = "",
    type?: "success" | "warning" | "error",
    duration = 4000,
) {
    return Toast.show({
        text1,
        text2,
        type,
        position: "top",
        visibilityTime: duration,
    });
}

export function showJobResultToast(jobResult: JobResult) {
    return Toast.show({
        props: {jobResult},
        type: "jobResult",
        position: "bottom",
        visibilityTime: 4000,
    });
}

export function renderNumber(
    number: number,
    decimals?: number,
    ignoreFixed?: boolean,
): string {
    if (number > 0 && number < 1) {
        return number.toFixed(decimals ? decimals : 0); //+ "~";
    } else if (number < 1000) {
        if (ignoreFixed) {
            return number.toString();
        }
        const fixed =
            decimals !== undefined
                ? number.toFixed(decimals)
                : number.toFixed(1);
        // Remove unnecessary trailing zeros for all decimal values
        return parseFloat(fixed).toString();
    } else if (number >= 1000 && number < 1_000_000) {
        const numberInK = number / 1000;

        if (decimals !== undefined) {
            // Always show the exact number of decimals specified
            return numberInK.toFixed(decimals) + "K";
        } else {
            // Original behavior for auto decimal places
            const scaled = numberInK.toFixed(1);
            return parseFloat(scaled).toString() + "K";
        }
    } else if (number >= 1_000_000) {
        const numberInM = number / 1_000_000;

        if (decimals !== undefined) {
            // Always show the exact number of decimals specified
            return numberInM.toFixed(decimals) + "M";
        } else {
            // Original behavior for auto decimal places
            const scaled = numberInM.toFixed(1);
            return parseFloat(scaled).toString() + "M";
        }
    }

    return "0";
}

export function handleResponseFail(error: any): void {
    // Check if we have a response with a status code
    if (error.response?.status) {
        const isOk = error.response.status < 500;
        // Safely extract error message with fallbacks
        const errorMessage =
            error.response.data?.error ||
            error.response.data?.message ||
            error.message ||
            strings.errors.serverError;

        showToast(
            isOk ? errorMessage : strings.errors.serverError,
            "",
            isOk ? "warning" : "error",
        );
    } else {
        // Handle cases where there's no response (network errors, etc.)
        showToast(error.message || strings.errors.serverError, "", "error");
    }
}

export function formatInputNumber(text: string) {
    // Remove non-numeric characters
    const numericText = text.replace(/[^0-9]/g, "");

    // Format with commas
    return numericText.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function removeCommas(text: string) {
    return text.replace(/,/g, "");
}

export function formatSecondsToTime(seconds: number) {
    const clampedSeconds = Math.max(0, seconds);
    const hrs = Math.floor(clampedSeconds / 3600);
    const mins = Math.floor((clampedSeconds % 3600) / 60);
    const secs = clampedSeconds % 60;

    const paddedMins = String(mins).padStart(2, "0");
    const paddedSecs = String(secs).padStart(2, "0");

    if (hrs > 0) {
        const paddedHrs = String(hrs).padStart(2, "0");
        return `${paddedHrs}:${paddedMins}:${paddedSecs}`;
    } else {
        return `${paddedMins}:${paddedSecs}`;
    }
}

export function formatNumberWithCommas(number: number): string {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getDarkBackground(ratio = 4) {
    return `rgba(0, 0, 0, 0.${ratio})`;
}

export function saveAsyncWithoutValue(key: string) {
    return AsyncStorage.setItem(key, "1");
}

export function getAsyncAndTriggerIfNotExists(
    key: string,
    callback: () => void,
) {
    AsyncStorage.getItem(key).then(value => {
        if (value === null) {
            callback();
        }
    });
}

export function getStreetName(
    gameStreets: GameStreet[],
    objectToCheck: any,
    xKey = "location_x",
    yKey = "location_y",
) {
    const street = gameStreets.find(
        (each: GameStreet) =>
            each.location_x === objectToCheck[xKey] &&
            each.location_y === objectToCheck[yKey],
    );
    return street?.name;
}

export function getHealthBarColor(healthRate: number) {
    if (healthRate < 0.2) {
        return colors.red;
    }
    if (healthRate < 0.75) {
        return colors.orange;
    }
    return colors.green;
}