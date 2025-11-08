import React, {useState} from "react";

import {gapSize} from "@assets/index";
import {
    InnerContainer,
    ScreenContainer,
    TabSelector,
    TitleHeader,
} from "@components/index";
import SupportContainer from "@screens/support/SupportContainer";
import {strings} from "@utils/index.ts";

import Reports from "./Reports";

const ModerationPanel = () => {
    const [tab, setTab] = useState<number>(0);

    function renderTabs() {
        switch (tab) {
            case 0:
                return <SupportContainer />;
            case 1:
                return <Reports />;
        }
    }

    return (
        <ScreenContainer>
            <InnerContainer style={{flex: 1}}>
                <TitleHeader title={strings.moderationPanel.title} />
                <TabSelector
                    items={["Tickets", "Reports"]}
                    selectedIndex={tab}
                    onSelect={setTab}
                    style={{alignSelf: "center", marginVertical: gapSize.sizeM}}
                />
                {renderTabs()}
            </InnerContainer>
        </ScreenContainer>
    );
};

export default ModerationPanel;
