import styled from "styled-components";
import React from "react";
import {
    MAX_MOBILE_WIDTH,
    MAX_SCREEN_WIDTH,
    MAX_TABLET_WIDTH,
    MAX_WEB_TABLET_WIDTH,
} from "./GlobalStylesUtils";

// Text fluidity https://css-tricks.com/snippets/css/fluid-typography/
// font-size: calc([minimum size] +
//      ([maximum size] - [minimum size]) *
//          ((100vw - [minimum viewport width]) / ([maximum viewport width] - [minimum viewport width])));

export const ResponsiveText = styled.span<{
    screenMin: number;
    screenDiff: number;
    mobileMin: number;
    mobileDiff: number;
    tabMin: number;
    tabDiff: number;
    webTabMin: number;
    webTabDiff: number;
}>`
    @media (max-width: ${MAX_SCREEN_WIDTH}px) {
        .${props => props.className} {
            font-size: calc(
                ${props => props.screenMin}px + ${props => props.screenDiff} *
                    ((100vw) / (${MAX_SCREEN_WIDTH}))
            );
        }
    }

    @media (max-width: ${MAX_MOBILE_WIDTH}px) and (min-width: ${MAX_SCREEN_WIDTH}px) {
        .${props => props.className} {
            font-size: calc(
                // min  + (max - min) * ((100vw - min_view_width) / (max_view_width - min_view_width))
                ${props => props.mobileMin}px + ${props => props.mobileDiff} *
                    (
                        (100vw - ${MAX_SCREEN_WIDTH}px) /
                            (${MAX_MOBILE_WIDTH} - ${MAX_SCREEN_WIDTH})
                    )
            );
        }
    }

    @media (max-width: ${MAX_TABLET_WIDTH}px) and (min-width: ${MAX_MOBILE_WIDTH}px) {
        .${props => props.className} {
            font-size: calc(
                ${props => props.tabMin}px + ${props => props.tabDiff} *
                    (
                        (100vw - ${MAX_MOBILE_WIDTH}px) /
                            (${MAX_TABLET_WIDTH} - ${MAX_MOBILE_WIDTH})
                    )
            );
        }
    }

    @media (max-width: ${MAX_WEB_TABLET_WIDTH}px) and (min-width: ${MAX_TABLET_WIDTH}px) {
        .${props => props.className} {
            font-size: calc(
                ${props => props.webTabMin}px + ${props => props.webTabDiff} *
                    (
                        (100vw - ${MAX_TABLET_WIDTH}px) /
                            (${MAX_WEB_TABLET_WIDTH} - ${MAX_TABLET_WIDTH})
                    )
            );
        }
    }
`;

export const responsiveTextStyles = {
    h1: {
        screenMin: 32,
        screenDiff: 32,
        mobileMin: 64,
        mobileDiff: 32,
        tabMin: 96,
        tabDiff: 12,
        webTabMin: 124,
        webTabDiff: 20,
    },
    h2: {
        screenMin: 32,
        screenDiff: 16,
        mobileMin: 56,
        mobileDiff: 16,
        tabMin: 78,
        tabDiff: 12,
        webTabMin: 108,
        webTabDiff: 20,
    },
    h3: {
        screenMin: 36,
        screenDiff: 12,
        mobileMin: 48,
        mobileDiff: 16,
        tabMin: 56,
        tabDiff: 16,
        webTabMin: 64,
        webTabDiff: 20,
    },
    h4: {
        screenMin: 24,
        screenDiff: 12,
        mobileMin: 28,
        mobileDiff: 16,
        tabMin: 32,
        tabDiff: 16,
        webTabMin: 38,
        webTabDiff: 20,
    },
    h5: {
        screenMin: 26,
        screenDiff: 12,
        mobileMin: 24,
        mobileDiff: 8,
        tabMin: 28,
        tabDiff: 8,
        webTabMin: 32,
        webTabDiff: 12,
    },
    h6: {
        screenMin: 22,
        screenDiff: 10,
        mobileMin: 24,
        mobileDiff: 6,
        tabMin: 26,
        tabDiff: 6,
        webTabMin: 28,
        webTabDiff: 10,
    },
    text24: {
        screenMin: 19,
        screenDiff: 4,
        mobileMin: 20,
        mobileDiff: 3,
        tabMin: 21,
        tabDiff: 3,
        webTabMin: 22,
        webTabDiff: 4,
    },

    text20: {
        screenMin: 15,
        screenDiff: 4,
        mobileMin: 16,
        mobileDiff: 3,
        tabMin: 17,
        tabDiff: 3,
        webTabMin: 18,
        webTabDiff: 4,
    },

    text18: {
        screenMin: 13,
        screenDiff: 4,
        mobileMin: 14,
        mobileDiff: 3,
        tabMin: 15,
        tabDiff: 3,
        webTabMin: 16,
        webTabDiff: 4,
    },

    text16: {
        screenMin: 12,
        screenDiff: 4,
        mobileMin: 13,
        mobileDiff: 3,
        tabMin: 14,
        tabDiff: 3,
        webTabMin: 15,
        webTabDiff: 4,
    },

    text14: {
        screenMin: 10,
        screenDiff: 4,
        mobileMin: 11,
        mobileDiff: 3,
        tabMin: 12,
        tabDiff: 3,
        webTabMin: 13,
        webTabDiff: 4,
    },

    text12: {
        screenMin: 8,
        screenDiff: 2,
        mobileMin: 9,
        mobileDiff: 3,
        tabMin: 10,
        tabDiff: 3,
        webTabMin: 11,
        webTabDiff: 4,
    },

    text10: {
        screenMin: 6,
        screenDiff: 2,
        mobileMin: 7,
        mobileDiff: 3,
        tabMin: 8,
        tabDiff: 3,
        webTabMin: 9,
        webTabDiff: 4,
    },

    text8: {
        screenMin: 5,
        screenDiff: 2,
        mobileMin: 6,
        mobileDiff: 3,
        tabMin: 7,
        tabDiff: 3,
        webTabMin: 8,
        webTabDiff: 4,
    },
};

export const Header1 = styled.h1`
    font-style: normal;
    font-weight: 600;
    font-size: 164px;
    line-height: 1;
`;

export const Header2 = styled.h2`
    font-style: normal;
    font-weight: 600;
    font-size: 124px;
    line-height: 1;
`;

export const Header3 = styled.h3`
    font-style: normal;
    font-weight: 600;
    font-size: 72px;
    line-height: 1.1;
`;

export const Header4 = styled.h4`
    font-style: normal;
    font-weight: 600;
    font-size: 48px;
    line-height: 1.1;
`;

export const Header5 = styled.h5`
    font-style: normal;
    font-weight: 600;
    font-size: 42px;
    line-height: 1.1;
`;

export const Header6 = styled.h6`
    font-style: normal;
    font-weight: 600;
    font-size: 32px;
    line-height: 1.1;
`;

export const Text24Regular = styled.text`
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 1.2;
`;

export const Text24SemiBold = styled.text`
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 1.2;
`;

export const Text20Regular = styled.text`
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 1.2;
`;

export const Text20SemiBold = styled.text`
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 1.2;
`;

export const Text18Regular = styled.text`
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 1.2;
`;

export const Text18SemiBold = styled.text`
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 1.2;
`;

export const Text16Regular = styled.text`
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 1.2;
`;

export const Text16SemiBold = styled.text`
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 1.2;
`;

export const Text14Regular = styled.text`
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 1.2;
`;

export const Text14SemiBold = styled.text`
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 1.2;
`;

export const Text12SemiBold = styled.text`
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 1.2;
`;

export const Text12Regular = styled.text`
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 1.2;
`;

export const Text10Regular = styled.text`
    font-style: normal;
    font-weight: normal;
    font-size: 10px;
    line-height: 1.2;
`;

export const Text10SemiBold = styled.text`
    font-style: normal;
    font-weight: 600;
    font-size: 10px;
    line-height: 1.1;
`;

export const Text8Regular = styled.text`
    font-style: normal;
    font-weight: normal;
    font-size: 8px;
    line-height: 1;
`;

/* ============================================= */
/* Custom Responsive styles */
/* ============================================= */

export const ResHeader1 = props => {
    return (
        <ResponsiveText {...responsiveTextStyles.h1}>
            <Header1 {...props}>{props.children}</Header1>
        </ResponsiveText>
    );
};

export const ResHeader2 = props => (
    <ResponsiveText {...responsiveTextStyles.h2}>
        <Header2 {...props}>{props.children}</Header2>
    </ResponsiveText>
);

export const ResHeader3 = props => (
    <ResponsiveText {...responsiveTextStyles.h3}>
        <Header3 {...props}>{props.children}</Header3>
    </ResponsiveText>
);

export const ResHeader4 = props => (
    <ResponsiveText {...responsiveTextStyles.h4}>
        <Header4 {...props}>{props.children}</Header4>
    </ResponsiveText>
);

export const ResHeader5 = props => (
    <ResponsiveText {...responsiveTextStyles.h5}>
        <Header5 {...props}>{props.children}</Header5>
    </ResponsiveText>
);

export const ResHeader6 = props => (
    <ResponsiveText {...responsiveTextStyles.h6}>
        <Header6 {...props}>{props.children}</Header6>
    </ResponsiveText>
);

export const ResText24SemiBold = props => (
    <ResponsiveText {...responsiveTextStyles.text24}>
        <Text24SemiBold {...props}>{props.children}</Text24SemiBold>
    </ResponsiveText>
);

export const ResText24Regular = props => (
    <ResponsiveText {...responsiveTextStyles.text24}>
        <Text24Regular {...props}>{props.children}</Text24Regular>
    </ResponsiveText>
);

export const ResText20SemiBold = props => (
    <ResponsiveText {...responsiveTextStyles.text20}>
        <Text20SemiBold {...props}>{props.children}</Text20SemiBold>
    </ResponsiveText>
);

export const ResText20Regular = props => (
    <ResponsiveText {...responsiveTextStyles.text20}>
        <Text20Regular {...props}>{props.children}</Text20Regular>
    </ResponsiveText>
);

export const ResText18SemiBold = props => (
    <ResponsiveText {...responsiveTextStyles.text18}>
        <Text18SemiBold {...props}>{props.children}</Text18SemiBold>
    </ResponsiveText>
);

export const ResText18Regular = props => (
    <ResponsiveText {...responsiveTextStyles.text18}>
        <Text18Regular {...props}>{props.children}</Text18Regular>
    </ResponsiveText>
);

export const ResText16SemiBold = props => (
    <ResponsiveText {...responsiveTextStyles.text16}>
        <Text16SemiBold {...props}>{props.children}</Text16SemiBold>
    </ResponsiveText>
);

export const ResText16Regular = props => (
    <ResponsiveText {...responsiveTextStyles.text16}>
        <Text16Regular {...props}>{props.children}</Text16Regular>
    </ResponsiveText>
);

export const ResText14SemiBold = props => (
    <ResponsiveText {...responsiveTextStyles.text14}>
        <Text14SemiBold {...props}>{props.children}</Text14SemiBold>
    </ResponsiveText>
);

export const ResText14Regular = props => (
    <ResponsiveText {...responsiveTextStyles.text14}>
        <Text14Regular {...props}>{props.children}</Text14Regular>
    </ResponsiveText>
);

export const ResText12SemiBold = props => (
    <ResponsiveText {...responsiveTextStyles.text12}>
        <Text12SemiBold {...props}>{props.children}</Text12SemiBold>
    </ResponsiveText>
);

export const ResText12Regular = props => (
    <ResponsiveText {...responsiveTextStyles.text12}>
        <Text12Regular {...props}>{props.children}</Text12Regular>
    </ResponsiveText>
);

export const ResText10SemiBold = props => (
    <ResponsiveText {...responsiveTextStyles.text10}>
        <Text10SemiBold {...props}>{props.children}</Text10SemiBold>
    </ResponsiveText>
);

export const ResText10Regular = props => (
    <ResponsiveText {...responsiveTextStyles.text10}>
        <Text10Regular {...props}>{props.children}</Text10Regular>
    </ResponsiveText>
);

export const ResText8Regular = props => (
    <ResponsiveText {...responsiveTextStyles.text8}>
        <Text8Regular {...props}>{props.children}</Text8Regular>
    </ResponsiveText>
);

/* ============================================= */
/* artano design typography */
/* ============================================= */
export const webHeader1 = styled.h1`
    font-style: normal;
    font-weight: normal;
    font-size: 78px;
    line-height: 125px;
`;
export const webHeader2 = styled.h2`
    font-style: normal;
    font-weight: normal;
    font-size: 49px;
    line-height: 48px;
`;
export const webHeader3 = styled.h3`
    font-style: normal;
    font-weight: 600;
    font-size: 31px;
    line-height: 31px;
`;
export const webHeader4 = styled.h4`
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 29px;
`;
export const webHeader = styled.header`
    font-style: normal;
    font-weight: 600;
    font-size: 22px;
    //line-height: 29px;
`;
export const webText24Regular = styled.text`
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 30px;
`;

export const webPost17Regular = styled.text`
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 38px;
`;

export const webText17Regular = styled.text`
    font-style: normal;
    font-weight: normal;
    font-size: 17px;
    line-height: 30px;
`;

export const getIcon = value => <i className={value} aria-hidden={true} />;

// -------------------------------- //
//  get showing result text  //
//--------------------------------- //
export const getShowingText = (t, fetchConfig) => {
    const { page, size, numberOfElements, totalElements } = fetchConfig;
    const fromStr = numberOfElements > 0 ? page * size + 1 : 0;
    const netToVal = (page + 1) * size;
    const toStr = totalElements < netToVal ? totalElements : netToVal;
    return (
        <Text14SemiBold className="text-muted small-horizontal-margin">
            {`Showing ${fromStr} to ${toStr} of ${totalElements} `}
        </Text14SemiBold>
    );
};
