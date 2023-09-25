// @flow
import * as React from "react";
import styled from "styled-components";
import MyCookieConsent from "./MyCookieConsent";
import { webBlue } from "../utils/ShadesUtils";

/* styled components */
const Wrapper = styled.div.attrs({})`
    text {
        color: white;
        display: block;
        text-decoration: none;
    }

    a {
        text-decoration: none;
    }

    text:first-of-type {
        margin-bottom: 12px;
    }

    .CookieConsent {
        align-items: center !important;
        background: ${webBlue} !important;
    }

    text:hover,
    a:hover {
        text-decoration: underline;
    }
`;

/* props  definition */
const consentProps = {
    cookieName: "",
    contentStyle: {
        flex: "none !important",
    },
};

export default function MyFooterConsent() {
    return (
        <Wrapper>
            <MyCookieConsent {...consentProps}>
                <Wrapper></Wrapper>
            </MyCookieConsent>
        </Wrapper>
    );
}
