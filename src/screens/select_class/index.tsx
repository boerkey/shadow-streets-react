import React, {useState} from "react";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";

import {characterApis} from "@apis/index.ts";
import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {
    AppButton,
    AppImage,
    AppText,
    Prompt,
    ScreenContainer,
} from "@components/index.ts";
import {Classes} from "@interfaces/GameInterface.ts";
import {authActions, characterActions} from "@redux/actions";
import {RootState} from "@redux/index";
import ClassCard from "@screens/select_class/ClassCard.tsx";
import {showToast} from "@utils/helperFunctions";
import {scaledValue, strings} from "@utils/index.ts";
import {navigateBack} from "../../router.tsx";

const SelectClass = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const [selectedClassId, setSelectedClassId] = useState<number>(
        Classes.GANGSTER,
    );
    const [showClassChangePrompt, setShowClassChangePrompt] = useState(false);
    const classIds = [Classes.GANGSTER, Classes.DETECTIVE, Classes.BUSINESSMAN];

    const hasNoClass = user.class === 0;

    const handleIconPress = (classId: number) => {
        setSelectedClassId(classId);
    };

    function changeClass() {
        characterApis.changeClass(selectedClassId).then(res => {
            showToast(res.data.message);
            dispatch(authActions.getUser());
            navigateBack();
        });
    }

    return (
        <ScreenContainer>
            <AppText
                text={
                    hasNoClass
                        ? strings.selectClass.timeToChooseClass
                        : strings.selectClass.changeYourClass
                }
                type={TextTypes.H2}
                centered
                style={styles.title}
            />
            <Prompt
                isVisible={showClassChangePrompt}
                onClose={() => setShowClassChangePrompt(false)}
                title={strings.common.warning}
                text={strings.selectClass.classChangeWarning}
                onConfirm={changeClass}
            />

            <View style={styles.cardContainer}>
                <ClassCard classId={selectedClassId} />
            </View>

            <View style={styles.iconContainer}>
                {classIds.map(classId => {
                    const isActive = selectedClassId === classId;
                    let iconSource;
                    switch (classId) {
                        case Classes.GANGSTER:
                            iconSource = isActive
                                ? images.icons.gangsterActive
                                : images.icons.gangsterPassive;
                            break;
                        case Classes.DETECTIVE:
                            iconSource = isActive
                                ? images.icons.detectiveActive
                                : images.icons.detectivePassive;
                            break;
                        case Classes.BUSINESSMAN:
                            iconSource = isActive
                                ? images.icons.businessmanActive
                                : images.icons.businessmanPassive;
                            break;
                        default:
                            iconSource = images.icons.hat;
                    }

                    return (
                        <TouchableOpacity
                            key={classId}
                            onPress={() => handleIconPress(classId)}
                            style={styles.iconTouchable}>
                            <AppImage size={45} source={iconSource} />
                            <AppText
                                text={strings.common.classNames[classId]}
                                style={styles.iconText}
                                color={
                                    isActive ? colors.borderColor : "#BFBFBF"
                                }
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>

            <AppButton
                onPress={() => {
                    if (hasNoClass) {
                        dispatch(characterActions.chooseClass(selectedClassId));
                    } else {
                        setShowClassChangePrompt(true);
                    }
                }}
                text={strings.common.choose}
                style={styles.chooseButton}
            />
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    title: {
        marginTop: gapSize.size3L,
        marginBottom: gapSize.sizeL,
    },
    cardContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    iconContainer: {
        width: "80%",
        height: scaledValue(88),
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: gapSize.size3L,
    },
    iconTouchable: {
        alignItems: "center",
    },
    iconText: {
        marginTop: gapSize.sizeL,
    },
    chooseButton: {
        alignSelf: "center",
        marginBottom: gapSize.size5L,
    },
});

export default SelectClass;
