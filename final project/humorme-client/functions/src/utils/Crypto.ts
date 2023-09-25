import { logger } from "firebase-functions";

const crypto = require("crypto");

export const createHash = (input: string) => {
    const hash = crypto
        .createHmac("sha256", process.env.JWT_SIGN_PASSWORD)
        .update(input)
        .digest("hex");
    return hash.slice(0, 10);
};

// if requested for experiment role using the corresponding hash value
// we validate against the expected role's hash
export const validateHash = (
    requestedRoleHash: string,
    expectedRole: string,
) => {
    const expectedRoleHash = createHash(expectedRole);
    logger.info(
        "[HASH VALIDATE] requested role hash: ",
        requestedRoleHash,
        "\noriginal hash: ",
        expectedRoleHash,
        "\nexpected role: ",
        expectedRole,
    );
    return expectedRoleHash === requestedRoleHash;
};
