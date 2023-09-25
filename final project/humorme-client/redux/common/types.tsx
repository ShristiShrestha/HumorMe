import { Action } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { combinedReducer } from "../store";

// -------------------------------------------------------------------------------- //
// Thunk //
// -------------------------------------------------------------------------------- //

export type MyExtraArg = undefined;
export type MyThunkResult<R> = ThunkAction<R, RootState, MyExtraArg, Action>;
// Next Line:
// It is important to use Action as last type argument, does not work with any.
export type MyThunkDispatch = ThunkDispatch<RootState, MyExtraArg, Action>;

// ------------------------------------------------------------------------- //
// Action
// ------------------------------------------------------------------------- //

export interface BaseActionType {
    readonly type: string;
    readonly payload?: any;
    readonly [key: string]: any;
}

export const RESET_REDUX = "RESET_REDUX";
export interface ResetReduxActionType {
    type: typeof RESET_REDUX;
}

// -------------------------------------------------------------------------------- //
// Root state //
// -------------------------------------------------------------------------------- //

export type QueryConfigType = {
    page: number;
    size: number;
    search?: string;
    sortBy?: string;
};

export type PageConfigType = {
    page: number;
    size: number;
    totalElements: number;
    numberOfElements: number;
};

export type RootState = ReturnType<typeof combinedReducer>;
