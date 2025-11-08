import React, {useEffect, useRef, useState} from "react";
import {TouchableOpacity, View} from "react-native";

import {communicationApis} from "@apis/index";
import {colors, gapSize} from "@assets/index";
import {TextTypes} from "@components/AppText";
import {AppModal, AppText} from "@components/index.ts";
import {scaledValue, SCREEN_WIDTH, strings} from "@utils/index.ts";

interface BotCheckerModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const randomNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const defaultCountdown = 30;

const BotCheckerModal = ({
    isVisible,
    onClose,
    onSuccess,
}: BotCheckerModalProps) => {
    const [numbersToShow, setNumbersToShow] = useState<number[]>([]);
    const [safeNumber, setSafeNumber] = useState<number>(-1);
    const [countdown, setCountdown] = useState<number>(defaultCountdown);
    const countdownInterval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isVisible) {
            setCountdown(defaultCountdown);
            const shuffledNumbers = randomNumbers.sort(
                () => Math.random() - 0.5,
            );
            const numbersToShow = shuffledNumbers.slice(0, 3);
            const randomIndex = Math.floor(
                Math.random() * numbersToShow.length,
            );
            const safeNumber = numbersToShow[randomIndex];

            setNumbersToShow(numbersToShow);
            setSafeNumber(safeNumber);
            countdownInterval.current = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        }
        return () => {
            if (countdownInterval.current) {
                clearInterval(countdownInterval.current);
                countdownInterval.current = null;
            }
        };
    }, [isVisible]);

    useEffect(() => {
        if (countdown <= 0) {
            checkSafeNumber(-99);
        }
    }, [countdown]);

    function applyBotRestriction() {
        communicationApis.applyBotRestriction();
    }

    function checkSafeNumber(selectedNumber: number) {
        if (selectedNumber !== safeNumber) {
            applyBotRestriction();
        } else {
            if (countdownInterval.current) {
                clearInterval(countdownInterval.current);
                countdownInterval.current = null;
            }
            setTimeout(() => {
                onSuccess();
            }, 500);
        }
        onClose();
    }

    function renderNumbers() {
        return numbersToShow.map(number => (
            <TouchableOpacity
                onLongPress={() => checkSafeNumber(number)}
                style={{
                    width: scaledValue(50),
                    height: scaledValue(50),
                    backgroundColor: colors.grey900,
                    borderRadius: 4,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <AppText
                    text={number.toString()}
                    type={TextTypes.H1}
                    centered
                />
            </TouchableOpacity>
        ));
    }

    return (
        <AppModal isVisible={isVisible} onClose={() => ""}>
            <View
                style={{
                    padding: gapSize.sizeL,
                    height: scaledValue(250),
                    width: SCREEN_WIDTH * 0.8,
                    backgroundColor: colors.black,
                    borderColor: colors.red,
                    borderWidth: 1,
                }}>
                <AppText
                    text={strings.common.choose + " - "}
                    postText={safeNumber.toString()}
                    type={TextTypes.H2}
                    centered
                />
                <AppText
                    text={`Long press to choose`}
                    type={TextTypes.BodyBold}
                    color={colors.secondary500}
                    centered
                />
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                        marginTop: gapSize.size3L,
                        paddingHorizontal: gapSize.sizeL,
                    }}>
                    {renderNumbers()}
                </View>
                <AppText
                    text={`${countdown}s`}
                    type={TextTypes.H1}
                    color={colors.red}
                    centered
                    style={{top: gapSize.size4L}}
                />
            </View>
        </AppModal>
    );
};

export default BotCheckerModal;
