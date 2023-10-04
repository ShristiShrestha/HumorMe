import { UIJokeDetails } from "../../models/dto/JokeDto";
import { UICommentDetails, UIRatingDetails } from "../../models/dto/CommentDto";

export const FETCH_APPS = "FETCH_JOKES";
export const SEARCH_APPS = "SEARCH_JOKES";
export const FETCH_APP = "FETCH_JOKE";
export const FETCH_APP_REVIEWS = "FETCH_JOKE_REVIEWS";
export const FETCH_MY_JOKE_RATINGS = "FETCH_MY_JOKE_RATINGS";
export const SET_APPS = "SET_JOKES";
export const SET_SEARCH_APPS = "SET_SEARCH_JOKES";
export const SET_APP = "SET_JOKE";
export const SET_APP_REVIEWS = "SET_JOKE_REVIEWS";
export const SET_APP_RATE_FEATURES = "SET_JOKE_RATE_FEATURES";
export const SET_MY_JOKE_RATINGS = "SET_MY_JOKE_RATINGS";

export type AppsState = {
    appsById: {
        [appId: string]: any;
    };
    searchAppsById: {
        [appId: string]: any;
    };
    app?: UIJokeDetails;
    appReviews?: UICommentDetails[];
    myJokesRatingsByIds?: {
        [appId: string]: UIRatingDetails;
    };
    appRateFeatures?: any;
};
