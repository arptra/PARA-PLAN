package dev.paraplan.api.model;

import java.math.BigDecimal;

public class AnalyzeResultFeatures {
  private BigDecimal totalCost;

  public AnalyzeResultFeatures totalCost(BigDecimal totalCost) {
    this.totalCost = totalCost;
    return this;
  }

  public BigDecimal getTotalCost() {
    return totalCost;
  }

  public void setTotalCost(BigDecimal totalCost) {
    this.totalCost = totalCost;
  }
}
