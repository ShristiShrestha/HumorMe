import { CLEAR_ERROR, ClearErrorAction } from "./types";

export const clearError = (tag: string): ClearErrorAction => ({
    type: `${tag}_${CLEAR_ERROR}`,
    payload: undefined,
});
