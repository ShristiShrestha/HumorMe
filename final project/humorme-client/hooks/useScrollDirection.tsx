import { useEffect, useState } from "react";

export const NO_SCROLL = "NO_SCROLL";
export const SCROLL_UP = "up";
export const SCROLL_DOWN = "down";

const useScrollDirection = ({
    initialDirection = NO_SCROLL,
    thresholdPixels = 0,
    callback = scrollDir => {},
} = {}) => {
    const [scrollDir, setScrollDir] = useState(initialDirection);

    /* use effects */
    useEffect(() => {
        const threshold = thresholdPixels;
        let lastScrollY =
            window.pageYOffset || document.documentElement.scrollTop;
        let ticking = false;

        const updateScrollDir = () => {
            const scrollY =
                window.pageYOffset || document.documentElement.scrollTop;
            console.log("scrollY: " + scrollY + " last scroll: " + lastScrollY);

            if (Math.abs(scrollY - lastScrollY) < threshold) {
                // We haven't exceeded the threshold
                ticking = false;
                setScrollDir(NO_SCROLL);
                return;
            }

            setScrollDir(scrollY > lastScrollY ? SCROLL_DOWN : SCROLL_UP);
            lastScrollY = scrollY > 0 ? scrollY : 0;

            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateScrollDir);
                ticking = true;
            }
        };

        window.addEventListener("wheel", onScroll);

        return () => window.removeEventListener("wheel", onScroll);
    }, [initialDirection, thresholdPixels]);

    return scrollDir;
};

export default useScrollDirection;
