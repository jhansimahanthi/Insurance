package com.insurance.payment.kafka;

import com.insurance.common.event.PaymentCompletedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Component
public class PaymentEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(PaymentEventPublisher.class);
    private static final String PAYMENT_EVENTS_TOPIC = "payment-events";

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public PaymentEventPublisher(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishPaymentCompletedEvent(PaymentCompletedEvent event) {
        log.info("Publishing PaymentCompletedEvent for payment: {}", event.getPaymentReference());
        CompletableFuture<SendResult<String, Object>> future =
                kafkaTemplate.send(PAYMENT_EVENTS_TOPIC, event.getCorrelationId(), event);

        future.whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("Failed to publish PaymentCompletedEvent: {}", ex.getMessage());
            } else {
                log.info("Published PaymentCompletedEvent to topic: {}, offset: {}",
                        result.getRecordMetadata().topic(),
                        result.getRecordMetadata().offset());
            }
        });
    }
}
