import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import LevelAvatar from "@components/Header/LevelAvatar";
import {AppButton, AppImage, AppText} from "@components/index.ts";
import commonStyles from "@utils/commonStyles";
import {formatNumberWithCommas} from "@utils/helperFunctions";
import strings from "@utils/strings";
import React from "react";
import {View} from "react-native";

const FrameItem = ({
    frame,
    onPress,
    isMyFrame = false,
    isActive = false,
}: {
    frame: any;
    onPress: () => void;
    isMyFrame?: boolean;
    isActive?: boolean;
}) => {
    return (
        <View
            key={frame.id}
            style={{
                padding: gapSize.sizeM,
                borderWidth: 1,
                borderColor: colors.secondary500,
                width: "100%",
                height: 104,
                marginTop: gapSize.sizeM,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
            }}>
            <LevelAvatar frameId={frame.id} showStatus={false} />
            <View
                style={{
                    width: "48%",
                    marginTop: -gapSize.sizeL,
                    marginLeft: gapSize.sizeM,
                }}>
                <AppText text={frame.name} type={TextTypes.H6} />
                <AppText
                    text={frame.description}
                    type={TextTypes.Body2}
                    color={colors.secondary500}
                    fontSize={10.5}
                    style={{
                        width: "95%",
                    }}
                />
            </View>
            <View>
                {!isMyFrame && (
                    <View
                        style={[
                            commonStyles.flexRowAlignCenter,
                            {marginBottom: gapSize.sizeS},
                        ]}>
                        <AppImage source={images.icons.shadowCoin} size={25} />
                        <AppText
                            text={formatNumberWithCommas(frame.price)}
                            type={TextTypes.BodyBold}
                            style={{marginLeft: gapSize.sizeS}}
                        />
                    </View>
                )}
                <AppButton
                    text={isMyFrame ? strings.common.use : strings.common.buy}
                    onPress={onPress}
                    promptTitle={isMyFrame ? undefined : frame.name}
                    promptText={
                        isMyFrame
                            ? undefined
                            : strings.cosmetics.youWillBuyThisFrame.replace(
                                  "{price}",
                                  formatNumberWithCommas(frame.price),
                              )
                    }
                    height={35}
                    width={isMyFrame ? 100 : 90}
                    style={{
                        marginTop: gapSize.sizeS,
                        opacity: isActive ? 0 : 1,
                        marginLeft: isMyFrame ? -gapSize.sizeL : 0,
                    }}
                    fontSize={20}
                />
            </View>
        </View>
    );
};

export default FrameItem;
