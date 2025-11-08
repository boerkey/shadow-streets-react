import React from "react";
import {ImageBackground, View, ViewStyle} from "react-native";

import {colors, gapSize, images} from "@assets/index.ts";
import AppText, {TextTypes} from "@components/AppText";
import {User} from "@interfaces/UserInterface.ts";
import {renderNumber} from "@utils/helperFunctions.ts";
import {
    characterHelpers,
    scaledValue,
    SCREEN_WIDTH,
    strings,
} from "@utils/index.ts";

interface StatsProps {
    user: User;
    containerStyle?: ViewStyle;
}

const StatsContainer = ({user, containerStyle}: StatsProps) => {
    const healthRatio = user.health / user.bonuses?.max_health;

    function getStatsList() {
        let list = [],
            text,
            image,
            val = 25522;
        for (let i = 1; i <= 6; i++) {
            switch (i) {
                case 1:
                    {
                        text = strings.gameKeys.str;
                        image = images.containers.strength;
                        val = user.strength;
                    }
                    break;
                case 2:
                    {
                        text = strings.gameKeys.dex;
                        image = images.containers.dexterity;
                        val = user.dexterity;
                    }
                    break;
                case 3:
                    {
                        text = strings.gameKeys.int;
                        image = images.containers.intelligence;
                        val = user.intelligence;
                    }
                    break;
                case 4:
                    {
                        text = strings.gameKeys.char;
                        image = images.containers.charisma;
                        val = user.charisma;
                    }
                    break;
                case 5:
                    {
                        text = strings.gameKeys.dmg;
                        image = images.containers.damage;
                        val = characterHelpers.calculateDamage(
                            user,
                            healthRatio,
                            user.items_weapons,
                            user.items_armors,
                        );
                    }
                    break;
                case 6:
                    {
                        text = strings.gameKeys.def;
                        image = images.containers.defence;
                        val = characterHelpers.calculateDefence(
                            user,
                            healthRatio,
                            user.items_weapons,
                            user.items_armors,
                        );
                    }
                    break;
            }
            list.push(
                <View key={i} style={{alignItems: "center"}}>
                    <AppText
                        text={text}
                        type={TextTypes.BodyBold}
                        fontSize={12}
                    />
                    <ImageBackground
                        resizeMode={"contain"}
                        style={{
                            width: 48,
                            height: 55,
                            alignItems: "center",
                            justifyContent: "flex-end",
                        }}
                        source={image}>
                        <AppText
                            text={renderNumber(val)}
                            type={TextTypes.BodyBold}
                            style={{bottom: gapSize.sizeS}}
                        />
                    </ImageBackground>
                </View>,
            );
        }
        return list;
    }
    return (
        <View
            style={{
                marginTop: gapSize.sizeM,
                width: SCREEN_WIDTH * 0.92,
                height: scaledValue(101),
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                borderColor: colors.secondary500,
                borderWidth: 1,
                paddingHorizontal: gapSize.sizeS,
                paddingVertical: gapSize.sizeL,
                flexDirection: "row",
                justifyContent: "space-between",
                ...containerStyle,
            }}>
            {getStatsList()}
        </View>
    );
};

export default StatsContainer;
