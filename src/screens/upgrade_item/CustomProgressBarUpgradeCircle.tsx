// src/screens/upgrade_item/CustomProgressBarUpgradeCircle.tsx
import {colors} from "@assets/index";
import React, {useEffect, useRef} from "react";
import {Animated, Easing, StyleSheet, View} from "react-native";
import Svg, {Circle, G} from "react-native-svg";

// Keep animation config separate
const ANIMATION_CONFIG = {
    DURATION: {
        STANDARD: 500,
        UPGRADING: 6000,
        SUCCESS_COMPLETE: 1800,
        COLOR_TRANSITION: 1250,
        RESULT_DISPLAY: 1500, // Shorter display for custom version?
    },
    PROGRESS_VALUES: {
        IDLE: 0,
        UPGRADING_END: 0.8,
        SUCCESS: 1,
        FAILURE: 1, // Failure also fills to 1
    },
    EASING: {
        LINEAR: Easing.linear,
        IN_OUT: Easing.inOut(Easing.ease),
        OUT: Easing.out(Easing.ease),
    },
    COLORS: {
        UPGRADING_START: colors.red,
        UPGRADING_MID: colors.orange,
        UPGRADING_END: colors.green,
        SUCCESS: colors.green,
        FAILURE: colors.red,
        IDLE: colors.orange, // Default color when idle
    },
};

// Define the possible states for the upgrade (can be imported if defined elsewhere)
export type UpgradeStatus = "idle" | "upgrading" | "success" | "failure";

// Create Animated component for SVG Circle
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    childrenContainer: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
    },
});

interface CustomProgressBarUpgradeCircleProps {
    size?: number;
    strokeWidth?: number;
    unfilledColor?: string;
    children?: React.ReactNode;
    // Props related to upgrade flow
    triggerUpgrade?: boolean;
    upgradeResult?: boolean | null;
    onUpgradeFinished?: () => void;
}

const CustomProgressBarUpgradeCircle: React.FC<
    CustomProgressBarUpgradeCircleProps
> = ({
    size = 100,
    strokeWidth = 5,
    unfilledColor = colors.secondaryTwo500,
    children,
    triggerUpgrade = false,
    upgradeResult = null,
    onUpgradeFinished,
}) => {
    // Internal state management
    const [status, setStatus] = React.useState<UpgradeStatus>("idle");
    const prevStatus = useRef<UpgradeStatus>(status);

    // Animated values
    const progressAnim = useRef(new Animated.Value(0)).current; // Value from 0 to 1
    const colorAnim = useRef(new Animated.Value(0)).current; // For color transitions

    // Refs for animations
    const progressAnimationRef = useRef<Animated.CompositeAnimation | null>(
        null,
    );
    const colorAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
    const resultTimerRef = useRef<NodeJS.Timeout | null>(null); // New: Ref for result display timer

    // SVG Calculations (memoize if props change often, but likely stable)
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const cx = size / 2;
    const cy = size / 2;

    // Interpolate progress (0-1) to strokeDashoffset (circumference-0)
    const strokeDashoffset = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [circumference, 0],
        extrapolate: "clamp", // Ensure value stays within range
    });

    // Interpolate colorAnim (0-1) to actual color string
    const animatedColor = colorAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [
            ANIMATION_CONFIG.COLORS.UPGRADING_START,
            ANIMATION_CONFIG.COLORS.UPGRADING_MID,
            ANIMATION_CONFIG.COLORS.UPGRADING_END,
        ],
        extrapolate: "clamp",
    });

    // Determine current stroke color based on status
    const getStrokeColor = () => {
        switch (status) {
            case "upgrading":
                return animatedColor; // Use the animated value
            case "success":
                return ANIMATION_CONFIG.COLORS.SUCCESS;
            case "failure":
                return ANIMATION_CONFIG.COLORS.FAILURE;
            case "idle":
            default:
                return ANIMATION_CONFIG.COLORS.IDLE;
        }
    };

    const strokeColor = getStrokeColor();

    // --- Animation Logic ---

    // Effect to handle trigger start
    useEffect(() => {
        if (triggerUpgrade && status === "idle") {
            setStatus("upgrading");
        }
        // If trigger is removed while success/failure is showing, go back to idle
        // Note: Reset logic primarily handled by onUpgradeFinished -> parent toggling trigger
        else if (
            !triggerUpgrade &&
            (status === "success" || status === "failure")
        ) {
            setStatus("idle");
        }
    }, [triggerUpgrade, status]);

    // Effect to handle result reception
    useEffect(() => {
        if (upgradeResult !== null && status === "upgrading") {
            setStatus(upgradeResult ? "success" : "failure");
        }
    }, [upgradeResult, status]);

    // Main effect to run animations based on status
    useEffect(() => {
        // Stop previous animations
        if (progressAnimationRef.current) {
            progressAnimationRef.current.stop();
        }
        if (colorAnimationRef.current) {
            colorAnimationRef.current.stop();
        }

        // Handle transitions TO idle state
        if (status === "idle") {
            if (
                prevStatus.current === "success" ||
                prevStatus.current === "failure"
            ) {
                // INSTANT reset after success/failure
                progressAnim.setValue(ANIMATION_CONFIG.PROGRESS_VALUES.IDLE);
                colorAnim.setValue(0); // Reset color interp
            } else if (prevStatus.current === "upgrading") {
                // Animate smoothly back to idle if cancelled mid-upgrade
                progressAnimationRef.current = Animated.timing(progressAnim, {
                    toValue: ANIMATION_CONFIG.PROGRESS_VALUES.IDLE,
                    duration: ANIMATION_CONFIG.DURATION.STANDARD,
                    easing: ANIMATION_CONFIG.EASING.OUT,
                    useNativeDriver: false, // MUST be false if color is also JS driven
                });
                progressAnimationRef.current.start();
                // Reset color immediately
                colorAnim.setValue(0);
            } else {
                // Initial state or already idle
                progressAnim.setValue(ANIMATION_CONFIG.PROGRESS_VALUES.IDLE);
                colorAnim.setValue(0);
            }

            prevStatus.current = status;
            return;
        }

        // --- Handle transitions TO other states ---

        if (status === "upgrading") {
            // Start progress animation from current value to UPGRADING_END
            progressAnimationRef.current = Animated.timing(progressAnim, {
                toValue: ANIMATION_CONFIG.PROGRESS_VALUES.UPGRADING_END,
                duration: ANIMATION_CONFIG.DURATION.UPGRADING,
                easing: ANIMATION_CONFIG.EASING.IN_OUT,
                useNativeDriver: false, // MUST be false if color is also JS driven
            });

            // Start color animation (red -> orange -> green)
            colorAnim.setValue(0); // Ensure start color
            colorAnimationRef.current = Animated.timing(colorAnim, {
                toValue: 1,
                duration: ANIMATION_CONFIG.DURATION.UPGRADING, // Match progress duration
                easing: ANIMATION_CONFIG.EASING.LINEAR,
                useNativeDriver: false, // Color interpolation needs JS thread
            });

            progressAnimationRef.current.start();
            colorAnimationRef.current.start();
        } else if (status === "success" || status === "failure") {
            // Animate progress to full
            progressAnimationRef.current = Animated.timing(progressAnim, {
                toValue: ANIMATION_CONFIG.PROGRESS_VALUES.SUCCESS, // 1
                duration: ANIMATION_CONFIG.DURATION.SUCCESS_COMPLETE,
                easing: ANIMATION_CONFIG.EASING.OUT,
                useNativeDriver: false, // MUST be false to avoid conflict
            });

            // Color is set instantly by getStrokeColor, no color animation needed here
            // but ensure colorAnim doesn't interfere if it was running
            if (colorAnimationRef.current) {
                colorAnimationRef.current.stop();
            }
            // Set colorAnim to a neutral state if needed, though not strictly necessary here
            // colorAnim.setValue(status === 'success' ? 1 : 0);

            progressAnimationRef.current.start(({finished}) => {
                // Wait for display duration *only if animation finished successfully*
                if (finished) {
                    // Clear any potentially existing timer before setting a new one
                    if (resultTimerRef.current) {
                        clearTimeout(resultTimerRef.current);
                    }
                    resultTimerRef.current = setTimeout(() => {
                        if (onUpgradeFinished) {
                            onUpgradeFinished();
                        }
                        resultTimerRef.current = null; // Clear ref after execution
                    }, ANIMATION_CONFIG.DURATION.RESULT_DISPLAY);
                }
            });
        }

        prevStatus.current = status;
    }, [status, progressAnim, colorAnim, onUpgradeFinished]);

    // Effect for unmount cleanup
    useEffect(() => {
        return () => {
            // Clear timer on unmount
            if (resultTimerRef.current) {
                clearTimeout(resultTimerRef.current);
                resultTimerRef.current = null;
            }
            // Stop any running animations (safety net)
            if (progressAnimationRef.current)
                progressAnimationRef.current.stop();
            if (colorAnimationRef.current) colorAnimationRef.current.stop();
        };
    }, []); // Empty array ensures this runs only on mount and unmount

    return (
        <View style={[styles.container, {width: size, height: size}]}>
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <G rotation="-90" origin={`${cx}, ${cy}`}>
                    {/* Background Circle */}
                    <Circle
                        cx={cx}
                        cy={cy}
                        r={radius}
                        stroke={unfilledColor}
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    {/* Progress Circle */}
                    <AnimatedCircle
                        cx={cx}
                        cy={cy}
                        r={radius}
                        stroke={strokeColor} // Use dynamic color
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset} // Use animated offset
                        strokeLinecap="round"
                    />
                </G>
            </Svg>
            {/* Children Content */}
            <View
                style={[styles.childrenContainer, {width: size, height: size}]}>
                {children}
            </View>
        </View>
    );
};

export default CustomProgressBarUpgradeCircle;
