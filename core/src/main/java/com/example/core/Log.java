package com.example.core;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class Log {
    private Log() {}

    public static Logger getLogger(Class<?> clazz) {
        return LoggerFactory.getLogger(clazz);
    }
}
