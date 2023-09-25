export const SET_AUTH = "SET_AUTH";

export const SET_USER_ID_IN_ANALYTICS = "SET_USER_ID_IN_ANALYTICS";

export type AuthState = {
    user?: any;
    loggedIn: boolean;

    // mark if userId has been set globally
    // before sending out events.
    userIdSetInAnalytics: boolean;
};
