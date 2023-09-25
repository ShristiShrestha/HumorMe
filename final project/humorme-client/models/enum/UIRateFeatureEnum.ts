export enum UIFeatureViewEnum {
    SHOW = "SHOW",
    REMOVED = "REMOVED",
}

/******************* key for overall app rating ************************/
export const OVERALL_RATING = "OVERALL";

// place (element) where an action is triggered
// to be logged in GA/firebase db

// for example, view rate feature desc could be
// in app details page or submit rating popup
export enum ELEMENT_ON_ACTION {
    HOME = "HOME",
    APP_DETAILS = "APP_DETAILS",
    RATE_APP = "RATE_APP",
    ALL_REVIEWS_VIEW = "ALL_REVIEWS_VIEW",
}
