// @ts-ignore
import * as functions from "firebase-functions";
import { signJwt, verifyJwt } from "./utils/Jwt";

const _ = require("lodash");

const AUTH_HEADER_KEY = "authorization";

const corsOptions = {
    origin: true,
    exposedHeaders: ["authorization", "Authorization"],
    // allowedHeaders: ["*"],
};

const firebaseCors = require("cors")(corsOptions);

// @ts-ignore
const getUserFromAuthReqHeader = (req, res) => {
    const authHeaderInReq = _.get(req, `headers.${AUTH_HEADER_KEY}`, undefined);
    if (authHeaderInReq) {
        const tokenParts = authHeaderInReq.split(" ");
        if (
            tokenParts.length !== 2 ||
            tokenParts[0].toLowerCase() !== "bearer"
        ) {
            res.status(401).send("No bearer auth header.");
        }

        const jwtToken = tokenParts[1];
        return verifyJwt(jwtToken);
    }
};

// @ts-ignore
const useJwtCheckOnReqHeader = (req, res) => {
    const authHeaderInReq = _.get(req, `headers.${AUTH_HEADER_KEY}`, undefined);
    const authHeaderInRes = _.get(res, `headers.${AUTH_HEADER_KEY}`, undefined);

    // ignore req if header does not have auth info
    // we allow users to explore the app without
    // requiring sign in
    if (authHeaderInReq) {
        const tokenParts = authHeaderInReq.split(" ");
        if (
            tokenParts.length !== 2 ||
            tokenParts[0].toLowerCase() !== "bearer"
        ) {
            res.status(401).send("No bearer auth header.");
        }

        const jwtToken = tokenParts[1];
        const decodedJwt = verifyJwt(jwtToken);

        if (!decodedJwt) res.status(401).send("Wrong jwt token.");

        const userId = _.get(decodedJwt, "id", undefined);
        const password = _.get(decodedJwt, "password", undefined);

        if (!userId || !password) {
            res.status(401).send("Invalid authenticated user info found.");
        }
        // if req has auth header, append it to res header as well
        else if (!authHeaderInRes) {
            res.setHeader(AUTH_HEADER_KEY, `bearer ${jwtToken}`);
        }
    }
};

// @ts-ignore
const useJwtOnResHeader = (data, res) => {
    const jwtData = { ...data };
    if (Object.keys(jwtData).includes("password")) delete jwtData["password"];
    const jwtToken = signJwt(jwtData);
    res.setHeader(AUTH_HEADER_KEY, `bearer ${jwtToken}`);
};

// @ts-ignore
const useCorsFunOnReq = handler =>
    functions.https.onRequest((req, res) => {
        firebaseCors(req, res, () => {
            if (req.method === "OPTIONS") {
                // Send response to OPTIONS requests
                res.set("Access-Control-Allow-Origin", "*");
                res.set("Access-Control-Allow-Methods", "*");
                res.set("Access-Control-Allow-Headers", "Content-Type");
                res.set("Access-Control-Max-Age", "3600");
                res.status(204).send("ok");
            }
            handler(req, res);
        });
    });

module.exports = {
    firebaseCors,
    useCorsFunOnReq,
    useJwtCheckOnReqHeader,
    useJwtOnResHeader,
    getUserFromAuthReqHeader,
};
