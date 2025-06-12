FROM openjdk:17-jdk-alpine
WORKDIR /app
COPY build/libs/duomonggo-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8091
CMD ["java", "-jar", "app.jar"]