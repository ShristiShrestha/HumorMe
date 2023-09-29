import Api from "../utils/ApiUtils";
import {
    LoginUserDto,
    PostUserDto,
    UIUserDetails,
} from "../models/dto/UIUserDetails";

export const signup = (request: PostUserDto) => {
    return Api.apiCall<UIUserDetails>({
        url: "/user/signup",
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

export const postUserSignIn = (data: any) => {
    return Api.apiCall({
        url: "/apiPostUserSignIn",
        method: "POST",
        data: data,
    });
};

export const postUserAssignToGroup = (reqData: any) => {
    return Api.apiCall({
        url: "/apiPostAssignUserToGroup",
        method: "POST",
        data: reqData,
    });
};
