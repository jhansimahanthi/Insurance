package com.insurance.notification.service;

import com.insurance.notification.entity.Notification;
import com.insurance.notification.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceImplTest {

    @Mock private NotificationRepository notificationRepository;
    @InjectMocks private NotificationServiceImpl notificationService;

    private Notification testNotification;

    @BeforeEach
    void setUp() {
        testNotification = Notification.builder()
                .id(1L).userId(1L)
                .title("Welcome!")
                .message("Your account has been created.")
                .type(Notification.NotificationType.SUCCESS)
                .read(false).createdAt(LocalDateTime.now()).build();
    }

    @Test
    void createNotification_success() {
        notificationService.createNotification(1L, "Welcome!", "Your account has been created.", "SUCCESS", "CUSTOMER_REGISTERED", "evt-123");

        verify(notificationRepository).save(argThat(n ->
                n.getUserId().equals(1L) &&
                n.getTitle().equals("Welcome!") &&
                n.getType() == Notification.NotificationType.SUCCESS
        ));
    }

    @Test
    void getNotificationsByUser_success() {
        Page<Notification> page = new PageImpl<>(List.of(testNotification));
        when(notificationRepository.findByUserIdOrderByCreatedAtDesc(eq(1L), any(PageRequest.class)))
                .thenReturn(page);

        var result = notificationService.getNotificationsByUser(1L, 0, 10);

        assertEquals(1, result.getContent().size());
        assertEquals("Welcome!", result.getContent().get(0).getTitle());
    }

    @Test
    void getUnreadCount_success() {
        when(notificationRepository.countByUserIdAndReadFalse(1L)).thenReturn(3L);

        long count = notificationService.getUnreadCount(1L);

        assertEquals(3L, count);
    }

    @Test
    void markAsRead_success() {
        notificationService.markAsRead(1L, 1L);

        verify(notificationRepository).markAsRead(1L, 1L);
    }

    @Test
    void markAllAsRead_success() {
        notificationService.markAllAsRead(1L);

        verify(notificationRepository).markAllAsRead(1L);
    }

    @Test
    void createNotification_defaultTypeIsInfo() {
        notificationService.createNotification(1L, "Test", "Test message", null, "TEST", "evt-456");

        verify(notificationRepository).save(argThat(n ->
                n.getType() == Notification.NotificationType.INFO
        ));
    }
}
