package com.insurance.quote.kafka;

import com.insurance.common.event.QuoteGeneratedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Component
public class QuoteEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(QuoteEventPublisher.class);
    private static final String QUOTE_EVENTS_TOPIC = "quote-events";

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public QuoteEventPublisher(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishQuoteGeneratedEvent(QuoteGeneratedEvent event) {
        log.info("Publishing QuoteGeneratedEvent for quote: {}", event.getQuoteNumber());
        CompletableFuture<SendResult<String, Object>> future =
                kafkaTemplate.send(QUOTE_EVENTS_TOPIC, event.getCorrelationId(), event);

        future.whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("Failed to publish QuoteGeneratedEvent: {}", ex.getMessage());
            } else {
                log.info("Published QuoteGeneratedEvent to topic: {}, offset: {}",
                        result.getRecordMetadata().topic(),
                        result.getRecordMetadata().offset());
            }
        });
    }
}
