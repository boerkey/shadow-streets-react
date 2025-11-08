import {Dimensions} from "react-native";
import strings from "./strings.ts";
import commonStyles from "./commonStyles.ts";
import axiosModule from "./axios.ts";
import * as helperFunctions from "./helperFunctions";
import * as characterHelpers from "./characterHelpers";
import * as casinoHelpers from "./casinoHelpers";
import * as itemHelpers from "./itemHelpers";
import * as constants from "./constants";

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window");

const BASE_WIDTH = 393; // Example: width of the design (e.g., iPhone 11 screen width)
const BASE_HEIGHT = 852; // Example: height of the design

const scaleWidth = SCREEN_WIDTH / BASE_WIDTH;
const scaleHeight = SCREEN_HEIGHT / BASE_HEIGHT;

const scaledValue = (value: number) => value * scaleWidth; // Use width as a base scale factor for uniform scaling
const moderateScale = (size: number, factor = 0.5) =>
    size + (scaledValue(size) - size) * factor;

export {
    scaledValue,
    moderateScale,
    commonStyles,
    strings,
    axiosModule,
    helperFunctions,
    SCREEN_HEIGHT,
    SCREEN_WIDTH,
    characterHelpers,
    itemHelpers,
    casinoHelpers,
    constants,
};
