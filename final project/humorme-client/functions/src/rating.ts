import { logger } from "firebase-functions";

const _ = require("lodash");

const { firestoreDb } = require("./firebase");

export async function postAppRatingToDb(data: any, user: any) {
    data = { ...data, user: user };
    const appId = data["appId"];
    const appName = data["appName"];
    const appsRatingsLogs = await firestoreDb.collection("app_ratings");

    let querySnapshot = await appsRatingsLogs
        .where("appId", "==", appId)
        .limit(1)
        .get();

    let appDocRef: any;
    let appDocRatingsRef: any;

    // if app rating doc does not exist for appId
    if (querySnapshot.empty) {
        // No document matching the criteria was found, create a new one
        const appRatingDoc = {
            appId: data["appId"],
            appName: data["appName"],
        };
        appDocRef = await appsRatingsLogs.add(appRatingDoc);
    }
    // else app rating doc exists for appId
    else {
        appDocRef = querySnapshot.docs[0].ref;
    }

    try {
        if (appDocRef) {
            // inside app_rating doc for appId, get existing/new collection for ratings
            appDocRatingsRef = appDocRef.collection("ratings");
            if (appDocRatingsRef) {
                await appDocRatingsRef.add(data);
                await callbackAppRating(appId, appName);

                return;
            }
        }

        logger.info("[ADD RATING] could not find ref to save ratings: ", data);
    } catch (e) {
        logger.error(
            "[ADD RATING] failed to save rating: ",
            e,
            "\nrating data: ",
            data,
        );
    }
}

/******************* App Rating triggers ************************/
export const callbackAppRating = async (appId: string, appName: string) => {
    // make sure app exists
    const appsCollection = await firestoreDb.collection("apps_rate_features");
    const appsRatingsLogs = await firestoreDb.collection("app_ratings");

    let queryAppSnapShot = await appsCollection
        .where("appId", "==", appId)
        .limit(1)
        .get();

    if (queryAppSnapShot.empty) {
        logger.error(
            "[callbackAppRating] no app details for app: ",
            appId,
            appName,
        );
        return {};
    }

    // find all users' ratings for this app
    const queryAppRatingsSnapshot = await appsRatingsLogs
        .where("appId", "==", appId)
        .limit(1)
        .get();

    // if no ratings exists for this app,
    // we return {}
    if (queryAppRatingsSnapshot.empty) {
        logger.error(
            "[callbackAppRating] no app_rating doc for app: ",
            appId,
            appName,
        );

        return {};
    }

    // if users' ratings exists for this app
    else {
        const appRatingDoc = queryAppRatingsSnapshot.docs[0];
        const appRatingDocRef = appRatingDoc.ref;
        const appRatingsQuerySnapshot = await appRatingDocRef
            .collection("ratings")
            .get();
        const ratings = !appRatingsQuerySnapshot.empty
            ? appRatingsQuerySnapshot.docs.map((item: any) => item.data())
            : [];

        // total number of users who rated this app till this point
        const totalUsersCount = ratings.length || 0;

        // users' ratings exists for this app
        if (totalUsersCount > 0) {
            const featuresUsersCount: any = {};
            let totalUsersRatingFeatures = 0;

            // loop through each feature rating by this user to this app
            for (let userIndex = 0; userIndex < totalUsersCount; userIndex++) {
                const indexUserRating = ratings[userIndex];
                const indexUserStarRatings = indexUserRating["star"];
                const features = Object.keys(indexUserStarRatings);

                // logger.info(
                //     "features: for user id: ",
                //     indexUserRating["id"],
                //     features,
                // );
                const hasRatedFeature =
                    Object.entries(indexUserStarRatings).filter(
                        (
                            // @ts-ignore
                            [feature, starRatingForFeature],
                        ) =>
                            feature !== "OVERALL" && // @ts-ignore
                            parseInt(starRatingForFeature.toString()) > 0,
                    ).length > 0;

                if (hasRatedFeature) totalUsersRatingFeatures += 1;

                // loop through each feature star-rating for this user
                for (
                    let featureIndex = 0;
                    featureIndex < features.length;
                    featureIndex++
                ) {
                    const feature = features[featureIndex];

                    // if new feature found
                    if (!Object.keys(featuresUsersCount).includes(feature)) {
                        // initialize star-rating for this feature from this user for this app
                        featuresUsersCount[feature] = {
                            totalUsers: 0, // total users rating this feature for each 1 to 5 stars
                            stars: {
                                0: 0, // users rated 1-star
                                1: 0, // users rated 2-stars
                                2: 0,
                                3: 0,
                                4: 0,
                            },
                        };
                    }

                    // star given for this feature by this user
                    // e.g. {RATE_FEATURE_0 : 3} means 2-star
                    const featureRatingFromUser = indexUserStarRatings[feature];
                    featuresUsersCount[feature]["totalUsers"] += 1;
                    featuresUsersCount[feature]["stars"][
                        featureRatingFromUser - 1
                    ] += 1;
                }
            }

            // logger.info("done looping users; rating: ", featuresUsersCount);

            //-- DONE loop through each user's rating to this app --

            // fetch latest app details
            queryAppSnapShot = await appsCollection
                .where("appId", "==", appId)
                .limit(1)
                .get();

            // update rate features average values in app details
            if (queryAppSnapShot.empty) {
                logger.error(
                    "[callbackAppRating] no app details for app: ",
                    appId,
                    "\nupdated featuresUsersCount: ",
                    featuresUsersCount,
                    "\ntotal Rating Users: ",
                    totalUsersCount,
                );
            }

            // app exists, so update its rating info
            else {
                const appRef = queryAppSnapShot.docs[0].ref;
                const appData = queryAppSnapShot.docs[0].data();
                const appRateFeatures = appData["rateFeatures"] || {};
                const features = Object.keys(featuresUsersCount);
                //
                // logger.info("appRateFeatures: ", appRateFeatures);
                //
                // logger.info("featuresUsersCount: ", featuresUsersCount);
                //
                // logger.info("features:  ", features);

                for (
                    let featureIndex = 0;
                    featureIndex < features.length;
                    featureIndex++
                ) {
                    const featureKey = features[featureIndex];

                    const featureStars =
                        featuresUsersCount[featureKey]["stars"];
                    const featureStarsKeys = Object.keys(featureStars);
                    let totalUsersForFeature = 0;
                    const starUsersMultiply: any = {};
                    for (
                        let starIndex = 0;
                        starIndex < featureStarsKeys.length;
                        starIndex++
                    ) {
                        const featureStar = featureStarsKeys[starIndex];

                        if (
                            Object.keys(
                                _.get(
                                    appRateFeatures,
                                    `${featureKey}.ratings`,
                                    {},
                                ),
                            ).includes(featureStar)
                        ) {
                            const starCount = parseInt(featureStar) + 1;
                            const totalFeatureStarUsers =
                                featureStars[featureStar];
                            appRateFeatures[featureKey]["ratings"][featureStar][
                                "star"
                            ] = starCount;
                            appRateFeatures[featureKey]["ratings"][featureStar][
                                "totalUsers"
                            ] = totalFeatureStarUsers;

                            // totalUsersRatingThisFeature = sum (number of users per star)
                            totalUsersForFeature += totalFeatureStarUsers;

                            starUsersMultiply[starCount] =
                                starCount * totalFeatureStarUsers;
                        }
                    }

                    // logger.info("star users: ", featureKey, starUsersMultiply);

                    // star rating (1 to 5) updated for this feature,
                    // now, update totalUsers who rated this feature
                    // and update the average rating for this feature

                    if (Object.keys(appRateFeatures).includes(featureKey)) {
                        appRateFeatures[featureKey]["totalUsers"] =
                            totalUsersForFeature;
                        // proportion of total rating users rating this feature
                        appRateFeatures[featureKey]["propUsers"] =
                            totalUsersForFeature / totalUsersCount;

                        // sum(x.f) where x is star value and f is the frequency
                        // @ts-ignore
                        const sumStarUsers: number = Object.values(
                            starUsersMultiply, // @ts-ignore
                        ).reduce((partialSum, x) => partialSum + x, 0);

                        appRateFeatures[featureKey]["avgRating"] =
                            sumStarUsers / totalUsersForFeature;
                    }
                }

                // logger.info(
                //     "finalized param to save in app : ",
                //     appRateFeatures,
                // );

                // update the rate features in app details
                await appRef.update({
                    // total users who rated this app till this point
                    totalUsersCount: totalUsersCount,
                    // total users who rated this app using rate features till this point
                    totalUsersRatingFeatures: totalUsersRatingFeatures,
                    // feature wise rating info for this app till this point
                    rateFeatures: appRateFeatures,
                });
            }
            const postUpdateQuery = await appsCollection
                .where("appId", "==", appId)
                .limit(1)
                .get();
            if (postUpdateQuery.empty) return {};
            return postUpdateQuery.docs[0].data();
        }
    }

    return {};
};
