cat > docs/architecture.md << 'EOF'
# Architecture Explanation

## 1. High-Level Architecture Diagram
This diagram illustrates the complete flow of the application, infrastructure, and CI/CD pipeline.

```text
[ USERS ] 
   | (HTTPS Request via Internet/Network)
   v
[ CLOUD INFRASTRUCTURE: Azure App Service - Production Slot ]
   |
   +---> [ APP COMPONENTS: Node.js/Express App ]
   |        +---> GET /health (Health Check)
   |        +---> POST /login (Authentication)
   |        +---> GET /api/data (REST API)
   |        +---> GET /admin (Admin Dashboard)
   |
   +---> [ DATABASE/STORAGE: Azure PostgreSQL Flexible Server ]
   |
   +---> [ MONITORING: Azure Log Analytics Workspace ]

=========================================
[ CI/CD PIPELINE: GitHub Actions ]
=========================================
[ DEVELOPER ] 
   | (git push)
   v
[ SOURCE CONTROL: GitHub Repository ] 
   | (Pull Request & Merge to main)
   v
[ AUTOMATED BUILD & TESTS ] (Jest)
   |
   v
[ DOCKER IMAGE BUILD ] -> Push to [ Azure Container Registry (ACR) ]
   |
   v
[ DEPLOYMENT: Azure App Service - STAGING SLOT ]
   |
   v
[ HEALTH CHECK: GET /health ] 
   |---> FAIL: Stop Pipeline (Production Protected)
   |---> PASS: Execute Slot Swap
                |
                v
cat > docs/architecture.md << 'EOF'
cat > docs/architecture.md << 'EOF'
# Architecture Explanation

## 1. High-Level Architecture Diagram
This diagram illustrates the complete flow of the application, infrastructure, and CI/CD pipeline.

```text
[ USERS ] 
   | (HTTPS Request via Internet/Network)
   v
[ CLOUD INFRASTRUCTURE: Azure App Service - Production Slot ]
   |
   +---> [ APP COMPONENTS: Node.js/Express App ]
   |        +---> GET /health (Health Check)
   |        +---> POST /login (Authentication)
   |        +---> GET /api/data (REST API)
   |        +---> GET /admin (Admin Dashboard)
   |
   +---> [ DATABASE/STORAGE: Azure PostgreSQL Flexible Server ]
   |
   +---> [ MONITORING: Azure Log Analytics Workspace ]

=========================================
[ CI/CD PIPELINE: GitHub Actions ]
=========================================
[ DEVELOPER ] 
   | (git push)
   v
[ SOURCE CONTROL: GitHub Repository ] 
   | (Pull Request & Merge to main)
   v
[ AUTOMATED BUILD & TESTS ] (Jest)
   |
   v
[ DOCKER IMAGE BUILD ] -> Push to [ Azure Container Registry (ACR) ]
   |
   v
[ DEPLOYMENT: Azure App Service - STAGING SLOT ]
   |
   v
[ HEALTH CHECK: GET /health ] 
   |---> FAIL: Stop Pipeline (Production Protected)
   |---> PASS: Execute Slot Swap
                |
                v
        [ PRODUCTION SLOT ]
