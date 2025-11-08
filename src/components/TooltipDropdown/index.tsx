import React, {ReactNode, useState} from "react";
import {TouchableOpacity} from "react-native";

import {TextTypes} from "@components/AppText";
import {Dropdown} from "@components/index.ts";
import Tooltip from "react-native-walkthrough-tooltip";

interface Props {
    children?: ReactNode | ReactNode[];
    options?: Array<any>;
    selectedIndex?: number;
    onSelect: (index: number, item: any) => void;
    paddingHorizontal?: number;
    onToolTipVisibilityChange?: (isVisible: boolean) => void;
    childContentSpacing?: number;
    placement?: "left" | "right" | "top" | "bottom";
    dropdownWidth?: number;
    textType?: TextTypes;
    hitSlop?: any;
    disabled?: boolean;
    maxHeight?: number;
}

const TooltipDropdown = ({
    children,
    options = [],
    selectedIndex = -1,
    onSelect,
    paddingHorizontal = 6,
    onToolTipVisibilityChange,
    childContentSpacing = 0,
    placement = "bottom",
    dropdownWidth,
    maxHeight = 250,
    textType,
    hitSlop,
    disabled = false,
}: Props) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <Tooltip
            onClose={() => {
                setShowTooltip(false);
                onToolTipVisibilityChange && onToolTipVisibilityChange(false);
            }}
            isVisible={showTooltip}
            showChildInTooltip={false}
            placement={placement}
            childContentSpacing={childContentSpacing}
            displayInsets={{top: 0, left: 0, right: 0, bottom: 0}}
            disableShadow
            contentStyle={{
                width: "auto",
                maxHeight: maxHeight,
                backgroundColor: "transparent",
            }}
            content={
                <Dropdown
                    options={options}
                    selectedIndex={selectedIndex}
                    onSelect={(index, item) => {
                        setShowTooltip(false);
                        onSelect(index, item);
                    }}
                    width={dropdownWidth}
                    textType={textType}
                />
            }>
            <TouchableOpacity
                hitSlop={hitSlop}
                disabled={options.length === 0 || disabled}
                onPress={() => {
                    setShowTooltip(true);
                    onToolTipVisibilityChange &&
                        onToolTipVisibilityChange(true);
                }}
                style={{paddingHorizontal, zIndex: 3}}>
                {children}
            </TouchableOpacity>
        </Tooltip>
    );
};
export default TooltipDropdown;
