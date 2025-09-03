package com.example.core;

import org.junit.jupiter.api.Test;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

import static org.junit.jupiter.api.Assertions.assertEquals;

@Testcontainers
class PgUtilsTest {

    @Container
    static final PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:16-alpine").withInitScript("init.sql");

    @Test
    void sanity() throws Exception {
        DataSource ds = PgUtils.hikari(postgres.getJdbcUrl(), postgres.getUsername(), postgres.getPassword());
        try (Connection conn = ds.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery("SELECT count(*) FROM test")) {
            rs.next();
            assertEquals(1, rs.getInt(1));
        }
    }
}
