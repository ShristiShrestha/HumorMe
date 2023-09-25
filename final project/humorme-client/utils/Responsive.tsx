import Media from "react-media";
import React, { ReactNode } from "react";
import { MAX_TABLET_WIDTH, MAX_WEB_TABLET_WIDTH } from "./GlobalStylesUtils";

type Props = {
    children: ReactNode;
};
export function Desktop(props: Props) {
    return (
        <Media query="(min-width: 992px)" {...props}>
            {matches => (matches ? props.children : null)}
        </Media>
    );
}

export function Tablet(props: Props) {
    return (
        <Media query="(max-width: 992px) and (min-width: 600px)" {...props}>
            {matches => (matches ? props.children : null)}
        </Media>
    );
}

export function MD(props: Props) {
    return (
        <Media query="(min-width: 600px)" {...props}>
            {matches => (matches ? props.children : null)}
        </Media>
    );
}

export function Mobile(props: Props) {
    return (
        <Media query="(max-width: 599px)" {...props}>
            {matches => (matches ? props.children : null)}
        </Media>
    );
}

export function Min980(props: Props) {
    return (
        <Media query="(min-width: 980px)" {...props}>
            {matches => (matches ? props.children : null)}
        </Media>
    );
}

export function Max980(props: Props) {
    return (
        <Media query="(max-width: 980px)" {...props}>
            {matches => (matches ? props.children : null)}
        </Media>
    );
}

export function Max950(props: Props) {
    return (
        <Media query="(max-width: 950px)" {...props}>
            {matches => (matches ? props.children : null)}
        </Media>
    );
}

export function Min950(props: Props) {
    return (
        <Media query="(min-width: 950px)" {...props}>
            {matches => (matches ? props.children : null)}
        </Media>
    );
}

export function MD768(props: Props) {
    return (
        <Media query="(min-width: 768px)" {...props}>
            {matches => (matches ? props.children : null)}
        </Media>
    );
}

export function Max768(props: Props) {
    return (
        <Media query="(max-width: 768px)" {...props}>
            {matches => (matches ? props.children : null)}
        </Media>
    );
}

export function Min570(props: Props) {
    return (
        <Media query="(min-width: 570px)" {...props}>
            {matches => (matches ? props.children : null)}
        </Media>
    );
}

export function Min390(props: Props) {
    return (
        <Media query="(min-width: 390px)" {...props}>
            {matches => (matches ? props.children : null)}
        </Media>
    );
}

export function Min340(props: Props) {
    return (
        <Media query="(min-width: 340px)" {...props}>
            {matches => (matches ? props.children : null)}
        </Media>
    );
}

export function MinWebTablet(props: Props) {
    return (
        <Media query={`(min-width: ${MAX_WEB_TABLET_WIDTH}px)`} {...props}>
            {matches => (matches ? props.children : null)}
        </Media>
    );
}

export function MaxWebTablet(props: Props) {
    return (
        <Media query={`(max-width: ${MAX_WEB_TABLET_WIDTH}px)`} {...props}>
            {matches => (matches ? props.children : null)}
        </Media>
    );
}

export function MaxLandingMidWebTablet(props: Props) {
    return (
        // and (max-height: 850px)
        <Media
            query={`(max-width: ${MAX_WEB_TABLET_WIDTH}px) and (min-width: 475px)`}
            {...props}
        >
            {matches => (matches ? props.children : null)}
        </Media>
    );
}

export function MaxLandingWebTablet(props: Props) {
    return (
        // and (max-height: 850px)
        <Media query={`(max-width: 475px) `} {...props}>
            {matches => (matches ? props.children : null)}
        </Media>
    );
}

/* ============================================= */
/* Height based view port */
/* ============================================= */
export function HMaxWebTablet(props: Props) {
    return (
        <Media query={`(max-height: ${MAX_WEB_TABLET_WIDTH}px)`} {...props}>
            {matches => (matches ? props.children : null)}
        </Media>
    );
}

export function HMaxTablet(props: Props) {
    return (
        <Media query={`(max-height: ${MAX_TABLET_WIDTH}px)`} {...props}>
            {matches => (matches ? props.children : null)}
        </Media>
    );
}

export function HMinWebTablet(props: Props) {
    return (
        <Media query={`(min-height: ${MAX_WEB_TABLET_WIDTH}px)`} {...props}>
            {matches => (matches ? props.children : null)}
        </Media>
    );
}

export function HMinTablet(props: Props) {
    return (
        <Media query={`(min-height: ${MAX_TABLET_WIDTH}px)`} {...props}>
            {matches => (matches ? props.children : null)}
        </Media>
    );
}
