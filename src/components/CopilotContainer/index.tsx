import React from "react";
import {View, ViewStyle} from "react-native";
import {CopilotStep, walkthroughable} from "react-native-copilot";

const CopilotView = walkthroughable(View);

interface CopilotContainerProps {
    children: React.ReactNode;
    uniqueId: string;
    text: string;
    orderNumber: number;
    containerStyle?: ViewStyle;
}

const CopilotContainer = ({
    children,
    uniqueId,
    text,
    orderNumber,
    containerStyle,
}: CopilotContainerProps) => {
    return (
        <CopilotStep order={orderNumber} text={text} name={uniqueId}>
            <CopilotView style={containerStyle}>{children}</CopilotView>
        </CopilotStep>
    );
};

export default CopilotContainer;
