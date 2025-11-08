import React, {useEffect, useRef} from "react";
import {Animated} from "react-native";

interface PulsingContainerProps {
    children: React.ReactNode;
    duration?: number;
    minOpacity?: number;
    maxOpacity?: number;
    style?: any;
    enabled?: boolean;
}

const PulsingContainer: React.FC<PulsingContainerProps> = ({
    children,
    duration = 1500,
    minOpacity = 0.4,
    maxOpacity = 1,
    style,
    enabled = true,
}) => {
    const opacityAnim = useRef(new Animated.Value(maxOpacity)).current;

    useEffect(() => {
        if (!enabled) {
            opacityAnim.setValue(maxOpacity);
            return;
        }

        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacityAnim, {
                    toValue: minOpacity,
                    duration: duration / 2,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: maxOpacity,
                    duration: duration / 2,
                    useNativeDriver: true,
                }),
            ]),
        );

        pulseAnimation.start();

        return () => {
            pulseAnimation.stop();
        };
    }, [opacityAnim, duration, minOpacity, maxOpacity, enabled]);

    return (
        <Animated.View style={[{opacity: opacityAnim}, style]}>
            {children}
        </Animated.View>
    );
};

export default PulsingContainer;
