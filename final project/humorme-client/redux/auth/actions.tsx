import { FETCH_USER, SET_AUTH, SET_USER } from "./types";
import { MyThunkDispatch } from "../common/types";
import { getUser } from "../../axios/UsersApi";
import { actionFailure, actionStart, actionSuccess } from "../common/actions";

/******************* set redux ************************/
/*
 *Set auth details
 **/
export function setAuth(user?: any) {
    return (dispatch: MyThunkDispatch) => {
        dispatch({ type: SET_AUTH, payload: user });
    };
}

export function setUser(user: any) {
    return (dispatch: MyThunkDispatch) => {
        dispatch({ type: SET_USER, payload: user });
    };
}

/******************* api calls ************************/
export function fetchUser(id: string) {
    return (dispatch: MyThunkDispatch) => {
        dispatch(actionStart(FETCH_USER));
        getUser(parseInt(id))
            .then(res => {
                dispatch(setUser(res));
                dispatch(actionSuccess(FETCH_USER, res));
            })
            .catch(err => {
                dispatch(actionFailure(FETCH_USER, err));
            });
    };
}
