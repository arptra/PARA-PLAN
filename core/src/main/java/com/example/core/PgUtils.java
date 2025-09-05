package com.example.core;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import javax.sql.DataSource;

public final class PgUtils {
    private PgUtils() {
    }

    public static DataSource hikari(String jdbcUrl, String user, String pass) {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(user);
        config.setPassword(pass);
        return new HikariDataSource(config);
    }
}
