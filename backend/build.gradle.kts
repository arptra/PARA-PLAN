plugins {
    id("org.springframework.boot") version "3.2.5"
    id("io.spring.dependency-management") version "1.1.4"
    id("java")
    id("org.openapi.generator") version "7.4.0"
}

group = "dev.paraplan"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(project(":core"))
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.5.0")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("com.nimbusds:nimbus-jose-jwt:9.37.3")
    implementation("org.openapitools:jackson-databind-nullable:0.2.6")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

openApiGenerate {
    generatorName.set("spring")
    inputSpec.set("${'$'}projectDir/src/main/resources/openapi/paraplan-openapi.yaml")
    outputDir.set("${'$'}buildDir/generated/openapi")
    apiPackage.set("dev.paraplan.api")
    modelPackage.set("dev.paraplan.api.model")
    invokerPackage.set("dev.paraplan.api.invoker")
    library.set("spring-boot")
    configOptions.set(
        mapOf(
            "dateLibrary" to "java8",
            "interfaceOnly" to "true",
            "useSpringBoot3" to "true",
            "useTags" to "true",
            "performBeanValidation" to "true"
        )
    )
}

sourceSets["main"].java.srcDir("${'$'}buildDir/generated/openapi/src/main/java")

tasks.named("compileJava").configure {
    dependsOn("openApiGenerate")
}

tasks.withType<Test> {
    useJUnitPlatform()
}
