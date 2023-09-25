import { MyThunkDispatch } from "../common/types";
import {
    FETCH_APP_REVIEWS,
    FETCH_APPS,
    SEARCH_APPS,
    SET_APP,
    SET_APP_RATE_FEATURES,
    SET_APP_REVIEWS,
    SET_APPS,
    SET_SEARCH_APPS,
} from "./types";
import { UIAppDetail } from "../../models/dto/JokeDto";
import { getAppReviews, getApps } from "../../axios/AppsApi";
import { actionFailure, actionStart, actionSuccess } from "../common/actions";
import _ from "lodash";
import { toUIAppsDetails } from "../../utils/AppsUtils";
import myStore from "../store";

/****************** SET STATE ************************/

export function setApps(
    apps: UIAppDetail[],
    lastPointer?: string,
    isSearchRes = false,
    clearExisting = false,
) {
    return (dispatch: MyThunkDispatch) => {
        const mergedAppsWithExisting = reformatAppsByIds(
            apps,
            isSearchRes,
            clearExisting,
        );
        if (isSearchRes) {
            dispatch({
                type: SET_SEARCH_APPS,
                payload: {
                    searchAppsById: mergedAppsWithExisting,
                },
            });
        } else {
            dispatch({
                type: SET_APPS,
                payload: {
                    appsById: mergedAppsWithExisting,
                    lastPointer: lastPointer,
                },
            });
        }
    };
}

export function setApp(app: UIAppDetail) {
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

export const fetchApps = (lastPointer?: string) => {
    return (dispatch: MyThunkDispatch) => {
        dispatch(actionStart(FETCH_APPS));
        getApps(undefined, lastPointer)
            .then((appsRes: any) => {
                const uiApps = toUIAppsDetails(_.get(appsRes, "apps", []));
                const lastPointer = _.get(appsRes, "lastPointer", undefined);
                dispatch(setApps(uiApps, lastPointer, false));
                dispatch(actionSuccess(FETCH_APPS, uiApps));
            })
            .catch(err => {
                dispatch(actionFailure(FETCH_APPS, err));
            });
    };
};

export const fetchSearchApps = (
    query: string,
    onSuccess?: Function,
    onError?: Function,
    onFinally?: Function,
) => {
    return (dispatch: MyThunkDispatch) => {
        dispatch(actionStart(SEARCH_APPS));
        getApps(undefined, undefined, query)
            .then((appsRes: any) => {
                const uiApps = toUIAppsDetails(_.get(appsRes, "apps", []));
                dispatch(setApps(uiApps, undefined, true, true));
                dispatch(actionSuccess(SEARCH_APPS, uiApps));
                onSuccess && onSuccess();
            })
            .catch(err => {
                dispatch(actionFailure(SEARCH_APPS, err));
                onError && onError();
            })
            .finally(() => onFinally && onFinally());
    };
};

export const fetchAppReviews = (appId: string) => {
    return (dispatch: MyThunkDispatch) => {
        dispatch(actionStart(FETCH_APP_REVIEWS));
        getAppReviews(appId)
            .then((appRevRes: any) => {
                const reviews = _.get(appRevRes, "reviews", []);
                dispatch(setAppReviews(reviews));
                dispatch(actionSuccess(FETCH_APP_REVIEWS, appRevRes));
            })
            .catch(err => {
                dispatch(actionFailure(FETCH_APP_REVIEWS, err));
            });
    };
};

/******************* internal utils ************************/
export const reformatAppsByIds = (
    newApps: UIAppDetail[],
    isSearchRes: boolean,
    clearExisting: boolean,
) => {
    let existingApps = {};

    if (!clearExisting) {
        if (isSearchRes) {
            existingApps = myStore.getState()?.apps?.searchAppsById || {};
        } else {
            existingApps = myStore.getState()?.apps?.appsById || {};
        }
    }

    for (let index = 0; index < newApps.length; index++) {
        const appInfo = newApps[index];
        existingApps[appInfo.appId] = appInfo;
    }
    return existingApps;
};
