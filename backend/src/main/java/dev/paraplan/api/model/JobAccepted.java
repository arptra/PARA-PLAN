package dev.paraplan.api.model;

public class JobAccepted {
  private String jobId;
  private String statusUrl;

  public JobAccepted jobId(String jobId) {
    this.jobId = jobId;
    return this;
  }

  public String getJobId() {
    return jobId;
  }

  public void setJobId(String jobId) {
    this.jobId = jobId;
  }

  public JobAccepted statusUrl(String statusUrl) {
    this.statusUrl = statusUrl;
    return this;
  }

  public String getStatusUrl() {
    return statusUrl;
  }

  public void setStatusUrl(String statusUrl) {
    this.statusUrl = statusUrl;
  }
}
