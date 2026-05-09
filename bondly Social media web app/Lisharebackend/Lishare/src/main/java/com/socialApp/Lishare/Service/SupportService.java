package com.socialApp.Lishare.Service;

import com.socialApp.Lishare.entities.SupportQuestion;
import com.socialApp.Lishare.entities.User;
import com.socialApp.Lishare.repos.SupportRepository;
import com.socialApp.Lishare.repos.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SupportService {

    private final SupportRepository supportRepository;
    private final RealtimeService realtimeService;
    private final NotificationService notificationService;
    private final UserRepo userRepository;

    // Create question
    public SupportQuestion createQuestion(SupportQuestion q) {
        SupportQuestion saved = supportRepository.save(q);
        realtimeService.sendToAdmins("support", Map.of("id", saved.getId(), "type", "QUESTION_CREATED"));
        return saved;
    }

    // Get own questions
    public List<SupportQuestion> getUserQuestions(Long userId) {
        return supportRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // Delete own question
    public void deleteQuestion(Long id, Long userId) {
        SupportQuestion q = supportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (!q.getUserId().equals(userId)) throw new RuntimeException("Not allowed");
        supportRepository.delete(q);
    }

    // Admin: get all
    public List<SupportQuestion> getAllQuestions() {
        return supportRepository.findAllByOrderByCreatedAtDesc();
    }

    // Admin: respond
    public SupportQuestion respondToQuestion(Long id, String response) {
        SupportQuestion q = supportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        q.setAdminResponse(response);
        q.setStatus("ANSWERED");
        SupportQuestion saved = supportRepository.save(q);
        realtimeService.sendToUser(saved.getUserId(), "support", Map.of("id", saved.getId(), "type", "ADMIN_RESPONSE"));

        userRepository.findById(saved.getUserId()).ifPresent(user ->
                notificationService.create(
                        user,
                        null,
                        "Admin replied to your support question",
                        "SUPPORT_REPLY"
                )
        );

        return saved;
    }
}
