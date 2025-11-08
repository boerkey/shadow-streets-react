import React, {useEffect, useState} from "react";
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import {supportApis} from "@apis/index";
import {colors, gapSize, images} from "@assets/index";
import AppImage from "@components/AppImage";
import AppText, {TextTypes} from "@components/AppText";
import Avatar from "@components/Avatar";
import FullScreenImageViewModal from "@components/FullScreenImageViewModal";
import {ReportType} from "@screens/player_profile";
import commonStyles from "@utils/commonStyles";
import {showToast} from "@utils/helperFunctions";

interface Report {
    id: string;
    content: string;
    type: ReportType;
    status: string;
    reporting_user_name?: string;
    reporting_user_id: string;
    user_name?: string;
    user_id: string;
    created_at: string;
    updated_at: string;
    created_at_ago: string;
}

enum ReportActionType {
    BAN = 1,
    IGNORE = 2,
}

const Reports = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(false);
    const [expandedItemId, setExpandedItemId] = useState(-1);
    const [selectedImageUrl, setSelectedImageUrl] = useState("");

    useEffect(() => {
        getReports();
    }, []);

    function getReports() {
        supportApis
            .getAllReports()
            .then(res => {
                setReports(res.data.reports);
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 500);
            });
    }

    function takeAction(reportId: number, action: ReportActionType) {
        supportApis
            .takeActionOnReport(reportId, action)
            .then(res => {
                showToast(res.data.message);
                getReports();
            })
            .catch(err => {
                console.log(err);
            });
    }

    function getReportType(type: ReportType) {
        switch (type) {
            case ReportType.NICKNAME:
                return "Nickname";
            case ReportType.PROFILE_IMAGE:
                return "Profile Image";
            case ReportType.MESSAGE:
                return "Chat Message";
            case ReportType.GANG_IMAGE:
                return "Gang Image";
        }
    }

    const _renderItem = ({item}: {item: any}) => {
        const isExpanded = expandedItemId === item.id;
        const isGangReportOrProfileImage =
            item.type === ReportType.GANG_IMAGE ||
            item.type === ReportType.PROFILE_IMAGE;
        const isActionTaken = item.status !== 0;
        return (
            <TouchableOpacity
                onPress={() => {
                    setExpandedItemId(isExpanded ? -1 : item.id);
                }}
                style={{
                    padding: gapSize.sizeM,
                    borderWidth: 1,
                    borderColor: isActionTaken
                        ? colors.green
                        : colors.borderColor,
                    marginBottom: gapSize.sizeM,
                }}>
                <View style={commonStyles.flexRow}>
                    <View style={commonStyles.alignItemsCenter}>
                        <Avatar
                            source={
                                isGangReportOrProfileImage
                                    ? item.content
                                    : undefined
                            }
                        />
                        <AppText
                            text={item.user_name}
                            type={TextTypes.Caption}
                            style={{marginTop: gapSize.sizeS}}
                            color={colors.red}
                        />
                    </View>
                    <View style={{flex: 1, marginLeft: gapSize.sizeM}}>
                        <View style={[commonStyles.flexRowSpaceBetween]}>
                            <AppText
                                text={item.reporting_user_name}
                                type={TextTypes.Body2}
                            />
                            <AppText
                                text={item.created_at_ago}
                                type={TextTypes.Body2}
                            />
                        </View>
                        {isExpanded && (
                            <>
                                <View
                                    style={{
                                        padding: gapSize.sizeS,
                                        borderWidth: 1,
                                        borderColor: colors.red,
                                        marginTop: gapSize.sizeM,
                                        minHeight: 75,
                                    }}>
                                    <AppText
                                        text={getReportType(item.type)}
                                        type={TextTypes.Body2}
                                        color={colors.orange}
                                    />
                                    <AppText
                                        text={item.content}
                                        type={TextTypes.Body2}
                                        style={{marginTop: 2}}
                                    />
                                </View>
                                {!isActionTaken ? (
                                    <View
                                        style={[
                                            commonStyles.flexRow,
                                            {marginTop: gapSize.sizeM},
                                        ]}>
                                        <TouchableOpacity
                                            onLongPress={() => {
                                                takeAction(
                                                    item.id,
                                                    ReportActionType.BAN,
                                                );
                                            }}
                                            hitSlop={commonStyles.hitSlop}
                                            style={styles.ticketButton}>
                                            <AppImage
                                                source={images.icons.mute}
                                                size={16}
                                            />
                                            <AppText
                                                text="Mute"
                                                type={TextTypes.Body2}
                                                style={{
                                                    marginLeft: gapSize.sizeS,
                                                }}
                                            />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onLongPress={() => {
                                                takeAction(
                                                    item.id,
                                                    ReportActionType.IGNORE,
                                                );
                                            }}
                                            hitSlop={commonStyles.hitSlop}
                                            style={styles.ticketButton}>
                                            <AppImage
                                                source={images.icons.x}
                                                size={12}
                                            />
                                            <AppText
                                                text="Ignore"
                                                type={TextTypes.Body2}
                                                style={{
                                                    marginLeft: gapSize.sizeS,
                                                }}
                                            />
                                        </TouchableOpacity>

                                        {isGangReportOrProfileImage && (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setSelectedImageUrl({
                                                        uri: item.content,
                                                    });
                                                }}
                                                hitSlop={commonStyles.hitSlop}
                                                style={styles.ticketButton}>
                                                <AppText
                                                    text="Fullscreen"
                                                    type={TextTypes.Body2}
                                                    style={{
                                                        marginLeft:
                                                            gapSize.sizeS,
                                                    }}
                                                />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                ) : (
                                    <AppText
                                        text={"Action Taken"}
                                        color={colors.green}
                                        type={TextTypes.Body2}
                                        style={{marginTop: 2}}
                                    />
                                )}
                            </>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View>
            <FullScreenImageViewModal
                isVisible={!!selectedImageUrl}
                onClose={() => setSelectedImageUrl("")}
                imageUrl={selectedImageUrl}
            />
            <FlatList
                data={reports.sort((a, b) => a.status - b.status)}
                refreshControl={
                    <RefreshControl
                        tintColor={colors.white}
                        refreshing={loading}
                        onRefresh={getReports}
                    />
                }
                renderItem={_renderItem}
                style={{height: "85%"}}
            />
        </View>
    );
};

export default Reports;

const styles = StyleSheet.create({
    ticketButton: {
        padding: gapSize.sizeS,
        borderWidth: 1,
        borderColor: colors.secondary500,
        backgroundColor: colors.black,
        height: 28,
        minWidth: 60,
        flexDirection: "row",
        marginRight: gapSize.sizeM,
        alignItems: "center",
    },
});
