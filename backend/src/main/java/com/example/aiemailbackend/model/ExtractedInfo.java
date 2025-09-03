package com.example.aiemailbackend.model;

public class ExtractedInfo {
    private String phone;
    private String alternateEmail;
    private String productOrderId;

    public ExtractedInfo() {}

    public ExtractedInfo(String phone, String alternateEmail, String productOrderId) {
        this.phone = phone;
        this.alternateEmail = alternateEmail;
        this.productOrderId = productOrderId;
    }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAlternateEmail() { return alternateEmail; }
    public void setAlternateEmail(String alternateEmail) { this.alternateEmail = alternateEmail; }
    public String getProductOrderId() { return productOrderId; }
    public void setProductOrderId(String productOrderId) { this.productOrderId = productOrderId; }
}

