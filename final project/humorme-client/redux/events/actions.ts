/******************* SET STATE ************************/
import { MyThunkDispatch } from "../common/types";
import { v4 as uuidv4 } from "uuid";
import { actionFailure, actionStart, actionSuccess } from "../common/actions";
import {
    POST_APP_TIMELOG,
    POST_EVENT,
    SET_EVENT,
    SET_TIMELOG,
    UNSET_EVENT,
    UNSET_TIMELOG,
} from "./types";
import {
    postCustomAppTimeLog,
    postCustomEventLog,
} from "../../axios/EventLogApi";
import _ from "lodash";
import myStore from "../store";

/******************* log GA events ************************/
export function setEvent(
    eventType: string,
    appId: string,
    eventInfo: any,
    logInServer = false,
    onSuccess?: (data) => any,
    onError?: (data, error) => any,
) {
    return (dispatch: MyThunkDispatch) => {
        const eventInfoWithId = {
            ...eventInfo,
            internalId: uuidv4().toString(),
        };
        const data = {
            eventType: eventType,
            appId: appId,
            data: eventInfoWithId,
        };

        // start logging
        dispatch(actionStart(SET_EVENT));
        // log event in store
        dispatch({
            type: SET_EVENT,
            payload: data,
        });

        // save to server if asked
        if (logInServer) {
            const onSuccessEvent = resdata => {
                dispatch(actionSuccess(SET_EVENT, resdata));
                onSuccess && onSuccess(resdata);
            };

            const onErrorEvent = (data, err) => {
                dispatch(actionFailure(SET_EVENT, err));
                onError && onError(data, err);
            };

            dispatch(
                postEvent(
                    eventType,
                    appId,
                    eventInfoWithId,
                    onSuccessEvent,
                    onErrorEvent,
                ),
            );
        } else {
            // mark as success
            dispatch(actionSuccess(SET_EVENT, data));
        }
    };
}

export function unsetEvent(eventType: string, appId: string, eventInfo: any) {
    return (dispatch: MyThunkDispatch) => {
        const data = {
            eventType: eventType,
            appId: appId,
            internalId: eventInfo["internalId"],
        };
        // start logging
        dispatch(actionStart(UNSET_EVENT));
        // dispatch event
        dispatch({
            type: UNSET_EVENT,
            payload: data,
        });
        // mark as success
        dispatch(actionSuccess(UNSET_EVENT, data));
    };
}

// log user activities (timestamp)
// in app page
export function setAppTimeLog(
    eventType: string,
    appId: string,
    userId: string,
    params: any,
) {
    return (dispatch: MyThunkDispatch) => {
        const eventData = {
            internalId: uuidv4().toString(),
            ...params,
        };
        const timeLogData = {
            userId: userId,
            appId: appId,
            eventType: eventType,
            timeLog: eventData,
        };
        const updatedAppTimeLogs = getUpdatedAppTimeLogs(
            timeLogData,
            myStore.getState()?.events,
        );
        dispatch(actionStart(SET_TIMELOG));
        dispatch({
            type: SET_TIMELOG,
            payload: updatedAppTimeLogs,
        });
        dispatch(actionSuccess(SET_TIMELOG, eventData));
    };
}

export function unsetAppTimelog() {
    return (dispatch: MyThunkDispatch) => {
        dispatch({
            type: UNSET_TIMELOG,
            payload: {},
        });
    };
}

/******************* API calls ************************/

// log event in server database
// and remove the event data afterwards
export function postEvent(
    eventType: string,
    appId: string,
    eventInfo: any,
    onSuccess?: (data) => any,
    onError?: (data, error) => any,
) {
    return (dispatch: MyThunkDispatch) => {
        // start sending log to api
        dispatch(actionStart(POST_EVENT));
        postCustomEventLog(eventType, appId, eventInfo)
            .then(res => {
                // remove event info from store
                dispatch(unsetEvent(eventType, appId, eventInfo));
                // mark postEvent as success
                dispatch(actionSuccess(POST_EVENT, res));
                // handle success callback if exists
                onSuccess && onSuccess(res);
            })
            .catch(err => {
                // mark postEvent as failure
                dispatch(actionFailure(POST_EVENT, err));
                // handle error callback if exists
                onError && onError(eventInfo, err);
            });
    };
}

export function postAppTimelog(
    userId: string,
    data: any,
    newEventData?: any,
    onSuccess?: (data) => any,
    onError?: (data, error) => any,
) {
    return (dispatch: MyThunkDispatch) => {
        let existingState = myStore.getState()?.events;
        let userAppTimeLogs = data;
        if (newEventData && Object.keys(newEventData).length > 0) {
            const { eventType, appId, userId, params } = newEventData;
            const eventData = {
                internalId: uuidv4().toString(),
                ...params,
            };
            const timeLogData = {
                userId: userId,
                appId: appId,
                eventType: eventType,
                timeLog: eventData,
            };
            const updatedAppTimeLogs = getUpdatedAppTimeLogs(
                timeLogData,
                existingState,
            );
            existingState = {
                ...existingState, // @ts-ignore
                appTimeLogs: updatedAppTimeLogs,
            };
            userAppTimeLogs = existingState?.appTimeLogs || {};
        }

        dispatch(actionStart(POST_APP_TIMELOG));
        postCustomAppTimeLog(userId, userAppTimeLogs || {})
            .then(res => {
                // mark postAppTimelog as success
                dispatch(actionSuccess(POST_APP_TIMELOG, res));
                // remove per app's time logs info from store
                dispatch(unsetAppTimelog());
                // handle success callback if exists
                onSuccess && onSuccess(res);
            })
            .catch(err => {
                // mark postAppTimelog as failure
                dispatch(actionFailure(POST_APP_TIMELOG, err));
                // handle error callback if exists
                onError && onError(data, err);
            });
    };
}

const getUpdatedAppTimeLogs = (data, state) => {
    const { userId, appId, timeLog, eventType } = data;
    const existingAppsEventsLogs = _.get(state, "appTimeLogs", {});
    let existingAppIdLogs = _.get(state, `appTimeLogs.${appId}`, {
        userId: userId,
        events: {},
    });

    const existingAppEventsLogs = existingAppIdLogs["events"];
    const existingEventLogs = existingAppEventsLogs[eventType] || [];
    existingEventLogs.push(timeLog);

    return {
        ...existingAppsEventsLogs,
        [appId]: {
            userId: userId,
            events: {
                ...existingAppEventsLogs,
                [eventType]: existingEventLogs,
            },
        },
    };
};
