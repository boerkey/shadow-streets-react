import React, {useEffect, useState} from "react";
import {ScrollView, View} from "react-native";

import {cosmeticApis} from "@apis/index";
import {gapSize} from "@assets/index.ts";
import {
    InnerContainer,
    ScreenContainer,
    TabSelector,
    TitleHeader,
} from "@components/index.ts";
import {showToast} from "@utils/helperFunctions";
import strings from "@utils/strings";
import FrameItem from "./FrameItem";

enum CosmeticType {
    AvatarFrame = 1,
}

interface AvatarFrame {
    id: number;
    name: string;
    description: string;
    price: number;
    type: CosmeticType.AvatarFrame;
}

interface UserCosmetic {
    id: number;
    cosmetic_id: number;
    type: CosmeticType;
    status: number;
}

const Cosmetics = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [avatarFrames, setAvatarFrames] = useState<AvatarFrame[]>([]);
    const [myCosmetics, setMyCosmetics] = useState<UserCosmetic[]>([]);

    useEffect(() => {
        getCosmetics();
    }, []);

    function getCosmetics() {
        cosmeticApis.getCosmeticsList().then(res => {
            setAvatarFrames(res.data.avatar_frames);
            setMyCosmetics(res.data.my_cosmetics);
        });
    }

    function buyCosmetic(cosmeticId: number, type: CosmeticType) {
        cosmeticApis.buyCosmetic(cosmeticId, type).then(res => {
            showToast(res.data.message);
            getCosmetics();
        });
    }

    function activateAvatarFrame(avatarFrameId: number) {
        cosmeticApis.activateAvatarFrame(avatarFrameId).then(res => {
            showToast(res.data.message);
            getCosmetics();
        });
    }

    function renderMyCosmetics() {
        return myCosmetics.map(myCosmetic => {
            if (myCosmetic.type === CosmeticType.AvatarFrame) {
                const frameData = avatarFrames.find(
                    frame => frame.id === myCosmetic.cosmetic_id,
                );
                if (frameData) {
                    return (
                        <FrameItem
                            key={frameData.id}
                            frame={frameData}
                            onPress={() =>
                                activateAvatarFrame(myCosmetic.cosmetic_id)
                            }
                            isMyFrame={true}
                            isActive={myCosmetic.status === 1}
                        />
                    );
                }
            }
        });
    }

    return (
        <ScreenContainer>
            <InnerContainer>
                <TitleHeader title={strings.cosmetics.title} />
                <View style={[{marginTop: gapSize.sizeM}]}>
                    <TabSelector
                        selectedIndex={selectedTab}
                        items={strings.cosmetics.tabs}
                        onSelect={setSelectedTab}
                        style={{alignSelf: "center"}}
                    />
                    <ScrollView style={{height: "90%"}}>
                        {selectedTab === 0 &&
                            avatarFrames.map(frame => {
                                const doIHaveThisFrame = myCosmetics.find(
                                    cosmetic =>
                                        cosmetic.cosmetic_id === frame.id,
                                );
                                if (!doIHaveThisFrame) {
                                    return (
                                        <FrameItem
                                            key={frame.id}
                                            frame={frame}
                                            onPress={() =>
                                                buyCosmetic(
                                                    frame.id,
                                                    CosmeticType.AvatarFrame,
                                                )
                                            }
                                        />
                                    );
                                }
                            })}
                        {selectedTab === 1 && renderMyCosmetics()}
                    </ScrollView>
                </View>
            </InnerContainer>
        </ScreenContainer>
    );
};

export default Cosmetics;
