import {useState} from "react";
import {TouchableOpacity, View} from "react-native";

import {gameApis} from "@apis/index";
import {colors, gapSize, images} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {AppImage, AppText} from "@components/index";
import {showToast} from "@utils/helperFunctions";
import {commonStyles, scaledValue} from "@utils/index";
import {Announcement} from ".";

const AnnouncementItem = ({item, onRefresh}: {item: Announcement, onRefresh: () => void}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    function handleRead() {
        gameApis.readGameAnnouncement(item.id);
    }

    function handleLike(vote: number) {
        gameApis.voteGameAnnouncement(item.id, vote).then(res => {
            showToast(res.data.message);
            onRefresh();
        });
    }

    return (
        <TouchableOpacity
            onPress={() => {
                setIsExpanded(!isExpanded);
                handleRead();
            }}
            style={{
                borderColor: isExpanded
                    ? colors.secondary500
                    : colors.lineColor,
                minHeight: scaledValue(30),
                borderWidth: 1,
                borderRadius: scaledValue(2),
                padding: gapSize.sizeM,
                marginTop: gapSize.sizeL,
            }}>
            <AppText
                text={item.title}
                centered
                type={TextTypes.BodyBold}
                color={colors.secondary500}
                fontSize={17}
            />
            {isExpanded && (
                <AppText
                    text={item.description}
                    centered
                    style={{marginTop: gapSize.sizeM}}
                />
            )}
            <View
                style={[
                    commonStyles.flexRowAlignStartSpaceBetween,
                    {marginTop: gapSize.sizeM},
                ]}>
                <View
                    style={[
                        commonStyles.flexRowAlignCenter,
                        {gap: gapSize.sizeS},
                    ]}>
                    <View
                        style={[
                            commonStyles.flexRowAlignCenter,
                            {gap: gapSize.sizeS},
                        ]}>
                        <AppImage source={images.icons.eye} size={25} />
                        <AppText text={item.view_amount} />
                    </View>

                    <View
                        style={[
                            commonStyles.flexRowAlignCenter,
                            {gap: gapSize.sizeS},
                        ]}>
                        <AppImage source={images.icons.approve} size={25} />
                        <AppText text={item.vote} />
                    </View>
                </View>

                {isExpanded && (
                    <View
                        style={[
                            commonStyles.flexRowAlignCenter,
                            {gap: gapSize.sizeM},
                        ]}>
                        <AppImage
                            source={images.icons.like}
                            size={25}
                            onPress={() => handleLike(1)}
                        />
                        <AppImage
                            source={images.icons.block}
                            size={23}
                            onPress={() => handleLike(-1)}
                        />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default AnnouncementItem;
