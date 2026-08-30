package com.insurance.notification.service;

import com.insurance.common.dto.PaginatedResponse;
import com.insurance.notification.dto.NotificationResponse;

public interface NotificationService {
    void createNotification(Long userId, String title, String message, String type, String eventType, String eventId);
    PaginatedResponse<NotificationResponse> getNotificationsByUser(Long userId, int page, int size);
    long getUnreadCount(Long userId);
    void markAsRead(Long id, Long userId);
    void markAllAsRead(Long userId);
}
