package com.example.app.model;

import java.util.List;

public record WebhookRequest(String url, List<String> events, String secret) {}
