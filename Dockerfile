# Build frontend
FROM node:20 AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Build backend
FROM gradle:8.14.3-jdk17 AS backend-build
WORKDIR /home/gradle/project
COPY . .
RUN gradle :backend:bootJar --no-daemon

# Runtime image
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=backend-build /home/gradle/project/backend/build/libs/backend-0.0.1-SNAPSHOT.jar app.jar
COPY --from=frontend /app/frontend/dist ./static
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
