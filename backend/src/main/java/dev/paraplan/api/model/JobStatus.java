package dev.paraplan.api.model;

public class JobStatus {
  public enum State { QUEUED, RUNNING, SUCCEEDED, FAILED }

  private String jobId;
  private State state;
  private AnalyzeResult result;

  public JobStatus jobId(String jobId) {
    this.jobId = jobId;
    return this;
  }

  public String getJobId() {
    return jobId;
  }

  public void setJobId(String jobId) {
    this.jobId = jobId;
  }

  public JobStatus state(String state) {
    this.state = State.valueOf(state);
    return this;
  }

  public JobStatus state(State state) {
    this.state = state;
    return this;
  }

  public State getState() {
    return state;
  }

  public void setState(State state) {
    this.state = state;
  }

  public JobStatus result(AnalyzeResult result) {
    this.result = result;
    return this;
  }

  public AnalyzeResult getResult() {
    return result;
  }

  public void setResult(AnalyzeResult result) {
    this.result = result;
  }
}
