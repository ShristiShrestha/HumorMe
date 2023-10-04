import { UIUserDetails } from "../../models/dto/UIUserDetails";

export const SET_AUTH = "SET_AUTH";

export const FETCH_USER = "FETCH_USER";
export const SET_USER = "SET_USER";

export type AuthState = {
    user?: UIUserDetails;
    loggedIn: boolean;

    viewUser?: UIUserDetails;
};
