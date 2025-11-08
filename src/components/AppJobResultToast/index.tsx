import React from "react";
import {ImageBackground, View} from "react-native";

import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {AppToast} from "@components/AppToast";
import {AppImage, AppText} from "@components/index.ts";
import {JobResult} from "@interfaces/JobInterface.ts";
import {renderNumber} from "@utils/helperFunctions.ts";
import {commonStyles, scaledValue, SCREEN_WIDTH} from "@utils/index.ts";

interface AppJobResultToastProps {
    jobResult: JobResult;
}

const AppJobResultToast = ({jobResult}: AppJobResultToastProps) => {
    const {message, status_yield} = jobResult;
    function renderMoneyAndExp() {
        return (
            <View style={{width: "40%"}}>
                {jobResult.experience_yield > 0 && (
                    <View style={commonStyles.flexRow}>
                        <AppText
                            text={"XP"}
                            color={colors.orange}
                            type={TextTypes.H6}
                        />
                        <AppText
                            text={`+${renderNumber(
                                jobResult.experience_yield,
                                2,
                            )}`}
                            type={TextTypes.H6}
                            style={{marginLeft: 4}}
                        />
                    </View>
                )}
                {jobResult.money_yield > 0 && (
                    <View style={commonStyles.flexRow}>
                        <AppImage source={images.icons.money} size={19} />
                        <AppText
                            text={`+${renderNumber(jobResult.money_yield, 2)}$`}
                            type={TextTypes.H6}
                            style={{marginLeft: 4}}
                        />
                    </View>
                )}
            </View>
        );
    }

    function renderStats() {
        const {
            stats_gain: {strength, dexterity, intelligence, charisma},
        } = jobResult;
        return (
            <View style={[commonStyles.flexRowSpaceBetween, {width: "55%"}]}>
                <View>
                    {strength > 0 && (
                        <View style={[commonStyles.flexRow]}>
                            <AppImage
                                source={images.icons.strength}
                                size={19}
                            />
                            <AppText
                                text={`+${renderNumber(strength, 2)}`}
                                type={TextTypes.H6}
                                style={{marginLeft: 4}}
                            />
                        </View>
                    )}
                    {dexterity > 0 && (
                        <View style={[commonStyles.flexRow]}>
                            <AppImage
                                source={images.icons.dexterity}
                                size={19}
                            />
                            <AppText
                                text={`+${renderNumber(dexterity, 2)}`}
                                type={TextTypes.H6}
                                style={{marginLeft: 4}}
                            />
                        </View>
                    )}
                </View>
                <View>
                    {intelligence > 0 && (
                        <View style={[commonStyles.flexRow]}>
                            <AppImage
                                source={images.icons.intelligence}
                                size={19}
                            />
                            <AppText
                                text={`+${renderNumber(intelligence, 2)}`}
                                type={TextTypes.H6}
                                style={{marginLeft: 4}}
                            />
                        </View>
                    )}
                    {charisma > 0 && (
                        <View style={[commonStyles.flexRow]}>
                            <AppImage
                                source={images.icons.charisma}
                                size={19}
                            />
                            <AppText
                                text={`+${renderNumber(charisma, 2)}`}
                                type={TextTypes.H6}
                                style={{marginLeft: 4}}
                            />
                        </View>
                    )}
                </View>
            </View>
        );
    }

    if (!jobResult.succeeded && jobResult.experience_yield === 0) {
        return (
            <AppToast
                text1={message}
                type={status_yield > 0 ? "error" : "warning"}
            />
        );
    }

    return (
        <ImageBackground
            resizeMode={"stretch"}
            source={images.containers.jobResultContainer}
            style={{
                height: scaledValue(125),
                width: SCREEN_WIDTH * 0.95,
                top: scaledValue(15),
                paddingVertical: 12,
                paddingHorizontal: gapSize.size3L,
                flexDirection: "row",
            }}>
            <AppImage source={images.icons.toastSuccess} />
            <View style={{marginLeft: 12}}>
                <AppText
                    text={message}
                    color={colors.green}
                    style={{width: SCREEN_WIDTH * 0.72}}
                />
                <View
                    style={[
                        commonStyles.flexRow,
                        {marginTop: gapSize.sizeS, width: SCREEN_WIDTH * 0.75},
                    ]}>
                    {renderMoneyAndExp()}
                    {renderStats()}
                </View>
            </View>
        </ImageBackground>
    );
};

export default AppJobResultToast;
