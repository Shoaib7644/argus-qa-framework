# Use the official Playwright image with the specific version
FROM mcr.microsoft.com/playwright:v1.61.1-focal

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set environment variables (if needed)
ENV BASE_URL=https://automationexercise.com

# Create directory for test results
RUN mkdir -p test-results

# Run tests when container starts (can be overridden)
# By default, run the smoke tests
CMD ["npx", "playwright", "test", "--grep", "@smoke"]