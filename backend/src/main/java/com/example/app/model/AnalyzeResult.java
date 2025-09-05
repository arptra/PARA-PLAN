package com.example.app.model;

import java.util.List;
import java.util.Map;

public record AnalyzeResult(
        List<String> features,
        Map<String, Object> predicted,
        Map<String, Object> landscape,
        Map<String, Object> selectivity,
        Map<String, Object> distribution,
        Map<String, Object> monteCarlo,
        List<String> outliers,
        List<Recommendation> recommendations,
        Map<String, Object> whatIf,
        Map<String, Object> diffReport
) {}
