import { generateMinMax } from "./NumberUtils";
import { hasData } from "./ShadesUtils";
import FuzzySearch from "fuzzy-search"; // Or: var FuzzySearch = require('fuzzy-search');

export const hasValuesInArr = (data: any[], total) => {
    const dataInfo = [] as boolean[];
    if (!hasData(data)) return false;
    data.map(item => {
        if (hasData(item)) {
            dataInfo.push(true);
        }
    });
    return total === dataInfo.length;
};

export const cloneArrNTimes = (arr: any[], noOfTimes: number) => {
    generateMinMax(noOfTimes).map(index => {
        arr = arr.concat(arr);
    });
    return arr;
};

/******************* Search using Fuzzy-search ************************/

export const searchByQuery = (query, data) => {
    const fuzzySearch = new FuzzySearch(data, [
        "name",
        // "genres",
        // "primaryGenre",
    ]);
    return fuzzySearch.search(query);
};
