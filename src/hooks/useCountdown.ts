import { useEffect, useState, useRef } from 'react';

interface CountdownOptions {
    onComplete?: () => void;
    isPaused?: boolean;
}

const useCountdown = (initialSeconds: number, options: CountdownOptions = {}) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    const onCompleteRef = useRef(options.onComplete);

    useEffect(() => {
        onCompleteRef.current = options.onComplete;
    }, [options.onComplete]);

    useEffect(() => {
        if (options.isPaused || initialSeconds <= 0) {
            return;
        }

        const interval = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onCompleteRef.current?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [initialSeconds, options.isPaused]);

    useEffect(() => {
        setSeconds(initialSeconds);
    }, [initialSeconds]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        if (hours > 0) {
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
                remainingSeconds,
            ).padStart(2, '0')}`;
        } else {
            return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(
                2,
                '0',
            )}`;
        }
    };

    return {
        seconds,
        formatted: formatTime(seconds),
    };
};

export default useCountdown;
