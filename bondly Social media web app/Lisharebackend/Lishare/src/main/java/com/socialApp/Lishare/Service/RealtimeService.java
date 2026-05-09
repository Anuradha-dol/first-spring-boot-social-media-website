package com.socialApp.Lishare.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class RealtimeService {

    private final Map<Long, CopyOnWriteArrayList<SseEmitter>> userEmitters = new ConcurrentHashMap<>();
    private final CopyOnWriteArrayList<SseEmitter> adminEmitters = new CopyOnWriteArrayList<>();

    public SseEmitter subscribeUser(Long userId) {
        SseEmitter emitter = createEmitter();
        userEmitters.computeIfAbsent(userId, ignored -> new CopyOnWriteArrayList<>()).add(emitter);
        emitter.onCompletion(() -> removeUserEmitter(userId, emitter));
        emitter.onTimeout(() -> removeUserEmitter(userId, emitter));
        send(emitter, "connected", Map.of("scope", "user"));
        return emitter;
    }

    public SseEmitter subscribeAdmin() {
        SseEmitter emitter = createEmitter();
        adminEmitters.add(emitter);
        emitter.onCompletion(() -> adminEmitters.remove(emitter));
        emitter.onTimeout(() -> adminEmitters.remove(emitter));
        send(emitter, "connected", Map.of("scope", "admin"));
        return emitter;
    }

    public void sendToUser(Long userId, String event, Object payload) {
        sendToMany(userEmitters.getOrDefault(userId, new CopyOnWriteArrayList<>()), event, payload);
    }

    public void sendToAdmins(String event, Object payload) {
        sendToMany(adminEmitters, event, payload);
    }

    private SseEmitter createEmitter() {
        return new SseEmitter(30 * 60 * 1000L);
    }

    private void sendToMany(List<SseEmitter> emitters, String event, Object payload) {
        emitters.forEach(emitter -> send(emitter, event, payload));
    }

    private void send(SseEmitter emitter, String event, Object payload) {
        try {
            emitter.send(SseEmitter.event().name(event).data(payload));
        } catch (IOException | IllegalStateException ignored) {
            emitter.complete();
        }
    }

    private void removeUserEmitter(Long userId, SseEmitter emitter) {
        List<SseEmitter> emitters = userEmitters.get(userId);
        if (emitters != null) emitters.remove(emitter);
    }
}
