FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY common/ common/
COPY pom.xml pom.xml
COPY notification-service/ notification-service/
RUN apt-get update && apt-get install -y maven &&     mvn clean package -pl notification-service -am -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/notification-service/target/*.jar app.jar
EXPOSE 8086
ENTRYPOINT ["java", "-jar", "app.jar"]
