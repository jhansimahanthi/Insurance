package com.insurance.quote.service;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class PremiumCalculator {

    /**
     * Calculates the premium based on a documented formula:
     *
     * Premium = Base Premium × Coverage Factor × Age Factor × Risk Factor × Duration Factor
     *
     * Coverage Factor = coverageAmount / 100000
     * Age Factor: 18-25: 1.3, 26-35: 1.0, 36-45: 1.2, 46-55: 1.5, 56-65: 2.0, 65+: 2.5
     * Risk Factor based on coverage-to-premium ratio
     * Duration Factor: months / 12 (prorated for less than a year)
     */
    public BigDecimal calculate(BigDecimal basePremium, int age, BigDecimal coverageAmount, int durationMonths) {
        BigDecimal coverageFactor = coverageAmount.divide(new BigDecimal("100000"), 4, RoundingMode.HALF_UP);
        BigDecimal ageFactor = getAgeFactor(age);
        BigDecimal riskFactor = calculateRiskFactor(coverageAmount, basePremium);
        BigDecimal durationFactor = BigDecimal.valueOf(durationMonths)
                .divide(BigDecimal.valueOf(12), 4, RoundingMode.HALF_UP);

        BigDecimal premium = basePremium
                .multiply(coverageFactor)
                .multiply(ageFactor)
                .multiply(riskFactor)
                .multiply(durationFactor)
                .setScale(2, RoundingMode.HALF_UP);

        // Ensure minimum premium
        BigDecimal minPremium = new BigDecimal("50.00");
        return premium.max(minPremium);
    }

    public String determineRiskLevel(BigDecimal basePremium, int age, BigDecimal coverageAmount) {
        BigDecimal ageFactor = getAgeFactor(age);
        BigDecimal ratio = coverageAmount.divide(basePremium, 4, RoundingMode.HALF_UP);

        if (ageFactor.compareTo(new BigDecimal("2.0")) >= 0 && ratio.compareTo(new BigDecimal("3000")) > 0) {
            return "HIGH";
        } else if (ageFactor.compareTo(new BigDecimal("1.3")) >= 0 || ratio.compareTo(new BigDecimal("2000")) > 0) {
            return "MEDIUM";
        }
        return "LOW";
    }

    private BigDecimal getAgeFactor(int age) {
        if (age <= 25) return new BigDecimal("1.3");
        if (age <= 35) return new BigDecimal("1.0");
        if (age <= 45) return new BigDecimal("1.2");
        if (age <= 55) return new BigDecimal("1.5");
        if (age <= 65) return new BigDecimal("2.0");
        return new BigDecimal("2.5");
    }

    private BigDecimal calculateRiskFactor(BigDecimal coverageAmount, BigDecimal basePremium) {
        BigDecimal ratio = coverageAmount.divide(basePremium, 4, RoundingMode.HALF_UP);
        if (ratio.compareTo(new BigDecimal("5000")) > 0) return new BigDecimal("1.5");
        if (ratio.compareTo(new BigDecimal("3000")) > 0) return new BigDecimal("1.2");
        return new BigDecimal("1.0");
    }
}
