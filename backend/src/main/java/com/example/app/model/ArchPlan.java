package com.example.app.model;

import java.util.Map;

public record ArchPlan(String planId, String mode, Map<String, Object> topology, Map<String, Object> constraints) {}
