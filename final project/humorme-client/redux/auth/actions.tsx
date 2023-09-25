import { SET_AUTH, SET_USER_ID_IN_ANALYTICS } from "./types";
import { MyThunkDispatch } from "../common/types";

/*
 *Set auth details
 **/
export function setAuth(user?: any) {
    return (dispatch: MyThunkDispatch) => {
        dispatch({ type: SET_AUTH, payload: user });
    };
}

export function setUserIdInAnalytics(userIdSet: boolean) {
    return (dispatch: MyThunkDispatch) => {
        dispatch({ type: SET_USER_ID_IN_ANALYTICS, payload: userIdSet });
    };
}
