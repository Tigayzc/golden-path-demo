#!/bin/bash

# Integration test script for API and Frontend

echo "🧪 Testing API and Frontend Integration"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test API Health
echo "1️⃣  Testing API Health Endpoint..."
API_HEALTH=$(curl -s http://localhost:8787/api/health)
if [[ $API_HEALTH == *"healthy"* ]]; then
  echo -e "${GREEN}✓ API Health Check: PASSED${NC}"
  echo "   Response: $API_HEALTH"
else
  echo -e "${RED}✗ API Health Check: FAILED${NC}"
  echo "   Make sure API is running: npm run dev:api"
  exit 1
fi

echo ""

# Test API Problems Endpoint
echo "2️⃣  Testing API Problems Endpoint..."
API_PROBLEMS=$(curl -s http://localhost:8787/api/problems)
if [[ $API_PROBLEMS == *"data"* ]]; then
  echo -e "${GREEN}✓ API Problems Endpoint: PASSED${NC}"
  # Count number of problems
  PROBLEM_COUNT=$(echo $API_PROBLEMS | grep -o '"id":' | wc -l | tr -d ' ')
  echo "   Found $PROBLEM_COUNT problems"
else
  echo -e "${RED}✗ API Problems Endpoint: FAILED${NC}"
  echo "   Response: $API_PROBLEMS"
  exit 1
fi

echo ""

# Test CORS Headers
echo "3️⃣  Testing CORS Headers..."
CORS_RESPONSE=$(curl -s -I -H "Origin: http://localhost:5173" http://localhost:8787/api/problems)
if [[ $CORS_RESPONSE == *"Access-Control-Allow-Origin"* ]]; then
  echo -e "${GREEN}✓ CORS Headers: PASSED${NC}"
  echo "   CORS is properly configured"
else
  echo -e "${YELLOW}⚠ CORS Headers: WARNING${NC}"
  echo "   CORS headers might not be configured correctly"
fi

echo ""

# Frontend Test
echo "4️⃣  Testing Frontend Build..."
if [ -d "packages/frontend/dist" ]; then
  echo -e "${GREEN}✓ Frontend Build: EXISTS${NC}"
  echo "   Dist directory found"
else
  echo -e "${YELLOW}⚠ Frontend Build: NOT FOUND${NC}"
  echo "   Run: npm run build:frontend"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Integration Tests Complete${NC}"
echo ""
echo "Next steps:"
echo "  1. Start API: npm run dev:api"
echo "  2. Start Frontend: npm run dev"
echo "  3. Visit: http://localhost:5173/problems"
echo ""
echo "Production URLs:"
echo "  • Frontend: https://tiga2000.com"
echo "  • API: https://tiga2000.com/api/problems"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
