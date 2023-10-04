import {
    AppsState,
    SET_APP,
    SET_APP_RATE_FEATURES,
    SET_APP_REVIEWS,
    SET_APPS,
    SET_MY_JOKE_RATINGS,
    SET_SEARCH_APPS,
} from "./types";
import { RootState } from "../common/types";

const initialState: AppsState = {
    appsById: {}, //ALL_JOKES,
    searchAppsById: {},
    myJokesRatingsByIds: {},
    appReviews: [],
};

export const selectApps = (state: RootState) => state.apps;
export default function reducer(state = initialState, action: any): AppsState {
    switch (action.type) {
        case SET_APPS: {
            return {
                ...state,
                appsById: action.payload.appsById,
            };
        }
        case SET_SEARCH_APPS: {
            return {
                ...state,
                searchAppsById: action.payload.searchAppsById,
            };
        }
        case SET_APP: {
            return {
                ...state,
                app: action.payload,
            };
        }
        case SET_MY_JOKE_RATINGS: {
            return {
                ...state,
                myJokesRatingsByIds: action.payload.myJokesRatingsByIds,
            };
        }
        case SET_APP_RATE_FEATURES: {
            return {
                ...state,
                appRateFeatures: action.payload,
            };
        }
        case SET_APP_REVIEWS: {
            return {
                ...state,
                appReviews: action.payload,
            };
        }
        default:
            return { ...state };
    }
}
