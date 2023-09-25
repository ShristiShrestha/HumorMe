import { BaseActionType, RootState } from "../common/types";

// ------------------------------------------------------------------------- //
// selectors
// ------------------------------------------------------------------------- //

export const selectAllLoading = (state: RootState) => state.allLoadings;

export const loadingSelector = (actions: string[]) => (state: RootState) => {
    // returns true if an action is in loading
    return actions.some(action => state.allLoadings[action]);
};

export const loadingSelectorFromAllLoading = (
    actions: string[],
) => (allLoadings: { [key: string]: string }) => {
    // returns true if an action is in loading
    return actions.some(action => allLoadings[action]);
};

// ------------------------------------------------------------------------- //
// reducers
// ------------------------------------------------------------------------- //

export default function reducer(
    state = {},
    action: BaseActionType,
): { [key: string]: string } {
    const { type } = action;
    const matches = /(.*)_(REQUEST|SUCCESS|FAILURE)/.exec(type);

    // not a *_REQUEST / *_SUCCESS /  *_FAILURE actions, so we ignore them
    if (!matches) {
        return state;
    }

    const [, requestName, requestState] = matches;
    return {
        ...state,
        // Store whether a request is happening at the moment or not
        // e.g. will be true when receiving GET_TODOS_REQUEST
        //      and false when receiving GET_TODOS_SUCCESS / GET_TODOS_FAILURE
        [requestName]: requestState === "REQUEST",
    };
}
