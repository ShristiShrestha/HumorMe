import ReactGA from "react-ga4";

export const initGoogleAnalytics = () => {
    const measurementId = process.env.NEXT_PUBLIC_MEASUREMENT_ID;
    // @ts-ignore
    ReactGA.initialize(measurementId, { debug: true });
};

export const logPageView = () => {
    // ReactGA.set({ page: window.location.pathname });
    ReactGA.send({
        hitType: "pageview",
        page: window.location.pathname,
    });
};

/******************* event register template ************************/
// export const logGAEvent = (category, desc) => {};
