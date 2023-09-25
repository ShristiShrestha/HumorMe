import styled from "styled-components";
import { grey4 } from "./ShadesUtils";
import * as React from "react";
import { CSSProperties } from "react";

export const MAX_WEB_TABLET_WIDTH = 1080;
export const MAX_WEB_TABLET_HEIGHT = 1920;

export const MAX_TABLET_WIDTH = 768;

export const MAX_MOBILE_WIDTH = 480;

export const MAX_SCREEN_WIDTH = 350;

/* ============================================= */
/* type definition */
/* ============================================= */
export const CssPositionTypes =
    "absolute" ||
    "inherit" ||
    "-moz-initial" ||
    "initial" ||
    "revert" ||
    "unset" ||
    "-webkit-sticky" ||
    "fixed" ||
    "relative" ||
    "static" ||
    "sticky" ||
    undefined;

export const ConstraintWrapper1400 = styled.div`
    width: 1480px;
    margin: 0 auto;

    @media (max-width: 1480px) {
        width: 85%;
    }
`;

export const ConstraintWrapper1080 = styled.div`
    width: ${MAX_WEB_TABLET_WIDTH}px;
    margin: 0 auto;

    @media (max-width: ${MAX_WEB_TABLET_WIDTH}px) {
        width: 85%;
    }
`;

/* ============================================= */
/* box shadows */
/* ============================================= */
export const jellyInnerShadow = `rgba(4, 4, 5, 0.05) 0px 5px 12px`;
export const inverseJellyInnerShadow = `rgba(4, 4, 5, 0.05) 0px -5px 12px`;
export const outerShadow = `0 0 6px ${grey4}`;

export const outerShadowClass = "outer-shadow";

/* ============================================= */
/* transitions */
/* ============================================= */
export const periSlowTransitionClass = `peri-slow-transition`;

/* gradient */
export const kappaGradientClass = `kappa-gradient`;

/* background */
export const smokeBgClass = "bg-whitesmoke";

/* animation */
export const animateLiftUpClass = "lift-up-animation";
export const animateZoomInClass = "zoom-in-animation";

export const customMidSpacer = (width = "100px", height = "0px") => (
    <div style={{ width: width, height: height }} />
);

/* ============================================= */
/* Center snapped full view div wrapper */
/* ============================================= */
export const MyCenterSnappedFullView = styled.div<{ position?: string }>`
    position: ${props => props.position ?? "relative"};
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;

    @media (max-width: ${MAX_WEB_TABLET_WIDTH}px) {
        margin: 0 !important;
        max-width: 100% !important;
        height: 100vh !important;
        scroll-snap-align: center;
    }
`;

/* ============================================= */
/* Svg wrapper */
/* ============================================= */
export const MyHorizontalCenteredSvg = styled.div<{
    img: string;
    width: string;
    height: string;
    top?: string;
    bottom?: string;
    transform?: string;
}>`
    position: absolute;
    top: ${props => props.top};
    bottom: ${props => props.bottom};
    height: ${props => props.height};
    width: ${props => props.width};
    transform: ${props => props.transform};
    background-image: url("${props => props.img}");
    background-size: cover;
`;

export const fullViewRelativeStyle: CSSProperties = {
    position: "relative",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: "100vh",
};

export const fullViewAbsoluteStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: "100vh",
};

export const fullHeightRelativeStyle: CSSProperties = {
    position: "relative",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
};

export const fullHeightAbsoluteStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
};
