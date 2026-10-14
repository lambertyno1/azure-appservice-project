# Troubleshooting

1. The "Push Rejected" Git Issue

The Problem: When trying to push code to GitHub, we got a red [rejected] error. GitHub refused to accept our code.
The Root Cause: We were trying to push directly to the main branch, but GitHub had newer changes that our local computer didn't have. It blocked us to prevent us from accidentally deleting work.
The Resolution: We adopted a Feature Branch Workflow. Instead of pushing to main, we pushed to a separate branch (feature/...) and used a Pull Request (PR) to merge it. When conflicts happened, we used GitHub's "Resolve Conflicts" tool to carefully combine the code.
The DevOps Lesson: Never push directly to main. Use branches and PRs as "quality gates" to keep the main codebase safe.


2. The Docker Build Failure (The Alpine Issue)

The Problem: Our CI/CD pipeline failed when trying to build the Docker image. The error said it couldn't compile a C++ program.
The Root Cause: We used node:18-alpine for our Dockerfile. "Alpine" is a super lightweight, stripped-down version of Linux. It doesn't have the heavy C++ compilers required by the standard bcrypt password library.
The Resolution: We switched from bcrypt to bcryptjs. It does the exact same security hashing but is written in pure JavaScript, so it doesn't need those missing C++ compilers.
The DevOps Lesson: "It works on my machine" doesn't matter. You must understand your container's base image (like Alpine) and ensure your dependencies are compatible with it.


3. The "Dangerous Site" Browser Warning

The Problem: When we visited our live Azure URL, the browser showed a big red "Not Secure" or "Deceptive site ahead" warning.
The Root Cause: We were typing http:// instead of https://. Also, Azure generates random subdomains (like web-app-project.azurewebsites.net) which browsers sometimes distrust because they are brand new.
The Resolution: We forced the use of HTTPS (the 'S' stands for Secure). For the browser warning, we clicked "Advanced" -> "Proceed anyway" to whitelist our own app.
The DevOps Lesson: Security starts with encryption (HTTPS). In a real production environment, you would map a custom domain (like myapp.com) and buy an SSL certificate to avoid these warnings.


4. The "Network Error" on Registration

The Problem: When a user tried to register, the UI just showed a "Network error" and nothing happened.
The Root Cause: The frontend was trying to send data to /api/register, but we hadn't actually created that route in our backend server.js file yet. The server returned a 404 error, which the frontend interpreted as a network crash.
The Resolution: We updated server.js to include the app.post('/api/register', ...) route and ensured it was properly connected to the database logic.
The DevOps Lesson: Frontend and Backend must be developed in sync. An API is only as good as its documented and implemented endpoints.


5. The Typo That Broke the Install

The Problem: We tried to install the security library, but npm returned a 404 Not Found error.
The Root Cause: A simple human typo. We typed npm install bycryptjs (with a 'y') instead of npm install bcryptjs (with an 'r').
The Resolution: We corrected the spelling to bcryptjs and ran the command again.
The DevOps Lesson: Automation is great, but human error still happens. Always double-check package names and read error logs carefully—they usually tell you exactly what went wrong.


6. The Stretched Logout Button (CSS modification)

The Problem: The logout button stretched across the entire top of the page, completely ruining the UI layout.
The Root Cause: We had a global CSS rule that said button { width: 100%; } to make our form buttons look good. The logout button inherited this rule, overriding its specific styling.
The Resolution: We moved the button inside the header and used position: absolute along with width: auto !important;. The !important flag forced the browser to prioritize the specific button style over the global rule.
The DevOps Lesson: Even in Cloud/DevOps, you are delivering a final product to a user. Understanding how different layers of code (like CSS cascading) interact is crucial for a polished delivery.


7. The Stopped Database Server

The Problem: We tried to connect our app to the Azure PostgreSQL database, but the connection failed. The Azure portal showed the server status as "Stopped".
The Root Cause: Azure Flexible Server has a feature that automatically pauses the database if it isn't used for a while, to save you money.
The Resolution: We went into the Azure Portal and manually clicked "Start" on the server. For the final demo, we decided to stick to the Mock Database to ensure 100% reliability without worrying about auto-pausing.
The DevOps Lesson: Cloud resources cost money. Providers build in auto-scaling and auto-pausing to help, but you must always monitor your resource states before a critical demo.


8. The Duplicate Booking Loop

The Problem: A user could click "Book Now" multiple times and book the same seat over and over again.
The Root Cause: The backend was just accepting every POST request it received without checking if that specific user had already booked that specific event.
The Resolution: We added a validation check in database.js: if (bookings.some(b => b.eventId === eventId && b.userEmail === userEmail)). If a match was found, it threw an error.
The DevOps Lesson: Never trust the frontend. Always enforce business logic and data integrity on the backend (the API).


9. Plain Text Passwords

The Problem: Initially, when a user registered, their password was saved exactly as they typed it (e.g., "Password123"). If someone hacked the database, they would see everyone's passwords.
The Root Cause: We hadn't implemented security hashing yet.
The Resolution: We integrated bcryptjs. Now, when a user registers, the password is scrambled into a hash (e.g., $2a$10$N9qo8uLOickgx2ZMRZoMye...). When they log in, bcrypt compares the input to the hash without ever revealing the original password.
The DevOps Lesson: Security is not an afterthought. Storing plain-text passwords is a massive compliance violation (like GDPR). Hashing is mandatory.


10. The Browser Cache Illusion

The Problem: We would push a fix to GitHub, wait for the pipeline to turn green, refresh the webpage, and... nothing changed. The old bug was still there. We thought the deployment failed.
The Root Cause: The deployment was actually successful! The issue was our web browser. Browsers save (cache) old versions of HTML and CSS files to make websites load faster. It was showing us the old, saved version of the site.
The Resolution: We learned to use a Hard Refresh (Ctrl + Shift + R). This forces the browser to ignore its cache and download the brand new files from the server.
The DevOps Lesson: Always clear your cache or use Incognito mode when testing a new deployment. Don't blame the pipeline until you've ruled out the browser!


11. GitHub Actions Secret Formatting

The Problem: The CI/CD pipeline failed at the very first step: "Azure Login". The error said the credentials were invalid.
The Root Cause: When we copied the Azure credentials JSON into GitHub Secrets, we accidentally missed a curly brace { or added an extra space. JSON is extremely strict about formatting.
The Resolution: We carefully re-copied the JSON string from the Azure CLI, ensured it was perfectly formatted, and updated the GitHub Secret.
The DevOps Lesson: Automation is only as good as its configuration. A single missing character in a secret or config file will bring the whole pipeline to a halt.


12. The Massive Repository (The node_modules Mistake)

The Problem: When we tried to push our code, it took forever, and our GitHub repository suddenly became hundreds of megabytes in size, filled with a huge number of files we didn't write.
The Root Cause: We accidentally committed the node_modules folder. This folder contains all the downloaded libraries for our app. It is huge and should never be uploaded to GitHub.
The Resolution: We added node_modules/ to our .gitignore file, deleted the folder from Git's tracking, and pushed the clean code.
The DevOps Lesson: Only commit your own code, not your dependencies. The package.json file tells the server what to download; you don't need to upload the actual downloaded files.


13. The "Module Not Found" Crash in Docker

The Problem: The app worked perfectly on our laptop, but the moment it ran inside the Docker container on Azure, it crashed with an error: Cannot find module 'express'.
The Root Cause: We forgot to tell Docker to install the dependencies. A Docker container is like an empty, brand-new computer. It doesn't have Node.js or our libraries installed until we tell it to.
The Resolution: We updated our Dockerfile to include the command RUN npm install. This told the container to download all the necessary libraries before starting the app.
The DevOps Lesson: Containers are isolated. You must explicitly script every setup step in your Dockerfile. Never assume the container has what your laptop has.


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
