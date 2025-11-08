import React, {useEffect, useState} from "react";
import {FlatList, ImageBackground, RefreshControl, View} from "react-native";

import {useIsFocused} from "@react-navigation/native";
import {RootState} from "@redux/index.ts";
import {useDispatch, useSelector} from "react-redux";

import {characterApis} from "@apis/index.ts";
import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {AppButton, AppImage, AppText} from "@components/index.ts";
import {Classes} from "@interfaces/GameInterface.ts";
import {authActions} from "@redux/actions/index.ts";
import {FirebaseParty} from "@screens/jobs/logic.ts";
import {getDarkBackground} from "@utils/helperFunctions.ts";
import {commonStyles, scaledValue, strings} from "@utils/index.ts";
import {navigate, SCREEN_NAMES} from "../../router.tsx";

const PartyJobsList = ({job}) => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(true);
    const [parties, setParties] = useState<FirebaseParty[]>([]);
    const [myParty, setMyParty] = useState<FirebaseParty | null>(null);

    const doIHaveParty = user.party_id || myParty;

    useEffect(() => {
        getMyParty(true);
    }, []);

    useEffect(() => {
        getParties();
        getMyParty();
    }, [isFocused]);

    function getParties() {
        setLoading(true);
        characterApis
            .getPartiesByJob(job.id)
            .then(res => {
                setParties(res.data.parties ?? []);
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            });
    }

    function getMyParty(shouldNavigate: boolean = false) {
        characterApis.getMyParty().then(res => {
            setMyParty(res.data.party);
            if (shouldNavigate && res.data.party) {
                navigate(SCREEN_NAMES.PARTY_DETAILS);
            }
        });
    }

    function refreshAllData() {
        getParties();
        getMyParty();
        dispatch(authActions.getUser());
    }

    function leaveAndRefresh() {
        characterApis
            .leaveParty()
            .then(res => {})
            .finally(() => {
                setTimeout(() => {
                    refreshAllData();
                }, 500);
            });
    }

    async function createPartyAndNavigate() {
        characterApis.createParty(job.id).then(res => {
            setTimeout(() => {
                navigate(SCREEN_NAMES.PARTY_DETAILS);
            });
        });
    }

    async function joinPartyAndNavigate(partyId: number) {
        characterApis.joinParty(partyId).then(res => {
            navigate(SCREEN_NAMES.PARTY_DETAILS);
        });
    }

    const _renderItem = ({item}) => (
        <PartyJobItem
            item={item}
            onJoin={() => joinPartyAndNavigate(item.id)}
            myPartyId={myParty?.id}
        />
    );

    return (
        <View style={{marginTop: gapSize.sizeM, width: "100%"}}>
            <AppImage
                source={
                    doIHaveParty ? images.icons.trash : images.icons.circlePlus
                }
                size={31}
                style={{
                    position: "absolute",
                    right: 0,
                    top: -45,
                    zIndex: 3,
                }}
                onPress={
                    doIHaveParty ? leaveAndRefresh : createPartyAndNavigate
                }
            />

            <FlatList
                refreshControl={
                    <RefreshControl
                        tintColor={colors.white}
                        refreshing={loading}
                        onRefresh={refreshAllData}
                    />
                }
                data={parties}
                renderItem={_renderItem}
                style={{height: "82%"}}
                ListEmptyComponent={() => (
                    <AppText
                        text={strings.jobs.noParty}
                        type={TextTypes.H4}
                        centered
                        style={{marginTop: "55%"}}
                    />
                )}
            />
        </View>
    );
};

export default PartyJobsList;

const PartyJobItem = ({
    item,
    onJoin,
    myPartyId,
}: {
    item: FirebaseParty;
    onJoin: () => void;
    myPartyId: string;
}) => {
    const isMyParty = item.id === myPartyId;
    const isFull = item.crew?.length >= item.required_crew;

    function renderJoinButton() {
        if (!isFull && !isMyParty) {
            return (
                <AppButton
                    onPress={onJoin}
                    text={strings.common.join}
                    height={42}
                    width={120}
                    fontSize={20}
                    style={{alignSelf: "flex-end", top: gapSize.sizeM}}
                />
            );
        }
        if (isMyParty) {
            return (
                <AppButton
                    onPress={onJoin}
                    text={strings.common.join}
                    height={42}
                    width={120}
                    fontSize={20}
                    style={{alignSelf: "flex-end", top: gapSize.sizeM}}
                />
            );
        }
        return <AppText text={strings.jobs.partyIsFull} />;
    }
    return (
        <ImageBackground
            source={images.jobs[Classes.PARTY][item.job_id]}
            style={{marginBottom: gapSize.sizeM}}>
            <View
                style={{
                    width: scaledValue(345),
                    height: scaledValue(95),
                    borderWidth: 1,
                    borderColor: colors.secondary500,
                    padding: scaledValue(8),
                }}>
                <View style={commonStyles.flexRowSpaceBetween}>
                    <View
                        style={{
                            padding: 4,
                            backgroundColor: getDarkBackground(8),
                        }}>
                        <AppText
                            text={item.name}
                            type={TextTypes.H5}
                            color={isMyParty ? colors.orange : colors.white}
                        />
                    </View>
                    <View style={{alignItems: "center"}}>
                        <AppText text={strings.jobs.crew} fontSize={8} />
                        <AppText
                            text={`${item.crew?.length ?? 0}/${
                                item.required_crew
                            }`}
                            type={TextTypes.BodyBold}
                        />
                    </View>
                </View>
                {renderJoinButton()}
            </View>
        </ImageBackground>
    );
};
