package com.example.aiemailbackend.repo;

import com.example.aiemailbackend.dto.AnalyticsOverview;
import com.example.aiemailbackend.model.EmailDetails;
import com.example.aiemailbackend.model.EmailItem;
import com.example.aiemailbackend.model.EmailPriority;
import com.example.aiemailbackend.model.EmailSentiment;
import com.example.aiemailbackend.model.ExtractedInfo;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
public class EmailRepository {
    private final List<EmailDetails> emails = new ArrayList<>();

    public EmailRepository() {
        seed();
    }

    private void seed() {
        emails.add(new EmailDetails(
                "1",
                "john.doe@example.com",
                "Cannot access my account",
                "Hi, I am unable to login to my account since yesterday. Please help.",
                "2025-09-03 10:15 AM",
                EmailPriority.Urgent,
                EmailSentiment.Negative,
                new ExtractedInfo("\u202A+91-9876543210\u202C", "john.alt@example.com", "ORD12345"),
                "Hi John, sorry to hear you're having trouble accessing your account. Please try resetting your password using the 'Forgot Password' link. If the issue persists, reply to this message and we will assist you immediately."
        ));
        emails.add(new EmailDetails(
                "2",
                "sara.lee@example.com",
                "Feature request: Dark mode improvements",
                "Loving the product! Could you add scheduled dark mode based on local time?",
                "2025-09-02 09:05 AM",
                EmailPriority.Normal,
                EmailSentiment.Positive,
                null,
                null
        ));
        emails.add(new EmailDetails(
                "3",
                "mike.ross@example.com",
                "Subscription renewal question",
                "I received a renewal notice but already paid. Can you check?",
                "2025-09-01 04:20 PM",
                EmailPriority.Normal,
                EmailSentiment.Neutral,
                null,
                null
        ));
        emails.add(new EmailDetails(
                "4",
                "support@acme-corp.com",
                "Payment failed for invoice INV-7789",
                "Payment failed due to card expiration. Please update your billing method.",
                "2025-09-03 08:47 AM",
                EmailPriority.Urgent,
                EmailSentiment.Negative,
                null,
                null
        ));
        emails.add(new EmailDetails(
                "5",
                "devrel@example.com",
                "Thanks for the quick fix!",
                "The issue was resolved. Appreciate the fast turnaround.",
                "2025-09-02 01:10 PM",
                EmailPriority.Normal,
                EmailSentiment.Positive,
                null,
                null
        ));
    }

    public List<EmailDetails> list(Optional<String> sentiment, Optional<String> priority, Optional<String> q, Optional<String> sort) {
        List<EmailDetails> data = new ArrayList<>(emails);
        if (sentiment.isPresent() && !sentiment.get().equalsIgnoreCase("All")) {
            data = data.stream().filter(e -> e.getSentiment().name().equalsIgnoreCase(sentiment.get())).collect(Collectors.toList());
        }
        if (priority.isPresent() && !priority.get().equalsIgnoreCase("All")) {
            data = data.stream().filter(e -> e.getPriority().name().equalsIgnoreCase(priority.get())).collect(Collectors.toList());
        }
        if (q.isPresent() && !q.get().isBlank()) {
            String s = q.get().toLowerCase(Locale.ROOT);
            data = data.stream().filter(e ->
                    e.getSender().toLowerCase(Locale.ROOT).contains(s) ||
                    e.getSubject().toLowerCase(Locale.ROOT).contains(s) ||
                    e.getBody().toLowerCase(Locale.ROOT).contains(s)
            ).collect(Collectors.toList());
        }
        Comparator<EmailDetails> cmp = Comparator.comparing(EmailItem::getDateTime);
        if (Objects.equals(sort.orElse("desc"), "desc")) cmp = cmp.reversed();
        data.sort(cmp);
        return data;
    }

    public Optional<EmailDetails> get(String id) {
        return emails.stream().filter(e -> e.getId().equals(id)).findFirst();
    }

    public EmailDetails updateReply(String id, String reply) {
        EmailDetails det = get(id).orElseThrow();
        det.setAiReply(reply);
        return det;
    }

    public EmailDetails add(EmailDetails body) {
        if (body.getId() == null || body.getId().isBlank()) {
            body.setId(UUID.randomUUID().toString());
        }
        emails.add(body);
        return body;
    }

    public AnalyticsOverview analytics() {
        int total = emails.size();
        int pos = (int) emails.stream().filter(e -> e.getSentiment() == EmailSentiment.Positive).count();
        int neg = (int) emails.stream().filter(e -> e.getSentiment() == EmailSentiment.Negative).count();
        int neu = (int) emails.stream().filter(e -> e.getSentiment() == EmailSentiment.Neutral).count();
        int urg = (int) emails.stream().filter(e -> e.getPriority() == EmailPriority.Urgent).count();
        return new AnalyticsOverview(total, pos, neg, neu, urg, "2h 15m");
    }
}

