import {useEffect, useState} from "react";
import {FlatList, View} from "react-native";

import {gameApis} from "@apis/index";
import {gapSize} from "@assets/index";
import {ScreenContainer, TitleHeader} from "@components/index";

import {strings} from "@utils/index";
import AnnouncementItem from "./AnnouncementItem";

export interface Announcement {
    id: number;
    title: string;
    description: string;
    view_amount: number;
    vote: number;
}

const Announcements = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    useEffect(() => {
        getAnnouncements();
    }, []);

    function getAnnouncements() {
        gameApis.getGameAnnouncements().then(res => {
            setAnnouncements(res.data.announcements);
        });
    }

    const _renderItem = ({item}: {item: Announcement}) => {
        return <AnnouncementItem item={item} onRefresh={getAnnouncements} />;
    };

    return (
        <ScreenContainer>
            <View style={{padding: gapSize.sizeL}}>
                <TitleHeader title={strings.drawer.announcements} />
                <FlatList
                    data={announcements}
                    renderItem={_renderItem}
                    ListFooterComponent={() => <View style={{height: 150}} />}
                />
            </View>
        </ScreenContainer>
    );
};

export default Announcements;
