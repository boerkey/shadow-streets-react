import {TouchableOpacity, View} from "react-native";

import * as Progress from "react-native-progress";
import {useSelector} from "react-redux";

import {colors, gapSize, images} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {AppImage, AppText} from "@components/index";
import {getHealthBarColor, renderNumber} from "@utils/helperFunctions";
import {commonStyles, scaledValue, strings} from "@utils/index";

import LevelAvatar from "@components/Header/LevelAvatar";
import {GroupFightParticipant} from "@interfaces/GroupFight";
import {RootState} from "@redux/index";
import styles from "./styles";

const FighterItem = ({
    fighter,
    onPress,
}: {
    fighter: GroupFightParticipant | null;
    onPress: () => void;
}) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const hpRate = fighter?.health / fighter?.max_health;
    const isMe = fighter?.user_id === user.id;
    return (
        <TouchableOpacity style={{width: "100%"}} onPress={onPress}>
            <View style={commonStyles.flexRowAlignCenter}>
                <LevelAvatar
                    size={45}
                    scaledSize
                    overrideUser={{
                        level: fighter?.level,
                        name: fighter?.user_name,
                        experience: 0,
                        required_experience: 0,
                        img_url: fighter?.img_url,
                    }}
                    showName={false}
                    frameId={fighter?.avatar_frame_id}
                    style={{
                        marginLeft: -gapSize.sizeS,
                        marginRight: gapSize.sizeS,
                    }}
                />
                <View>
                    <View
                        style={[
                            commonStyles.flexRowSpaceBetween,
                            {marginLeft: gapSize.sizeXS},
                        ]}>
                        <AppText
                            text={fighter?.user_name}
                            color={isMe ? colors.green : colors.white}
                            type={TextTypes.H7}
                        />
                    </View>
                    <View
                        style={[
                            commonStyles.flexRowAlignCenter,
                            {marginTop: gapSize.sizeS},
                        ]}>
                        <View style={commonStyles.flexRowAlignCenter}>
                            <AppImage source={images.icons.damage} size={18} />
                            <AppText
                                text={renderNumber(fighter?.damage, 1)}
                                style={{
                                    marginLeft: gapSize.sizeXS,
                                }}
                                type={TextTypes.Caption2}
                                fontSize={11}
                            />
                        </View>
                        <View
                            style={[
                                commonStyles.flexRowAlignCenter,
                                {marginLeft: gapSize.sizeS},
                            ]}>
                            <AppImage source={images.icons.defence} size={18} />
                            <AppText
                                text={renderNumber(fighter?.defence, 1)}
                                style={{marginLeft: gapSize.sizeXS}}
                                type={TextTypes.Caption2}
                                fontSize={11}
                            />
                        </View>
                    </View>
                </View>
            </View>
            <Progress.Bar
                height={4}
                progress={hpRate}
                width={scaledValue(153)}
                borderRadius={1}
                borderColor={colors.special}
                unfilledColor={colors.grey900}
                color={getHealthBarColor(hpRate)}
                style={styles.progressBar}
            />
            <View
                style={[
                    commonStyles.flexRowSpaceBetween,
                    {marginTop: gapSize.sizeXS},
                ]}>
                <AppText
                    text={strings.gameKeys.hp}
                    type={TextTypes.H7}
                    fontSize={10}
                />
                <AppText
                    text={`${renderNumber(fighter?.health, 1)}/${renderNumber(
                        fighter?.max_health,
                        1,
                    )}`}
                    type={TextTypes.H7}
                    color={getHealthBarColor(hpRate)}
                    fontSize={10}
                />
            </View>
        </TouchableOpacity>
    );
};

export default FighterItem;
