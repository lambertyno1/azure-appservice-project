Environment Variables & Secrets
Security is critical. We never store passwords in the code. We use Environment Variables injected at runtime.

A. GitHub Secrets (For CI/CD Pipeline)
These are stored in your GitHub Repository → Settings → Secrets and variables → Actions.

Secret Name                   Description

AZURE_CREDENTIALS             JSON object for service principal authentication

ACR_LOGIN_SERVER              The URL of your Azure container registry

ACR_USERNAME                  Username for the ACR admin access

ACR_PASSWORD                  Password for the ACR admin access


B. Azure App Settings (For Runtime)
These are stored in your Azure App Service → Configuration → Application settings.

Variable Name                     Description                     Example Value

DATABASE_URL          Connection string for Azure PostgreSQL      postgresql://admin:Pass123!@psqlprojectapp.postgres.database.azure.com:
                                                                  5432/postgres?sslmode=require

PORT                    The port the container listens to         80 or 8080

WEBSITES_PORT        Azure specific settings to map container 
                     port


Part 2: Step-by-Step Deployment Instructions
Step 1: Provision the Database (Azure PostgreSQL)

Go to Azure Portal → Create a resource → Azure Database for PostgreSQL → Flexible Server.
Resource Group: Select your existing group.
Server name: psqlprojectapp (or similar).
Authentication: Select Password authentication. Create an admin username (azureadmin) and a strong password.
Networking:
Select Public access (allowed IP addresses).
Check "Allow public access from any Azure service within Azure to this server".
Click Review + Create.


Step 2: Create the Container Registry (ACR)

- Azure Portal → Create a resource → Container Registry.
Name: ticketbookingregistry (must be unique).
SKU: Basic (for cost saving).
Admin User: Enable this (required for GitHub Actions to push images).
Go to the resource → Access keys → Copy the Login server, Username, and Password. Save these for GitHub Secrets.


Step 3: Create the App Service

Azure Portal → Create a resource → Web App.
Publish: Docker Container.
Runtime stack: Node 18 LTS (or just leave default since we use Docker).
Region: Same as your database (e.g., Central US).
Plan: Select your existing App Service Plan (or create a new Basic B1 plan).
Deployment Center:
           - Source: GitHub Actions.
           - Connect your repository and branch (main).
           - Select Container Registry as the source.
           - Select your ACR and the image name (ticket-booking).


Step 4: Configure GitHub Secrets

Go to your GitHub Repo → Settings → Secrets and variables → Actions → New repository secret.
Add the four secrets listed in Part 1A using the values you copied from Azure.
Note: To get AZURE_CREDENTIALS, run this command in your WSL terminal (logged into Azure CLI):

az ad sp create-for-rbac --name "myApp" --role contributor \--scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} \--sdk-auth

Copy the JSON output and paste it into the GitHub Secret.


Step 5: Add Environment Variables to Azure

Go to your App Service (web-app-project) → Environment variables (or Configuration).
Click Add and add the variables from part 1B

- Name: DATABASE_URL, Value: Your PostgreSQL connection string.
   - Name: WEBSITES_PORT, Value: 80.

3. Click Apply and Restart the App Service


Step 6: Push Code to Trigger Pipeline

1. Ensure your .github/workflows/deploy.yml is committed to the main branch.
2. Push any change to main:

git add .
git commit -m "chore: trigger deployment"
git push origin main


3. Go to the Actions tab in GitHub. You will see the pipeline running:

Build & Test: Runs npm install and tests.
Build & Push: Builds the Docker image and pushes it to ACR.
Deploy to Staging: Deploys the image to the staging slot.
Health Check: Pings /health to ensure the app is alive.
Swap to Production: Swaps the staging slot with production for zero downtime.


Part 3: Verification (How to prove it works)

After the pipeline finishes (green checkmarks):

1. Check the Live Site: Visit https://web-app-project.azurewebsites.net.
2. Test Persistence:

-  Register a new user (e.g., testuser / Test@1234).
Log out.
Log back in. (If it works, your database is connected and persisting data).


4. Check the Database:

Go to Azure Portal → Your PostgreSQL resource → Query database (left menu).
Run: SELECT * FROM users;
You should see testuser in the list.

