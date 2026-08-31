package com.insurance.claim.kafka;

import com.insurance.common.event.ClaimStatusUpdatedEvent;
import com.insurance.common.event.ClaimSubmittedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Component
@ConditionalOnBean(KafkaTemplate.class)
public class ClaimEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(ClaimEventPublisher.class);
    private static final String CLAIM_EVENTS_TOPIC = "claim-events";

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public ClaimEventPublisher(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishClaimSubmittedEvent(ClaimSubmittedEvent event) {
        log.info("Publishing ClaimSubmittedEvent for claim: {}", event.getClaimNumber());
        CompletableFuture<SendResult<String, Object>> future =
                kafkaTemplate.send(CLAIM_EVENTS_TOPIC, event.getCorrelationId(), event);
        future.whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("Failed to publish ClaimSubmittedEvent: {}", ex.getMessage());
            } else {
                log.info("Published ClaimSubmittedEvent to topic: {}, offset: {}",
                        result.getRecordMetadata().topic(),
                        result.getRecordMetadata().offset());
            }
        });
    }

    public void publishClaimStatusUpdatedEvent(ClaimStatusUpdatedEvent event) {
        log.info("Publishing ClaimStatusUpdatedEvent for claim: {}", event.getClaimNumber());
        CompletableFuture<SendResult<String, Object>> future =
                kafkaTemplate.send(CLAIM_EVENTS_TOPIC, event.getCorrelationId(), event);
        future.whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("Failed to publish ClaimStatusUpdatedEvent: {}", ex.getMessage());
            } else {
                log.info("Published ClaimStatusUpdatedEvent to topic: {}, offset: {}",
                        result.getRecordMetadata().topic(),
                        result.getRecordMetadata().offset());
            }
        });
    }
}
