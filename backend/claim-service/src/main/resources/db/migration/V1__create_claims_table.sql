-- Create claims table
CREATE TABLE IF NOT EXISTS claims (
    id BIGSERIAL PRIMARY KEY,
    claim_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    policy_id BIGINT NOT NULL,
    claim_type VARCHAR(50) NOT NULL,
    description TEXT,
    claim_amount DECIMAL(15, 2) NOT NULL,
    incident_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SUBMITTED',
    admin_notes TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_claims_number ON claims(claim_number);
CREATE INDEX idx_claims_customer ON claims(customer_id);
CREATE INDEX idx_claims_policy ON claims(policy_id);
CREATE INDEX idx_claims_status ON claims(status);
