import Api from "../utils/ApiUtils";

export const postCustomEventLog = (
    action: string,
    appId: string,
    data: any,
) => {
    return Api.apiCall({
        url: `/apiPostEvents?action=${action}&appId=${appId}`,
        method: "POST",
        data: data,
    });
};

export const postCustomAppTimeLog = (userId: string, data: any) => {
    return Api.apiCall({
        url: `/apiPostUserAppTimeLogs?userId=${userId}`,
        method: "POST",
        data: data,
    });
};
