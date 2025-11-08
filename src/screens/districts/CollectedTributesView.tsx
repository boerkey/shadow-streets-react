import React from "react";
import {View} from "react-native";

import {colors, gapSize, images} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {AppImage, AppText} from "@components/index";
import {RootState} from "@redux/index";
import {renderNumber} from "@utils/helperFunctions";
import {commonStyles} from "@utils/index";
import {useSelector} from "react-redux";

const CollectedTributesView = ({
    text,
    collectedTributes,
    showCollectedTributes,
    isMyGang,
}: {
    text: string;
    collectedTributes: number;
    showCollectedTributes: boolean;
    isMyGang: boolean;
}) => {
    const gameConfig = useSelector((state: RootState) => state.game.gameConfig);
    const oneShadowCoinToMoneyRatio =
        gameConfig.one_shadow_coin_to_money_ratio ?? 1000;
    const collectedMoney = collectedTributes / 2;
    const collectedShadowCoins =
        collectedTributes / 2 / oneShadowCoinToMoneyRatio;
    return (
        <View
            style={{
                position: "absolute",
                bottom: showCollectedTributes ? 19 : 30,
                left: 25,
                width: "80%",
                backgroundColor: colors.black,
                borderWidth: 1,
                borderColor: colors.secondary500,
                paddingVertical: 6,
                paddingHorizontal: 12,
                alignItems: "center",
            }}>
            <AppText
                text={text}
                fontSize={12}
                color={isMyGang ? colors.green : colors.red}
            />

            {showCollectedTributes && (
                <View
                    style={[
                        commonStyles.flexRowAlignCenter,
                        {
                            paddingLeft: gapSize.sizeL,
                            marginTop: gapSize.sizeS,
                        },
                    ]}>
                    <View style={commonStyles.flexRowAlignCenter}>
                        <AppImage source={images.icons.money} size={20} />
                        <AppText
                            text={renderNumber(collectedMoney, 1)}
                            postText="$"
                            type={TextTypes.H6}
                            color={colors.white}
                            fontSize={12}
                            style={{marginLeft: gapSize.sizeXS}}
                        />
                    </View>
                    <View
                        style={[
                            commonStyles.flexRowAlignCenter,
                            {marginLeft: gapSize.sizeS},
                        ]}>
                        <AppImage source={images.icons.shadowCoin} size={15} />
                        <AppText
                            text={renderNumber(collectedShadowCoins, 1)}
                            type={TextTypes.H6}
                            color={colors.white}
                            fontSize={12}
                            style={{marginLeft: gapSize.sizeXS}}
                        />
                    </View>
                </View>
            )}
        </View>
    );
};

export default CollectedTributesView;
