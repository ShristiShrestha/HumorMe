/******************* ACTION TYPES ************************/

export const POST_EVENT = "POST_EVENT";

export const POST_APP_TIMELOG = "POST_APP_TIMELOG";
export const SET_EVENT = "SET_EVENT";
export const UNSET_EVENT = "UNSET_EVENT";

export const SET_TIMELOG = "SET_TIMELOG";
export const UNSET_TIMELOG = "UNSET_TIMELOG";

/******************* INTERNAL STATE ************************/

export type EventsByApps = {
    [eventName: string]: {
        [appId: string]: any[];
    };
};

export type EventTimeLog = {
    internalId: string;
    startTs: Date;
    endTs?: Date;
};

export type AppEventsTimeLog = {
    [appId: string]: {
        userId: string;
        events: {
            [eventType: string]: EventTimeLog[];
        };
    };
};

export type EventsState = {
    events: EventsByApps;

    appTimeLogs?: AppEventsTimeLog;
};
