1. Manage private keys in CI/CD environment
    - remove the use of private folder
    - manage [firebase gservice account permission](https://console.cloud.google.com/iam-admin) (Currently given permission as owner)
    - Database service requires money 
      - so deploy pages only `firebase deploy --project pure-advantage-243618 --only hosting`
    - `"lint": "eslint --fix --ext .js,.jsx ."`
   ```
   "lint-staged": {
       "*.{js,jsx}": [
         "eslint '*/**/*.{js,jsx}' --fix"
       ],
       "*.{json,md,html}": [
         "prettier --write"
       ]
   },
   "husky": {
      "hooks": {
      "pre-commit": "lint-staged"
      }
   },
   
   # in firebase.json > functions > [0] 
   "predeploy": [
     "npm --prefix \"$RESOURCE_DIR\""
   ]
```
