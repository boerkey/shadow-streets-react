import {View} from "react-native";

import * as Progress from "react-native-progress";

import {colors, gapSize, images} from "@assets/index";
import {TextTypes} from "@components/AppText";
import LevelAvatar from "@components/Header/LevelAvatar";
import {AppImage, AppModal, AppText, Divider} from "@components/index";
import {getHealthBarColor, renderNumber} from "@utils/helperFunctions";
import {commonStyles, scaledValue, strings} from "@utils/index";

import {GroupFightParticipant} from "@interfaces/GroupFight";

import styles from "./styles";

const FighterDetailsModal = ({
    isVisible,
    onClose,
    fighter,
}: {
    isVisible: boolean;
    onClose: () => void;
    fighter: GroupFightParticipant;
}) => {
    return (
        <AppModal isVisible={isVisible} onClose={onClose}>
            <View
                style={{
                    padding: gapSize.sizeL,
                    backgroundColor: colors.black,
                    width: scaledValue(345),
                    height: scaledValue(466),
                    borderWidth: 1,
                    borderColor: colors.secondary500,
                    alignItems: "center",
                }}>
                <AppText text={fighter?.user_name} type={TextTypes.H2} />
                <View
                    style={[
                        commonStyles.flexRow,
                        {
                            width: "100%",
                            marginTop: gapSize.sizeM,
                            marginBottom: gapSize.sizeS,
                        },
                    ]}>
                    <LevelAvatar
                        size={110}
                        scaledSize
                        overrideUser={{
                            level: fighter?.level,
                            name: fighter?.user_name,
                            experience: 0,
                            required_experience: 0,
                            img_url: fighter?.img_url,
                        }}
                        showName={false}
                    />
                    <View
                        style={{
                            marginLeft: gapSize.sizeM,
                            width: scaledValue(180),
                            marginTop: gapSize.sizeM,
                        }}>
                        <View style={commonStyles.flexRowSpaceBetween}>
                            <AppText text={"HP"} type={TextTypes.H7} />
                            <AppText
                                text={`${renderNumber(
                                    fighter?.health,
                                    1,
                                )}/${renderNumber(fighter?.max_health, 1)}`}
                                type={TextTypes.H7}
                            />
                        </View>

                        <Progress.Bar
                            height={4}
                            progress={fighter?.health / fighter?.max_health}
                            width={scaledValue(180)}
                            borderRadius={1}
                            borderColor={colors.special}
                            unfilledColor={colors.grey900}
                            color={getHealthBarColor(
                                fighter?.health / fighter?.max_health,
                            )}
                            style={styles.progressBar}
                        />
                        <View
                            style={{
                                marginTop: gapSize.sizeM,
                                borderBottomWidth: 1,
                                borderBottomColor: colors.lineColor,
                                marginBottom: gapSize.sizeM,
                            }}>
                            <View style={commonStyles.flexRowSpaceBetween}>
                                <AppText text={strings.groupFight.dealtDmg} />
                                <AppText
                                    text={renderNumber(
                                        fighter?.total_dealt_damage,
                                        1,
                                    )}
                                />
                            </View>
                        </View>
                        <View
                            style={{
                                borderBottomWidth: 1,
                                borderBottomColor: colors.lineColor,
                                marginBottom: gapSize.sizeM,
                            }}>
                            <View style={commonStyles.flexRowSpaceBetween}>
                                <AppText text={strings.groupFight.takenDmg} />
                                <AppText
                                    text={renderNumber(
                                        fighter?.total_received_damage,
                                        1,
                                    )}
                                />
                            </View>
                        </View>
                    </View>
                </View>
                <Divider width={"100%"} marginVertical={4} />
                <AppText text={"Rewards"} type={TextTypes.TitleSmall} />
                <View
                    style={[
                        commonStyles.flexRowSpaceBetween,
                        {width: "100%", marginTop: gapSize.sizeM},
                    ]}>
                    <View style={{width: "25%"}}>
                        <View
                            style={commonStyles.flexRowSpaceBetweenAlignCenter}>
                            <AppImage source={images.icons.money} size={20} />
                            <AppText
                                preText="+"
                                text={renderNumber(fighter?.gained_money, 1)}
                                type={TextTypes.H6}
                            />
                        </View>
                        <View
                            style={[
                                commonStyles.flexRowSpaceBetweenAlignCenter,
                                {marginTop: gapSize.sizeM},
                            ]}>
                            <AppImage
                                source={images.icons.shadowCoin}
                                size={18}
                                style={{left: 1}}
                            />
                            <AppText
                                preText="+"
                                text={renderNumber(
                                    fighter?.gained_shadow_coin,
                                    1,
                                )}
                                type={TextTypes.H6}
                            />
                        </View>
                    </View>
                    <View style={{width: "25%"}}>
                        <View
                            style={commonStyles.flexRowSpaceBetweenAlignCenter}>
                            <AppText
                                text={strings.gameKeys.xp}
                                type={TextTypes.H6}
                                color={colors.orange}
                            />
                            <AppText
                                preText="+"
                                text={renderNumber(
                                    fighter?.gained_experience,
                                    1,
                                )}
                                type={TextTypes.H6}
                            />
                        </View>
                        <View
                            style={[
                                commonStyles.flexRowSpaceBetweenAlignCenter,
                                {marginTop: gapSize.sizeM},
                            ]}>
                            <AppText
                                text={strings.gameKeys.pre}
                                type={TextTypes.H6}
                            />
                            <AppText
                                preText="+"
                                text={renderNumber(fighter?.gained_prestige, 1)}
                                type={TextTypes.H6}
                            />
                        </View>
                    </View>
                    <View style={{width: "25%"}} />
                </View>
            </View>
        </AppModal>
    );
};

export default FighterDetailsModal;
