import {useEffect, useState} from "react";
import {FlatList, TouchableOpacity, View} from "react-native";

import {useSelector} from "react-redux";

import {getFaq} from "@apis/faqApis";
import {colors, gapSize} from "@assets/index";
import AppText, {TextTypes} from "@components/AppText";
import Divider from "@components/Divider";
import InnerContainer from "@components/InnerContainer";
import ScreenContainer from "@components/ScreenContainer";
import TitleHeader from "@components/TitleHeader";
import {RootState} from "@redux/index.ts";
import commonStyles from "@utils/commonStyles";

interface Faq {
    topic: string;
    questions: {question: string; answer: string; higlightWords: string[]}[];
}

const Faq = () => {
    const userLang = useSelector((state: RootState) => state.auth.user?.lang);
    const [faqs, setFaqs] = useState<Faq[]>([]);
    useEffect(() => {
        getFaq().then(res => {
            setFaqs(res.data.faqs_by_language[userLang]);
        });
    }, []);

    const _renderItem = ({item}: {item: any}) => {
        return (
            <View>
                <AppText
                    text={item.topic}
                    type={TextTypes.Caption}
                    style={{marginBottom: gapSize.sizeM}}
                    color={colors.white}
                />
                <View
                    style={{
                        backgroundColor: colors.black,
                        borderWidth: 1,
                        borderColor: colors.secondary500,
                        marginBottom: gapSize.size2L,
                    }}>
                    <FlatList
                        data={item.questions}
                        renderItem={({item}) => (
                            <QuestionItem
                                key={item.question}
                                question={item.question}
                                answer={item.answer}
                                highlightWords={item.highlightWords}
                            />
                        )}
                        ItemSeparatorComponent={() => (
                            <Divider marginVertical={2} width={"95%"} />
                        )}
                    />
                </View>
            </View>
        );
    };

    return (
        <ScreenContainer>
            <InnerContainer>
                <TitleHeader title="FAQ" />
                <FlatList
                    data={faqs}
                    renderItem={_renderItem}
                    style={{height: "90%"}}
                />
            </InnerContainer>
        </ScreenContainer>
    );
};

export default Faq;

const QuestionItem = ({
    question,
    answer,
    highlightWords,
}: {
    question: string;
    answer: string;
    highlightWords: string[];
}) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <TouchableOpacity
            onPress={() => setIsOpen(!isOpen)}
            style={{
                paddingVertical: gapSize.sizeM,
                paddingHorizontal: gapSize.sizeL,
            }}>
            <View style={[commonStyles.flexRowAlignStartSpaceBetween]}>
                <AppText
                    text={question}
                    type={TextTypes.H4}
                    style={{width: "85%"}}
                />
                <AppText
                    text={isOpen ? "-" : "+"}
                    type={TextTypes.H4}
                    fontSize={40}
                    style={{
                        top: -gapSize.sizeL,
                        position: "absolute",
                        right: 0,
                    }}
                />
            </View>
            {isOpen && (
                <AppText
                    text={answer}
                    wordsToHighlight={highlightWords}
                    highlightStyle={{
                        color: colors.green,
                        fontWeight: "bold",
                    }}
                    style={{marginTop: gapSize.sizeM}}
                />
            )}
        </TouchableOpacity>
    );
};
