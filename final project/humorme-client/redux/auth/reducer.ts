import { AuthState, SET_AUTH, SET_USER_ID_IN_ANALYTICS } from "./types";
import { RootState } from "../common/types";

const initialState: AuthState = {
    loggedIn: false,
    userIdSetInAnalytics: false,
};

export const selectAuth = (state: RootState) => state.auth;
export default function reducer(state = initialState, action: any): AuthState {
    switch (action.type) {
        case SET_AUTH: {
            return {
                ...state,
                user: action.payload,
                loggedIn: !!action.payload,
            };
        }
        case SET_USER_ID_IN_ANALYTICS: {
            return {
                ...state,
                userIdSetInAnalytics: action.payload,
            };
        }
        default:
            return { ...state };
    }
}
