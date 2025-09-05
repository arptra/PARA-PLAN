package dev.paraplan.api;

import dev.paraplan.api.model.JobStatus;
import org.springframework.http.ResponseEntity;

public interface JobsApi {
  ResponseEntity<JobStatus> getJobStatus(String jobId);
}
