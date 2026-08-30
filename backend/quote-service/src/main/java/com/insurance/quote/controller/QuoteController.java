package com.insurance.quote.controller;

import com.insurance.common.dto.ApiResponse;
import com.insurance.common.dto.PaginatedResponse;
import com.insurance.quote.dto.CreateQuoteRequest;
import com.insurance.quote.dto.QuoteResponse;
import com.insurance.quote.service.QuoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quotes")
@Tag(name = "Quotes", description = "Insurance Quote Management APIs")
public class QuoteController {

    private final QuoteService quoteService;

    public QuoteController(QuoteService quoteService) {
        this.quoteService = quoteService;
    }

    @PostMapping
    @Operation(summary = "Generate a new insurance quote")
    public ResponseEntity<ApiResponse<QuoteResponse>> generateQuote(
            @Valid @RequestBody CreateQuoteRequest request) {
        QuoteResponse response = quoteService.generateQuote(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Quote generated successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get quote by ID")
    public ResponseEntity<ApiResponse<QuoteResponse>> getQuoteById(@PathVariable Long id) {
        QuoteResponse response = quoteService.getQuoteById(id);
        return ResponseEntity.ok(ApiResponse.success("Quote retrieved successfully", response));
    }

    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get quotes by customer ID")
    public ResponseEntity<ApiResponse<PaginatedResponse<QuoteResponse>>> getQuotesByCustomer(
            @PathVariable Long customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PaginatedResponse<QuoteResponse> response = quoteService.getQuotesByCustomer(customerId, page, size);
        return ResponseEntity.ok(ApiResponse.success("Quotes retrieved successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get all quotes (admin)")
    public ResponseEntity<ApiResponse<PaginatedResponse<QuoteResponse>>> getAllQuotes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PaginatedResponse<QuoteResponse> response = quoteService.getAllQuotes(page, size);
        return ResponseEntity.ok(ApiResponse.success("Quotes retrieved successfully", response));
    }
}
