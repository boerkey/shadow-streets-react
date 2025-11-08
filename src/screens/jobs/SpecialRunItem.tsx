import React, {useEffect, useState} from "react";
import {ImageBackground, TouchableOpacity, View} from "react-native";

import {useDispatch, useSelector} from "react-redux";

import {
    AppButton,
    AppImage,
    AppText,
    Divider,
    TooltipDropdown,
} from "@components/index";

import {specialRunApis} from "@apis/index";
import {colors, gapSize, images} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {authActions, characterActions} from "@redux/actions";
import {RootState} from "@redux/index";
import {renderNumber} from "@utils/helperFunctions";
import {commonStyles, scaledValue, strings} from "@utils/index";
import {getItemImage} from "@utils/itemHelpers";
import {RiskLevel} from "./CurrentSpecialRun";
import styles from "./styles";

const SpecialRunItem = ({item, index}: {item: any; index: number}) => {
    const dispatch = useDispatch();
    const difficulties = useSelector(
        (state: RootState) => state.character.specialRunDifficulties,
    );
    const lastSpecialRunRewards = useSelector(
        (state: RootState) => state.character.lastSpecialRunRewards,
    );
    const specialRunLimitText = useSelector(
        (state: RootState) => state.character.specialRunLimitText,
    );

    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedDifficulty, setSelectedDifficulty] = useState(-1);

    const selectedDifficultyObject = difficulties.find(
        (difficulty: any) => difficulty.difficulty === selectedDifficulty,
    );

    const isSameCategory = lastSpecialRunRewards?.category_id === item.category;

    useEffect(() => {
        if (lastSpecialRunRewards) {
            setIsExpanded(isSameCategory);
        }
    }, [lastSpecialRunRewards]);

    function startJob() {
        if (selectedDifficultyObject) {
            specialRunApis
                .startSpecialRun(selectedDifficulty, item.category)
                .then(res => {
                    console.log(res);
                    dispatch(characterActions.getSpecialRuns());
                    dispatch(authActions.getUser());
                });
        }
    }

    function getDifficultyList() {
        return difficulties.map((difficulty: any) => ({
            name: RiskLevel[difficulty.difficulty],
            id: difficulty.difficulty,
        }));
    }

    function renderRiskLevel(riskLevel: RiskLevel) {
        switch (riskLevel) {
            case RiskLevel.LOW:
                return <AppImage source={images.icons.greenDot} size={15} />;
            case RiskLevel.MEDIUM:
                return <AppImage source={images.icons.orangeDot} size={15} />;
            case RiskLevel.HIGH:
                return <AppImage source={images.icons.redDot} size={15} />;
        }
    }

    function renderRequirements() {
        if (selectedDifficultyObject) {
            return (
                <View style={{width: "100%"}}>
                    <AppText
                        text={strings.common.requirements}
                        type={TextTypes.BodyBold}
                        color={colors.white}
                        centered
                    />
                    <View
                        style={{
                            marginTop: gapSize.sizeM,
                            width: "100%",
                        }}>
                        <View style={commonStyles.flexRowSpaceBetween}>
                            <AppText
                                fontSize={14}
                                text={strings.common.energy}
                            />
                            <AppText
                                text={selectedDifficultyObject.required_energy}
                                color={colors.borderColor}
                                type={TextTypes.BodyBold}
                            />
                        </View>
                        <Divider width={"100%"} marginVertical={7} />
                        <View style={commonStyles.flexRowSpaceBetween}>
                            <AppText fontSize={14} text={strings.common.risk} />
                            {renderRiskLevel(
                                selectedDifficultyObject.difficulty,
                            )}
                        </View>
                    </View>
                </View>
            );
        }
    }

    function renderLastSpecialRunRewards() {
        if (
            lastSpecialRunRewards &&
            isSameCategory &&
            selectedDifficulty === -1
        ) {
            return (
                <View style={{width: "100%"}}>
                    <AppText
                        text={
                            strings.jobs.lastRun +
                            " - " +
                            lastSpecialRunRewards.operation_name
                        }
                        type={TextTypes.BodyBold}
                        centered
                        style={{marginBottom: gapSize.sizeM}}
                    />
                    <View style={commonStyles.flexRowSpaceBetween}>
                        <AppText text={strings.jobs.result} />
                        <AppText
                            text={
                                lastSpecialRunRewards.was_success
                                    ? strings.jobs.success
                                    : strings.jobs.failed
                            }
                            color={
                                lastSpecialRunRewards.was_success
                                    ? colors.green
                                    : colors.red
                            }
                        />
                    </View>
                    <Divider width={"100%"} marginVertical={4} />
                    {Object.keys(strings.jobs.specialRunRewards).map(key => {
                        const value = lastSpecialRunRewards.rewards[key];
                        if (value) {
                            return (
                                <View key={key}>
                                    <View
                                        style={
                                            commonStyles.flexRowSpaceBetween
                                        }>
                                        <AppText
                                            text={
                                                strings.jobs.specialRunRewards[
                                                    key
                                                ]
                                            }
                                        />
                                        <AppText
                                            text={renderNumber(value, 1)}
                                            type={TextTypes.BodyBold}
                                            color={colors.secondary500}
                                        />
                                    </View>
                                    <Divider
                                        width={"100%"}
                                        marginVertical={4}
                                    />
                                </View>
                            );
                        }
                    })}
                    {lastSpecialRunRewards.rewards.dropped_items?.length >
                        0 && (
                        <>
                            <View
                                style={
                                    commonStyles.flexRowSpaceBetweenAlignCenter
                                }>
                                <AppText text={strings.jobs.itemLoot} />
                                <View style={commonStyles.flexRowSpaceBetween}>
                                    {lastSpecialRunRewards.rewards.dropped_items?.map(
                                        (item: any) => {
                                            return (
                                                <View
                                                    style={[
                                                        commonStyles.alignAllCenter,
                                                        {
                                                            borderWidth: 1,
                                                            width: 30,
                                                            height: 30,
                                                            borderColor:
                                                                colors.green,
                                                            marginLeft: 6,
                                                        },
                                                    ]}>
                                                    <AppImage
                                                        source={getItemImage(
                                                            item,
                                                        )}
                                                        size={22}
                                                    />
                                                    {item.amount > 1 && (
                                                        <AppText
                                                            text={item.amount}
                                                            style={{
                                                                position:
                                                                    "absolute",
                                                                top: 0,
                                                                right: 0,
                                                            }}
                                                            color={
                                                                colors.secondary500
                                                            }
                                                            type={
                                                                TextTypes.Caption2
                                                            }
                                                        />
                                                    )}
                                                </View>
                                            );
                                        },
                                    )}
                                </View>
                            </View>
                            <Divider width={"100%"} marginVertical={4} />
                        </>
                    )}
                    <View style={commonStyles.flexRowSpaceBetween}>
                        <AppText text={strings.jobs.completedAt} />
                        <AppText
                            text={lastSpecialRunRewards.completed_at_ago}
                        />
                    </View>
                    <Divider width={"100%"} marginVertical={4} />
                </View>
            );
        }
    }

    return (
        <ImageBackground
            source={images.missions[2]}
            style={{marginBottom: scaledValue(12)}}>
            <TouchableOpacity
                style={[
                    styles.mainContainer,
                    {
                        height: scaledValue(isExpanded ? 115 : 88),
                    },
                ]}
                onPress={() => {
                    setIsExpanded(!isExpanded);
                }}>
                <AppText
                    text={specialRunLimitText}
                    style={{position: "absolute", top: 5, right: 5}}
                />
                <AppText text={item.name} type={TextTypes.H5} />
            </TouchableOpacity>
            {isExpanded && (
                <View
                    style={[
                        styles.requirementsContainer,
                        {
                            alignItems: "center",
                        },
                    ]}>
                    {renderRequirements()}
                    {renderLastSpecialRunRewards()}
                    <View
                        style={[
                            commonStyles.flexRowSpaceBetweenAlignCenter,
                            {marginTop: gapSize.sizeL},
                        ]}>
                        <TooltipDropdown
                            options={getDifficultyList()}
                            placement="top"
                            onSelect={(index: number, item) => {
                                setSelectedDifficulty(item.id);
                            }}>
                            <View
                                style={{
                                    width: 140,
                                    height: 44,
                                    borderWidth: 1,
                                    borderColor: colors.secondary500,
                                    marginRight: gapSize.sizeL,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: colors.black,
                                }}>
                                <AppText
                                    text={
                                        selectedDifficultyObject
                                            ? RiskLevel[
                                                  selectedDifficultyObject
                                                      .difficulty
                                              ]
                                            : "Choose Difficulty"
                                    }
                                    type={TextTypes.BodyBold}
                                />
                            </View>
                        </TooltipDropdown>
                        <AppButton
                            disabled={!selectedDifficultyObject}
                            text={strings.common.start}
                            height={45}
                            width={140}
                            fontSize={21}
                            onPress={startJob}
                        />
                    </View>
                </View>
            )}
        </ImageBackground>
    );
};

export default SpecialRunItem;
