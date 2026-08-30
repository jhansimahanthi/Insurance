package com.insurance.notification.consumer;

import com.insurance.common.event.*;
import com.insurance.notification.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class EventNotificationConsumer {

    private static final Logger log = LoggerFactory.getLogger(EventNotificationConsumer.class);

    private final NotificationService notificationService;

    public EventNotificationConsumer(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @KafkaListener(topics = "customer-events", groupId = "notification-service-group")
    public void handleCustomerRegisteredEvent(CustomerRegisteredEvent event) {
        log.info("Received CustomerRegisteredEvent for: {}", event.getEmail());
        notificationService.createNotification(
                event.getUserId(),
                "Welcome to Insurance Management System!",
                String.format("Dear %s %s, your account has been created successfully. " +
                        "You can now browse policies and generate quotes.",
                        event.getFirstName(), event.getLastName()),
                "SUCCESS",
                event.getEventType(),
                event.getEventId());
    }

    @KafkaListener(topics = "quote-events", groupId = "notification-service-group")
    public void handleQuoteGeneratedEvent(QuoteGeneratedEvent event) {
        log.info("Received QuoteGeneratedEvent for quote: {}", event.getQuoteNumber());
        notificationService.createNotification(
                event.getCustomerId(),
                "New Quote Generated",
                String.format("A quote has been generated for %s. " +
                        "Calculated premium: $%s. Please review and proceed with purchase.",
                        event.getPolicyName(), event.getCalculatedPremium()),
                "INFO",
                event.getEventType(),
                event.getEventId());
    }

    @KafkaListener(topics = "policy-events", groupId = "notification-service-group")
    public void handlePolicyPurchasedEvent(PolicyPurchasedEvent event) {
        log.info("Received PolicyPurchasedEvent for purchase: {}", event.getPurchaseNumber());
        notificationService.createNotification(
                event.getCustomerId(),
                "Policy Purchased Successfully",
                String.format("Your policy '%s' has been purchased. " +
                        "Purchase number: %s. Premium: $%s. Please complete the payment.",
                        event.getPolicyName(), event.getPurchaseNumber(), event.getPremium()),
                "SUCCESS",
                event.getEventType(),
                event.getEventId());
    }

    @KafkaListener(topics = "payment-events", groupId = "notification-service-group")
    public void handlePaymentCompletedEvent(PaymentCompletedEvent event) {
        log.info("Received PaymentCompletedEvent for payment: {}", event.getPaymentReference());
        notificationService.createNotification(
                event.getCustomerId(),
                "Payment Successful",
                String.format("Your payment of $%s has been processed successfully. " +
                        "Payment reference: %s. Your policy is now active.",
                        event.getAmount(), event.getPaymentReference()),
                "SUCCESS",
                event.getEventType(),
                event.getEventId());
    }

    @KafkaListener(topics = "claim-events", groupId = "notification-service-group")
    public void handleClaimEvents(Object event) {
        if (event instanceof ClaimSubmittedEvent claimEvent) {
            log.info("Received ClaimSubmittedEvent for claim: {}", claimEvent.getClaimNumber());
            notificationService.createNotification(
                    claimEvent.getCustomerId(),
                    "Claim Submitted",
                    String.format("Your claim '%s' has been submitted successfully. " +
                            "Claim amount: $%s. We will review it shortly.",
                            claimEvent.getClaimNumber(), claimEvent.getClaimAmount()),
                    "INFO",
                    claimEvent.getEventType(),
                    claimEvent.getEventId());
        } else if (event instanceof ClaimStatusUpdatedEvent statusEvent) {
            log.info("Received ClaimStatusUpdatedEvent for claim: {}",
                    statusEvent.getClaimNumber());
            String message = String.format(
                    "Your claim '%s' status has been updated from %s to %s.",
                    statusEvent.getClaimNumber(),
                    statusEvent.getPreviousStatus(),
                    statusEvent.getNewStatus());

            String notifType = switch (statusEvent.getNewStatus()) {
                case "APPROVED", "SETTLED" -> "SUCCESS";
                case "REJECTED" -> "ERROR";
                default -> "INFO";
            };

            notificationService.createNotification(
                    statusEvent.getCustomerId(),
                    "Claim Status Updated",
                    message,
                    notifType,
                    statusEvent.getEventType(),
                    statusEvent.getEventId());
        }
    }
}
