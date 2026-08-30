FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY common/ common/
COPY pom.xml backend/pom.xml
COPY user-service/ user-service/
WORKDIR /app
RUN apt-get update && apt-get install -y maven && \
    mvn clean package -pl user-service -am -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/user-service/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
