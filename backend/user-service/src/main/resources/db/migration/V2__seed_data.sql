-- Seed data for development/demo purposes
-- Passwords are BCrypt hashed versions of "Demo@12345"

-- Admin user: admin@example.com / Demo@12345
INSERT INTO users (first_name, last_name, email, password, phone, role, status)
VALUES ('Admin', 'User', 'admin@example.com', '$2a$10$vMZfFiXM6Fne65TJLjMc9.coXdEMeGuVNVme6L7IMJTy/TycV1Qfu', '+1234567890', 'ADMIN', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;

-- Customer 1: customer1@example.com / Demo@12345
INSERT INTO users (first_name, last_name, email, password, phone, role, status)
VALUES ('John', 'Doe', 'customer1@example.com', '$2a$10$vMZfFiXM6Fne65TJLjMc9.coXdEMeGuVNVme6L7IMJTy/TycV1Qfu', '+1987654321', 'CUSTOMER', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;

-- Customer 2: customer2@example.com / Demo@12345
INSERT INTO users (first_name, last_name, email, password, phone, role, status)
VALUES ('Jane', 'Smith', 'customer2@example.com', '$2a$10$vMZfFiXM6Fne65TJLjMc9.coXdEMeGuVNVme6L7IMJTy/TycV1Qfu', '+1122334455', 'CUSTOMER', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;
