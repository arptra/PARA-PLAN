package dev.paraplan.app.controller;

import dev.paraplan.api.JobsApi;
import dev.paraplan.api.model.JobStatus;
import dev.paraplan.app.service.AnalyzeJobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JobsController implements JobsApi {

  private final AnalyzeJobService service;

  public JobsController(AnalyzeJobService service) {
    this.service = service;
  }

  @Override
  public ResponseEntity<JobStatus> getJobStatus(String jobId) {
    JobStatus status = service.getStatus(jobId);
    return status != null ? ResponseEntity.ok(status) : ResponseEntity.notFound().build();
  }
}
