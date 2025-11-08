import React, {useEffect} from "react";
import {View} from "react-native";
import {useDispatch, useSelector} from "react-redux";

import {propertyApis} from "@apis/index.ts";
import {UpgradeTree} from "@components/index.ts";
import {UserProperty} from "@interfaces/PropertyInterface.ts";
import {authActions, gameActions} from "@redux/actions";
import {RootState} from "@redux/index.ts";
import styles from "@screens/property_details/styles.ts";
import {showToast} from "@utils/helperFunctions.ts";

interface UpgradesProps {
    property: UserProperty;
    getPropertyDetails: () => void;
}

const Upgrades = ({property, getPropertyDetails}: UpgradesProps) => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const gamePropertyUpgrades = useSelector(
        (state: RootState) => state.game.gamePropertyUpgrades,
    );
    const canUpgrade = property.user_id === user?.id;

    useEffect(() => {
        if (property.upgrades.length === 0) {
            dispatch(gameActions.getGamePropertyUpgrades());
        }
    }, []);

    function makeUpgrade(upgradeId: number) {
        propertyApis.makeUpgrade(property.id, upgradeId).then(res => {
            showToast(res.data.message);
            dispatch(authActions.getUser());
            getPropertyDetails();
        });
    }

    return (
        <View style={styles.noBackgroundSectionContainer}>
            <UpgradeTree
                availableUpgrades={property.upgrades}
                upgradeTree={gamePropertyUpgrades}
                filterType={property.type}
                onUpgrade={makeUpgrade}
                canUpgrade={canUpgrade}
            />
        </View>
    );
};

export default Upgrades;
