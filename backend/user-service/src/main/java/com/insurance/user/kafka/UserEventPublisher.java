package com.insurance.user.kafka;

import com.insurance.common.event.CustomerRegisteredEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Component
public class UserEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(UserEventPublisher.class);
    private static final String CUSTOMER_EVENTS_TOPIC = "customer-events";

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public UserEventPublisher(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishCustomerRegisteredEvent(CustomerRegisteredEvent event) {
        log.info("Publishing CustomerRegisteredEvent for user: {}", event.getEmail());
        CompletableFuture<SendResult<String, Object>> future =
                kafkaTemplate.send(CUSTOMER_EVENTS_TOPIC, event.getCorrelationId(), event);

        future.whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("Failed to publish CustomerRegisteredEvent: {}", ex.getMessage());
            } else {
                log.info("Published CustomerRegisteredEvent to topic: {}, partition: {}, offset: {}",
                        result.getRecordMetadata().topic(),
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
            }
        });
    }
}
