import { UIAppDetail } from "../../models/dto/JokeDto";

export const FETCH_APPS = "FETCH_APPS";
export const SEARCH_APPS = "SEARCH_APPS";
export const FETCH_APP = "FETCH_APP";
export const FETCH_APP_REVIEWS = "FETCH_APP_REVIEWS";
export const SET_APPS = "SET_APPS";
export const SET_SEARCH_APPS = "SET_SEARCH_APPS";
export const SET_APP = "SET_APP";
export const SET_APP_REVIEWS = "SET_APP_REVIEWS";
export const SET_APP_RATE_FEATURES = "SET_APP_RATE_FEATURES";

export type AppsState = {
    appsById: {
        [appId: string]: any;
    };
    lastPointer?: any;
    searchAppsById: {
        [appId: string]: any;
    };
    app?: UIAppDetail;
    appReviews?: any[];
    appRateFeatures?: any;
};
