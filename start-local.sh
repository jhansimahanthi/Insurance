#!/bin/bash
# Start all services locally with H2 in-memory database

JAVA="/c/Program Files/Java/jdk-24/bin/java"
JVM_OPTS="--add-opens java.base/java.lang=ALL-UNNAMED --add-opens java.base/java.lang.reflect=ALL-UNNAMED --add-opens java.base/java.util=ALL-UNNAMED"
SPRING_OPTS="--spring.profiles.active=local"
BASE_DIR="/c/Users/Lenovo/Favorites/backend"

echo "=== Starting Insurance Management System (Local Mode) ==="

# Kill any existing Java processes on our ports
for port in 8081 8082 8083 8084 8085 8086; do
    pid=$(lsof -ti:$port 2>/dev/null)
    if [ -n "$pid" ]; then
        kill -9 $pid 2>/dev/null
        echo "Killed process on port $port"
    fi
done

echo ""
echo "[1/6] Starting User Service (port 8081)..."
cd "$BASE_DIR"
"$JAVA" $JVM_OPTS -jar user-service/target/user-service-1.0.0.jar $SPRING_OPTS > /tmp/user-service.log 2>&1 &
echo "PID: $!"

echo "[2/6] Starting Policy Service (port 8082)..."
cd "$BASE_DIR"
"$JAVA" $JVM_OPTS -jar policy-service/target/policy-service-1.0.0.jar $SPRING_OPTS > /tmp/policy-service.log 2>&1 &
echo "PID: $!"

echo "[3/6] Starting Quote Service (port 8083)..."
cd "$BASE_DIR"
"$JAVA" $JVM_OPTS -jar quote-service/target/quote-service-1.0.0.jar $SPRING_OPTS > /tmp/quote-service.log 2>&1 &
echo "PID: $!"

echo "[4/6] Starting Payment Service (port 8084)..."
cd "$BASE_DIR"
"$JAVA" $JVM_OPTS -jar payment-service/target/payment-service-1.0.0.jar $SPRING_OPTS > /tmp/payment-service.log 2>&1 &
echo "PID: $!"

echo "[5/6] Starting Claim Service (port 8085)..."
cd "$BASE_DIR"
"$JAVA" $JVM_OPTS -jar claim-service/target/claim-service-1.0.0.jar $SPRING_OPTS > /tmp/claim-service.log 2>&1 &
echo "PID: $!"

echo "[6/6] Starting Notification Service (port 8086)..."
cd "$BASE_DIR"
"$JAVA" $JVM_OPTS -jar notification-service/target/notification-service-1.0.0.jar $SPRING_OPTS > /tmp/notification-service.log 2>&1 &
echo "PID: $!"

echo ""
echo "All services started! Waiting for them to initialize..."
sleep 30

echo ""
echo "=== Checking service health ==="
for port in 8081 8082 8083 8084 8085 8086; do
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$port/actuator/health 2>/dev/null)
    if [ "$response" = "200" ]; then
        echo "✅ Port $port: UP"
    else
        echo "❌ Port $port: DOWN (status: $response)"
    fi
done

echo ""
echo "=== Service URLs ==="
echo "User Service:        http://localhost:8081/swagger-ui.html"
echo "Policy Service:      http://localhost:8082/swagger-ui.html"
echo "Quote Service:       http://localhost:8083/swagger-ui.html"
echo "Payment Service:     http://localhost:8084/swagger-ui.html"
echo "Claim Service:       http://localhost:8085/swagger-ui.html"
echo "Notification Service: http://localhost:8086/swagger-ui.html"
echo ""
echo "=== Demo Credentials ==="
echo "Admin:    admin@example.com / Demo@12345"
echo "Customer: customer1@example.com / Demo@12345"
echo "Customer: customer2@example.com / Demo@12345"
echo ""
echo "To start Angular frontend: cd insurance-ui && npx ng serve"
