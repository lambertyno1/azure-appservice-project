# Troubleshooting
- If
cat > docs/troubleshooting.md << 'EOF'
# Troubleshooting and Failure Recovery Guide

This document outlines the standard operating procedures for investigating, troubleshooting, and recovering from application failures in our Azure environment. 

## 1. First Response: The Investigation Path
If the application stops working in production, the team follows this exact investigation path to identify the root cause:

1. **Check Application Availability:** Verify if the site is actually down or if it's a local network issue.
2. **Check the `/health` Endpoint:** Run `curl https://<app-name>.azurewebsites.net/health`. If it fails, the container or app process has crashed.
3. **Check Azure Logs:** Go to the Azure Portal -> App Service -> **Log stream** (or query **Log Analytics** using `AppServiceConsoleLogs | take 50`) to view real-time error messages.
4. **Check Recent Deployments:** Look at the **Deployment Center** in the Azure Portal to see if a recent CI/CD pipeline push caused the issue.
5. **Check Application Settings:** Verify that no required Environment Variables (like `DATABASE_URL` or `WEBSITES_PORT`) were accidentally deleted or changed.
6. **Check Database Connectivity:** Ensure the Azure PostgreSQL server is running and the connection string is correct.

---

## 2. Failure Scenario 1: Staging Deployment Fails (Health Check)
**Scenario:** A developer merges a Pull Request to `main` that contains a bug, causing the application to crash on startup.

**Detection:**
1. The GitHub Actions pipeline deploys the new code to the **Staging Slot**.
2. The pipeline runs the automated health check: `curl -f https://<app-name>-staging.azurewebsites.net/health`.
3. The health check returns a non-200 status code (e.g., 503 Service Unavailable).
4. **Result:** The pipeline **FAILS** and stops immediately. The Production slot is **NOT** updated.

**Recovery Process:**
1. **Do NOT swap slots.** Production remains safe and unaffected.
2. Open the GitHub Actions logs to see the exact error (e.g., "Cannot find module 'express'").
3. Create a new feature branch (`git checkout -b fix/startup-error`).
4. Fix the code locally, test it, and push the branch.
5. Open a new Pull Request, merge it to `main`, and let the CI/CD pipeline run again.

---

## 3. Failure Scenario 2: Production Issue (Instant Rollback)
**Scenario:** A bug slipped through the health check (e.g., a specific API endpoint crashes only under certain user conditions) and is now affecting live users in Production.

**Detection:**
1. Users report errors, or Azure Monitoring alerts trigger.
2. The team checks the `/health` endpoint (which might still pass if the main server is up, but specific routes are broken).
3. Azure Log Analytics shows a spike in `AppServiceHTTPLogs` with 500 Internal Server Errors.

**Recovery Process (Slot Swap Rollback):**
Because we use Deployment Slots, we can roll back instantly without redeploying code.
1. Go to the **Azure Portal** -> App Service -> **Deployment slots**.
2. Click the **Swap** button at the top of the screen.
3. In the swap dialog, set the **Source** to `Production` and the **Target** to `Staging`.
4. Click **OK**. 
5. **Result:** Azure instantly swaps the virtual IP addresses. The previous, working version of the app (which was sitting in the Staging slot) is now live in Production. The broken version is moved to Staging for investigation.
6. Once the issue is fixed in a new feature branch, the team can re-deploy and swap again.

---

## 4. Common Issues and Quick Fixes

| Symptom | Probable Cause | Troubleshooting Step |
| :--- | :--- | :--- |
| **503 Service Unavailable** | The Docker container failed to start or crashed. | Check `AppServiceConsoleLogs` in Log Analytics. Verify `WEBSITES_PORT` is set to `80` in Application Settings. |
| **ImagePullUnauthorized** | App Service cannot pull the Docker image from ACR. | Verify `DOCKER_REGISTRY_SERVER_USERNAME` and `PASSWORD` are correct in App Settings. Ensure ACR Admin User is enabled. |
| **Database Connection Error** | App cannot connect to PostgreSQL. | Check if the `DATABASE_URL` environment variable is correct. Verify the PostgreSQL server is not paused and firewall rules allow Azure services. |
| **Pipeline Fails at "Swap"** | Missing permissions in GitHub Actions. | Ensure the `AZURE_PUBLISH_PROFILE` secret is valid and the `azure/login` step is present in the workflow YAML. |
