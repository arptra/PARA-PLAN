package com.example.app.model;

public record JobInfo(String jobId, JobStatus status, AnalyzeResult result, ErrorResponse error) {}
