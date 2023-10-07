HumorMe!
--------

Where to start?

### Navigate HumorMe!

1. Check out the demo of this web application [here](https://www.youtube.com/watch?v=spTFk1AgGv8)
2. Access the application hosted [here](http://3.143.17.104:3000). Make sure your browser does not restrict serving content only on HTTPS.
3. Read the jokes anonymously. Just scroll through the home page.
4. Sign up/ Sign in
   - There is a *Account* button at the top of the page. Click on it and you will see sign in and sign up tabs.
   - Once you sign up, click on the sign in tab, and sign in.
5. Create a post
   - There is a post button. Click on it and you will see a form where you can write your joke and add some keywords to search that joke.
   - You can see all your jokes in your personal profile page as well. Once you log in, you can see your username at the top of the page, next to the sign out button. Click the username and you will be navigated to your profile page.
6. Rate any joke
   - If you are logged in, you can rate any jokes using one of the four labels shown directly below the joke text.
   - If considerable amount of people have different rating (opinion), the page also shows the maximum percentage of users who rated differently.
7. Comment any joke
   - If you are logged in, you can comment on a joke.
   - Currently, the page is not responsive enough to detect changes if you have another browser also opening the same joke. So, if you want to detect changes (rating, comments) in another opened browser for a given joke, click the joke text and it will update the values in that browser.
8. Follow/Unfollow each other
   - By clicking on the username shown at the top of each joke, you will navigated to the corresponding user profile page. From there, if you are logged in, you can follow and unfollow them. If you are visiting your own profile, you will see *edit profile* button, and use it to update your username, and bio description.

### Submitted materials

This folder contains all the submission materials required to be submitted as the final project submission. For source code and jar file, use this [link](https://lsumail2-my.sharepoint.com/:f:/g/personal/sshre35_lsu_edu/EpwlkFc38QFPoEyJ2Da1kGsBDBeePo2HWmWPOXYk36yLcA?e=wQKUA9)

1. **humorme-api-0.0.1-SNAPSHOT.jar** is the deployable file for backend server. Tomcat server is embedded in it so you can simply run it `java -jar humorme-api-0.0.1-SNAPSHOT.jar`.

   - There are other dependencies to run this jar file such as a running Postgres server and environment variables.
   - Unzip the humorme-server.zip to get the server side implementation in Java SpringBoot framework. In this repository, there is also a README.md file that can assist you with dependencies.
2. **humorme-client.zip** contains all the Javascript files created for client side development. The repo also contains a README.md file to guide you step by step for deploying in an EC2 instance.
3. **Shrestha_CSC7510_Final_Project_Report.pdf** is the final report generated for this assignment that summarizes the implmentations and results.
