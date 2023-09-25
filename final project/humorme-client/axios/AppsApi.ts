import Api from "../utils/ApiUtils";

export const getApps = (
    appId?: string,
    lastPointer?: string,
    appName?: string,
    pageSize?: number,
) => {
    return Api.apiCall<any>({
        url: "/apiGetApps",
        method: "GET",
        params: {
            appId: appId,
            lastPointer: lastPointer,
            search: appName,
            pageSize: pageSize,
        },
    });
};

export const getAppRateFeatures = (appId: string) => {
    return Api.apiCall<any[] | any>({
        url: "/apiGetAppRateFeatures",
        method: "GET",
        params: { appId: appId },
    });
};

export const getAppReviews = (appId: string) => {
    return Api.apiCall<any[] | any>({
        url: "/apiGetAppReviews",
        method: "GET",
        params: { appId: appId },
    });
};

export const postAppRating = data => {
    return Api.apiCall({
        url: "/apiPostAppRating",
        method: "POST",
        data: data,
    });
};
