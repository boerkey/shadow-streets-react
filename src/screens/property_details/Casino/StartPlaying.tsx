import React, {ReactNode} from "react";
import {Image, Platform, View} from "react-native";

import {gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {AppButton, AppText} from "@components/index.ts";
import {strings} from "@utils/index.ts";

const StartPlaying = ({onStart}) => {
    function getBlackjackRules() {
        const rules: ReactNode[] = [];
        strings.propertyCasino.blackjackRules.forEach((rule: string, i) => {
            rules.push(
                <AppText
                    text={`- ${rule}`}
                    key={i}
                    centered
                    style={{
                        marginTop:
                            gapSize.sizeM * (Platform.OS === "ios" ? 1 : 0.5),
                    }}
                />,
            );
        });
        return rules;
    }
    return (
        <View style={{alignItems: "center"}}>
            <AppText
                text={strings.propertyCasino.blackjack}
                type={TextTypes.H2}
                fontSize={28}
                centered
            />
            <AppText
                text={strings.propertyCasino.blackjackShortExplanation}
                centered
                style={{
                    marginTop:
                        gapSize.sizeL * (Platform.OS === "ios" ? 1 : 0.5),
                }}
            />
            <Image
                source={images.backgrounds.blackjackDetails}
                style={{
                    width: 309,
                    height: 139,
                    marginTop: gapSize.sizeL,
                }}
            />
            <AppText
                text={strings.propertyCasino.basicRules}
                style={{marginTop: gapSize.sizeL}}
                type={TextTypes.BodyBold}
            />
            {getBlackjackRules()}
            <AppButton
                onPress={onStart}
                text={strings.propertyCasino.play}
                style={{marginTop: gapSize.sizeL}}
            />
        </View>
    );
};

export default StartPlaying;
