package com.example.aiemailbackend.model;

public class EmailItem {
    private String id;
    private String sender;
    private String subject;
    private String body;
    private String dateTime; // Display/time string for simplicity
    private EmailPriority priority;
    private EmailSentiment sentiment;

    public EmailItem() {}

    public EmailItem(String id, String sender, String subject, String body, String dateTime, EmailPriority priority, EmailSentiment sentiment) {
        this.id = id;
        this.sender = sender;
        this.subject = subject;
        this.body = body;
        this.dateTime = dateTime;
        this.priority = priority;
        this.sentiment = sentiment;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
    public String getDateTime() { return dateTime; }
    public void setDateTime(String dateTime) { this.dateTime = dateTime; }
    public EmailPriority getPriority() { return priority; }
    public void setPriority(EmailPriority priority) { this.priority = priority; }
    public EmailSentiment getSentiment() { return sentiment; }
    public void setSentiment(EmailSentiment sentiment) { this.sentiment = sentiment; }
}

