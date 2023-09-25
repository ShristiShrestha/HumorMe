// @flow
import * as React from "react";
import { CSSProperties, ReactNode } from "react";
// @ts-ignore
import CookieConsent from "react-cookie-consent";
import _ from "lodash";
import { webBlue, white } from "../utils/ShadesUtils";

type styleProps = {
    containerStyle?: CSSProperties;
    contentStyle?: CSSProperties;
};

/* type definition */
type Props = {
    cookieName: string;
    children: ReactNode;
    containerClass?: string;
    contentClass?: string;
    styles?: styleProps;
};

export default function MyCookieConsent(props: Props) {
    const { cookieName, children, containerClass, contentClass, styles } =
        props;
    const containerStyle = _.get(styles, "containerStyle");
    const contentStyle = _.get(styles, "contentStyle");

    return (
        <CookieConsent
            containerClasses={containerClass}
            contentClasses={contentClass}
            style={containerStyle}
            contentStyle={contentStyle}
            cookieName={cookieName}
            buttonStyle={{
                background: white,
                borderRadius: 32,
                marginRight: 16,
                padding: "8px 16px",
                color: webBlue,
            }}
        >
            {children}
        </CookieConsent>
    );
}
