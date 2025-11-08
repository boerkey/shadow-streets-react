import {commonStyles, strings} from "@utils/index.ts";
import {View} from "react-native";
import {AppText} from "@components/index.ts";
import {renderNumber} from "@utils/helperFunctions.ts";
import {TextTypes} from "@components/AppText";
import {colors} from "@assets/index.ts";
import React, {ReactNode} from "react";

export function getPlayerStatistics(playerStatistics): ReactNode[] {
    let list: ReactNode[] = [];
    if (playerStatistics) {
        Object.keys(playerStatistics).forEach(key => {
            const val = playerStatistics[key];
            const keyString = strings.playerProfile.stats[key];
            if (keyString) {
                list.push(
                    <View key={key}>
                        <View style={commonStyles.flexRowSpaceBetween}>
                            <AppText
                                text={`${strings.playerProfile.stats[key]}`}
                            />
                            <AppText
                                text={renderNumber(val, 0)}
                                type={TextTypes.BodyBold}
                            />
                        </View>
                        <View
                            style={{
                                marginVertical: 12,
                                backgroundColor: colors.lineColor,
                                height: 0.5,
                            }}
                        />
                    </View>,
                );
            }
        });
    }
    return list;
}
