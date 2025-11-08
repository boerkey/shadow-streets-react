import React from "react";
import {View} from "react-native";

import * as Progress from "react-native-progress";

import {colors} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {AppText, Avatar} from "@components/index.ts";
import {commonStyles, scaledValue} from "@utils/index.ts";

interface FighterAvatarProps {
    avatarSource: string;
    health: number;
    maxHealth: number;
    frameId: number;
}

const FighterAvatar = ({
    avatarSource,
    health,
    maxHealth,
    frameId,
}: FighterAvatarProps) => {
    const hpRatio =
        maxHealth > 0 ? Math.max(0, Math.min(1, health / maxHealth)) : 0;

    function getHpColor() {
        if (hpRatio > 0.6) {
            return colors.green;
        }
        if (hpRatio > 0.2 && hpRatio <= 0.6) {
            return colors.orange;
        }
        return colors.red;
    }

    return (
        <View style={commonStyles.alignItemsCenter}>
            <Avatar source={avatarSource} size={70} frameId={frameId} />
            <Progress.Bar
                height={4}
                progress={hpRatio}
                borderRadius={1}
                width={scaledValue(70)}
                borderColor={colors.special}
                unfilledColor={colors.secondaryTwo500}
                color={getHpColor()}
                style={{
                    marginTop: scaledValue(8),
                }}
            />
            <AppText
                text={`${health?.toFixed(0)}/${maxHealth?.toFixed(0)}`}
                type={TextTypes.H7}
                style={{marginTop: 2}}
                color={getHpColor()}
            />
        </View>
    );
};

export default FighterAvatar;
