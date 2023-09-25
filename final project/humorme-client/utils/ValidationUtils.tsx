import _ from "lodash";

export function isUndefined(data: any) {
    return _.isUndefined(data);
}

export function isNull(data: any) {
    return _.isNull(data);
}

export function isNetherUndefinedNorNull(data: any) {
    return !isUndefined(data) && !isNull(data);
}

export function isEtherUndefinedOrNull(data: any) {
    return isUndefined(data) || isNull(data);
}
