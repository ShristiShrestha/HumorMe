import Api from "../utils/ApiUtils";

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
