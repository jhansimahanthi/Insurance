package com.insurance.quote;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
@ComponentScan(basePackages = {"com.insurance.quote", "com.insurance.common"})
public class QuoteServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(QuoteServiceApplication.class, args);
    }
}
