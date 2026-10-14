Environment Variables & Secrets
Security is critical. We never store passwords in the code. We use Environment Variables injected at runtime.

### A. GitHub Secrets (CI/CD Pipeline)

GitHub Actions uses repository secrets to authenticate with Azure and access the Azure Container Registry during deployment.

To configure these secrets, navigate to:

Repository → Settings → Secrets and variables → Actions → New repository secret.

Add the following secrets using the actual values obtained from your Azure resources. Never commit credentials or passwords directly to the repository.
Secret Name                   Description

AZURE_CREDENTIALS             JSON object for service principal authentication

ACR_LOGIN_SERVER              The URL of your Azure container registry

ACR_USERNAME                  Username for the ACR admin access

ACR_PASSWORD                  Password for the ACR admin access


### B. Azure App Service Environment Variables (Runtime)

These variables configure the application when it runs on Azure App Service.

To configure them, open the Azure Portal and navigate to:

App Service → Settings → Environment variables.

Add the required variables listed below, using the actual values from your Azure resources. Do not commit database credentials or other sensitive information to GitHub.

Variable Name                     Description                     Example Value

DATABASE_URL          Connection string for Azure PostgreSQL      postgresql://<username>:<password>@<server>.postgres.database.azure.com:5432/<database>?sslmode=require
                                                                  5432/postgres?sslmode=require

PORT                    The port the container listens to         80 or 8080

WEBSITES_PORT        Azure specific settings to map container 
                     port


Part 2: Step-by-Step Deployment Instructions
### Step 1: Provision the Database (Azure PostgreSQL)

1. Go to the Azure Portal.
2. Select Create a resource → Azure Database for PostgreSQL → Flexible Server.

**Configuration:**

- **Resource Group:** Select your existing resource group.
- **Server name:** Enter `psqlprojectapp` or another available name.
- **Authentication:** Select Password authentication.
- **Administrator username:** Enter `azureadmin` or another suitable username.
- **Password:** Create a strong password and store it securely.

**Networking:**

- Select Public access (allowed IP addresses).
- Configure the required firewall rules to allow connections from authorized IP addresses.
- Only enable access from other Azure services if your deployment requires it and the security implications are understood.

3. Select Review + Create.
4. Review the configuration and create the server.

### Step 2: Create the Azure Container Registry (ACR)

1. Open the Azure Portal.
2. Select Create a resource → Container Registry.

**Configuration:**

- **Registry name:** Enter `ticketbookingregistry` or your existing registry name. The name must be globally unique.
- **Resource Group:** Select the resource group used for this project.
- **SKU:** Select Basic for a cost-conscious development setup.

3. Select Review + Create, review the configuration, and create the registry.

**Retrieve the registry details:**

4. Open your Container Registry resource.
5. Navigate to Access keys.
6. Copy the Login server, Username, and Password if administrator access is enabled.

Use the appropriate values to configure the GitHub Actions secrets required by your deployment workflow. Store credentials securely and never commit passwords to the repository.

### Step 3: Create the Azure App Service

1. Open the Azure Portal.
2. Select Create a resource → Web App.

**Basic configuration:**

- **Resource Group:** Select the resource group used for this project.
- **Name:** Enter a globally unique name for your web app.
- **Publish:** Select Docker Container.
- **Operating System:** Select Linux if required by your container configuration.
- **Region:** Choose a region suitable for the project, preferably the same region as the database to reduce network latency.
- **App Service Plan:** Select an existing plan or create an appropriate plan based on your project's requirements and budget.

**Container configuration:**

3. Configure the web app to use the container image stored in your Azure Container Registry (ACR).
4. Select the appropriate registry and image repository, such as `ticket-booking`, if that is the image name used by your project.
5. Configure the image tag and registry authentication according to your GitHub Actions workflow.

**Deployment configuration:**

6. Configure GitHub Actions as the deployment method only if this matches the deployment workflow used by your project.
7. Ensure the selected repository, branch, registry, image name, and deployment settings match the project's actual configuration.

8. Review the configuration and create the App Service.


### Step 4: Configure GitHub Secrets

1. Open your GitHub repository.
2. Navigate to Settings → Secrets and variables → Actions.
3. Select New repository secret.
4. Add the four secrets listed in Section A using the appropriate values from your Azure resources.

**Configuring AZURE_CREDENTIALS:**

The `AZURE_CREDENTIALS` secret contains the credentials GitHub Actions uses to authenticate with Azure. The exact format depends on the authentication method configured in your deployment workflow.

If your workflow uses a service principal, an authorized team member can create or obtain the required credentials using the Azure CLI.

Before running any command, confirm that you are signed in to Azure CLI and have selected the correct subscription.

Use the authentication command and output format supported by your project's GitHub Actions workflow.

Copy the required credential output into the `AZURE_CREDENTIALS` repository secret. Treat it as sensitive information and never commit it to the repository.

### Step 5: Add Environment Variables to Azure

1. Open the Azure Portal.
2. Navigate to your App Service (for example, `web-app-project`).
3. Open Settings → Environment variables.
4. Add the required application settings listed in Section B.

**Required configuration:**

- **Name:** `DATABASE_URL`
  **Value:** Your Azure PostgreSQL connection string. Replace the placeholders with the actual database credentials and details. Store the real value securely in Azure; never commit it to the repository.

- **Name:** `WEBSITES_PORT`
  **Value:** `80`, provided that your container listens on port 80.

5. Add any other environment variables required by the application.
6. Save or apply the changes.
7. Restart the App Service if required for the new settings to take effect.

### Step 6: Push Code to Trigger the Deployment Pipeline

1. Ensure the GitHub Actions workflow file, `.github/workflows/deploy.yml`, exists in the repository and is configured correctly.
2. Ensure all required GitHub repository secrets and Azure App Service environment variables have been configured.
3. Commit and push the reviewed changes to the branch that triggers the deployment workflow.

For example, if the workflow is configured to run on the `main` branch, use:

```bash
git add .
git commit -m "docs: improve deployment instructions"
git push origin main

## Part 3: Verification (How to Confirm the Deployment Works)

After the GitHub Actions deployment workflow finishes successfully, follow these steps to verify the application.

### 1. Check the Deployed Application

Open the Azure App Service Overview page in the Azure Portal and copy the application's Default domain.

Open the domain in a browser and confirm that the application loads successfully.

### 2. Test Application Functionality

If the application supports user registration and login:

1. Register a test user using non-sensitive test credentials.
2. Log out of the application.
3. Log back in with the test account.
4. Confirm that the application behaves as expected.

### 3. Verify Database Persistence

If the application stores user information in PostgreSQL:

1. Confirm that the application is configured with the correct `DATABASE_URL` in Azure App Service environment variables.
2. Perform a supported application action that saves test data.
3. Confirm that the saved data remains available after logging out and logging back in.

### 4. Check the Database

If you have the necessary database permissions, connect to the Azure PostgreSQL database using an approved database client.

Run an appropriate SQL query to verify that the test record was saved. For example, if the application uses a table named `users`:

```sql
SELECT * FROM users;

### 4. Check the Database

1. Connect to your Azure PostgreSQL database using an authorized database client.
2. Confirm the name of the database table that stores the application's user records.
3. Run an appropriate SQL query to verify that the test record was saved.

For example, if the application stores user records in a table named `users`, run:

```sql
SELECT * FROM users;
