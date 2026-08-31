package com.insurance.quote.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.util.Map;

@Component
public class PolicyServiceClient {

    private static final Logger log = LoggerFactory.getLogger(PolicyServiceClient.class);
    private final WebClient webClient;

    public PolicyServiceClient() {
        HttpClient httpClient = HttpClient.create()
                .responseTimeout(Duration.ofSeconds(5));

        this.webClient = WebClient.builder()
                .baseUrl("http://localhost:8082")
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }

    public Map<String, Object> getPolicyById(Long policyId) {
        log.info("Fetching policy details for policy: {}", policyId);
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = webClient.get()
                    .uri("/api/policies/{id}", policyId)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(5))
                    .block();

            if (response != null && (boolean) response.get("success")) {
                return (Map<String, Object>) response.get("data");
            }
            return null;
        } catch (Exception e) {
            log.error("Failed to fetch policy from Policy Service: {}", e.getMessage());
            return null;
        }
    }
}
