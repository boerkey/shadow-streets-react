import React, {useState} from "react";
import {FlatList, RefreshControl, ScrollView, View} from "react-native";

import {useSelector} from "react-redux";

import {guardApis} from "@apis/index";
import {colors, gapSize, images} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {AppImage, AppText, CheckBox, Divider} from "@components/index";
import TabSelector from "@components/TabSelector";
import {GuardUpgrade, UserGuard} from "@interfaces/GameInterface";
import {UserProperty} from "@interfaces/PropertyInterface";
import {RootState} from "@redux/index";
import PropertyItem from "@screens/property/PropertyItem";
import {getStreetName, renderNumber, showToast} from "@utils/helperFunctions";
import {commonStyles, strings} from "@utils/index";
import GuardUpgrades from "./GuardUpgrades";

const GuardTwo = ({
    guard,
    getGuard,
    guardUpgradesData,
    loading,
    userProperties,
}: {
    guard: UserGuard;
    getGuard: () => void;
    guardUpgradesData: GuardUpgrade[];
    loading: boolean;
    userProperties: UserProperty[];
}) => {
    const gameStreets = useSelector(
        (state: RootState) => state.game.gameStreets,
    );
    const user = useSelector((state: RootState) => state.auth.user);
    const [guardDetailsTab, setGuardDetailsTab] = useState(0);

    const propertyManagementUpgrade = guard.upgrades.some(
        upgrade => upgrade.upgrade_id === 1,
    );

    function updateGuardTask(taskId: number, taskValue: number) {
        guardApis.updateGuardTask(guard.id, taskId, taskValue).then(res => {
            showToast(res.data.message);
            getGuard();
        });
    }
    
    function renderTabs() {
        if (guardDetailsTab === 0) {
            return (
                <FlatList
                    data={userProperties}
                    renderItem={({item}) => (
                        <PropertyItem item={item} showStreetName />
                    )}
                />
            );
        }
        return (
            <View
                style={{
                    backgroundColor: "#181515",
                    paddingHorizontal: gapSize.sizeM,
                    paddingBlock: gapSize.sizeM,
                }}>
                <AppText
                    text={strings.guards.depositToProperties}
                    type={TextTypes.H4}
                    centered
                    style={{marginBottom: gapSize.sizeM}}
                />
                {userProperties?.map(property => {
                    const hasTask = guard.tasks.find(
                        task => task.task_id === property.id,
                    );
                    const propertyType =
                        strings.common.propertyTypeNames[property.type];
                    const streetName = getStreetName(
                        gameStreets,
                        property,
                        "location_x",
                        "location_y",
                    );
                    return (
                        <View key={property.id}>
                            <View style={commonStyles.flexRowSpaceBetween}>
                                <CheckBox
                                    text={property.name + " - " + propertyType}
                                    isChecked={!!hasTask}
                                    onPress={() => {
                                        updateGuardTask(
                                            property.id,
                                            hasTask ? 0 : 5000,
                                        );
                                    }}
                                    textColor={
                                        hasTask ? colors.green : colors.grey500
                                    }
                                />
                                <View style={commonStyles.flexRowAlignCenter}>
                                    <AppImage
                                        source={images.icons.whiteMinus}
                                        size={20}
                                        onPress={() => {
                                            updateGuardTask(
                                                property.id,
                                                hasTask
                                                    ? hasTask.task_value - 5000
                                                    : 0,
                                            );
                                        }}
                                        hitSlop={commonStyles.hitSlop}
                                    />
                                    <AppText
                                        text={
                                            hasTask
                                                ? renderNumber(
                                                      hasTask.task_value,
                                                  )
                                                : "0"
                                        }
                                        type={TextTypes.H4}
                                        style={{
                                            marginHorizontal: gapSize.sizeM,
                                        }}
                                        color={
                                            hasTask
                                                ? colors.green
                                                : colors.grey500
                                        }
                                    />
                                    <AppImage
                                        source={images.icons.whitePlus}
                                        size={20}
                                        onPress={() => {
                                            updateGuardTask(
                                                property.id,
                                                hasTask
                                                    ? hasTask.task_value + 5000
                                                    : 5000,
                                            );
                                        }}
                                        hitSlop={commonStyles.hitSlop}
                                    />
                                </View>
                            </View>
                            <AppText text={streetName} />
                            <Divider
                                width={"100%"}
                                marginVertical={gapSize.sizeM}
                            />
                        </View>
                    );
                })}
                <AppText
                    text={strings.guards.guard2Explanation}
                    type={TextTypes.Body}
                    style={{
                        marginBottom: gapSize.sizeM,
                    }}
                    color={colors.secondary500}
                />
            </View>
        );
    }

    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={getGuard} />
            }
            contentContainerStyle={{paddingBottom: 300}}
            showsVerticalScrollIndicator={false}>
            {propertyManagementUpgrade && (
                <TabSelector
                    items={[
                        {id: 1, name: strings.guards.property},
                        {id: 0, name: strings.guards.management},
                    ]}
                    selectedIndex={guardDetailsTab}
                    onSelect={index => {
                        setGuardDetailsTab(index);
                    }}
                    style={{alignSelf: "center"}}
                />
            )}
            {renderTabs()}
            <GuardUpgrades
                guardUpgradesData={guardUpgradesData}
                user={user}
                guard={guard}
                getGuard={getGuard}
            />
        </ScrollView>
    );
};

export default GuardTwo;
