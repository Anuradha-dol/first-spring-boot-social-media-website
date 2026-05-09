package com.socialApp.Lishare.Service;

import com.socialApp.Lishare.entities.Notification;
import com.socialApp.Lishare.entities.User;
import com.socialApp.Lishare.repos.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final RealtimeService realtimeService;

    public Notification create(User recipient, User actor, String message, String type) {
        Notification notification = Notification.builder()
                .user(recipient)
                .actorUser(actor)
                .message(message)
                .type(type)
                .read(false)
                .build();

        Notification saved = notificationRepository.save(notification);
        realtimeService.sendToUser(
                recipient.getUserId(),
                "notification",
                Map.of("id", saved.getId(), "type", type)
        );
        return saved;
    }

    public void removeNotification(Long recipientId, Long actorId, String type) {
        notificationRepository.deleteByUserUserIdAndActorUserUserIdAndType(recipientId, actorId, type);
    }

    public void clearAllUserNotifications(Long userId) {
        notificationRepository.deleteByUserUserId(userId);
    }
}
