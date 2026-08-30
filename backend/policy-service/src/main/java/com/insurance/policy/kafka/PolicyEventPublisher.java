package com.insurance.policy.kafka;

import com.insurance.common.event.PolicyPurchasedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Component
public class PolicyEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(PolicyEventPublisher.class);
    private static final String POLICY_EVENTS_TOPIC = "policy-events";

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public PolicyEventPublisher(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishPolicyPurchasedEvent(PolicyPurchasedEvent event) {
        log.info("Publishing PolicyPurchasedEvent for purchase: {}", event.getPurchaseNumber());
        CompletableFuture<SendResult<String, Object>> future =
                kafkaTemplate.send(POLICY_EVENTS_TOPIC, event.getCorrelationId(), event);

        future.whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("Failed to publish PolicyPurchasedEvent: {}", ex.getMessage());
            } else {
                log.info("Published PolicyPurchasedEvent to topic: {}, offset: {}",
                        result.getRecordMetadata().topic(),
                        result.getRecordMetadata().offset());
            }
        });
    }
}
