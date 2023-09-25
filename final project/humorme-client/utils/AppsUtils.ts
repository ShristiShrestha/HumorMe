import { UIAppDetail, UIAppMeta, UIAppReview } from "../models/dto/JokeDto";
import { parseDate, parseDateStrToDate } from "./DateUtils";
import _ from "lodash";

const toRatingCountText = (rating?: string) => {
    if (rating && rating.toString().length > 0) {
        const ratingNum = parseInt(rating);
        // >= M
        const millionNum = ratingNum / Math.pow(10, 6);
        if (millionNum >= 1) {
            return `${millionNum.toString().split(".")[0]}M`;
        }
        // >= K
        const thousandsNum = ratingNum / Math.pow(10, 3);
        if (thousandsNum >= 1) {
            return `${thousandsNum.toString().split(".")[0]}K`;
        }
        return rating.toString();
    }
    return "0";
};

const toAvgRatingText = (rating?: string) => {
    if (rating && rating.toString().length > 0) {
        const ratingText = rating.toString();
        if (ratingText.includes(".")) {
            const textSplit = ratingText.split(".");
            return `${textSplit[0]}.${textSplit[1].slice(0, 1)}`;
        }
        return ratingText.slice(0, 1);
    }
    return "0";
};

const toSizeText = (size?: string) => {
    if (size && size.toString().length > 0) {
        const sizeNum = parseInt(size);
        // >= M
        const millionNum = sizeNum / Math.pow(10, 6);
        if (millionNum >= 1) {
            return `${millionNum.toString().split(".")[0]}MB`;
        }
        // >= K
        const thousandsNum = sizeNum / Math.pow(10, 3);
        if (thousandsNum >= 1) {
            return `${thousandsNum.toString().split(".")[0]}KB`;
        }
        return `${sizeNum.toString()}B`;
    }
    return "0B";
};
export const toUIAppDetailMeta = (app: any): UIAppMeta => {
    const data = _.get(app, "data", {});
    const price = parseInt(_.get(data, "price", 0));
    const appScreenshots = _.get(data, "screenshotUrls", "");
    return {
        priceText: price > 0 ? price.toString() : "Free",
        avgRatingText: toAvgRatingText(_.get(data, "averageUserRating", 0)),
        ratingText: toRatingCountText(_.get(data, "userRatingCount", 0)),
        sellerName: _.get(data, "sellerName", "N/A"),
        appIconUrl: _.get(data, "artworkUrl512", ""),
        screenshotsUrl: appScreenshots.split(","),
        desc: _.get(data, "description", "N/A"),
        releaseNote: _.get(data, "releaseNotes", "N/A"),
        releaseVersion: _.get(data, "version", "N/A"),
        sizeText: toSizeText(_.get(data, "fileSizeBytes", "0")),
        sellerUrl: _.get(data, "sellerUrl", "https://google.com"),
    };
};
export const toUIAppDetail = (app: any): UIAppDetail => {
    return {
        appId: _.get(app, "appId", ""),
        name: _.get(app, "name", ""),
        genres: _.get(app, "genres", ""),
        genreIds: _.get(app, "genreIds", ""),
        primaryGenre: _.get(app, "primaryGenre", "N/A"),
        primaryGenreId: _.get(app, "primaryGenreId", "N/A"),
        url: _.get(app, "url", ""),
        data: _.get(app, "data", {}),
        meta: toUIAppDetailMeta(app),
        reviews: toUIAppReviews(_.get(app, "reviews", [])),
        rateFeatures: toUIAppRateFeatures(_.get(app, "rateFeatures", {})),
        totalUsersCount: _.get(app, "totalUsersCount", 0),
        totalUsersRatingFeatures: _.get(app, "totalUsersRatingFeatures", 0),
        rank: _.get(app, "rank", 0),
    };
};

export const toUIAppsDetails = (apps: any[]) =>
    apps.map(item => toUIAppDetail(item));

export const toUIAppReview = (review: any): UIAppReview => {
    return {
        id: _.get(review, "reviewId", ""),
        date: parseDateStrToDate(_.get(review, "date", "")),
        name: _.get(review, "name", ""),
        username: _.get(review, "username", ""),
        title: _.get(review, "title", ""),
        review: _.get(review, "review", ""),
        rating: parseInt(_.get(review, "rating", "0")),
        domain: _.get(review, "domain", ""),
    };
};

export const toUIAppReviews = (reviews: any[]) => {
    return reviews
        .sort((a, b) => {
            const firstDate = new Date(parseDate(a["date"])).getTime();
            const secondDate = new Date(parseDate(b["date"])).getTime();
            return secondDate - firstDate;
        })
        .map(item => toUIAppReview(item));
};

export const toUIAppRateFeatures = (rateFeatures: any) => {
    const rateFeatureKeys = Object.keys(rateFeatures);
    if (rateFeatureKeys.length < 1) return rateFeatures;

    const parsedRateFeatures = {};

    for (let index = 0; index < rateFeatureKeys.length; index++) {
        const indexRateFeatureKey = rateFeatureKeys[index];
        const indexRateFeature = rateFeatures[indexRateFeatureKey];
        parsedRateFeatures[indexRateFeatureKey] = {
            id: _.get(indexRateFeature, "id", "-1"),
            name: _.get(indexRateFeature, "name", "N/A"),
            desc: _.get(indexRateFeature, "desc", "N/A"),
            avgRating: _.get(indexRateFeature, "avgRating", 0),
            propUsers: _.get(indexRateFeature, "propUsers", 0),
            totalUsers: _.get(indexRateFeature, "totalUsers", 0),
            ratings: toUIStarRatings(_.get(indexRateFeature, "ratings", {})),
        };
    }

    return parsedRateFeatures;
};

export const toUIStarRatings = starRatings => {
    const starKeys = Object.keys(starRatings);
    if (starKeys.length < 1) return starRatings;

    const parsedStarRatings = {};

    for (let index = 0; index < starKeys.length; index++) {
        const indexStarKey = starKeys[index];
        const indexStarRating = starRatings[indexStarKey];
        parsedStarRatings[parseInt(indexStarKey)] = {
            id: _.get(indexStarRating, "id", index.toString()),
            star: _.get(indexStarRating, "star", index + 1),
            totalUsers: _.get(indexStarRating, "totalUsers", 0),
        };
    }

    return parsedStarRatings;
};
