import {
    AppsState,
    SET_APP,
    SET_APP_RATE_FEATURES,
    SET_APP_REVIEWS,
    SET_APPS,
    SET_SEARCH_APPS,
} from "./types";
import { RootState } from "../common/types";
import { ALL_JOKES } from "../../data/jokes";

const initialState: AppsState = {
    appsById: {}, //ALL_JOKES,
    searchAppsById: {},
};

export const selectApps = (state: RootState) => state.apps;
export default function reducer(state = initialState, action: any): AppsState {
    switch (action.type) {
        case SET_APPS: {
            return {
                ...state,
                appsById: action.payload.appsById,
                lastPointer: action.payload.lastPointer,
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
