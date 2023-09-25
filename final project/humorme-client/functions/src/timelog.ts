const _ = require("lodash");

const { firestoreDb } = require("./firebase");

/******************* User activity log in an app (time logs) ************************/

export async function postUserAppTimeLogs(userId: string, reqData: any) {
    if (reqData) {
        const appIds = Object.keys(reqData) || [];
        const timeLogsCollection = await firestoreDb.collection("time_logs");

        for (let index = 0; index < appIds.length; index++) {
            const appId = appIds[index];
            const data = reqData[appId] || {};

            if (Object.keys(data).length > 0) {
                let queryUserAppLogSnapshot = await timeLogsCollection
                    .where("userId", "==", userId)
                    .where("appId", "==", appId)
                    .limit(1)
                    .get();

                // No document matching the criteria was found, create a new one

                if (queryUserAppLogSnapshot.empty) {
                    const userAppLogDoc = {
                        userId: userId,
                        appId: appId,
                        timeLogs: [data],
                    };

                    await timeLogsCollection.add(userAppLogDoc);
                }

                // A document matching the criteria was found
                else {
                    const docRef = await queryUserAppLogSnapshot.docs[0].ref;
                    const docData = queryUserAppLogSnapshot.docs[0].data();
                    const currentTimeLogs = _.get(docData, "timeLogs", []);
                    currentTimeLogs.push(data);
                    await docRef.update({ timeLogs: currentTimeLogs });
                }
            }
        }

        return { "saving time logs for apps: ": appIds };
    }

    return "No time logs in request body";
}
