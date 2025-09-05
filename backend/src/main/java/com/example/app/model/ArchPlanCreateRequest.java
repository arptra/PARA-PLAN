package com.example.app.model;

import java.util.Map;

public record ArchPlanCreateRequest(String mode, Map<String, Object> topology, Map<String, Object> constraints) {}
