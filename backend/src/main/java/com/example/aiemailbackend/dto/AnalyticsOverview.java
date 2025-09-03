package com.example.aiemailbackend.dto;

public class AnalyticsOverview {
    private int totalEmails;
    private int positiveEmails;
    private int negativeEmails;
    private int neutralEmails;
    private int urgentEmails;
    private String averageResponse;

    public AnalyticsOverview() {}

    public AnalyticsOverview(int totalEmails, int positiveEmails, int negativeEmails, int neutralEmails, int urgentEmails, String averageResponse) {
        this.totalEmails = totalEmails;
        this.positiveEmails = positiveEmails;
        this.negativeEmails = negativeEmails;
        this.neutralEmails = neutralEmails;
        this.urgentEmails = urgentEmails;
        this.averageResponse = averageResponse;
    }

    public int getTotalEmails() { return totalEmails; }
    public void setTotalEmails(int totalEmails) { this.totalEmails = totalEmails; }
    public int getPositiveEmails() { return positiveEmails; }
    public void setPositiveEmails(int positiveEmails) { this.positiveEmails = positiveEmails; }
    public int getNegativeEmails() { return negativeEmails; }
    public void setNegativeEmails(int negativeEmails) { this.negativeEmails = negativeEmails; }
    public int getNeutralEmails() { return neutralEmails; }
    public void setNeutralEmails(int neutralEmails) { this.neutralEmails = neutralEmails; }
    public int getUrgentEmails() { return urgentEmails; }
    public void setUrgentEmails(int urgentEmails) { this.urgentEmails = urgentEmails; }
    public String getAverageResponse() { return averageResponse; }
    public void setAverageResponse(String averageResponse) { this.averageResponse = averageResponse; }
}

