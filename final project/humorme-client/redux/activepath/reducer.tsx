import {
    ActivePathState,
    SET_ACTIVE_PATH,
    SetActivePathActionType,
} from "./types";

const initialState = {
    path: null,
};

export default function reducer(
    state = initialState,
    action: SetActivePathActionType,
): ActivePathState {
    switch (action.type) {
        case SET_ACTIVE_PATH: {
            return { ...state, path: action.payload };
        }
        default:
            return { ...state };
    }
}
