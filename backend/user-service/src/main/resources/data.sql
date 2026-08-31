-- Seed data for user service (H2 compatible)
-- Passwords are BCrypt hashed versions of "Demo@12345"

-- Admin user: admin@example.com / Demo@12345
INSERT INTO users (first_name, last_name, email, password, phone, role, status, created_at, updated_at)
SELECT 'Admin', 'User', 'admin@example.com', '$2a$10$vMZfFiXM6Fne65TJLjMc9.coXdEMeGuVNVme6L7IMJTy/TycV1Qfu', '+1234567890', 'ADMIN', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com');

-- Customer 1: customer1@example.com / Demo@12345
INSERT INTO users (first_name, last_name, email, password, phone, role, status, created_at, updated_at)
SELECT 'John', 'Doe', 'customer1@example.com', '$2a$10$vMZfFiXM6Fne65TJLjMc9.coXdEMeGuVNVme6L7IMJTy/TycV1Qfu', '+1987654321', 'CUSTOMER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'customer1@example.com');

-- Customer 2: customer2@example.com / Demo@12345
INSERT INTO users (first_name, last_name, email, password, phone, role, status, created_at, updated_at)
SELECT 'Jane', 'Smith', 'customer2@example.com', '$2a$10$vMZfFiXM6Fne65TJLjMc9.coXdEMeGuVNVme6L7IMJTy/TycV1Qfu', '+1122334455', 'CUSTOMER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'customer2@example.com');
