import HighlightText from "@sanar/react-native-highlight-text";
import React from "react";
import {Text, TextStyle} from "react-native";

import {colors, fonts} from "@assets/index.ts";
import {helperFunctions, moderateScale} from "@utils/index.ts";

export enum TextTypes {
    H1 = "h1",
    H2 = "h2",
    H3 = "h3",
    H4 = "h4",
    H5 = "h5",
    H6 = "h6",
    H7 = "h7",
    Body = "body",
    Body2 = "body2",
    BodyBold = "bodyBold",
    BodyLarge = "bodyLarge",
    BodySmall = "bodySmall",
    Caption = "caption",
    Caption2 = "caption2",
    ButtonLarge = "buttonLarge",
    ButtonSmall = "buttonSmall",
    Title = "title",
    TitleSmall = "titleSmall",
}

interface Props {
    text?: string | number | undefined;
    type?: TextTypes | undefined;
    style?: TextStyle;
    color?: string;
    fontSize?: number;
    highlightStyle?: TextStyle;
    wordsToHighlight?: Array<string>;
    centered?: boolean;
    shortenLength?: number;
    minifyLength?: number;
    preText?: string;
    postText?: string;
    formatNumberWithCommas?: boolean;
}

const AppText = ({
    text = "",
    preText = "",
    postText = "",
    type = TextTypes.Body,
    style,
    fontSize,
    color = colors.white,
    highlightStyle,
    wordsToHighlight,
    centered,
    shortenLength,
    minifyLength,
    formatNumberWithCommas,
}: Props) => {
    const shortenText = (s: string): string => {
        return s
            .split(" ")
            .map(word => (word.length > 3 ? word.slice(0, 3) + "." : word))
            .join(" ");
    };

    // Convert text to a string and determine which version to display.

    function getStyle() {
        let fontSizeStyle, fontFamily;
        switch (type) {
            case TextTypes.H1:
                fontSizeStyle = moderateScale(28);
                fontFamily = fonts.CinzelBlack;
                break;
            case TextTypes.H2:
                fontSizeStyle = moderateScale(24);
                fontFamily = fonts.CinzelRegular;
                break;
            case TextTypes.H3:
                fontSizeStyle = moderateScale(20);
                fontFamily = fonts.CinzelBlack;
                break;
            case TextTypes.H4:
                fontSizeStyle = moderateScale(18);
                fontFamily = fonts.CinzelRegular;
                break;
            case TextTypes.H5:
                fontSizeStyle = moderateScale(16);
                fontFamily = fonts.CinzelBold;
                break;
            case TextTypes.H6:
                fontSizeStyle = moderateScale(14);
                fontFamily = fonts.CinzelBold;
                break;
            case TextTypes.H7:
                fontSizeStyle = moderateScale(12);
                fontFamily = fonts.CinzelBold;
                break;
            case TextTypes.Body:
                fontSizeStyle = moderateScale(14);
                fontFamily = fonts.RalewayMedium;
                break;
            case TextTypes.Body2:
                fontSizeStyle = moderateScale(12);
                fontFamily = fonts.RalewayMedium;
                break;
            case TextTypes.BodyBold:
                fontSizeStyle = moderateScale(14);
                fontFamily = fonts.RalewayBold;
                break;
            case TextTypes.BodySmall:
                fontSizeStyle = moderateScale(10);
                fontFamily = fonts.RalewayMedium;
                break;
            case TextTypes.BodyLarge:
                fontSizeStyle = moderateScale(16);
                fontFamily = fonts.RalewayRegular;
                break;
            case TextTypes.Caption2:
                fontSizeStyle = moderateScale(10);
                fontFamily = fonts.RalewayBold;
                break;
            case TextTypes.Caption:
                fontSizeStyle = moderateScale(8);
                fontFamily = fonts.RalewayMedium;
                break;
            case TextTypes.ButtonLarge:
                fontSizeStyle = moderateScale(26);
                fontFamily = fonts.CinzelRegular;
                break;
            case TextTypes.ButtonSmall:
                fontSizeStyle = moderateScale(20);
                fontFamily = fonts.CinzelRegular;
                break;
            case TextTypes.Title:
                fontSizeStyle = moderateScale(32);
                fontFamily = fonts.CinzelRegular;
                break;
            case TextTypes.TitleSmall:
                fontSizeStyle = moderateScale(28);
                fontFamily = fonts.CinzelRegular;
                break;
        }

        // Determine the base font size from the prop or computed type style.
        let computedFontSize = fontSize
            ? moderateScale(fontSize)
            : fontSizeStyle;

        // If minifyLength is provided and the text is too long, reduce the font size.
        if (minifyLength && textStr.length > minifyLength) {
            // Reduce the font size by 20%.
            computedFontSize = computedFontSize * 0.8;
        }

        return {
            fontSize: computedFontSize,
            fontFamily,
            fontVariant: ["lining-nums", "tabular-nums"],
        };
    }

    const textStr = String(text);
    const displayText =
        shortenLength && textStr.length > shortenLength
            ? shortenText(textStr)
            : formatNumberWithCommas
            ? helperFunctions.formatNumberWithCommas(text)
            : textStr;
    const finalText = preText + displayText + postText;

    if (highlightStyle) {
        return (
            <HighlightText
                autoEscape={false}
                sanitize={text => text}
                style={[getStyle(), style, {color}]}
                highlightStyle={highlightStyle}
                searchWords={wordsToHighlight}
                textToHighlight={finalText}
            />
        );
    }

    return (
        <Text
            style={[
                getStyle(),
                {color, textAlign: centered ? "center" : "auto"},
                style,
            ]}>
            {finalText}
        </Text>
    );
};

export default AppText;
