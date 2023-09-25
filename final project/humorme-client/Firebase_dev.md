# How to start
- Watch changes in functions
  - `cd <root>/functions & npm run build:watch`
- Run emulator: `firebase emulators:start`
  - Authentication, Functions, Firestore, Storage
- Build NextJS project (clientside): `npm run build`
    - Make sure build files are inside `out` folder (we use this to deploy to firebase hosting)
- To run NextJS project in development mode (not the same as using DEV env): `npm run dev`
  - The build files are saved in `.next` folder
- If firebase is started fresh, add files in storage for initializing database,
  - `remote_storage/users` <- `data/new_100_users.csv`: *initNewUsers*
  - `remote_storage/domains` <- `data/domains_details.csv`: *initDomainDetails*
  - `remote_storage/app_details` <- `./data/<domain>_appdetails.csv` : *initAppDetails*, *initAppRateFeaturesFromDomains*
  - `remote_storage/app_reviews` <- `./data/app reviews/<app_id>.csv` (only upload max 20 most recent reviews for each app)



# 1. Local development

1. Setup emulators
    - Initialize: `firebase init emulators`
    - Start: `firebase emulators:start --only firestore` for firestore database only
    - Stop: Ctrl + C may not kill the processes.
        - `lsof -i tcp:<port>` followed by `kill <pid>`

2. Manage Firebase config based on environment
    - Use process.env.NODE_ENV ["PROD", "DEV"]

```
Next.js allows you to set defaults in .env (all environments), .env.development (development environment), 
and .env.production (production environment). Here, .env.local always overrides the defaults set.
```

---

# 2. Deploy

Firebase hosting works for static content. Later, with integration of Firebase Functions, apps with dynamic content
using SSR in NextJS can be deployed in Firebase.

1. Create build
    - next.config.js
   ```
   const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    output: "export", // exports the output to `out` directory
    images: {
        unoptimized: true,
    },
   };
   module.exports = nextConfig;

   ```
2. Make sure `<root>/.env.production` file is being used before creating a build folder.
3. Run `npm run build`: Create a deployable build saving to `out` directory. 
      - Make sure firebase.config file has `out` as the public directory in hosting
4. In `functions/src/firebase.ts`
    - Use `.env.production` file using dotenv
5. Run deploy cmd in firebase: `firebase deploy`

# 3. Environment variables

```.dotenv
NEXT_PUBLIC_ENV=LOCAL
NEXT_PUBLIC_APP_ID=local_appid
NEXT_PUBLIC_FIREBASE_API_KEY=local_api_key
NEXT_PUBLIC_AUTH_DOMAIN=localhost
NEXT_PUBLIC_FIREBASE_PROJECT_ID=local_project_id
NEXT_PUBLIC_STORAGE_BUCKET=http://localhost:9199
NEXT_PUBLIC_MEASUREMENT_ID=local_measurement_id // paste your firebase analytics or GA4 measurement ID here
NEXT_PUBLIC_MESSAGING_SENDER_ID=local_sender_id
```

# 4. Restart from scratch

- Run `firebase use --clear` to clear active projects from the firebase CLI
    - I have removed the old project and created the new one
    - I have enabled only hosting, auth, firestore and storage services


# 5. Browser Limitations
Browsers like Brave disable trackers and ads (default set to standard) which lead to
**analytics like Google (GA) not being able to track user activities** from such browsers.
To allow GA tracking while visiting our website, follow the given steps:

1. Brave: 
    - Shields down for all websites: Go to settings > Shields > Tackers & ads blocking (set to `Disabled`)
    - Shield down for specific websites: Go to settings > Privacy & Security > Shield Status (Shields settings) > Add websites using `Add` button in `Shield Down` section.



# References

- https://codeburst.io/next-js-on-cloud-functions-for-firebase-with-firebase-hosting-7911465298f2
- Dynamic content rendering of NextJS in
  firebase [stackoverflow references](https://stackoverflow.com/questions/56284434/how-to-deploy-next-js-app-on-firebase-hosting)
- https://github.com/vercel/next.js/tree/canary/examples/with-firebase-hosting
- Functions hosting: https://github.com/geovanisouza92/serverless-firebase/tree/master
- https://github.com/jthegedus/firebase-functions-next-example
- [Setup nodemailer in server](https://alexb72.medium.com/how-to-send-emails-using-a-nodemailer-gmail-and-oauth2-fe19d66451f9) to send email
  - Sign up process where we send users their password for login.
