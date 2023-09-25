import { logger } from "firebase-functions";
import { v4 as uuidv4 } from "uuid";
import { UserRole, UserRoleStatus } from "./utils/Users";

const _ = require("lodash");

const { firebaseStorage, firestoreDb } = require("./firebase");
const csv = require("csv-parser");

const addToCollectionOptions = {
    ignoreUndefinedProperties: true,
};

const parseAppname = (appname: string) => {
    let updatedName = appname.replace(/\W+/g, "-");
    updatedName = updatedName.replace(/^-+|-+$/g, "");
    return updatedName;
};

type RateFeaturesType = {
    [title: string]: string;
};

const createRateFeaturesFields = (rateFeaturesDesc?: RateFeaturesType) => {
    const featuresTitle = rateFeaturesDesc ? Object.keys(rateFeaturesDesc) : [];
    const numFeatures = featuresTitle?.length || 3;
    const overallStarRatings: any = {};
    for (let starIndex = 0; starIndex < 5; starIndex++) {
        overallStarRatings[starIndex] = {
            id: uuidv4(),
            star: starIndex + 1,
            totalUsers: 0,
        };
    }

    const overallRating = {
        id: uuidv4(),
        name: "Overall",
        desc: "",
        avgRating: 0,
        propUsers: 0,
        totalUsers: 0,
        ratings: overallStarRatings,
    };

    const allRatingsInStore: any = {};
    allRatingsInStore["OVERALL"] = overallRating;

    for (let featureIndex = 0; featureIndex < numFeatures; featureIndex++) {
        const rateFeatureName =
            featuresTitle[featureIndex] || "Rate Feature " + featureIndex;
        const featureRatings: any = {};

        for (let starIndex = 0; starIndex < 5; starIndex++) {
            featureRatings[starIndex] = {
                id: uuidv4(),
                star: starIndex + 1,
                totalUsers: 0,
            };
        }

        allRatingsInStore[rateFeatureName.toUpperCase()] = {
            id: uuidv4(),
            name: rateFeatureName,
            desc:
                featuresTitle.length > featureIndex
                    ? _.get(
                          rateFeaturesDesc,
                          featuresTitle[featureIndex],
                          "The app is " + rateFeatureName.toLowerCase() + ".",
                      )
                    : "Default description " + rateFeatureName,
            avgRating: 0,
            propUsers: 0,
            totalUsers: 0,
            ratings: featureRatings,
        };
    }

    return allRatingsInStore;
};

/******************* APP DETAILS ************************/
// @ts-ignore
export async function getAppDetailsFromStorage(saveToDb = true) {
    const bucket = firebaseStorage.bucket(process.env.APP_DETAILS_FILES);

    // @ts-ignore
    const [csvFiles] = await bucket.getFiles();

    logger.info(
        "csv files app details:  ",
        csvFiles.map((item: any) => item["name"]),
    );

    for (let index = 0; index < csvFiles.length; index++) {
        const csvApps: any[] = [];
        const fileBucket = csvFiles[index];
        const bucketName = fileBucket["name"].replace(".csv", "");
        fileBucket
            .createReadStream()
            .pipe(csv())
            .on("data", (row: any) => {
                // Process each row of the CSV file
                const dataMap: any = JSON.parse(row["data"]);
                const rowDto: any = {
                    appId: row["id"],
                    name: row["name"],
                    formattedName: parseAppname(row["name"]),
                    genres: dataMap["genres"] || "",
                    genreIds: dataMap["genreIds"] || "",
                    primaryGenre: dataMap["primaryGenreName"] || "",
                    primaryGenreId: dataMap["primaryGenreId"] || "",
                    url: row["url"] || "",
                    data: dataMap || {},
                    domainId: row["domainId"] || "-1",
                    domainName: row["domainName"] || "",
                };
                csvApps.push(rowDto);
            })
            .on("end", async () => {
                if (saveToDb) {
                    await addAppsDetailsFromCsvToDb(csvApps, bucketName);
                }
            })
            .on("error", (error: any) => {
                logger.error(
                    "Failed csv app details parsing: ",
                    bucketName,
                    error,
                );
            });
    }

    return {
        "loading apps details from files: ": csvFiles.map(
            (item: any) => item["name"],
        ),
    };
}

// array of apps details
// [0].keys: "0", "name", "url", "id", "data" => ignore first row index like "0"

//WARNING: using models/dto/CSVAppDto.ts causes issue in deploying functions
// well since this is out of the scope of the function repository, it fails to find
// it and the function is not compiled
async function addAppsDetailsFromCsvToDb(data: any[], domain: string) {
    try {
        const appsCollection = await firestoreDb.collection("apps");
        const appsRateFeaturesCollection = await firestoreDb.collection(
            "apps_rate_features",
        );
        const appsSnapshot = await appsCollection.get();
        const appsInDb: any[] = [];

        appsSnapshot.forEach((doc: any) => {
            const appData = doc.data();
            appsInDb.push(appData);
        });
        const dbAppNames = appsInDb.map(app => app.appId);
        logger.info(
            "fetched apps details from firestore: ",
            dbAppNames.length,
            domain,
        );

        let appsNotInDb = data;
        if (dbAppNames.length > 0) {
            appsNotInDb = data.filter(app => !dbAppNames.includes(app.appId));
        }
        logger.info("app details not in db: ", appsNotInDb.length, domain);

        if (appsNotInDb.length > 0) {
            const appsBatch = firestoreDb.batch();
            const appsRateFeaturesBatch = firestoreDb.batch();
            appsNotInDb.forEach(app => {
                const docRef = appsCollection.doc();
                appsBatch.set(docRef, app, addToCollectionOptions);
                const appRateFeaturesDocRef = appsRateFeaturesCollection.doc();
                const appRateFeatures = {
                    appId: app?.appId || "-1",
                    appName: app?.name || "",
                    domainId: app?.domainId || "-1",
                    domainName: app?.domainName || "",
                };
                appsRateFeaturesBatch.set(
                    appRateFeaturesDocRef,
                    appRateFeatures,
                    addToCollectionOptions,
                );
            });
            await appsBatch.commit();
            await appsRateFeaturesBatch.commit();
            logger.info(
                "Success save apps details to firestore: ",
                domain,
                appsNotInDb.length,
            );
        }
    } catch (err) {
        logger.error("Error apps details to firestore: ", domain, err);
    }
}

/******************* APP REVIEWS ************************/

// @ts-ignore
export async function getAppReviewsFromStorage(saveToDb = true) {
    const bucket = firebaseStorage.bucket(process.env.APP_REVIEWS_FILES);

    // @ts-ignore
    const [csvFiles] = await bucket.getFiles();

    logger.info(
        "csv files app reviews:  ",
        csvFiles.map((item: any) => item["name"]),
    );

    // @ts-ignore
    csvFiles.map(fileBucket => {
        const csvReviews: any[] = [];
        const bucketName = fileBucket["name"].replace(".csv", "");
        let appName: string = "";
        fileBucket
            .createReadStream()
            .pipe(csv())
            // @ts-ignore
            .on("data", row => {
                const devRes: any = _.get(row, "developerResponse", undefined);
                const rowDto: any = {
                    reviewId: uuidv4().toString(),
                    domain: _.get(row, "domain", "")?.toString()?.toLowerCase(),
                    name: _.get(row, "app name", ""), // app's name
                    appId: _.get(row, "app id", ""), // app's appId
                    rating: _.get(row, "rating", ""),
                    title: _.get(row, "title", ""),
                    review: _.get(row, "review", ""),
                    date: _.get(row, "date", ""),
                    username: _.get(row, "userName", ""),
                    developerResponse:
                        devRes?.length > 0 ? JSON.parse(devRes) : {},
                };
                appName = row["app name"];
                csvReviews.push(rowDto);
            })
            .on("end", async () => {
                if (saveToDb) {
                    await addAppReviewsFromCsvToDb(
                        csvReviews,
                        bucketName,
                        appName,
                    );
                }
            })
            .on("error", (error: any) => {
                logger.error("Failed csv reviews parsing: ", bucketName, error);
            });
    });
    // @ts-ignore
    return {
        "loading reviews from files: ": csvFiles.map(
            (item: any) => item["name"],
        ),
    };
}

// @ts-ignore
async function addAppReviewsFromCsvToDb(
    data: any[],
    appId: string,
    appName: string,
) {
    try {
        const appReviewsCollection = await firestoreDb.collection(
            "app_reviews",
        );
        const appReviewsSnapshot = await appReviewsCollection
            .where("appId", "==", appId)
            .get();

        if (!appReviewsSnapshot.empty) {
            appReviewsSnapshot.forEach((doc: any) => {
                const appReviewsData = doc.data();
                const appReviewsDocId = doc["id"];
                const appReviews = data || [];
                appReviewsData["reviews"] = appReviews;
                appReviewsCollection
                    .doc(appReviewsDocId)
                    .update(appReviewsData, addToCollectionOptions)
                    .then(() => {
                        logger.info(
                            "Updated reviews to app: ",
                            appName,
                            appReviews.length,
                        );
                    })
                    .catch((err: any) => {
                        logger.error(
                            "error save reviews to app: ",
                            appName,
                            appReviews.length,
                            err,
                        );
                    });
            });
        } else {
            const newAppReviewsDoc = {
                appId: appId,
                appName: appName,
                reviews: data,
            };
            await appReviewsCollection.add(
                newAppReviewsDoc,
                addToCollectionOptions,
            );
            logger.info("Reviews added to app: ", appName, data.length);
        }
    } catch (err) {
        logger.error(
            "Error reviews to app: ",
            appId,
            appName,
            data.length,
            err,
        );
    }
}

/******************* USERS INITIALIZATION ************************/

export async function getUsersFromStorage(saveToDb = true) {
    const bucket = firebaseStorage.bucket(process.env.NEW_USERS_FILES);

    // @ts-ignore
    const [csvFiles] = await bucket.getFiles();

    logger.info(
        "csv files new users:  ",
        csvFiles.map((item: any) => item["name"]),
    );

    for (let index = 0; index < csvFiles.length; index++) {
        const csvUsers: any[] = [];
        const fileBucket = csvFiles[index];
        fileBucket
            .createReadStream()
            .pipe(csv())
            .on("data", (row: any) => {
                const userInfo: any = {
                    id: uuidv4().toString(),
                    csvId: _.get(row, "id", uuidv4().toString()),
                    password: _.get(row, "password", "NO_PASSWORD"),
                    // @ts-ignore
                    role: UserRole[
                        _.get(row, "role", UserRole.CONTROL.toString())
                    ],
                    roleStatus:
                        // @ts-ignore
                        UserRoleStatus[
                            _.get(
                                row,
                                "role_status",
                                UserRoleStatus.AVAILABLE.toString(),
                            )
                        ],
                    csvCreatedAt: _.get(row, "created_at", ""),
                    createdAt: new Date(),
                };
                csvUsers.push(userInfo);
            })
            .on("end", async () => {
                if (saveToDb) {
                    await addCsvUsersToDb(csvUsers);
                }
            });
    }

    return {
        "loading users from files: ": csvFiles.map((item: any) => item["name"]),
    };
}

async function addCsvUsersToDb(csvUsers: any[]) {
    try {
        const usersCollection = await firestoreDb.collection("users");
        const batch = firestoreDb.batch();
        let usersAdded = 0;
        let noPasswordUsers = 0;

        for (const userInfo of csvUsers) {
            const userPass = _.get(userInfo, "password", "NO_PASSWORD");
            if (userPass !== "NO_PASSWORD") {
                const snapshotByPass = await usersCollection
                    .where("password", "!=", userPass)
                    .get();
                // a user with this password already exists
                // ignore saving such user again
                if (!snapshotByPass.empty) {
                    logger.info("found users with existing pass: ", userPass);
                }
                // no user has this password
                // we add it to the db
                else {
                    const userRef = usersCollection.doc();
                    batch.set(userRef, userInfo, addToCollectionOptions);
                    usersAdded += 1;
                }
            } else {
                noPasswordUsers += 1;
                logger.info("Found a user with NO_PASSWORD", userInfo);
            }
        }

        if (usersAdded > 0) {
            await batch.commit();
            logger.info("Success new users creation to firestore.", usersAdded);
        }

        if (noPasswordUsers > 0) {
            logger.info("Found total NO_PASSWORD users: ", noPasswordUsers);
        }
    } catch (err) {
        logger.error("Error users creation to firestore: ", err);
    }
}
/******************* DOMAIN DETAILS AND APP RATE FEATURES ************************/

export async function getDomainDetailsFromStorage(saveToDb = true) {
    const bucket = firebaseStorage.bucket(process.env.DOMAIN_DETAILS_FILES);

    // @ts-ignore
    const [csvFiles] = await bucket.getFiles();

    logger.info(
        "csv files domain rate features:  ",
        csvFiles.map((item: any) => item["name"]),
    );

    // @ts-ignore
    csvFiles.map(fileBucket => {
        const domainRateFeatures: any[] = [];
        // save domain as filename
        const bucketName = fileBucket["name"].replace(".csv", "");
        // @ts-ignore
        const allDomain: any = {};
        // logger.info("file bucket: ", bucketName);
        fileBucket
            .createReadStream()
            .pipe(csv()) // @ts-ignore
            .on("data", row => {
                const rateFeaturesInfo = _.get(row, "rateFeatures", undefined);
                const rateFeaturesDesc = rateFeaturesInfo
                    ? JSON.parse(rateFeaturesInfo)
                    : undefined;
                const rateFeatures = createRateFeaturesFields(rateFeaturesDesc);
                const domainInfo: any = {
                    id: _.get(row, "id", uuidv4().toString()),
                    name: _.get(row, "name", ""),
                    rateFeatures: rateFeatures,
                };
                domainRateFeatures.push(domainInfo);
            })
            .on("end", async () => {
                if (saveToDb) {
                    await addDomainDetailsFromCsvToDb(
                        domainRateFeatures,
                        bucketName,
                    );
                }
            })
            .on("error", (error: any) => {
                logger.error(
                    "Failed domain rate features parsing: ",
                    bucketName,
                    error,
                );
            });
    });

    // @ts-ignore
    return {
        "loading domain rate features from files: ": csvFiles.map(
            (item: any) => item["name"],
        ),
    };
}

async function addDomainDetailsFromCsvToDb(data: any[], filename: string) {
    try {
        const domainsCollection = await firestoreDb.collection("domains");
        const domainsInDb: any[] = [];
        const domainsSnapshot = await domainsCollection.get();

        domainsSnapshot.forEach((doc: any) => {
            const domainData = doc.data();
            domainsInDb.push(domainData);
        });
        const existingDomainNames = domainsInDb.map(domain => domain.id);
        logger.info(
            "fetched domains details from firestore: ",
            existingDomainNames.length,
        );

        let domainsNotInDb = data;
        if (existingDomainNames.length > 0) {
            domainsNotInDb = data.filter(
                domainData => !existingDomainNames.includes(domainData.id),
            );
        }
        logger.info(
            "domains not in db: ",
            domainsNotInDb.length,
            "\nloaded from storage: ",
            filename,
        );

        if (domainsNotInDb.length > 0) {
            const batch = firestoreDb.batch();
            domainsNotInDb.forEach(domainData => {
                const docRef = domainsCollection.doc();
                batch.set(docRef, domainData, addToCollectionOptions);
            });
            await batch.commit();
            logger.info(
                "Success save domain details to firestore: ",
                filename,
                domainsNotInDb.length,
            );
        }
    } catch (err) {
        logger.error(
            "Error saving domains details to firestore: ",
            filename,
            err,
        );
    }
}

export async function addDomainRateFeaturesInApps() {
    try {
        const appsCollection = await firestoreDb.collection(
            "apps_rate_features",
        );
        const domainsCollection = await firestoreDb.collection("domains");
        const domainQuery = domainsCollection.where("id", "!=", "");
        const domainSnapshot = await domainQuery.get();

        if (!domainSnapshot.empty) {
            for (let index = 0; index < domainSnapshot.docs.length; index++) {
                const domainData = domainSnapshot.docs[index].data();
                const domainId = _.get(domainData, "id", "-1");
                const domainName = _.get(domainData, "name", "");
                const domainRateFeatures = _.get(
                    domainData,
                    "rateFeatures",
                    {},
                );
                if (Object.keys(domainRateFeatures).length > 0) {
                    const domainAppsSnapshot = await appsCollection
                        .where("appId", "!=", "")
                        .where("domainId", "==", domainId)
                        .get();
                    if (!domainAppsSnapshot.empty) {
                        const batch = firestoreDb.batch();
                        let appsAddedInDomain = 0;
                        domainAppsSnapshot.forEach((appDoc: any) => {
                            const appRef = appDoc.ref;
                            const appData = appDoc.data();
                            appData["rateFeatures"] = domainRateFeatures;
                            batch.set(appRef, appData, addToCollectionOptions);
                            appsAddedInDomain += 1;
                        });

                        if (appsAddedInDomain > 0) {
                            await batch.commit();
                            logger.info(
                                "Success domain rate features added to apps: ",
                                domainName,
                                appsAddedInDomain,
                            );
                        } else {
                            logger.error(
                                "No apps saved in batch with domain rate features: ",
                                domainName,
                                domainAppsSnapshot.docs.length,
                            );
                        }
                    } else {
                        logger.error(
                            "No apps found in domain: ",
                            domainName,
                            domainId,
                        );
                    }
                } else {
                    logger.error(
                        "No rate features found in domain: ",
                        domainName,
                        domainId,
                    );
                }
            }
        } else {
            logger.error("No domains found to update app's rate features.");
        }

        return domainSnapshot.docs.map((item: any) => item.data());
    } catch (err) {
        logger.info("Failed to save domain rate features in apps: ", err);
    }

    return {};
}
