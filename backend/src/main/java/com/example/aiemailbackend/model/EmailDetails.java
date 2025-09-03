package com.example.aiemailbackend.model;

public class EmailDetails extends EmailItem {
    private ExtractedInfo extracted;
    private String aiReply;

    public EmailDetails() {
        super();
    }

    public EmailDetails(String id, String sender, String subject, String body, String dateTime, EmailPriority priority, EmailSentiment sentiment, ExtractedInfo extracted, String aiReply) {
        super(id, sender, subject, body, dateTime, priority, sentiment);
        this.extracted = extracted;
        this.aiReply = aiReply;
    }

    public ExtractedInfo getExtracted() { return extracted; }
    public void setExtracted(ExtractedInfo extracted) { this.extracted = extracted; }
    public String getAiReply() { return aiReply; }
    public void setAiReply(String aiReply) { this.aiReply = aiReply; }
}

