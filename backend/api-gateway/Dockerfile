FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY common/ common/
COPY pom.xml pom.xml
COPY api-gateway/ api-gateway/
RUN apt-get update && apt-get install -y maven &&     mvn clean package -pl api-gateway -am -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/api-gateway/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
