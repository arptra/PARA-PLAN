package com.example.core;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.testcontainers.containers.PostgreSQLContainer;

import com.zaxxer.hikari.HikariDataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

import static org.junit.jupiter.api.Assertions.assertEquals;

class PgUtilsTest {

    private static final PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:16-alpine").withInitScript("init.sql");

    @BeforeAll
    static void start() {
        postgres.start();
    }

    @AfterAll
    static void stop() {
        postgres.stop();
    }

    @Test
    void sanity() throws Exception {
        try (HikariDataSource ds = (HikariDataSource) PgUtils.hikari(
                String.format("jdbc:postgresql://%s:%d/%s", postgres.getHost(), postgres.getFirstMappedPort(), postgres.getDatabaseName()),
                postgres.getUsername(),
                postgres.getPassword());
             Connection conn = ds.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery("SELECT count(*) FROM test")) {
            rs.next();
            assertEquals(1, rs.getInt(1));
        }
    }
}
