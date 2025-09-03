package com.example.aiemailbackend.web;

import com.example.aiemailbackend.dto.AnalyticsOverview;
import com.example.aiemailbackend.model.EmailDetails;
import com.example.aiemailbackend.repo.EmailRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class EmailController {
    private final EmailRepository repo;

    public EmailController(EmailRepository repo) { this.repo = repo; }

    @GetMapping("/emails")
    public List<EmailDetails> list(
            @RequestParam Optional<String> sentiment,
            @RequestParam Optional<String> priority,
            @RequestParam Optional<String> q,
            @RequestParam Optional<String> sort
    ) {
        return repo.list(sentiment, priority, q, sort);
    }

    @GetMapping("/emails/{id}")
    public ResponseEntity<EmailDetails> get(@PathVariable String id) {
        return repo.get(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/emails")
    public EmailDetails create(@RequestBody EmailDetails body) {
        return repo.add(body);
    }

    @PostMapping("/emails/{id}/reply")
    public ResponseEntity<EmailDetails> updateReply(@PathVariable String id, @RequestBody Map<String, String> body) {
        if (!body.containsKey("reply")) return ResponseEntity.badRequest().build();
        try {
            return ResponseEntity.ok(repo.updateReply(id, body.get("reply")));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/analytics")
    public AnalyticsOverview analytics() {
        return repo.analytics();
    }
}

