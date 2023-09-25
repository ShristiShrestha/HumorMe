import { MyThunkDispatch } from "../common/types";
import { SET_ACTIVE_PATH } from "./types";

/**
 * Set active path
 * @param path just a string of url path used in react router insideRoutes
 * @returns {Function}
 */
export function setActiveContainer(path: string) {
    return (dispatch: MyThunkDispatch) => {
        dispatch({ type: SET_ACTIVE_PATH, payload: path });
    };
}
