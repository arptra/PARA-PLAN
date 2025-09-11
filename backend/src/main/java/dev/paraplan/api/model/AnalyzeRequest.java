package dev.paraplan.api.model;

public class AnalyzeRequest {
  private String query;

  public AnalyzeRequest query(String query) {
    this.query = query;
    return this;
  }

  public String getQuery() {
    return query;
  }

  public void setQuery(String query) {
    this.query = query;
  }
}
