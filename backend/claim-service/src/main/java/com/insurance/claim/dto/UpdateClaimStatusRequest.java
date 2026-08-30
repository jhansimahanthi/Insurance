package com.insurance.claim.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateClaimStatusRequest {

    @NotBlank(message = "Status is required")
    private String status;

    private String adminNotes;
}
