import _ from "lodash";

export const getErrorMsg = error =>
    _.get(error, "response.data.error.error", "Something went wrong!");
