// axios/errorReducer.js
import _ from "lodash";
import { BaseActionType, RootState } from "../common/types";
import { ErrorState } from "./types";

// ------------------------------------------------------------------------- //
// selectors
// ------------------------------------------------------------------------- //

export const selectAllErrors = (state: RootState) => state.allErrors;

export const errorSelector = (actions: string[]) => (state: RootState) => {
    return (
        _(actions)
            .map(action => state.allErrors[action])
            .compact()
            .first() || undefined
    );
};

export const errorSelectorFromAllErrors = (actions: string[]) => (
    allErrors: ErrorState,
) => {
    const errorsForActions = actions.map(action => allErrors[action]);
    if (errorsForActions && errorsForActions[0]) {
        return errorsForActions[0];
    }
    return null;
};

// ------------------------------------------------------------------------- //
// reducer
// ------------------------------------------------------------------------- //

const initialState = {
    // empty
};

const errorReducer = (
    state = initialState,
    action: BaseActionType,
): ErrorState => {
    const { type, payload } = action;
    const matches = /(.*)_(REQUEST|FAILURE)/.exec(type);

    // not a *_REQUEST / *_FAILURE actions, so we ignore them
    if (!matches) {
        return state;
    }

    const [, requestName, requestState] = matches;
    return {
        ...state,
        // Store errorMessage
        // e.g. stores errorMessage when receiving GET_TODOS_FAILURE
        //      else clear errorMessage when receiving GET_TODOS_REQUEST
        [requestName]: requestState === "FAILURE" ? payload : null,
    };
};

export default errorReducer;
