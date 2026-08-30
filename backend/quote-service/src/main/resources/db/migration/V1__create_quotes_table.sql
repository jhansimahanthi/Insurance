-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
    id BIGSERIAL PRIMARY KEY,
    quote_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    policy_id BIGINT NOT NULL,
    age INTEGER NOT NULL,
    coverage_amount DECIMAL(15, 2) NOT NULL,
    duration INTEGER NOT NULL,
    risk_level VARCHAR(20),
    calculated_premium DECIMAL(15, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE INDEX idx_quotes_number ON quotes(quote_number);
CREATE INDEX idx_quotes_customer ON quotes(customer_id);
CREATE INDEX idx_quotes_policy ON quotes(policy_id);
CREATE INDEX idx_quotes_status ON quotes(status);
