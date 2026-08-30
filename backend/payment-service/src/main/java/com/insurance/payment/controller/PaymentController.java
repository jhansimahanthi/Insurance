package com.insurance.payment.controller;

import com.insurance.common.dto.ApiResponse;
import com.insurance.common.dto.PaginatedResponse;
import com.insurance.payment.dto.PaymentRequest;
import com.insurance.payment.dto.PaymentResponse;
import com.insurance.payment.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payments", description = "Payment Management APIs")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    @Operation(summary = "Process a payment (simulated)")
    public ResponseEntity<ApiResponse<PaymentResponse>> processPayment(
            @Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.processPayment(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Payment processed successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get payment by ID")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentById(@PathVariable Long id) {
        PaymentResponse response = paymentService.getPaymentById(id);
        return ResponseEntity.ok(ApiResponse.success("Payment retrieved successfully", response));
    }

    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get payments by customer ID")
    public ResponseEntity<ApiResponse<PaginatedResponse<PaymentResponse>>> getPaymentsByCustomer(
            @PathVariable Long customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PaginatedResponse<PaymentResponse> response = paymentService.getPaymentsByCustomer(customerId, page, size);
        return ResponseEntity.ok(ApiResponse.success("Payments retrieved successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get all payments (admin)")
    public ResponseEntity<ApiResponse<PaginatedResponse<PaymentResponse>>> getAllPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PaginatedResponse<PaymentResponse> response = paymentService.getAllPayments(page, size);
        return ResponseEntity.ok(ApiResponse.success("Payments retrieved successfully", response));
    }
}
