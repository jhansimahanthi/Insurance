FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY common/ common/
COPY pom.xml pom.xml
COPY claim-service/ claim-service/
RUN apt-get update && apt-get install -y maven &&     mvn clean package -pl claim-service -am -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/claim-service/target/*.jar app.jar
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "app.jar"]
