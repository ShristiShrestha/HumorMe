import { SET_AUTH } from "./types";
import { MyThunkDispatch } from "../common/types";

/*
 *Set auth details
 **/
export function setAuth(user?: any) {
    return (dispatch: MyThunkDispatch) => {
        dispatch({ type: SET_AUTH, payload: user });
    };
}
