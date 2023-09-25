/* boolean conversion */
import _ from "lodash";

export const toBoolean = str => {
    return !!str && _.isEqual(str, "true");
};
