package dev.paraplan.api.model;

public class AnalyzeResultPredicted {
  private Integer p95ms;

  public AnalyzeResultPredicted p95ms(Integer p95ms) {
    this.p95ms = p95ms;
    return this;
  }

  public Integer getP95ms() {
    return p95ms;
  }

  public void setP95ms(Integer p95ms) {
    this.p95ms = p95ms;
  }
}
