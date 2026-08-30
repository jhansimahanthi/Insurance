package com.insurance.notification.service;

import com.insurance.common.dto.PaginatedResponse;
import com.insurance.notification.dto.NotificationResponse;
import com.insurance.notification.entity.Notification;
import com.insurance.notification.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationServiceImpl implements NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationServiceImpl.class);

    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    @Transactional
    public void createNotification(Long userId, String title, String message,
                                   String type, String eventType, String eventId) {
        log.info("Creating notification for user {}: {}", userId, title);

        Notification notification = Notification.builder()
                .userId(userId)
                .title(title)
                .message(message)
                .type(type != null ? Notification.NotificationType.valueOf(type.toUpperCase()) :
                        Notification.NotificationType.INFO)
                .eventType(eventType)
                .eventId(eventId)
                .build();

        notificationRepository.save(notification);
    }

    @Override
    public PaginatedResponse<NotificationResponse> getNotificationsByUser(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);

        return PaginatedResponse.<NotificationResponse>builder()
                .content(notifications.getContent().stream().map(this::toResponse).toList())
                .page(notifications.getNumber())
                .size(notifications.getSize())
                .totalElements(notifications.getTotalElements())
                .totalPages(notifications.getTotalPages())
                .last(notifications.isLast())
                .build();
    }

    @Override
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    @Override
    @Transactional
    public void markAsRead(Long id, Long userId) {
        notificationRepository.markAsRead(id, userId);
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsRead(userId);
    }

    private NotificationResponse toResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .userId(notification.getUserId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType().name())
                .read(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
