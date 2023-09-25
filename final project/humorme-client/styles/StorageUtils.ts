export const genRandom = () => {
    console.log("hello gen random");
};
// import {getDownloadURL, ref as storageRef} from "firebase/storage";
// import {addDoc, collection, getDocs} from "firebase/firestore";
// import {firebaseStorage, firestore} from "../../utils/FirebaseUtils";
// import Papa from "papaparse";
// import * as functions from "firebase-functions";
//
// const storageBaseURL = process.env.NEXT_PUBLIC_STORAGE_BUCKET;
// const APP_DOMAINS = ["investing", "ride_sharing", "mental_health"];
//
// // eslint-disable-next-line max-len
// /** ***************** Fetch apps details from firebase storage ************************/
// const getAllAppDetails = async () => {
//   const appDetailsData: [] = [];
//
//   for (let i = 0; i < 3; i++) {
//     const domain = APP_DOMAINS[i];
//     // Define the path to the CSV file in the Storage emulator
//     // eslint-disable-next-line max-len
//     const csvFilePath = `${storageBaseURL}/app_details/${domain}_appdetails.csv`;
//     console.log("csv file : ", csvFilePath);
//
//     // Download the file from the Storage emulator
//     getDownloadURL(storageRef(firebaseStorage, csvFilePath))
//       .then((downloadURL) => {
//         // Use the downloadURL to fetch the CSV file
//         console.log("download url: ", downloadURL);
//         return fetch(downloadURL);
//       })
//       .then((response) => {
//         // Read the response as text
//         // console.log("download res: ", response);
//         return response.text();
//       })
//       .then((csvText) => {
//         // Parse the CSV text using Papa Parse
//         const {
//           data: rows,
//           meta: {fields: header},
//         } = Papa.parse(csvText, {header: true});
//
//         // Log the parsed rows and header
//         console.log("Header:", header);
//
//         // Perform further operations with the parsed rows
//         // (e.g., create objects, data processing, etc.)
//         const objects = rows.map((row: any) => ({
//           // Create an object based on the row data
//           // Customize the object creation based on your CSV structure
//           // Example: Assuming CSV has columns 'name', 'age', 'email'
//           id: row["id"],
//           name: row["name"],
//           url: row["url"],
//           data: row["data"] ? JSON.parse(row["data"]) : {},
//         }));
//
//         const validObjects = objects.filter((row) => row.id?.length > 0);
//
//         // // Log the created objects
//         console.log("Objects:", validObjects);
//         // saveAppDetailsToDb(validObjects);
//         // saveAppDetailsToFirestore(validObjects).then(r => {});
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         // @ts-ignore
//         appDetailsData.push(validObjects);
//
//         // Perform further operations with the created objects
//         // (e.g., data manipulation, storing in a database, etc.)
//       })
//       .catch((error) => {
//         // Handle any errors during the process
//         console.error("Error reading CSV file:", error);
//       });
//   }
//
//   return appDetailsData;
// };
//
// /** ***************** Realtime DB ************************/
// // const saveAppDetailsToDb = (data: any[]) => {
// //     if (firebaseDb != null) {
// //         const appRef = dbRef(firebaseDb, "apps");
// //         // Retrieve data from the database
// //         dbGetRef(appRef)
// //             .then(snapshot => {
// //                 const apps = snapshot.val();
// //                 console.log("db apps: ", apps);
// //                 return apps;
// //             })
// //             .then(apps => {
// //                 const dbAppsIds = apps.map(apps => apps.id);
// //                 const dataNotInApps = data.filter(
// //                     row => !dbAppsIds.includes(row.id),
// //                 );
// //                 // Add data to the database
// //                 dbUpdate(appRef, dataNotInApps).then(res => {
// //                     console.log("successfully set apps.", res);
// //                 });
// //             })
// //             .catch(err => {
// //                 console.log("failed to fetch apps: ", err);
// //             });
// //     } else {
// //         console.error("[FIREBASE] Failed to get realtime database.");
// //     }
// //     return [];
// // };
//
// /** ***************** Firestore DB ************************/
// // @ts-ignore
// const saveAppDetailsToFirestore = async (data: any[]) => {
//   if (firestore != null) {
//     const apps = await getAppDetailsFromFirestore();
//     if (apps) {
//       // const dbAppsIds = apps.map(apps => apps.id);
//       // const dataNotInApps = data.filter(
//       //     row => !dbAppsIds.includes(row.id),
//       // );
//       console.log("adding to firestore: ");
//       const docRef = await addDoc(collection(firestore, "users"), {
//         email: "shristi@gmail.com",
//         name: "Shristi",
//       });
//       console.log("[FIREBASE] Document user written: ", docRef);
//
//       // const batch = writeBatch(firestore);
//       // dataNotInApps.forEach(apps => {
//       //     const appRef = firestoreDoc(collection(firestore, "apps"));
//       //     batch.set(appRef, apps);
//       // });
//       // await batch.commit();
//       // console.log(
//       //     "Apps added to firestore successfully. ",
//       //     dataNotInApps,
//       // );
//     }
//   }
// };
//
// // @ts-ignore
// const getAppDetailsFromFirestore = async () => {
//   try {
//     const querySnapshot = await getDocs(collection(firestore, "apps"));
//     const appsDetailsList = querySnapshot.docs.map((doc) => doc.data());
//     console.log("App details from firestore:", appsDetailsList);
//     return appsDetailsList;
//   } catch (error) {
//     console.error("Error getting apps details from firestore:", error);
//   }
// };
//
// // Define the Firebase Function
// exports.getFileContent = functions.https.onRequest(async (req, res) => {
//   try {
//     const appDetails = await getAllAppDetails();
//     // Send the file content as the response
//     res.send(appDetails);
//   } catch (error) {
//     console.error("Error retrieving file:", error);
//     res.status(500).send("Error retrieving file");
//   }
// });
