import {View} from "react-native";
import {useDispatch, useSelector} from "react-redux";

import {specialRunApis} from "@apis/index";
import {colors, gapSize, images} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {AppImage, AppText, SmallButton} from "@components/index";
import {authActions, characterActions} from "@redux/actions";
import {RootState} from "@redux/index";
import {renderNumber, showToast} from "@utils/helperFunctions";
import {strings} from "@utils/index";

import styles from "./styles";

export enum RiskLevel {
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
}

const CurrentSpecialRun = () => {
    const currentSpecialRun = useSelector(
        (state: RootState) => state.character.currentSpecialRun,
    );
    const dispatch = useDispatch();
    const specialRunLoading = useSelector(
        (state: RootState) => state.character.specialRunLoading,
    );
    
    function makeChoice(choice_id: number) {
        if (specialRunLoading) {
            return;
        }
        dispatch(characterActions.setSpecialRunLoading(true));
        specialRunApis
            .makeSpecialRunChoice(choice_id)
            .then(res => {
                showToast(res.data.message);
            })
            .finally(() => {
                dispatch(authActions.getUser());
                dispatch(characterActions.getSpecialRuns());
            });
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

    function renderChoices() {
        return currentSpecialRun.current_node?.choices.map(choice => {
            return (
                <View
                    key={choice.choice_id}
                    style={{
                        width: "100%",
                        marginBottom: gapSize.sizeM,
                    }}>
                    <View
                        style={{
                            borderWidth: 1,
                            borderColor: colors.borderColor,
                            padding: gapSize.sizeM,
                        }}>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}>
                            <AppText
                                text={choice.choice_text}
                                type={TextTypes.Body}
                            />
                            {renderRiskLevel(choice.risk_level)}
                        </View>
                    </View>
                    <View
                        style={{
                            padding: gapSize.sizeM,
                            borderWidth: 1,
                            borderTopWidth: 0,
                            borderColor: colors.borderColor,
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}>
                        <View>
                            <AppText
                                text={choice.flavor_text}
                                type={TextTypes.BodySmall}
                                style={{marginBottom: gapSize.sizeS}}
                            />
                            {Object.keys(choice.requirements).map(key => {
                                const value = choice.requirements[key];
                                return (
                                    <View key={key}>
                                        <AppText
                                            text={
                                                strings.common.gameKeys[
                                                    key
                                                ] +
                                                ": " +
                                                renderNumber(value, 1)
                                            }
                                            type={TextTypes.BodySmall}
                                            style={{
                                                marginBottom: gapSize.sizeXS,
                                            }}
                                        />
                                    </View>
                                );
                            })}
                        </View>
                        <SmallButton
                            text={strings.common.choose}
                            width={110}
                            onPress={() => makeChoice(choice.choice_id)}
                            disabled={specialRunLoading}
                        />
                    </View>
                </View>
            );
        });
    }

    return (
        <View
            style={[
                styles.mainContainer,
                {
                    paddingHorizontal: gapSize.size2L,
                    paddingVertical: gapSize.sizeM,
                    backgroundColor: colors.black,
                },
            ]}>
            <AppText
                text={currentSpecialRun.current_node?.title}
                type={TextTypes.H6}
                style={{marginBottom: gapSize.sizeS}}
            />
            <AppText
                text={currentSpecialRun.current_node?.story_text}
                type={TextTypes.Body}
                style={{marginBottom: gapSize.sizeM}}
            />
            {renderChoices()}
        </View>
    );
};

export default CurrentSpecialRun;
