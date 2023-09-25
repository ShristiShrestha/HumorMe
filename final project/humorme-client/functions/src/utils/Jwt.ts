import { SignOptions } from "jsonwebtoken";
import { logger } from "firebase-functions";

const jwt = require("jsonwebtoken");

let signKey = process.env.JWT_SIGN_PASSWORD;
signKey = signKey ? signKey.trim() : signKey;

const options: SignOptions = {
    //todo: expiry date not added in jwt sign in
    //   expiresIn: "1d",
    // algorithm: "HS512",
};

export function signJwt(data: any) {
    return jwt.sign(data, signKey, options);
}

export function verifyJwt(token: string) {
    try {
        return jwt.verify(token, signKey);
    } catch (err) {
        logger.error("[JWT] verify failed: ", token, err);
    }

    return undefined;
}
