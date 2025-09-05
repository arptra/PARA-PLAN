package dev.paraplan.api.model;

import java.util.ArrayList;
import java.util.List;

public class AnalyzeResult {
  private String fingerprint;
  private AnalyzeResultFeatures features;
  private AnalyzeResultPredicted predicted;
  private List<String> recommendations = new ArrayList<>();

  public AnalyzeResult fingerprint(String fingerprint) {
    this.fingerprint = fingerprint;
    return this;
  }

  public String getFingerprint() {
    return fingerprint;
  }

  public void setFingerprint(String fingerprint) {
    this.fingerprint = fingerprint;
  }

  public AnalyzeResult features(AnalyzeResultFeatures features) {
    this.features = features;
    return this;
  }

  public AnalyzeResultFeatures getFeatures() {
    return features;
  }

  public void setFeatures(AnalyzeResultFeatures features) {
    this.features = features;
  }

  public AnalyzeResult predicted(AnalyzeResultPredicted predicted) {
    this.predicted = predicted;
    return this;
  }

  public AnalyzeResultPredicted getPredicted() {
    return predicted;
  }

  public void setPredicted(AnalyzeResultPredicted predicted) {
    this.predicted = predicted;
  }

  public AnalyzeResult recommendations(List<String> recommendations) {
    this.recommendations = recommendations;
    return this;
  }

  public List<String> getRecommendations() {
    return recommendations;
  }

  public void setRecommendations(List<String> recommendations) {
    this.recommendations = recommendations;
  }
}
