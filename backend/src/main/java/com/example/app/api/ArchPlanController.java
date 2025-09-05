package com.example.app.api;

import com.example.app.model.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/arch/plans")
public class ArchPlanController {

    @PostMapping
    public ArchPlanResponse create(@RequestBody ArchPlanCreateRequest request) {
        return new ArchPlanResponse("plan-001", "CREATED");
    }

    @GetMapping("/{planId}")
    public ArchPlan get(@PathVariable String planId) {
        return new ArchPlan(planId, "single", Map.of(), Map.of());
    }

    @PostMapping("/{planId}/analyze-jobs")
    public ResponseEntity<?> analyze(@PathVariable String planId,
                                     @RequestParam(value = "wait", required = false) Integer wait) {
        if (wait != null && wait > 0) {
            return ResponseEntity.ok(dummyResult());
        }
        return ResponseEntity.accepted().body(new JobCreatedResponse("job-456", "/jobs/job-456"));
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
