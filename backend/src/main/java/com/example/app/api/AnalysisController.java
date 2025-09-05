package com.example.app.api;

import com.example.app.model.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class AnalysisController {

    @PostMapping("/analyze-jobs")
    public ResponseEntity<?> analyzeJob(@RequestParam(value = "wait", required = false) Integer wait,
                                        @RequestBody AnalyzeRequest request) {
        if (wait != null && wait > 0) {
            return ResponseEntity.ok(dummyResult());
        }
        return ResponseEntity.accepted().body(new JobCreatedResponse("job-123", "/jobs/job-123"));
    }

    @GetMapping("/jobs/{jobId}")
    public JobInfo getJob(@PathVariable String jobId) {
        return new JobInfo(jobId, JobStatus.SUCCEEDED, dummyResult(), null);
    }

    private AnalyzeResult dummyResult() {
        return new AnalyzeResult(
                List.of("feature1", "feature2"),
                Map.of("throughput", 100),
                Map.of(),
                Map.of(),
                Map.of(),
                Map.of(),
                List.of(),
                List.of(),
                Map.of(),
                Map.of()
        );
    }
}
