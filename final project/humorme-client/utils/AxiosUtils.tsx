import axios, { AxiosInstance } from "axios";
import _ from "lodash";
import axiosCancel from "axios-cancel";

function getAxiosInstance(baseUrl: string, apiVersion: string) {
    // the axios instance to return
    const axiosInstance: AxiosInstance = axios.create({
        baseURL: `${baseUrl}${apiVersion}`,
        // withCredentials: true,
        headers: {
            crossDomain: true,
            accessControlAllowOrigin: true,
        },
    });

    // @ts-ignore
    axiosCancel(axiosInstance, {
        debug: false, // default
    });

    axiosInstance.interceptors.response.use(
        function (response) {
            return response;
        },
        function (error) {
            const status = _.get(error, "response.status", null);
            if (status === 419 || status === 423 || status === 401) {
                // todo: handle unauthenticated, page expired status
            }
            return Promise.reject(error);
        },
    );
    return axiosInstance;
}

const sourceSelector = (state, label) => {
    // returns true if an action is in loading
    return _.get(state, "Axios.sourceData." + label, null);
};

const cancelRequest = (state, label) => {
    const source = sourceSelector(state, label);
    if (source) {
        source.cancel();
    }
};

export { getAxiosInstance, sourceSelector, cancelRequest };
