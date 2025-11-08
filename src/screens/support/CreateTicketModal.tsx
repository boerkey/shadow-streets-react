import React, {useState} from "react";
import {FlatList, TextInput, TouchableOpacity, View} from "react-native";

import auth from "@react-native-firebase/auth";

import {supportApis} from "@apis/index";
import {colors, fonts, gapSize} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {AppButton, AppModal, AppText, Divider} from "@components/index.ts";
import {showToast, uploadImageWithFirebase} from "@utils/helperFunctions";
import {commonStyles, scaledValue, strings} from "@utils/index.ts";
import AddImageBox from "./AddImageBox";

const CreateTicketModal = ({isVisible, onClose}) => {
    const [filterText, setFilterText] = useState("");
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [reportImages, setReportImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    function createTicket(uploadedImages: string[]) {
        supportApis
            .createTicket(selectedTopic.id, message, uploadedImages)
            .then(response => {
                showToast(response.data.message);
            })
            .finally(() => {
                setLoading(false);
                onClose();
            });
    }

    const _renderItem = ({item, index}) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    setSelectedTopic(item);
                    setShowDropdown(false);
                }}>
                <AppText
                    text={item.name}
                    type={TextTypes.H6}
                    color={colors.white}
                />
                <AppText
                    text={item.explanation}
                    color={colors.grey500}
                    fontSize={10}
                />
            </TouchableOpacity>
        );
    };

    function renderSelect() {
        return (
            <View
                style={{
                    paddingHorizontal: gapSize.sizeL,
                    borderBottomWidth: 1,
                    borderColor: colors.grey500,
                    backgroundColor: colors.inputBackground,
                    width: "100%",
                    height: scaledValue(51),
                    alignItems: "center",
                    flexDirection: "row",
                    marginBottom: gapSize.size2L,
                }}>
                {selectedTopic ? (
                    <TouchableOpacity
                        onPress={() => setShowDropdown(prev => !prev)}
                        style={{width: "100%"}}>
                        <AppText
                            text={selectedTopic?.name}
                            type={TextTypes.H6}
                            color={colors.white}
                        />
                        <AppText
                            text={selectedTopic?.explanation}
                            type={TextTypes.BodySmall}
                            color={colors.grey500}
                        />
                    </TouchableOpacity>
                ) : (
                    <TextInput
                        readOnly={!!selectedTopic}
                        key={2}
                        onTouchStart={() => setShowDropdown(true)}
                        selectionColor={colors.grey500}
                        onChangeText={setFilterText}
                        value={filterText}
                        style={{
                            width: "85%",
                            color: colors.white,
                            fontFamily: fonts.RalewayMedium,
                            fontSize: 10,
                        }}
                        placeholder={strings.support.chooseTopic}
                        placeholderTextColor={colors.grey500}
                    />
                )}
                {(filterText.length > 0 || selectedTopic) && (
                    <TouchableOpacity
                        onPress={() => {
                            setFilterText("");
                            setSelectedTopic(null);
                        }}
                        style={{position: "absolute", right: gapSize.sizeL}}
                        hitSlop={commonStyles.hitSlop}>
                        <AppText
                            text={"X"}
                            type={TextTypes.H6}
                            fontSize={20}
                            color={colors.grey500}
                        />
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    function handleSelectedImage(image: any, index: number) {
        const newImages = [...reportImages];
        newImages[index] = image;
        setReportImages(newImages);
    }

    async function ensureAnonymousLogin() {
        const currentUser = auth().currentUser;
        if (!currentUser) {
            await auth().signInAnonymously();
        }
        return auth().currentUser?.uid;
    }

    async function submitTicket() {
        setLoading(true);
        let imageURLs = [];
        if (reportImages.length > 0) {
            const fbUserId = await ensureAnonymousLogin();
            const promises = [];
            for (const image of reportImages) {
                promises.push(
                    uploadImageWithFirebase(
                        "SupportImages/" + fbUserId,
                        image?.path,
                        image?.filename,
                    ),
                );
            }
            imageURLs = await Promise.all(promises);
        }
        createTicket(imageURLs);
    }

    const isButtonDisabled = !selectedTopic || message.length < 30;

    return (
        <AppModal isVisible={isVisible} onClose={onClose}>
            <View
                style={{
                    backgroundColor: colors.black,
                    width: scaledValue(345),
                    height: scaledValue(522),
                    borderWidth: 1,
                    borderColor: colors.secondary500,
                    padding: gapSize.size2L,
                }}>
                <AppText
                    text={strings.support.createTicket}
                    type={TextTypes.H2}
                    color={colors.white}
                    style={{marginBottom: gapSize.sizeS}}
                    centered
                />
                {renderSelect()}
                {showDropdown && (
                    <FlatList
                        data={strings.support.topics.filter(topic =>
                            topic.name
                                .toLowerCase()
                                .includes(filterText.toLowerCase()),
                        )}
                        renderItem={_renderItem}
                        keyExtractor={(item, index) => `${item.id}-${index}`}
                        style={{
                            position: "absolute",
                            paddingHorizontal: gapSize.sizeL,
                            top: scaledValue(125),
                            zIndex: 1,
                            height: scaledValue(200),
                            width: scaledValue(320),
                            alignSelf: "center",
                            backgroundColor: "black",
                        }}
                        ItemSeparatorComponent={() => (
                            <Divider width={"100%"} />
                        )}
                    />
                )}
                <View
                    style={[
                        commonStyles.flexRow,
                        {
                            width: "100%",
                        },
                    ]}>
                    <AppText
                        text={strings.support.yourMessage}
                        type={TextTypes.Body}
                        color={colors.white}
                    />
                    <AppText text={"*"} color={colors.red} fontSize={25} />
                </View>
                <View
                    style={{
                        width: "100%",
                        height: scaledValue(145),
                        borderWidth: 1,
                        borderColor: colors.secondary500,
                        padding: gapSize.sizeL,
                    }}>
                    <TextInput
                        placeholder={strings.support.min30Characters}
                        placeholderTextColor={colors.grey500}
                        style={{
                            color: colors.white,
                            fontFamily: fonts.RalewayMedium,
                            fontSize: 14,
                            width: "100%",
                        }}
                        blurOnSubmit
                        returnKeyType={"done"}
                        multiline={true}
                        maxLength={1000}
                        onChangeText={text => setMessage(text)}
                    />
                </View>
                <AppText
                    text={strings.support.upTo3Files}
                    color={colors.grey500}
                    fontSize={10}
                    style={{marginVertical: gapSize.sizeM}}
                />
                <View style={commonStyles.flexRow}>
                    <AddImageBox
                        onImageSelected={image => handleSelectedImage(image, 0)}
                        imageToDisplay={reportImages[0]}
                    />
                    <AddImageBox
                        onImageSelected={image => handleSelectedImage(image, 1)}
                        imageToDisplay={reportImages[1]}
                        style={{marginLeft: gapSize.sizeM}}
                    />
                    <AddImageBox
                        onImageSelected={image => handleSelectedImage(image, 2)}
                        imageToDisplay={reportImages[2]}
                        style={{marginLeft: gapSize.sizeM}}
                    />
                </View>
                <View
                    style={[
                        commonStyles.flexRowSpaceEvenly,
                        {marginTop: gapSize.sizeL},
                    ]}>
                    <AppButton
                        text={strings.common.cancel}
                        type="redSmall"
                        onPress={onClose}
                        width={125}
                    />
                    <AppButton
                        text={strings.common.send}
                        width={125}
                        onPress={submitTicket}
                        loading={loading}
                        disabled={isButtonDisabled}
                    />
                </View>
            </View>
        </AppModal>
    );
};

export default CreateTicketModal;
