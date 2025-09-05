package dev.paraplan.app.service;

import dev.paraplan.api.model.AnalyzeRequest;
import dev.paraplan.api.model.AnalyzeResult;
import dev.paraplan.api.model.JobAccepted;
import dev.paraplan.api.model.JobStatus;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.*;

@Service
public class AnalyzeJobService {

  private final Map<String, JobState> store = new ConcurrentHashMap<>();
  private final ExecutorService executor = Executors.newCachedThreadPool();

  public JobAccepted enqueue(AnalyzeRequest request) {
    String jobId = UUID.randomUUID().toString();
    String statusUrl = "/jobs/" + jobId;
    store.put(jobId, new JobState(JobState.State.QUEUED, null));
    CompletableFuture.runAsync(() -> runJob(jobId, request), executor);
    return new JobAccepted().jobId(jobId).statusUrl(statusUrl);
  }

  public JobWaitResult createAndMaybeWait(AnalyzeRequest request, int waitSeconds) {
    JobAccepted accepted = enqueue(request);
    if (waitSeconds <= 0) {
      return new JobWaitResult(false, accepted);
    }
    try {
      for (int i = 0; i < waitSeconds * 10; i++) {
        Thread.sleep(100);
        JobStatus status = getStatus(accepted.getJobId());
        if (status != null && "SUCCEEDED".equals(status.getState())) {
          return new JobWaitResult(true, accepted).analyzeResult(status.getResult());
        }
      }
    } catch (InterruptedException ignored) {
    }
    return new JobWaitResult(false, accepted);
  }

  public JobStatus getStatus(String jobId) {
    JobState state = store.get(jobId);
    if (state == null) {
      return null;
    }
    JobStatus status = new JobStatus().jobId(jobId).state(state.state.name());
    if (state.result != null) {
      status.setResult(state.result);
    }
    return status;
  }

  private void runJob(String jobId, AnalyzeRequest request) {
    store.put(jobId, new JobState(JobState.State.RUNNING, null));
    try {
      Thread.sleep(ThreadLocalRandom.current().nextInt(300, 1200));
      AnalyzeResult result = new AnalyzeResult()
          .fingerprint(UUID.randomUUID().toString())
          .addRecommendationsItem("placeholder");
      store.put(jobId, new JobState(JobState.State.SUCCEEDED, result));
    } catch (Exception e) {
      store.put(jobId, new JobState(JobState.State.FAILED, null));
    }
  }

  private record JobState(State state, AnalyzeResult result) {
    enum State {QUEUED, RUNNING, SUCCEEDED, FAILED}
  }

  public static class JobWaitResult {
    private final boolean completed;
    private final JobAccepted accepted;
    private AnalyzeResult analyzeResult;

    public JobWaitResult(boolean completed, JobAccepted accepted) {
      this.completed = completed;
      this.accepted = accepted;
    }

    public JobWaitResult analyzeResult(AnalyzeResult result) {
      this.analyzeResult = result;
      return this;
    }

    public boolean completed() {
      return completed;
    }

    public AnalyzeResult analyzeResult() {
      return analyzeResult;
    }

    public String jobId() {
      return accepted.getJobId();
    }

    public String statusUrl() {
      return accepted.getStatusUrl();
    }
  }
}
