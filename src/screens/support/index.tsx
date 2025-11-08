import React from "react";

import {InnerContainer, ScreenContainer} from "@components/index";
import {TitleHeader} from "@components/index.ts";
import {strings} from "@utils/index.ts";

import SupportContainer from "./SupportContainer";

const Support = () => {
    return (
        <ScreenContainer>
            <InnerContainer style={{flex: 1}}>
                <TitleHeader title={strings.drawer.support} />
                <SupportContainer />
            </InnerContainer>
        </ScreenContainer>
    );
};

export default Support;
