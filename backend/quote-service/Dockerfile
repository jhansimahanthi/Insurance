FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY common/ common/
COPY pom.xml pom.xml
COPY quote-service/ quote-service/
RUN apt-get update && apt-get install -y maven &&     mvn clean package -pl quote-service -am -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/quote-service/target/*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]
