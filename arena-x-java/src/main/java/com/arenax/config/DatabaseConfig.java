package com.arenax.config;

import java.io.InputStream;
import java.util.Properties;

/**
 * Loads database configuration from external properties file or environment variables.
 * Credentials are never hardcoded in source code.
 */
public class DatabaseConfig {

    private static String host = "localhost";
    private static int port = 3306;
    private static String database = "arena_x_db";
    private static String username = "root";
    private static String password = "";

    static {
        loadProperties();
    }

    private static void loadProperties() {
        // 1. Try reading from db.properties in classpath
        try (InputStream input = DatabaseConfig.class.getClassLoader().getResourceAsStream("db.properties")) {
            if (input != null) {
                Properties prop = new Properties();
                prop.load(input);
                host = prop.getProperty("db.host", host);
                port = Integer.parseInt(prop.getProperty("db.port", String.valueOf(port)));
                database = prop.getProperty("db.database", database);
                username = prop.getProperty("db.username", username);
                password = prop.getProperty("db.password", password);
            }
        } catch (Exception ignored) {
            // Fallback to environment variables
        }

        // 2. Override with Environment Variables if set (Docker / Production)
        if (System.getenv("ARENAX_DB_HOST") != null) host = System.getenv("ARENAX_DB_HOST");
        if (System.getenv("ARENAX_DB_PORT") != null) port = Integer.parseInt(System.getenv("ARENAX_DB_PORT"));
        if (System.getenv("ARENAX_DB_NAME") != null) database = System.getenv("ARENAX_DB_NAME");
        if (System.getenv("ARENAX_DB_USER") != null) username = System.getenv("ARENAX_DB_USER");
        if (System.getenv("ARENAX_DB_PASSWORD") != null) password = System.getenv("ARENAX_DB_PASSWORD");
    }

    public static String getJdbcUrl() {
        return String.format("jdbc:mysql://%s:%d/%s?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8",
                host, port, database);
    }

    public static String getUsername() { return username; }
    public static String getPassword() { return password; }
    public static String getDatabaseName() { return database; }
}
