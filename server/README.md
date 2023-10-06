# SERVER implementation for HumorMe Server!

## Setup
1. Download and run postgres server.
2. Make necessary db connection credential changes on application.properties file, if necessary.
3. Download and install jdk 11, maven 3.9.0 .
4. To run the application with maven, execute `mvn package` followed by `java -jar -DPOSTGRES_DB_URL="localhost" target/humorme-api-0.0.1-SNAPSHOT.jar`.

## Swagger UI
This is the link to swagger UI: http://localhost:8080/swagger-ui.html

# Deploy in EC2 Ubuntu Container
- copy jar file to the remote container:
  - `scp -i <path_to_pem_file_for_auth> target/humorme-api-0.0.1-SNAPSHOT.jar <user>@<host>:~/app`
- in remote container, go to app directory and run
  -  `java -jar humorme-api-0.0.1-SNAPSHOT.jar --POSTGRES_DB_USER=<db_user> --POSTGRES_DB_PASSWORD=<db_user_password> --SERVER_PORT=8081 --CLIENT_URLS=http://localhost:3000,http://3.141.47.20:3000`
  - Use 8081 port since tomcat is currently using 8080 (conflict)
  - Check if process exists in ports: `sudo lsof -i :8080`