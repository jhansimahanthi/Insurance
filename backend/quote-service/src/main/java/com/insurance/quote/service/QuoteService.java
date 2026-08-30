package com.insurance.quote.service;

import com.insurance.common.dto.PaginatedResponse;
import com.insurance.quote.dto.CreateQuoteRequest;
import com.insurance.quote.dto.QuoteResponse;

public interface QuoteService {
    QuoteResponse generateQuote(CreateQuoteRequest request);
    QuoteResponse getQuoteById(Long id);
    PaginatedResponse<QuoteResponse> getQuotesByCustomer(Long customerId, int page, int size);
    PaginatedResponse<QuoteResponse> getAllQuotes(int page, int size);
}
