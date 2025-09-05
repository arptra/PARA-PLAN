package dev.paraplan.api;

import dev.paraplan.api.model.AnalyzeRequest;
import org.springframework.http.ResponseEntity;

public interface AnalyzeApi {
  ResponseEntity<?> createAnalyzeJob(Integer wait, AnalyzeRequest body);
}
