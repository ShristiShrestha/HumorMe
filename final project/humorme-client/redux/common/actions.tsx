import { BaseActionType, RESET_REDUX, ResetReduxActionType } from "./types";

export interface BaseAction {
    type: string;
    payload?: any;
}

export const actionStart = (label: string): BaseActionType => ({
    type: `${label}_REQUEST`,
});

export const actionSuccess = (
    label: string,
    response: any,
): BaseActionType => ({
    type: `${label}_SUCCESS`,
    payload: response,
});

export const actionFailure = (label: string, error: any): BaseActionType => ({
    type: `${label}_FAILURE`,
    payload: error,
});

export const actionReset = (): ResetReduxActionType => ({
    type: RESET_REDUX,
});
