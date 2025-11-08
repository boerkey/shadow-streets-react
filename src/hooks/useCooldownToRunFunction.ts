import {useRef} from "react";

export default function useCooldownToRunFunction(ms = 2000) {
    const isCooldown = useRef(false);
    return (callback: () => void) => {
        if (isCooldown.current) return;
        isCooldown.current = true;
        callback();
        setTimeout(() => {
            isCooldown.current = false;
        }, ms);
    };
}
