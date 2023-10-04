import Api from "../utils/ApiUtils";
import {
    LoginUserDto,
    PostUserDto,
    UIUserDetails,
} from "../models/dto/UIUserDetails";

export const signup = (request: PostUserDto) => {
    return Api.apiCall<UIUserDetails>({
        url: "/users/signup",
        method: "POST",
        data: request,
    });
};

export const login = (request: LoginUserDto) => {
    return Api.apiCall<UIUserDetails>({
        url: "/auth/login",
        method: "POST",
        data: request,
    });
};

export const checkLogin = () => {
    return Api.apiCall<UIUserDetails>({
        url: "/auth/profile",
        method: "GET",
    });
};

export const getUser = (id: number) => {
    return Api.apiCall({
        url: `/users/${id}`,
        method: "GET",
    });
};

export const patchUser = (request: any) => {
    return Api.apiCall({
        url: `/users`,
        method: "PATCH",
        data: request,
    });
};
