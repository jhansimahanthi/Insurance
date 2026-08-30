-- Create insurance_policies table
CREATE TABLE IF NOT EXISTS insurance_policies (
    id BIGSERIAL PRIMARY KEY,
    policy_number VARCHAR(50) NOT NULL UNIQUE,
    policy_name VARCHAR(100) NOT NULL,
    policy_type VARCHAR(50) NOT NULL,
    description TEXT,
    coverage_amount DECIMAL(15, 2) NOT NULL,
    base_premium DECIMAL(15, 2) NOT NULL,
    duration INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    benefits TEXT,
    exclusions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_policies_number ON insurance_policies(policy_number);
CREATE INDEX idx_policies_type ON insurance_policies(policy_type);
CREATE INDEX idx_policies_status ON insurance_policies(status);

-- Create policy_purchases table
CREATE TABLE IF NOT EXISTS policy_purchases (
    id BIGSERIAL PRIMARY KEY,
    purchase_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    policy_id BIGINT NOT NULL,
    quote_id BIGINT,
    premium DECIMAL(15, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_PAYMENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_purchases_number ON policy_purchases(purchase_number);
CREATE INDEX idx_purchases_customer ON policy_purchases(customer_id);
CREATE INDEX idx_purchases_policy ON policy_purchases(policy_id);
