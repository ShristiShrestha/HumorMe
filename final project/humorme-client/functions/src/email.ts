// import { logger } from "firebase-functions";
//
// const _ = require("lodash");
//
// const nodemailer = require("nodemailer");
//
// const transportOptions = {
//     service: "Gmail",
//     auth: {
//         type: "OAuth2",
//         user: process.env.SEND_EMAIL_ID,
//         // pass: process.env.SEND_EMAIL_PASSWORD,
//         // clientId: process.env.SEND_EMAIL_CLIENTID,
//         // clientSecret: process.env.SEND_EMAIL_CLIENTSECRET,
//     },
// };
//
// const emailTransporter = nodemailer.createTransport({
//     ...transportOptions,
// });
// export function sendEmailPassphrase(user: any, sendEmailTo: string) {
//     const password = _.get(user, "password", undefined);
//     if (password) {
//         logger.info("[User assign] sending email to : ", user, sendEmailTo);
//         const mailOptions = {
//             from: `AppStore Support ${process.env.SEND_EMAIL_PASSWORD}`,
//             to: sendEmailTo,
//             subject: "IMPORTANT! Save your passphrase safely.",
//             html: `Passphrase: <b>${password}</b>`,
//         };
//         try {
//             // @ts-ignore
//             emailTransporter.sendMail(mailOptions, function (err, res) {});
//         } catch (err) {
//             logger.error(
//                 "[User assign] sending email failed: ",
//                 mailOptions,
//                 transportOptions,
//                 err,
//             );
//         }
//     }
// }

export const dummy = "1";
