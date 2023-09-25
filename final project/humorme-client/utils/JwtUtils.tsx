import { sign, SignOptions, verify, VerifyOptions } from "jsonwebtoken";

let signKey = process.env.NEXT_PUBLIC_JWT_SIGN_PASSWORD;
signKey = signKey ? signKey.trim() : signKey;

const signOptions: SignOptions = {
    //todo: expiry date not added in jwt sign in
    //   expiresIn: "1d",
    algorithm: "HS512",
};

const verifyOptions: VerifyOptions = {
    algorithms: ["HS512"],
};

export function signJwt(data) {
    if (signKey) return sign(data, signKey, signOptions);
    return undefined;
}

export function verifyJwt(token) {
    try {
        if (signKey) {
            return verify(token, signKey);
        }
    } catch (err) {
        console.error(
            "[JWT] verify failed: ",
            token,
            signKey,
            verifyOptions,
            err,
        );
    }

    return undefined;
}
