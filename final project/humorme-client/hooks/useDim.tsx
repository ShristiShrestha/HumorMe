import { useEffect, useState } from "react";
import {
    MAX_MOBILE_WIDTH,
    MAX_WEB_TABLET_WIDTH,
} from "../utils/GlobalStylesUtils";

export default function useDim(onWidthChange) {
    const [dim, setDim] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setDim({ width: window.innerWidth, height: window.innerHeight });

        const updateWindowDimensions = () => {
            const deltaWidth = window.innerWidth - dim.width;
            const deltaHeight = window.innerHeight - dim.height;
            onWidthChange && onWidthChange(deltaWidth, deltaHeight);
            setDim({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener("resize", updateWindowDimensions);
        return () =>
            window.removeEventListener("resize", updateWindowDimensions);
    }, []);
    return {
        height: dim.height,
        width: dim.width,
        isWebTabletWidth: dim.width <= MAX_WEB_TABLET_WIDTH,
        isMobileWidth: dim.width <= MAX_MOBILE_WIDTH,
    };
}
