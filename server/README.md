# SERVER implementation for HumorMe!

## Setup
1. Download and run postgres server.
2. Make necessary db connection credential changes on application.properties file, if necessary.
3. Download and install jdk 11, maven 3.9.0 .
4. To run the application with maven, execute `mvn package` followed by `java -jar -DPOSTGRES_DB_URL="localhost" target/online-scheduler-api-0.0.1-SNAPSHOT.jar`.
5. To verify the application has started, visit [link](http://localhost:8080/actuator).

## Run with docker
1. Download and install docker.
2. Execute the command `docker compose up -d`.
3. Verify the application is running by visiting the [link](http://localhost:8080/actuator).

## Swagger UI
This is the link to swagger UI: http://localhost:8080/swagger-ui.html
