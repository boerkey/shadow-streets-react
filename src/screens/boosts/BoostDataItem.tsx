import {AppButton} from "@components/index";
import {StyleSheet, View} from "react-native";

import {colors, gapSize, images} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {AppImage, AppText} from "@components/index";
import {BoostData} from "@interfaces/GangInterface";
import {commonStyles, scaledValue, strings} from "@utils/index";

const BoostDataItem = ({
    item,
    onPress,
}: {
    item: BoostData;
    onPress: () => void;
}) => {
    return (
        <View style={styles.boostItemContainer}>
            <AppImage
                source={
                    item.image_id !== 0
                        ? images.boosts[item.image_id]
                        : images.boosts[item.id]
                }
                size={70}
            />
            <View
                style={{
                    width: "45%",
                    marginLeft: gapSize.sizeM,
                    top: -gapSize.sizeS,
                }}>
                <AppText text={item.name} type={TextTypes.H5} />
                <AppText
                    text={item.description}
                    fontSize={13}
                    style={{width: "90%", marginVertical: gapSize.sizeS}}
                />
                <AppText
                    text={`( ${item.duration} ${strings.boosts.hours} )`}
                    fontSize={13}
                    style={{width: "90%", top: gapSize.sizeS}}
                />
            </View>
            <View style={commonStyles.alignItemsCenter}>
                <View
                    style={[
                        commonStyles.flexRowAlignCenter,
                        {marginBottom: gapSize.sizeS, top: -gapSize.sizeS},
                    ]}>
                    <AppImage source={images.icons.shadowCoin} size={30} />
                    <AppText
                        text={item.price}
                        type={TextTypes.H5}
                        style={{marginLeft: gapSize.sizeS}}
                    />
                </View>
                <AppButton
                    onPress={onPress}
                    promptTitle={item.name}
                    promptText={strings.boosts.youWillBuyThisPackAreYouSure}
                    text={strings.common.buy}
                    width={100}
                    height={42}
                    fontSize={20}
                />
            </View>
        </View>
    );
};

export default BoostDataItem;

const styles = StyleSheet.create({
    boostItemContainer: {
        width: "100%",
        minHeight: scaledValue(124),
        borderColor: colors.secondary500,
        borderWidth: 1,
        marginTop: gapSize.sizeM,
        flexDirection: "row",
        padding: gapSize.sizeM,
        alignItems: "center",
        backgroundColor: colors.black,
    },
});
