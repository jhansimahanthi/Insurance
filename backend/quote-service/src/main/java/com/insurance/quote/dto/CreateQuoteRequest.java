package com.insurance.quote.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateQuoteRequest {

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotNull(message = "Policy ID is required")
    private Long policyId;

    @NotNull(message = "Age is required")
    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 100, message = "Age must be at most 100")
    private Integer age;

    @NotNull(message = "Coverage amount is required")
    @DecimalMin(value = "1000", message = "Coverage amount must be at least 1000")
    private BigDecimal coverageAmount;

    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 month")
    private Integer duration;
}
