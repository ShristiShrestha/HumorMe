import { MyThunkDispatch } from "../common/types";
import {
    FETCH_APP_REVIEWS,
    FETCH_APPS,
    SET_APP,
    SET_APP_RATE_FEATURES,
    SET_APP_REVIEWS,
    SET_APPS,
} from "./types";
import { UIJokeDetails } from "../../models/dto/JokeDto";
import { actionFailure, actionStart, actionSuccess } from "../common/actions";
import myStore from "../store";
import { getJokeComments, getJokes } from "../../axios/JokesApi";
import { sort } from "next/dist/build/webpack/loaders/css-loader/src/utils";

/****************** SET STATE ************************/

export function setApps(apps: UIJokeDetails[]) {
    return (dispatch: MyThunkDispatch) => {
        const mergedAppsWithExisting = reformatAppsByIds(apps);
        dispatch({
            type: SET_APPS,
            payload: {
                appsById: mergedAppsWithExisting,
            },
        });
    };
}

export function setApp(app: UIJokeDetails) {
    return (dispatch: MyThunkDispatch) => {
        dispatch({ type: SET_APP, payload: app });
    };
}

export function setAppRateFeatures(rateFeatures: any) {
    return (dispatch: MyThunkDispatch) => {
        dispatch({ type: SET_APP_RATE_FEATURES, payload: rateFeatures });
    };
}

export function setAppReviews(appReviews: any[]) {
    return (dispatch: MyThunkDispatch) => {
        dispatch({ type: SET_APP_REVIEWS, payload: appReviews });
    };
}

/******************* FETCH from api ************************/

export const fetchApps = (labels?: string) => {
    return (dispatch: MyThunkDispatch) => {
        dispatch(actionStart(FETCH_APPS));
        getJokes(labels)
            .then((appsRes: any) => {
                dispatch(setApps(appsRes));
                dispatch(actionSuccess(FETCH_APPS, appsRes));
            })
            .catch(err => {
                dispatch(actionFailure(FETCH_APPS, err));
            });
    };
};

export const fetchAppReviews = (jokeId: number) => {
    return (dispatch: MyThunkDispatch) => {
        dispatch(actionStart(FETCH_APP_REVIEWS));
        getJokeComments(jokeId)
            .then((comments: any) => {
                dispatch(setAppReviews(comments));
                dispatch(actionSuccess(FETCH_APP_REVIEWS, comments));
            })
            .catch(err => {
                dispatch(actionFailure(FETCH_APP_REVIEWS, err));
            });
    };
};

/******************* internal utils ************************/
export const reformatAppsByIds = (newApps: UIJokeDetails[]) => {
    let existingApps = myStore.getState()?.apps?.appsById || {};

    for (let index = 0; index < newApps.length; index++) {
        const appInfo = newApps[index];
        existingApps[appInfo.id] = appInfo;
    }
    return existingApps;
};
