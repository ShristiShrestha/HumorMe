import { MyThunkDispatch } from "../common/types";
import {
    FETCH_APP,
    FETCH_APP_REVIEWS,
    FETCH_APPS,
    FETCH_MY_JOKE_RATINGS,
    SET_APP,
    SET_APP_RATE_FEATURES,
    SET_APP_REVIEWS,
    SET_APPS,
    SET_MY_JOKE_RATINGS,
} from "./types";
import { UIJokeDetails } from "../../models/dto/JokeDto";
import { actionFailure, actionStart, actionSuccess } from "../common/actions";
import myStore from "../store";
import {
    getJoke,
    getJokeComments,
    getJokes,
    getMyJokeRatings,
} from "../../axios/JokesApi";
import { UICommentDetails, UIRatingDetails } from "../../models/dto/CommentDto";

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

export function setMyJokeRatings(myRatings: UIRatingDetails[]) {
    return (dispatch: MyThunkDispatch) => {
        const ratingsByIds = reformatRatingsByJokeIds(myRatings);
        dispatch({
            type: SET_MY_JOKE_RATINGS,
            payload: {
                myJokesRatingsByIds: ratingsByIds,
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
export const fetchApp = id => {
    return (dispatch: MyThunkDispatch) => {
        dispatch(actionStart(FETCH_APP));
        getJoke(id)
            .then(jokeRes => {
                dispatch(setApp(jokeRes));
                dispatch(actionSuccess(FETCH_APP, jokeRes));
            })
            .catch(err => {
                dispatch(actionFailure(FETCH_APP, err));
            });
    };
};

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

export const fetchMyJokeRatings = () => {
    return (dispatch: MyThunkDispatch) => {
        dispatch(actionStart(FETCH_MY_JOKE_RATINGS));
        getMyJokeRatings()
            .then((myRatings: UIRatingDetails[]) => {
                dispatch(setMyJokeRatings(myRatings));
                dispatch(actionSuccess(FETCH_MY_JOKE_RATINGS, myRatings));
            })
            .catch(err => {
                dispatch(actionFailure(FETCH_MY_JOKE_RATINGS, err));
            });
    };
};

export const fetchAppReviews = (jokeId: number) => {
    return (dispatch: MyThunkDispatch) => {
        dispatch(actionStart(FETCH_APP_REVIEWS));
        getJokeComments(jokeId)
            .then((comments: UICommentDetails[]) => {
                const sortedComments = comments.sort(
                    (first, second) =>
                        new Date(second.createdAt).getTime() -
                        new Date(first.createdAt).getTime(),
                );
                dispatch(setAppReviews(sortedComments));
                dispatch(actionSuccess(FETCH_APP_REVIEWS, sortedComments));
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

export const reformatRatingsByJokeIds = (newMyRatings: UIRatingDetails[]) => {
    let existingMyRatings = myStore.getState()?.apps?.myJokesRatingsByIds || {};

    for (let index = 0; index < newMyRatings.length; index++) {
        const appInfo = newMyRatings[index];
        existingMyRatings[appInfo.joke.id] = appInfo;
    }
    return existingMyRatings;
};
