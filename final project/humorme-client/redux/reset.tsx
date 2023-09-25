/**
 * Reset the redux store
 * @returns {function(*): *}
 */
import { MyThunkDispatch } from "./common/types";

export function resetRedux() {
    return (dispatch: MyThunkDispatch) => {
        return dispatch({ type: "RESET_REDUX", payload: undefined });
    };
}
