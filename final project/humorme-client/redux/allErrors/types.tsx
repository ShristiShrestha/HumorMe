export const CLEAR_ERROR = "CLEAR_ERROR";

export interface ClearErrorAction {
    readonly type: string;
    readonly payload?: undefined;
}

export type ErrorState = {
    [key: string]: any;
};
