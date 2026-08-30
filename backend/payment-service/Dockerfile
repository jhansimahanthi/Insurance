FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY common/ common/
COPY pom.xml pom.xml
COPY payment-service/ payment-service/
RUN apt-get update && apt-get install -y maven &&     mvn clean package -pl payment-service -am -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/payment-service/target/*.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]
