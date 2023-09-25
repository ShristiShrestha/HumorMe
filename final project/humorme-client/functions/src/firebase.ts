import { logger } from "firebase-functions";

require("dotenv").config({ path: ".env.production" });
const firebaseAdmin = require("firebase-admin");

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.applicationDefault(),
    storageBucket: process.env.STORAGE_BUCKET,
});

const firestoreDb = firebaseAdmin.firestore();
logger.info("[FIREBASE FUNC] firestore: ", firestoreDb);

const firebaseStorage = firebaseAdmin.storage();
logger.info("[FIREBASE FUNC] storage: ", firebaseStorage);

module.exports = {
    firebaseAdmin,
    firestoreDb,
    firebaseStorage,
};
