import {
    EventsState,
    SET_EVENT,
    SET_TIMELOG,
    UNSET_EVENT,
    UNSET_TIMELOG,
} from "./types";
import { RootState } from "../common/types";

const initialState: EventsState = {
    events: {},
};

export const selectEvents = (state: RootState) => state.events.events;
export const selectAppTimeLogs = (state: RootState) => state.events.appTimeLogs;

export default function reducer(
    state = initialState,
    action: any,
): EventsState {
    switch (action.type) {
        case UNSET_EVENT: {
            const { eventType, appId, internalId } = action.payload;
            let newEvents = state.events;
            const existingEvents = Object.keys(newEvents);
            const eventKey = eventType?.toUpperCase();

            // event exists
            if (existingEvents.includes(eventKey)) {
                const appsInEvent = Object.keys(newEvents[eventKey]);

                // app exists in event data
                if (appsInEvent.includes(appId)) {
                    // @ts-ignore
                    newEvents[eventKey][appId] = newEvents[eventKey][
                        appId
                    ].filter(item => item?.internalId !== internalId);
                }
            }

            return {
                ...state,
                events: newEvents,
            };
        }

        case SET_EVENT: {
            const { eventType, appId, data } = action.payload;
            const newEvents = state.events;
            const existingEvents = Object.keys(newEvents);
            const eventKey = eventType?.toUpperCase();

            // event exists
            if (existingEvents.includes(eventKey)) {
                const appsInEvent = Object.keys(newEvents[eventKey]);

                // app exists in event data
                if (appsInEvent.includes(appId)) {
                    // @ts-ignore
                    newEvents[eventKey][appId].append(data);
                } else {
                    newEvents[eventKey][appId] = [data];
                }
            }
            // register new event log
            else {
                newEvents[eventKey] = {
                    [appId]: [data],
                };
            }

            return {
                ...state,
                events: newEvents,
            };
        }

        case SET_TIMELOG: {
            // const { userId, appId, timeLog, eventType } = action.payload;
            // const existingAppsEventsLogs = _.get(state, "appTimeLogs", {});
            // let existingAppIdLogs = _.get(state, `appTimeLogs.${appId}`, {
            //     userId: userId,
            //     events: {},
            // });
            //
            // const existingAppEventsLogs = existingAppIdLogs["events"];
            // const existingEventLogs = existingAppEventsLogs[eventType] || [];
            // existingEventLogs.push(timeLog);

            return {
                ...state,
                appTimeLogs: action.payload,
                // appTimeLogs: {
                //     ...existingAppsEventsLogs,
                //     [appId]: {
                //         userId: userId,
                //         events: {
                //             ...existingAppEventsLogs,
                //             [eventType]: existingEventLogs,
                //         },
                //     },
                // },
            };
        }

        case UNSET_TIMELOG: {
            return {
                ...state,
                appTimeLogs: action.payload,
            };
        }

        default:
            return { ...state };
    }
}
