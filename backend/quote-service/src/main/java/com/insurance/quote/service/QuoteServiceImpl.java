package com.insurance.quote.service;

import com.insurance.common.dto.PaginatedResponse;
import com.insurance.common.event.QuoteGeneratedEvent;
import com.insurance.common.exception.BusinessException;
import com.insurance.common.exception.ResourceNotFoundException;
import com.insurance.quote.client.PolicyServiceClient;
import com.insurance.quote.dto.CreateQuoteRequest;
import com.insurance.quote.dto.QuoteResponse;
import com.insurance.quote.entity.Quote;
import com.insurance.quote.kafka.QuoteEventPublisher;
import com.insurance.quote.mapper.QuoteMapper;
import com.insurance.quote.repository.QuoteRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class QuoteServiceImpl implements QuoteService {

    private static final Logger log = LoggerFactory.getLogger(QuoteServiceImpl.class);
    private static final AtomicInteger QUOTE_COUNTER = new AtomicInteger(1000);

    private final QuoteRepository quoteRepository;
    private final PolicyServiceClient policyServiceClient;
    private final PremiumCalculator premiumCalculator;
    private final QuoteMapper quoteMapper;
    private final QuoteEventPublisher eventPublisher;

    public QuoteServiceImpl(QuoteRepository quoteRepository,
                            PolicyServiceClient policyServiceClient,
                            PremiumCalculator premiumCalculator,
                            QuoteMapper quoteMapper,
                            QuoteEventPublisher eventPublisher) {
        this.quoteRepository = quoteRepository;
        this.policyServiceClient = policyServiceClient;
        this.premiumCalculator = premiumCalculator;
        this.quoteMapper = quoteMapper;
        this.eventPublisher = eventPublisher;
    }

    @Override
    @Transactional
    public QuoteResponse generateQuote(CreateQuoteRequest request) {
        log.info("Generating quote for customer: {}, policy: {}", request.getCustomerId(), request.getPolicyId());

        Map<String, Object> policyData = policyServiceClient.getPolicyById(request.getPolicyId());
        if (policyData == null) {
            throw new ResourceNotFoundException("Policy", "id", request.getPolicyId());
        }

        BigDecimal basePremium = new BigDecimal(policyData.get("basePremium").toString());
        String policyName = (String) policyData.get("policyName");

        BigDecimal calculatedPremium = premiumCalculator.calculate(
                basePremium, request.getAge(), request.getCoverageAmount(), request.getDuration());
        String riskLevel = premiumCalculator.determineRiskLevel(
                basePremium, request.getAge(), request.getCoverageAmount());

        String quoteNumber = generateQuoteNumber();

        Quote quote = Quote.builder()
                .quoteNumber(quoteNumber)
                .customerId(request.getCustomerId())
                .policyId(request.getPolicyId())
                .age(request.getAge())
                .coverageAmount(request.getCoverageAmount())
                .duration(request.getDuration())
                .riskLevel(riskLevel)
                .calculatedPremium(calculatedPremium)
                .status(Quote.QuoteStatus.PENDING)
                .expiresAt(LocalDateTime.now().plusDays(30))
                .build();

        quote = quoteRepository.save(quote);
        log.info("Quote generated: {}, premium: {}", quoteNumber, calculatedPremium);

        QuoteGeneratedEvent event = QuoteGeneratedEvent.create(
                quote.getId(), quote.getQuoteNumber(),
                quote.getCustomerId(), null,
                quote.getPolicyId(), policyName,
                quote.getCalculatedPremium(), quote.getCoverageAmount());
        eventPublisher.publishQuoteGeneratedEvent(event);

        return quoteMapper.toResponse(quote, policyName);
    }

    @Override
    public QuoteResponse getQuoteById(Long id) {
        Quote quote = quoteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quote", "id", id));

        Map<String, Object> policyData = policyServiceClient.getPolicyById(quote.getPolicyId());
        String policyName = policyData != null ? (String) policyData.get("policyName") : "Unknown";

        return quoteMapper.toResponse(quote, policyName);
    }

    @Override
    public PaginatedResponse<QuoteResponse> getQuotesByCustomer(Long customerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Quote> quotes = quoteRepository.findByCustomerId(customerId, pageable);

        return PaginatedResponse.<QuoteResponse>builder()
                .content(quotes.getContent().stream()
                        .map(q -> {
                            Map<String, Object> policyData = policyServiceClient.getPolicyById(q.getPolicyId());
                            String policyName = policyData != null ? (String) policyData.get("policyName") : "Unknown";
                            return quoteMapper.toResponse(q, policyName);
                        })
                        .toList())
                .page(quotes.getNumber())
                .size(quotes.getSize())
                .totalElements(quotes.getTotalElements())
                .totalPages(quotes.getTotalPages())
                .last(quotes.isLast())
                .build();
    }

    @Override
    public PaginatedResponse<QuoteResponse> getAllQuotes(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Quote> quotes = quoteRepository.findAll(pageable);

        return PaginatedResponse.<QuoteResponse>builder()
                .content(quotes.getContent().stream()
                        .map(q -> {
                            Map<String, Object> policyData = policyServiceClient.getPolicyById(q.getPolicyId());
                            String policyName = policyData != null ? (String) policyData.get("policyName") : "Unknown";
                            return quoteMapper.toResponse(q, policyName);
                        })
                        .toList())
                .page(quotes.getNumber())
                .size(quotes.getSize())
                .totalElements(quotes.getTotalElements())
                .totalPages(quotes.getTotalPages())
                .last(quotes.isLast())
                .build();
    }

    private String generateQuoteNumber() {
        return "QT-" + String.format("%06d", QUOTE_COUNTER.getAndIncrement());
    }
}
