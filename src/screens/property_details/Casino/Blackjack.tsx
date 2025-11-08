import React, {useState} from "react";
import {View} from "react-native";

import {useRoute} from "@react-navigation/native";
import {useDispatch} from "react-redux";

import {propertyCasinoApis} from "@apis/index.ts";
import {colors, gapSize, images} from "@assets/index.ts";
import {TextTypes} from "@components/AppText";
import {
    AppButton,
    AppImage,
    AppText,
    MiniHeader,
    Prompt,
    ScreenContainer,
} from "@components/index.ts";
import HeaderMoney from "@components/MiniHeader/HeaderMoney.tsx";
import {authActions} from "@redux/actions";
import {
    calculateHandTotal,
    getImageNumber,
    mapCardNumberToCard,
} from "@utils/casinoHelpers.ts";
import {formatNumberWithCommas} from "@utils/helperFunctions.ts";
import {
    commonStyles,
    scaledValue,
    SCREEN_HEIGHT,
    strings,
} from "@utils/index.ts";

export enum BlackjackAction {
    HIT = "hit",
    STAND = "stand",
    DOUBLE = "double",
}

export enum BetStatus {
    CONTINUE = "continue",
    LOSE = "lose",
    DEALER_BUST = "dealer_bust",
    WIN = "win",
    PUSH = "push", // DRAW
}

const Blackjack = () => {
    const dispatch = useDispatch();
    const {params} = useRoute();
    const [bet, setBet] = useState(
        {...params?.bet, status: BetStatus.CONTINUE} || {},
    );
    const [showBetPrompt, setShowBetPrompt] = useState(false);
    const property_id = params?.property_id;
    const minBetAmount = params?.minBetAmount;
    const maxBetAmount = params?.maxBetAmount;

    function startBlackjackBet(betAmount: number) {
        setShowBetPrompt(false);
        propertyCasinoApis
            .startBlackjackBet(property_id, betAmount)
            .then(res => {
                setBet(res.data);
            });
    }

    function doBlackjackAction(action: BlackjackAction) {
        propertyCasinoApis.doBlackjackAction(bet.bet_id, action).then(res => {
            updateBetAfterAction(res.data);
            dispatch(authActions.getUser());
        });
    }

    function updateBetAfterAction(values) {
        setBet({...bet, ...values});
    }

    function renderDealerCards() {
        return (
            <View
                style={{
                    height: SCREEN_HEIGHT * 0.3,
                    width: "40%",
                    top: 10,
                    left: -50,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <View style={commonStyles.flexRow}>
                    {[...Array(Math.max(2, bet.dealer_cards.length))].map(
                        (_, i) => {
                            const cardCount = Math.max(
                                2,
                                bet.dealer_cards.length,
                            );
                            const middleIndex = (cardCount - 1) / 2;

                            const rotateFactor = Math.max(2, 10 - cardCount); // rotation per card
                            const rotateDegree =
                                (i - middleIndex) * rotateFactor;

                            const maxSpacing = 50;
                            const minSpacing = 20;
                            const spacing = Math.max(
                                minSpacing,
                                maxSpacing - cardCount * 3,
                            );
                            const leftOffset = (i - middleIndex) * spacing;

                            const cardId = bet.dealer_cards[i];
                            const isHidden =
                                i === 1 && bet.dealer_cards.length === 1;

                            return (
                                <AppImage
                                    key={i}
                                    source={
                                        isHidden
                                            ? images.cards.backCard
                                            : images.cards[
                                                  getImageNumber(cardId)
                                              ]
                                    }
                                    size={140}
                                    style={{
                                        transform: [
                                            {rotate: `${rotateDegree}deg`},
                                        ],
                                        width: 100,
                                        position: "absolute",
                                        alignSelf: "center",
                                        left: leftOffset,
                                        zIndex: i,
                                    }}
                                />
                            );
                        },
                    )}
                </View>
            </View>
        );
    }

    function renderHandTotal() {
        let myCards = [];
        bet.player_cards.forEach((cardId: number) => {
            myCards.push(mapCardNumberToCard(cardId));
        });
        const myHandTotal = calculateHandTotal(myCards);
        return (
            <View
                style={{
                    backgroundColor: colors.black,
                    borderWidth: 1,
                    borderColor: colors.secondary500,
                    width: scaledValue(43),
                    height: scaledValue(32),
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 5,
                }}>
                <AppText text={myHandTotal} type={TextTypes.H3} />
            </View>
        );
    }

    function renderMyCards() {
        return (
            <View
                style={{
                    height: SCREEN_HEIGHT * 0.3,
                    width: "40%",
                    left: -50,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <View style={commonStyles.flexRow}>
                    {bet.player_cards.map((cardId, i) => {
                        const cardCount = bet.player_cards.length;
                        const middleIndex = (cardCount - 1) / 2;

                        const rotateFactor = Math.max(2, 10 - cardCount); // rotation per card
                        const rotateDegree = (i - middleIndex) * rotateFactor;

                        const maxSpacing = 50;
                        const minSpacing = 20;
                        const spacing = Math.max(
                            minSpacing,
                            maxSpacing - cardCount * 3,
                        );
                        const leftOffset = (i - middleIndex) * spacing;

                        return (
                            <AppImage
                                key={i}
                                source={images.cards[getImageNumber(cardId)]}
                                size={200}
                                style={{
                                    transform: [{rotate: `${rotateDegree}deg`}],
                                    width: 100,
                                    position: "absolute",
                                    alignSelf: "center",
                                    left: leftOffset,
                                    zIndex: i,
                                }}
                            />
                        );
                    })}
                </View>
            </View>
        );
    }

    function renderMyBet() {
        function getColor() {
            switch (bet.status) {
                case BetStatus.CONTINUE:
                case undefined:
                    return colors.white;
                case BetStatus.LOSE:
                    return colors.red;
                case BetStatus.WIN:
                case BetStatus.DEALER_BUST:
                    return colors.green;
            }
        }
        return (
            <View style={{alignItems: "center"}}>
                <AppText
                    text={
                        strings.propertyCasino.betTitles[
                            bet?.status ?? BetStatus.CONTINUE
                        ]
                    }
                    color={getColor()}
                    type={TextTypes.H2}
                />
                <HeaderMoney
                    width={90}
                    noBackgroundStyle
                    money={bet.bet_amount}
                    fontSize={20}
                />
            </View>
        );
    }

    function renderButtons() {
        if (bet?.status === BetStatus.CONTINUE || bet.status === undefined) {
            return (
                <View
                    style={[
                        commonStyles.flexRowSpaceBetween,
                        {width: "75%", top: gapSize.size2L},
                    ]}>
                    <AppButton
                        text={strings.propertyCasino.stand}
                        width={124}
                        onPress={() => doBlackjackAction(BlackjackAction.STAND)}
                    />
                    <AppButton
                        text={strings.propertyCasino.hit}
                        width={124}
                        onPress={() => doBlackjackAction(BlackjackAction.HIT)}
                    />
                </View>
            );
        }
        return (
            <View style={[{width: "75%", top: gapSize.size2L}]}>
                <AppButton
                    text={strings.propertyCasino.playAgain}
                    width={200}
                    style={{alignSelf: "center"}}
                    onPress={() => setShowBetPrompt(true)}
                />
            </View>
        );
    }

    function getMinMaxBetAmount() {
        let minMaxBets = strings.propertyCasino.minMaxRatesAre;
        minMaxBets = minMaxBets
            .replace("{min}", minBetAmount)
            .replace("{max}", formatNumberWithCommas(maxBetAmount));
        return minMaxBets;
    }

    return (
        <ScreenContainer source={images.backgrounds.blackjackTable}>
            <MiniHeader noBackgroundStyle />
            <View style={{padding: gapSize.sizeL, alignItems: "center"}}>
                {renderDealerCards()}
                {renderHandTotal()}
                {renderMyCards()}
                {renderMyBet()}
                {renderButtons()}
            </View>
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
        </ScreenContainer>
    );
};

export default Blackjack;
