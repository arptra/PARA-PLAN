package dev.paraplan.app.controller;

import dev.paraplan.api.AnalyzeApi;
import dev.paraplan.api.model.AnalyzeRequest;
import dev.paraplan.api.model.AnalyzeResult;
import dev.paraplan.api.model.JobAccepted;
import dev.paraplan.app.service.AnalyzeJobService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
public class AnalyzeJobsController implements AnalyzeApi {

  private final AnalyzeJobService service;

  public AnalyzeJobsController(AnalyzeJobService service) {
    this.service = service;
  }

  @Override
  public ResponseEntity<?> createAnalyzeJob(@RequestParam(value = "wait", required = false, defaultValue = "0") Integer wait,
                                            @Valid @RequestBody AnalyzeRequest body) {
    AnalyzeJobService.JobWaitResult result = service.createAndMaybeWait(body, wait != null ? wait : 0);
    if (result.completed()) {
      AnalyzeResult analyzeResult = result.analyzeResult();
      return ResponseEntity.ok(analyzeResult);
    }
    JobAccepted accepted = new JobAccepted().jobId(result.jobId()).statusUrl(result.statusUrl());
    return ResponseEntity.accepted()
        .location(URI.create(result.statusUrl()))
        .body(accepted);
  }
}
