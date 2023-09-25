import { logger } from "firebase-functions";

/******************* API for collection: apps ************************/
const _ = require("lodash");

export const DEFAULT_PAGE_SIZE = 25;
const addToCollectionOptions = {
    ignoreUndefinedProperties: true,
};

const { firestoreDb } = require("./firebase");
export async function getAppsFromDb(
    appId?: string,
    lastPointer?: string,
    search?: string,
    pageSize?: number,
) {
    const appsCollection = await firestoreDb.collection("apps");
    const allPageSize = pageSize || DEFAULT_PAGE_SIZE;
    if (appId) {
        let queryAppSnapShot = appsCollection.where("appId", "==", appId);

        if (search) {
            queryAppSnapShot = await queryAppSnapShot
                .where("name", ">=", search)
                .where("name", "<=", search + "\uf8ff")
                .limit(allPageSize)
                .get();
        } else {
            queryAppSnapShot = await queryAppSnapShot.limit(1).get();
        }
        if (queryAppSnapShot.empty) return undefined;
        return queryAppSnapShot.docs[0].data();
    }

    let appsSnapshot: any = undefined;

    if (search && search?.length > 0) {
        appsSnapshot = appsCollection
            .where("name", ">=", search)
            .where("name", "<=", search + "\uf8ff");
    }

    if (lastPointer !== undefined) {
        const lastDocumentRef = appsCollection.doc(lastPointer);
        if (lastDocumentRef) {
            appsSnapshot =
                appsSnapshot === undefined
                    ? appsCollection.startAfter(lastDocumentRef) //if no search query
                    : appsSnapshot.startAfter(lastDocumentRef); // with search query
        }
    }

    appsSnapshot = await (appsSnapshot === undefined
        ? appsCollection.limit(allPageSize).get() // no search query, no last pointer
        : appsSnapshot.limit(allPageSize).get()); // either search query or with last pointer

    const appsInDb: any[] = [];
    let index = 0;
    let newLastPointer: string = "";
    appsSnapshot.forEach((doc: any) => {
        const appData = doc.data();
        appsInDb.push(appData);
        index += 1;

        if (index === appsSnapshot.docs.length && doc.id !== lastPointer) {
            logger.info(
                "load more apps add last pointer: ",
                lastPointer,
                " and last doc id: ",
                doc.id,
            );
            newLastPointer = doc.id;
        }
    });

    return { apps: appsInDb, lastPointer: newLastPointer };
}

export async function getAppRateFeaturesFromDb(appId: string) {
    const appsRateFeaturesCollection = await firestoreDb.collection(
        "apps_rate_features",
    );
    const queryAppRateFeaturesSnapShot = await appsRateFeaturesCollection
        .where("appId", "==", appId)
        .limit(1)
        .get();

    let shouldFetchDomainRateFeatures = true;
    let appRateFeatureDocRef: any = undefined;
    let appRateFeaturesDocData: any = undefined;
    const appsRateFeaturesBatch = firestoreDb.batch();

    // if app rate feature doc does not exist
    // we need to create one
    if (queryAppRateFeaturesSnapShot.empty) {
        logger.info(
            `found no rate feature doc for ${appId} so creating a new doc.`,
        );
        appRateFeaturesDocData = {
            appId: appId,
            appName: "",
            domainId: "",
            domainName: "",
        };
        appRateFeatureDocRef = appsRateFeaturesCollection.doc();
        // appsRateFeaturesBatch.set(
        //     appRateFeatureDocRef,
        //     appRateFeaturesDocData,
        //     addToCollectionOptions,
        // );
        // await appsRateFeaturesBatch.commit();
    }
    // app rate feature doc exists
    else {
        appRateFeatureDocRef = queryAppRateFeaturesSnapShot.docs[0].ref;
        appRateFeaturesDocData = queryAppRateFeaturesSnapShot.docs[0].data();
    }

    const existingRateFeatures = _.get(
        appRateFeaturesDocData,
        "rateFeatures",
        undefined,
    );
    // if rateFeatures field exist in
    // app rate feature doc (existing or the new one we recently created)
    // we don't need to update it
    if (existingRateFeatures && Object.keys(existingRateFeatures).length > 0) {
        shouldFetchDomainRateFeatures = false;
    }

    // if there is not rateFeatures field
    // we need to fetch that from domain details
    // and append it to the app rate feature doc
    if (shouldFetchDomainRateFeatures) {
        logger.info(
            `Found no rate features field in app_rate_features for ${appId} so fetch from domain details: `,
        );

        // first get the app details to get domain id
        const appCollection = await firestoreDb.collection("apps");
        const appQuerySnapshot = await appCollection
            .where("appId", "==", appId)
            .limit(1)
            .get();

        // found no app, so return whatever app rate features doc we have (very unlikely)
        if (appQuerySnapshot.empty) {
            return appRateFeaturesDocData;
        }

        const appDetails = appQuerySnapshot.docs[0].data();
        appRateFeaturesDocData["appName"] = _.get(
            appDetails,
            "name",
            appRateFeaturesDocData?.appName,
        );
        appRateFeaturesDocData["domainName"] = _.get(
            appDetails,
            "domainName",
            appRateFeaturesDocData?.domainName,
        );
        appRateFeaturesDocData["domainId"] = _.get(
            appDetails,
            "domainId",
            appRateFeaturesDocData?.domainId,
        );

        const appDomainId = _.get(appDetails, "domainId", undefined);

        if (appDomainId) {
            const domainCollection = await firestoreDb.collection("domains");
            const domainQuerySnapShot = await domainCollection
                .where("id", "==", appDomainId)
                .limit(1)
                .get();

            // found no domain details from app.domainId,
            // so return whatever app rate features doc we have (very unlikely)
            if (domainQuerySnapShot.empty) {
                return appRateFeaturesDocData; // found no domain details to add rate features, so return 404
            }

            const domainDetailsDocData = domainQuerySnapShot.docs[0].data();
            const domainRateFeatures = _.get(
                domainDetailsDocData,
                "rateFeatures",
                undefined,
            );

            if (domainRateFeatures) {
                appRateFeaturesDocData["rateFeatures"] = domainRateFeatures;
                appsRateFeaturesBatch.set(
                    appRateFeatureDocRef,
                    appRateFeaturesDocData,
                    addToCollectionOptions,
                );
                await appsRateFeaturesBatch.commit();
            }
        }
    }

    return appRateFeaturesDocData;
}

export async function getAppReviewsFromDb(appId: string) {
    const appsCollection = await firestoreDb.collection("app_reviews");
    const queryAppSnapShot = await appsCollection
        .where("appId", "==", appId)
        .limit(1)
        .get();
    if (queryAppSnapShot.empty) return undefined;
    return queryAppSnapShot.docs[0].data();
}
