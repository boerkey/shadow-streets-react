import React, {useState} from "react";
import {FlatList, TouchableOpacity, View} from "react-native";

import {useSelector} from "react-redux";

import {colors, fonts, gapSize} from "@assets/index.ts";
import {AppText} from "@components/index.ts";
import {TextTypes} from "@components/AppText";
import {scaledValue, strings} from "@utils/index.ts";
import {RootState} from "@redux/index.ts";

const FightMessages = ({messages}: any) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [isExpanded, setIsExpanded] = useState(false);

    const _renderMessage = ({item}) => {
        const highlightedWords = item.highlighted_words?.split(/[|,]/);
        return (
            <AppText
                text={item.messages[user.lang]}
                style={{marginBottom: scaledValue(8)}}
                wordsToHighlight={highlightedWords}
                highlightStyle={{
                    color: colors.orange,
                    fontFamily: fonts.RalewayBold,
                }}
            />
        );
    };
    return (
        <View
            style={{
                backgroundColor: colors.black,
                borderWidth: 1,
                borderColor: colors.secondary500,
                padding: gapSize.sizeM,
                marginTop: scaledValue(12),
            }}>
            <TouchableOpacity onPress={() => setIsExpanded(prev => !prev)}>
                <AppText
                    text={strings.fights.summary}
                    type={TextTypes.H4}
                    fontSize={24}
                    centered
                />
            </TouchableOpacity>
            {isExpanded && (
                <FlatList
                    style={{height: "30%"}}
                    data={messages}
                    scrollEnabled={isExpanded}
                    renderItem={_renderMessage}
                />
            )}
        </View>
    );
};

export default FightMessages;
