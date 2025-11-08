import React, {useEffect, useState} from "react";
import {FlatList, TouchableOpacity, View} from "react-native";

import MaskedView from "@react-native-masked-view/masked-view";
import FastImage from "react-native-fast-image";
import LinearGradient from "react-native-linear-gradient";

import {getGangsByTargetDistrict} from "@apis/districtApis";
import {colors, gapSize, images} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {AppImage, AppModal, AppText, Avatar, Divider} from "@components/index";
import {commonStyles, SCREEN_HEIGHT, SCREEN_WIDTH, strings} from "@utils/index";

interface DistrictFightListModalProps {
    districtId: number;
    districtName: string;
    onClose: () => void;
}

interface GangMember {
    member_name: string;
    member_img_url: string;
    point: number;
    contribution: number;
    user_id: number;
}

interface Gang {
    id: number;
    name: string;
    img_url: string;
    total_points: number;
    members: {
        member_name: string;
        member_img_url: string;
        point: number;
        contribution: number;
        user_id: number;
    }[];
}

const DistrictFightListModal = ({
    districtId,
    districtName,
    onClose,
}: DistrictFightListModalProps) => {
    const [expandedGangId, setExpandedGangId] = useState<number>(-1);
    const [gangs, setGangs] = useState<Gang[]>([]);

    useEffect(() => {
        if (districtId > 0) {
            getGangsByTargetDistrict(districtId).then(res => {
                setGangs(res.data.gangs);
            });
        }
    }, [districtId]);

    const _renderItem = ({item, index}: {item: any; index: number}) => {
        const isExpanded = expandedGangId === item.id;
        return (
            <DistrictFightListGangItem
                item={item}
                index={index}
                isExpanded={isExpanded}
                onExpand={() => setExpandedGangId(isExpanded ? -1 : item.id)}
            />
        );
    };

    return (
        <AppModal isVisible={districtId > 0} onClose={onClose}>
            <View
                style={{
                    height: SCREEN_HEIGHT * 0.65,
                    width: SCREEN_WIDTH * 0.85,
                    borderWidth: 1,
                    borderColor: colors.secondary500,
                    backgroundColor: colors.black,
                    padding: gapSize.size3L,
                    alignItems: "center",
                }}>
                <AppText
                    text={districtName}
                    type={TextTypes.TitleSmall}
                    color={colors.white}
                    style={{marginBottom: gapSize.sizeM}}
                />
                <FlatList
                    data={gangs}
                    renderItem={_renderItem}
                    style={{width: "100%"}}
                />
            </View>
        </AppModal>
    );
};

export default DistrictFightListModal;

const DistrictFightListGangItem = ({
    item,
    index,
    isExpanded,
    onExpand,
}: {
    item: Gang;
    index: number;
    isExpanded: boolean;
    onExpand: () => void;
}) => {
    const _renderMemberItem = ({item}: {item: any}) => {
        return <DistrictFightListGangMemberItem item={item} />;
    };

    return (
        <View
            style={{
                marginBottom: gapSize.sizeM,
                width: "100%",
            }}>
            <TouchableOpacity
                onPress={onExpand}
                style={{
                    height: 81,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderWidth: 1,
                    borderColor: colors.secondary500,
                    paddingRight: gapSize.size3L,
                }}>
                <MaskedView
                    maskElement={
                        <LinearGradient
                            colors={["transparent", "#FFFFFF23", "#000000B2"]}
                            locations={[0, 0.14, 0.98]}
                            start={{x: 1, y: 0}}
                            end={{x: 0, y: 0}}
                            style={{
                                width: "100%",
                                height: "100%",
                            }}
                        />
                    }>
                    <FastImage
                        source={
                            item.img_url
                                ? {uri: item.img_url}
                                : images.examples.gang
                        }
                        style={{
                            height: 77,
                            width: 150,
                        }}
                    />
                </MaskedView>
                <AppText
                    text={index + 1}
                    type={TextTypes.H5}
                    color={colors.white}
                    fontSize={28}
                    style={{position: "absolute", top: 20, left: 25}}
                />

                <View
                    style={[
                        commonStyles.alignItemsCenter,
                        {position: "absolute", right: 10},
                    ]}>
                    <AppText
                        text={item.name}
                        type={TextTypes.H5}
                        color={colors.white}
                    />
                    <View
                        style={[commonStyles.flexRow, {alignSelf: "flex-end"}]}>
                        <AppImage source={images.icons.blood} size={18} />
                        <AppText
                            text={item.total_points}
                            type={TextTypes.H5}
                            color={colors.white}
                        />
                    </View>
                </View>
            </TouchableOpacity>
            {isExpanded && (
                <FlatList
                    data={item.members?.sort((a, b) => b.point - a.point)}
                    renderItem={_renderMemberItem}
                    ItemSeparatorComponent={() => (
                        <Divider marginVertical={2} width={"100%"} />
                    )}
                    style={{
                        width: "100%",
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: colors.secondary500,
                    }}
                />
            )}
        </View>
    );
};

const DistrictFightListGangMemberItem = ({item}: {item: GangMember}) => {
    return (
        <View
            style={{
                paddingVertical: gapSize.sizeM,
                paddingHorizontal: gapSize.sizeL,
            }}>
            <View style={commonStyles.flexRowSpaceBetweenAlignCenter}>
                <View style={commonStyles.flexRowAlignCenter}>
                    <Avatar size={48} source={item.member_img_url} />
                    <AppText
                        text={item.member_name}
                        style={{marginLeft: gapSize.size2S}}
                    />
                </View>
                <View style={{alignItems: "flex-end"}}>
                    <View style={commonStyles.flexRowAlignCenter}>
                        <AppImage source={images.icons.blood} size={18} />
                        <AppText text={item.point} />
                    </View>
                    <AppText
                        preText={strings.districts.contribution + " "}
                        text={item.contribution.toFixed(0)}
                        postText="%"
                        style={{marginTop: gapSize.sizeS}}
                    />
                </View>
            </View>
        </View>
    );
};
