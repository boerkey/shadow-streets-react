import React, {useEffect} from "react";
import {View} from "react-native";

import {useDispatch, useSelector} from "react-redux";

import {gangApis} from "@apis/index";
import UpgradeTree from "@components/UpgradeTree";
import {GangUpgrade} from "@interfaces/GangInterface";
import {gameActions} from "@redux/actions";
import {RootState} from "@redux/index";
import {showToast} from "@utils/helperFunctions";
import {SCREEN_HEIGHT} from "@utils/index.ts";

const GangUpgrades = ({
    upgrades,
    onUpgradeComplete,
}: {
    upgrades: GangUpgrade[];
    onUpgradeComplete: () => void;
}) => {
    const dispatch = useDispatch();
    const gameGangUpgrades = useSelector(
        (state: RootState) => state.game.gameGangUpgrades,
    );

    useEffect(() => {
        if (gameGangUpgrades.length === 0) {
            dispatch(gameActions.getGameGangUpgrades());
        }
    }, []);

    function upgradeGang(upgrade_id: number) {
        gangApis.upgradeGang(upgrade_id).then(res => {
            showToast(res.data.message);
            onUpgradeComplete();
        });
    }

    return (
        <View style={{height: SCREEN_HEIGHT * 0.75}}>
            <UpgradeTree
                filterType={-1}
                upgradeTree={gameGangUpgrades}
                availableUpgrades={upgrades}
                onUpgrade={upgradeGang}
                upgradeType="Gang"
            />
        </View>
    );
};

export default GangUpgrades;
