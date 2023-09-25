import * as functions from "firebase-functions";
import { logger } from "firebase-functions";
import {
    addDomainRateFeaturesInApps,
    getAppDetailsFromStorage,
    getAppReviewsFromStorage,
    getDomainDetailsFromStorage,
    getUsersFromStorage,
} from "./storage";
import {
    getAppRateFeaturesFromDb,
    getAppReviewsFromDb,
    getAppsFromDb,
} from "./apps";
import { callbackAppRating, postAppRatingToDb } from "./rating";
import { postUserAppTimeLogs } from "./timelog";
import {
    assignUserToGroup,
    FetchUsersParams,
    getUsersFromDb,
    processSignIn,
} from "./users";
import { UserRole } from "./utils/Users";
import { validateHash } from "./utils/Crypto";

const { firestoreDb } = require("./firebase");
const {
    useCorsFunOnReq,
    getUserFromAuthReqHeader,
    useJwtOnResHeader,
} = require("./jwtInterceptor");
const _ = require("lodash");

// const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

/******************* Https API functions ************************/

// @ts-ignore
exports.helloWorld = useCorsFunOnReq((req, res) => {
    logger.info("[HELLO WORLD] Hello logs 3:52PM!", {
        structuredData: true,
    });
    const docData = {
        app: "dummy",
    };

    logger.info("adding doc data to firestore: ", docData);
    firestoreDb
        .collection("apps")
        .add(docData)
        // @ts-ignore
        .then(res => {
            logger.info("apps addData: ", res);
        })
        // @ts-ignore
        .catch(err => {
            logger.error("apps addData error: ", err);
        });

    res.send("Hello from Firebase 3:52PM!");
});

// @ts-ignore
exports.toHome = useCorsFunOnReq((req, res) => {
    res.redirect("/");
});

/******************* Initialization ************************/

//@ts-ignore
exports.initAppDetails = useCorsFunOnReq((req, res) => {
    getAppDetailsFromStorage().then(resData => res.status(200).send(resData));
});

//@ts-ignore
exports.initAppReviews = useCorsFunOnReq((req, res) => {
    getAppReviewsFromStorage().then(resData => res.status(200).send(resData));
});

//@ts-ignore
exports.initDomainDetails = useCorsFunOnReq((req, res) => {
    getDomainDetailsFromStorage().then(resData =>
        res.status(200).send(resData),
    );
});

//@ts-ignore
exports.initAppRateFeaturesFromDomains = useCorsFunOnReq((req, res) => {
    addDomainRateFeaturesInApps().then(resData =>
        res.status(200).send(resData),
    );
});

//@ts-ignore
exports.initNewUsers = useCorsFunOnReq((req, res) => {
    getUsersFromStorage().then(resData => res.status(200).send(resData));
});

/******************* Fetch App details functions ************************/
//@ts-ignore
exports.apiGetApps = useCorsFunOnReq((req, res) => {
    getAppsFromDb(
        req.query.appId,
        req.query.lastPointer,
        req.query.search,
        req.query.pageSize,
    ).then((resData: any) => {
        if (resData) return res.status(200).send(resData);
        return res.status(404);
    });
});

//@ts-ignore
exports.apiGetAppReviews = useCorsFunOnReq((req, res) => {
    getAppReviewsFromDb(req.query.appId).then((resData: any) => {
        if (resData) return res.status(200).send(resData);
        return res.status(404);
    });
});

//@ts-ignore
exports.apiGetAppRateFeatures = useCorsFunOnReq((req, res) => {
    try {
        const appId = req?.query?.appId;
        if (appId) {
            const loggedUser = getUserFromAuthReqHeader(req, res);
            if (loggedUser) {
                const role = _.get(loggedUser, "role", UserRole.CONTROL);
                if (role === UserRole.EXPERIMENT) {
                    getAppRateFeaturesFromDb(appId).then((resData: any) => {
                        if (resData) return res.status(200).send(resData);
                        return res
                            .status(404)
                            .send(`Found no rate features for app ${appId}`);
                    });
                } else
                    return res
                        .status(403)
                        .send("Forbidden access to rate features.");
            } else {
                return res
                    .status(401)
                    .send("Unauthorized access. Please login first.");
            }
        } else {
            return res.status(400).send("Please provide a valid app id.");
        }
    } catch (e) {
        return res
            .status(404)
            .send(`Found no rate features for app ${req?.query?.appId}`);
    }
});

/******************* Fetch users function ************************/
//@ts-ignore
exports.apiGetUsers = useCorsFunOnReq((req, res) => {
    const query = req.query;
    const params: FetchUsersParams = {
        id: _.get(query, "id", undefined),
        role: _.get(query, "role", undefined),
        roleStatus: _.get(query, "role_status", undefined),
        createdAfterTs: _.get(query, "created_after_ts", undefined),
        limit: parseInt(_.get(query, "limit", "25")),
    };
    getUsersFromDb(params).then(resData => res.status(200).send(resData));
});

/******************* Assign new users to groups ************************/

//@ts-ignore
exports.apiPostUserSignIn = useCorsFunOnReq((req, res) => {
    if (req.method !== "POST" && req.method !== "OPTIONS") {
        return res.status(405).send("Method Not Allowed");
    }

    if (req.method === "POST") {
        const password = _.get(req, "body.password", undefined);
        if (password) {
            processSignIn(password).then(resData => {
                if (resData) {
                    useJwtOnResHeader(resData, res);
                    return res.status(200).send(resData);
                }
                return res.status(404).send("No user available.");
            });
        } else {
            logger.info(
                "[User sign in] error: invalid passcode: ",
                req.body,
                req.method,
            );
            return res.status(403).send("Invalid passcode.");
        }
    }
});

//@ts-ignore
exports.apiPostAssignUserToGroup = useCorsFunOnReq(async (req, res) => {
    if (req.method !== "POST" && req.method !== "OPTIONS") {
        return res.status(405).send("Method Not Allowed");
    }
    if (req.method === "POST") {
        const loggedUserFromAuthHeader = getUserFromAuthReqHeader(req, res);

        if (
            loggedUserFromAuthHeader &&
            loggedUserFromAuthHeader?.id?.length > 0
        ) {
            try {
                const userFromDb = await getUsersFromDb({
                    id: loggedUserFromAuthHeader?.id,
                    limit: 1,
                });

                if (userFromDb.length > 0) {
                    logger.info(
                        "[ROLE ASSIGN] found user from JWT header: ",
                        userFromDb[0],
                    );
                    return res.status(200).send(userFromDb[0]);
                }
            } catch (e) {
                logger.error(
                    "User from JWT not in db: ",
                    loggedUserFromAuthHeader,
                );
            }
        }

        // const sendEmailTo = _.get(req, "body.sendEmailTo", undefined);
        // if (sendEmailTo) {
        //     try {
        //         const validEmail = emailRegex.test(sendEmailTo);
        //         if (!validEmail) return res.status(403).send("Invalid email.");
        //     } catch (err) {
        //         logger.info("[User assign] email invalid: ", sendEmailTo, err);
        //         return res.status(403).send("Invalid email.");
        //     }
        // }

        const role_id_hash = _.get(req, "body.role_id", undefined);
        let userRole = UserRole.CONTROL; // by default set to control group

        // if role hash exists in req query, assign accordingly
        // else, we randomly assign them
        if (role_id_hash && role_id_hash?.length > 0) {
            const isExperiment = validateHash(
                role_id_hash,
                UserRole.EXPERIMENT,
            );

            // if hash matches, set user to treatment/experiment group
            if (isExperiment) userRole = UserRole.EXPERIMENT;
        }
        assignUserToGroup(userRole).then(resData => {
            if (resData) {
                // if (sendEmailTo) sendEmailPassphrase(resData, sendEmailTo);
                useJwtOnResHeader(resData, res);
                // if (Object.keys(resData).includes("password"))
                //     delete resData["password"];
                return res.status(200).send(resData);
            }
            return res.status(404).send("No user available.");
        });
    }
});

/******************* Save App Ratings ************************/
//@ts-ignore
exports.apiPostAppRating = useCorsFunOnReq(async (req, res) => {
    if (req.method !== "POST" && req.method !== "OPTIONS") {
        return res.status(405).send("Method Not Allowed");
    }
    if (req.method === "POST") {
        const loggedUser = getUserFromAuthReqHeader(req, res) || {
            id: "-1",
            name: "anonymous",
            role: UserRole.CONTROL,
        };
        if (loggedUser)
            postAppRatingToDb(req.body, loggedUser).then(() =>
                res
                    .status(200)
                    .send("your ratings have been submitted successfully."),
            );
        else res.status(401).send("Please login first.");
    }
});

//@ts-ignore
exports.callbackPostAppRating = useCorsFunOnReq((req, res) => {
    if (req.method !== "POST" && req.method !== "OPTIONS") {
        return res.status(405).send("Method Not Allowed");
    }
    if (req.method === "POST") {
        callbackAppRating(req.body.appId, req.body.appName).then(resData =>
            res.status(200).send(resData),
        );
    }
});

/******************* Save per user per app time logs ************************/
// @ts-ignore
exports.apiPostUserAppTimeLogs = useCorsFunOnReq((req, res) => {
    if (req.method !== "POST" && req.method !== "OPTIONS") {
        return res.status(405).send("Method Not Allowed");
    }

    if (req.method === "POST") {
        postUserAppTimeLogs(req.query.userId, req.body).then(resData =>
            res.status(200).send(resData),
        );
    }
});

/******************* Auth functions triggers ************************/

export const createUserDocument = functions.auth.user().onCreate(user => {
    firestoreDb
        .collection("users")
        .doc(user.uid)
        .set(JSON.parse(JSON.stringify(user)))
        //@ts-ignore
        .then(res => {
            logger.info("users onCreate: ", res);
        });
});
