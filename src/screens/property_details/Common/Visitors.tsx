import React, {useState} from "react";
import {FlatList, View} from "react-native";

import {colors, gapSize, images} from "@assets/index.ts";
import {commonStyles, strings} from "@utils/index.ts";
import {AppImage, AppText, Avatar, Prompt} from "@components/index.ts";
import {propertyApis} from "@apis/index.ts";
import {PropertyVisitor} from "@interfaces/PropertyInterface.ts";
import styles from "@screens/property_details/styles.ts";
import {TextTypes} from "@components/AppText";

interface VisitorsProps {
    visitors: PropertyVisitor[];
    property_id: number;
    getPropertyDetails(): void;
}

const Visitors = ({
    visitors,
    property_id,
    getPropertyDetails,
}: VisitorsProps) => {
    const [showPrompt, setShowPrompt] = useState(false);
    const _renderItem = ({item}) => <VisitorItem visitor={item} />;

    function leaveMessage(message: string) {
        setShowPrompt(false);
        propertyApis
            .leaveMessageToProperty(property_id, message)
            .then(() => getPropertyDetails());
    }

    return (
        <View style={styles.sectionContainer}>
            <AppText
                text={strings.propertyDetails.visitors}
                centered
                type={TextTypes.H4}
                fontSize={24}
                style={{marginBottom: gapSize.sizeL}}
            />
            <AppImage
                onPress={() => setShowPrompt(true)}
                source={images.icons.comment}
                size={24}
                hitSlop={commonStyles.bigHitSlop}
                containerStyle={{
                    position: "absolute",
                    right: gapSize.size2L,
                    top: gapSize.size2L,
                }}
            />
            <Prompt
                isVisible={showPrompt}
                onClose={() => setShowPrompt(false)}
                onConfirm={leaveMessage}
                title={strings.propertyDetails.leaveMessage}
                inputValidation={"any"}
                maxLength={80}
            />
            <FlatList
                data={visitors}
                renderItem={_renderItem}
                style={{paddingVertical: gapSize.sizeM}}
                ItemSeparatorComponent={() => (
                    <View
                        style={{
                            height: 1,
                            width: "100%",
                            backgroundColor: colors.lineColor,
                            marginVertical: gapSize.sizeM,
                        }}
                    />
                )}
            />
        </View>
    );
};

export default Visitors;

const VisitorItem = ({visitor}: {visitor: PropertyVisitor}) => {
    return (
        <View>
            {visitor.message && (
                <View style={styles.visitorMessageContainer}>
                    <AppText
                        text={visitor.message}
                        type={TextTypes.Caption}
                        color={colors.secondary500}
                    />
                </View>
            )}
            <View
                style={{
                    position: "absolute",
                    right: gapSize.sizeS,
                    top: gapSize.sizeS,
                }}>
                <AppText
                    text={visitor.time_ago}
                    type={TextTypes.Caption}
                    color={colors.grey500}
                />
            </View>
            <View style={commonStyles.flexRowSpaceBetweenAlignCenter}>
                <View>
                    <Avatar />
                    <AppText
                        text={visitor.name}
                        color={colors.white}
                        fontSize={12}
                    />
                </View>
                <AppText
                    text={`${strings.propertyDetails.numberOfVisits}: ${visitor.number_of_visits}`}
                    fontSize={12}
                />
            </View>
        </View>
    );
};
