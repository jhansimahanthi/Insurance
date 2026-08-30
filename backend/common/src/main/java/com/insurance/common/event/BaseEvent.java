package com.insurance.common.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class BaseEvent {
    private String eventId;
    private String eventType;
    private LocalDateTime timestamp;
    private String correlationId;

    protected void initDefaults() {
        if (this.eventId == null) this.eventId = UUID.randomUUID().toString();
        if (this.timestamp == null) this.timestamp = LocalDateTime.now();
        if (this.correlationId == null) this.correlationId = UUID.randomUUID().toString();
    }
}
