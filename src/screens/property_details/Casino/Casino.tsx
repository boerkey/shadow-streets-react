import React, {useEffect, useState} from "react";
import {ActivityIndicator} from "react-native";

import {propertyCasinoApis} from "@apis/index.ts";
import {Prompt} from "@components/index.ts";
import {UserProperty} from "@interfaces/PropertyInterface.ts";
import {formatNumberWithCommas, showToast} from "@utils/helperFunctions.ts";
import {strings} from "@utils/index.ts";

import {navigate, SCREEN_NAMES} from "../../../router.tsx";
import StartPlaying from "./StartPlaying.tsx";

interface CasinoProps {
    property: UserProperty;
}

const Casino = ({property}: CasinoProps) => {
    const [minBetAmount, setMinBetAmount] = useState(0);
    const [maxBetAmount, setMaxBetAmount] = useState(0);
    const [showBetPrompt, setShowBetPrompt] = useState(false);

    useEffect(() => {
        getCasinoDetails();
    }, []);

    function getCasinoDetails() {
        propertyCasinoApis.getCasinoDetails(property.id).then(res => {
            const {min_bet_amount, max_bet_amount, active_bet} = res.data;
            setMinBetAmount(min_bet_amount);
            setMaxBetAmount(max_bet_amount);
            if (active_bet) {
                setActiveBetAndNavigate(active_bet);
            }
        });
    }

    function setActiveBetAndNavigate(bet) {
        navigate(SCREEN_NAMES.BLACKJACK, {
            bet,
            property_id: property.id,
            minBetAmount,
            maxBetAmount,
        });
    }

    function renderViews() {
        if (minBetAmount === 0) {
            return <ActivityIndicator />;
        }
        return <StartPlaying onStart={() => setShowBetPrompt(true)} />;
    }

    function getMinMaxBetAmount() {
        let minMaxBets = strings.propertyCasino.minMaxRatesAre;
        minMaxBets = minMaxBets
            .replace("{min}", minBetAmount)
            .replace("{max}", formatNumberWithCommas(maxBetAmount));
        return minMaxBets;
    }

    function startBlackjackBet(betAmount: number) {
        setShowBetPrompt(false);
        if (betAmount > minBetAmount && betAmount <= maxBetAmount) {
            propertyCasinoApis
                .startBlackjackBet(property.id, betAmount)
                .then(res => {
                    setActiveBetAndNavigate(res.data);
                });
        } else {
            showToast(
                strings.propertyCasino.pleaseChooseCorrectBetAmount,
                "",
                "warning",
            );
        }
    }

    return (
        <>
            <Prompt
                isVisible={showBetPrompt}
                onConfirm={startBlackjackBet}
                onClose={() => setShowBetPrompt(false)}
                title={strings.propertyCasino.placeYourBet}
                text={getMinMaxBetAmount()}
                placeholder={"$"}
                inputValidation={"number-only"}
                maxLength={7}
                formatNumber
            />
            {renderViews()}
        </>
    );
};

export default Casino;
