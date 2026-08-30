-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    payment_reference VARCHAR(50) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    policy_id BIGINT NOT NULL,
    purchase_id BIGINT,
    amount DECIMAL(15, 2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    transaction_date TIMESTAMP,
    card_last_four VARCHAR(4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_reference ON payments(payment_reference);
CREATE INDEX idx_payments_customer ON payments(customer_id);
CREATE INDEX idx_payments_purchase ON payments(purchase_id);
