// capitalize

///todo: refactor dummy impl
import queryString from "querystring";
import _ from "lodash";
import { isNetherUndefinedNorNull } from "./ValidationUtils";

const thousandSeparatorRegex = /\d{1,3}(?=(\d{3})+(?!\d))/g;
const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const shortenStr = (
    str: string | number,
    expectedLength?: number,
    firstIndex = 0,
) => {
    if (isNetherUndefinedNorNull(expectedLength)) {
        return str.toString().substr(firstIndex, expectedLength);
    }
    return str;
};

export const toMidDottedStr = (
    str: string | number,
    leadingVisible = 12,
    firstIndex = 0,
    // trailing_visible_max = 12,
) => {
    const total = str.toString().length;
    const leadingStr = str.toString().substring(firstIndex, leadingVisible);
    const trailingStr = str.toString().substring(total - leadingVisible);
    return `${leadingStr}...${trailingStr}`;
};

export const toEndDottedStr = (
    str: string | number,
    leadingVisible = 12,
    firstIndex = 0,
    // trailing_visible_max = 12,
) => {
    const total = str.toString().length;
    const leadingStr = str.toString().substring(firstIndex, leadingVisible);
    return `${leadingStr}...`;
};

export const getCommaSeparatedStr = (
    val: number,
    truncate = true,
    decimalCount = 4,
) => {
    // quicker than Math calc to get exact decimal value
    const decimalVal = val.toString().split(".")[1]?.substr(0, decimalCount);

    // comma separation for integer part only
    const truncatedVal = Math.trunc(val);
    const formattedTruncatVal = truncatedVal
        .toString()
        .replace(thousandSeparatorRegex, "$&, ");
    return truncate
        ? formattedTruncatVal
        : `${formattedTruncatVal}${!!decimalVal ? `.${decimalVal}` : ""}`;
};

export const capitalize = (val, perWord = false) => {
    const formattedVal = val || "";
    const firstChar = formattedVal.toString()[0]?.toUpperCase();
    const resulted = `${firstChar}${formattedVal
        .toString()
        .substring(1)
        .toLowerCase()}`;
    if (perWord) {
        const words = resulted.split(/,|\s/);
        let wordsCapitalized = "";
        words.map(word => {
            if (word.length > 1)
                wordsCapitalized +=
                    " " + word[0]?.toUpperCase() + word.slice(1);
            else wordsCapitalized += " " + word?.toUpperCase();
        });
        return wordsCapitalized;
    }

    return resulted;
};

export const getTruncVal = (val, decimalCount = 2) => {
    const valStr = val.toString();
    const intVal = valStr.split(".")[0];
    const decimalVal = valStr.split(".")[1]?.substr(0, decimalCount);
    return !!decimalVal ? `${intVal}.${decimalVal}` : intVal;
};

/* parse query params from location */
export const parseLocationQuery = (
    locSearch,
    key,
): string | string[] | undefined => {
    const params = queryString.parse(locSearch);
    const queryStr = `${key}`;
    return params[queryStr] ? params[queryStr] : undefined;
};

export const parseLocationQueryStr = (locSearch, key): string | undefined => {
    const params = queryString.parse(locSearch);
    const queryStr = `${key}`;
    // @ts-ignore
    return params[queryStr]
        ? typeof params[queryStr] === "string"
            ? params[queryStr]
            : // @ts-ignore
              params[queryStr][0]
        : undefined;
};

/* Format string */
export const replaceBy = (val, replace, replaceBy) =>
    val.replace(replace, replaceBy);

/* conversion from camel case */
const camelCaseRegex = /[A-Z]/g;
export const camelToSnakeCase = str =>
    str.replace(camelCaseRegex, letter => `_${letter.toLowerCase()}`);
export const camelToCapitalize = str =>
    capitalize(
        str.replace(camelCaseRegex, letter => ` ${letter.toLowerCase()}`),
    );

/* conversion from snake case */
export const snakeToCapitalize = str => capitalize(str.split("_").join(" "));

/* boolean conversion */
export const toBoolean = str => {
    return !!str && _.isEqual(str, "true");
};

/* email validation */
export const isValidEmail = email =>
    emailRegex.test(email.toString().toLowerCase());

export const getIsSelected = (currentId, selectedId) => {
    return currentId === selectedId;
};
