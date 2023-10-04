HumorMe!
---

Making jokes just for fun!

## Deploy NextJS in EC2 Instance

### 1. Setup node environment in EC2 instance
  - Connect to remote instance: `ssh -i <path-to-pem-file> <user>@<host>`
  - Install global dependencies: `sudo apt install node npm -y`
  - Create an app folder to store build files: `mkdir app`

### 2. Move build content to the EC2 instance
  - Build next js project in your local machine:
    - Setup next.config.json file as follows:
    ```js
        const nextConfig = {
        reactStrictMode: true,
        swcMinify: true,
        //distDir: "out", // exports the output to out directory on npm run dev
        output: "export", //exports the output to out directory on npm run build
        images: {
        unoptimized: true,
        },
        };
        
        module.exports = nextConfig;
    ```
    - Build and save to *out* folder: `npm run build`
  - Copy your build folder to the remote server (inside app directory) 
    - `scp -i <path-to-pem-file> -r <build-folder> <user>@<host>:/<path-to-app>`

### 3. EC2 Apache configuration 
   - Login to your remote server: `ssh -i <path-to-pem-file> <user>@<host>`
   - Install Apache2: `sudo apt install apache2 -y`
   - Enable Apache's *rewrite* module, which is necessary for NextJS
     - `sudo a2enmod rewrite`
   - Configure static content serve in apache for your project
      - Create a new file *humorme.conf* : `touch /etc/apache2/sites-available/humorme.conf`
      - Copy following content in the conf file
      ```xml
         <VirtualHost *:3000> // serve at port 3000
         ServerName <ip-addresss> // host or public ip of your ec2 instance
         DocumentRoot /var/www/humorme // path where your project build is served from
        
             <Directory /var/www/humorme>
                 Options Indexes FollowSymLinks
                 AllowOverride All
                 Require all granted
             </Directory>
        
             ErrorLog ${APACHE_LOG_DIR}/error.log
             CustomLog ${APACHE_LOG_DIR}/access.log combined
         </VirtualHost>
      ```
      - You see */var/www/humorme* is the directory serving your project. You need to copy your 
   build content here. 
        - `sudo cp -r ~/app/out /var/www/humorme`
      - In case there is issue with apache permission to accessing your directory
        - `sudo chown -R www-data:www-data /var/www/humorme`
   - Enable the virtual host: `sudo a2ensite your-nextjs-app.conf`
   - Add environment variables in `~/.bashrc`
     - For now, add the variables at system level
     ```dotenv
        NEXT_PUBLIC_API_URL=<API_SERVER_URL>
        NEXT_PUBLIC_JWT_SIGN_PASSWORD=<JWT_KEY_SAME_AS_THE_API_SERVER>
     ```
   - Restart Apache to apply changes: `sudo systemctl restart apache2`
   - Allow connection: Make sure your EC2 instance allows `tcp:3000 port` from any ipaddress (if you are lax about it)
     - Check security groups/inbound rules for the hosting instance

### 4. Test your app
   - Checkout your webapp at `http://<ip-address>:3000`

