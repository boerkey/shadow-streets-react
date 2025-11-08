import React from "react";
import {StyleSheet, View} from "react-native";

import {colors, gapSize, images} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {AppImage, AppText} from "@components/index";
import {useCountdown} from "@hooks/index";
import {BoostData} from "@interfaces/GangInterface";
import {UserBoost} from "@interfaces/UserInterface";
import {commonStyles, scaledValue} from "@utils/index.ts";

const MyBoostItem = ({
    boostData,
    item,
}: {
    boostData: BoostData | undefined;
    item: UserBoost;
}) => {
    if (!boostData) return <></>;
    const {ends_at, ends_at_seconds} = item;
    const {formatted} = useCountdown(ends_at_seconds);

    return (
        <View style={styles.boostItemContainer}>
            <AppImage
                source={
                    boostData.image_id
                        ? images.boosts[boostData.image_id]
                        : images.boosts[boostData.id]
                }
                size={70}
            />
            <View style={{marginLeft: gapSize.sizeM, top: -gapSize.sizeS}}>
                <AppText text={boostData?.name} type={TextTypes.H5} />
                <View
                    style={[
                        commonStyles.flexRowAlignCenter,
                        {marginTop: gapSize.sizeS},
                    ]}>
                    <AppImage source={images.icons.time} size={17} />
                    <AppText
                        text={formatted}
                        type={TextTypes.H5}
                        style={{marginLeft: gapSize.sizeS}}
                    />
                </View>
            </View>
        </View>
    );
};

export default MyBoostItem;

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
