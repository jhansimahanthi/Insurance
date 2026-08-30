package com.insurance.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RouteConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("user-service", r -> r
                        .path("/api/auth/**", "/api/users/**", "/api/admin/**")
                        .filters(f -> f.stripPrefix(0))
                        .uri("http://localhost:8081"))

                .route("policy-service", r -> r
                        .path("/api/policies/**")
                        .filters(f -> f.stripPrefix(0))
                        .uri("http://localhost:8082"))

                .route("quote-service", r -> r
                        .path("/api/quotes/**")
                        .filters(f -> f.stripPrefix(0))
                        .uri("http://localhost:8083"))

                .route("payment-service", r -> r
                        .path("/api/payments/**")
                        .filters(f -> f.stripPrefix(0))
                        .uri("http://localhost:8084"))

                .route("claim-service", r -> r
                        .path("/api/claims/**")
                        .filters(f -> f.stripPrefix(0))
                        .uri("http://localhost:8085"))

                .route("notification-service", r -> r
                        .path("/api/notifications/**")
                        .filters(f -> f.stripPrefix(0))
                        .uri("http://localhost:8086"))
                .build();
    }
}
