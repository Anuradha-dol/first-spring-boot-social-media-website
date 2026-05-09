package com.socialApp.Lishare.controller;

import com.socialApp.Lishare.Service.RealtimeService;
import com.socialApp.Lishare.Service.interfaces.FollowService;
import com.socialApp.Lishare.dtos.postdTOs.NotificationDTO;
import com.socialApp.Lishare.entities.Notification;
import com.socialApp.Lishare.entities.User;
import com.socialApp.Lishare.repos.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final FollowService followService;
    private final RealtimeService realtimeService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getNotifications(
            @AuthenticationPrincipal User currentUser) {

        List<Notification> notifications =
                notificationRepository
                        .findByUserUserIdOrderByCreatedAtDesc(currentUser.getUserId());

        List<NotificationDTO> response = notifications.stream()
                .map(n -> toDto(n, currentUser))
                .toList();

        return ResponseEntity.ok(response);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(@AuthenticationPrincipal User currentUser) {
        return realtimeService.subscribeUser(currentUser.getUserId());
    }

    private NotificationDTO toDto(Notification notification, User currentUser) {
        User actor = notification.getActorUser();
        boolean hasActor = actor != null;
        User displayUser = hasActor ? actor : notification.getUser();

        boolean isFollowing = displayUser != null &&
                !displayUser.getUserId().equals(currentUser.getUserId()) &&
                followService.isFollowing(currentUser.getUserId(), displayUser.getUserId());

        boolean isFollower = displayUser != null &&
                !displayUser.getUserId().equals(currentUser.getUserId()) &&
                followService.isFollowing(displayUser.getUserId(), currentUser.getUserId());

        return NotificationDTO.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .type(notification.getType())
                .read(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .userId(displayUser != null ? displayUser.getUserId() : null)
                .firstName(displayUser != null ? displayUser.getFirstname() : null)
                .lastName(displayUser != null ? displayUser.getLastName() : null)
                .isFollowing(isFollowing)
                .isFollower(isFollower)
                .build();
    }
}
