plugins {
    id("java")
}

group = "com.example"
version = "0.0.1-SNAPSHOT"

dependencies {
    implementation("org.slf4j:slf4j-api:2.0.9")
    implementation("org.postgresql:postgresql:42.7.3")
    implementation("com.zaxxer:HikariCP:5.1.0")
    implementation("com.fasterxml.jackson.core:jackson-databind:2.17.0")
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.2")
    testImplementation("org.testcontainers:junit-jupiter:1.20.2")
    testImplementation("org.testcontainers:postgresql:1.20.2")
    runtimeOnly("ch.qos.logback:logback-classic:1.5.6")
}
