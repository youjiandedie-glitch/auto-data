# Deploying to Vercel

This guide will help you deploy your China Auto Analysis application to Vercel for free, using a PostgreSQL database.

## Prerequisites

1.  A [GitHub](https://github.com/) account.
2.  A [Vercel](https://vercel.com/) account (sign up with GitHub).

## Step 1: Push Code to GitHub

Since you are currently working locally, you need to push your code to a GitHub repository.

1.  Log in to GitHub and create a **New Repository**.
    *   Name it `china-auto-analysis` (or similar).
    *   Keep it **Private** or **Public** (your choice).
    *   Do **NOT** initialize with README, .gitignore, or License (you already have them).

2.  Run the following commands in your terminal to push your local code:

```bash
# Initialize git if not already (you seem to have it)
git init

# Add remote (replace YOUR_USERNAME and YOUR_REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/china-auto-analysis.git

# Rename branch to main
git branch -M main

# Add files
git add .
git commit -m "Initial commit for deployment"

# Push
git push -u origin main
```

## Step 2: Import Project to Vercel

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Find your `china-auto-analysis` repository in the list and click **"Import"**.

## Step 3: Configure Project

1.  **Framework Preset**: It should auto-detect **Next.js**.
2.  **Root Directory**: `./` (default is fine).
3.  **Environment Variables**: You don't need to manually set them *yet*. We'll add the database next.
4.  Click **"Deploy"**.
    *   *Note: The initial deployment might fail or build successfully but error on runtime because there is no database yet. This is expected.*

## Step 4: Add Vercel Postgres Database

1.  Once the project is created (even if build failed), go to the **Storage** tab in your project dashboard.
2.  Click **"Connect Store"** (or "Create Database").
3.  Select **"Postgres"** (Vercel Postgres / Neon).
4.  Accept the terms and click **"Create"**.
5.  Select region (choose one close to you or your users, e.g., `Singapore` or `US West`).
6.  Once created, go to the **Settings** -> **Environment Variables** tab.
    *   You should see variables like `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, etc., automatically added.
    *   *Important:* If you don't see them, go back to Storage -> select your DB -> .env.local -> "Copy Snippet" -> Add them manually to Settings.

## Step 5: Initialize Production Database

Now we need to create the tables in your new remote database.

1.  **Pull Environment Variables Locally:**
    The easiest way is to use Vercel CLI, but you can also just copy the values from Vercel Dashboard to your local `.env` file (comment out your SQLite `DATABASE_URL`).
    
    *Recommended approach for now:*
    Go to Vercel Dashboard -> Storage -> Select DB -> `.env.local` tab -> **Show Secret**.
    Copy the `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING`.
    Update your local `.env` file:
    ```env
    # Comment out SQLite
    # DATABASE_URL="file:./dev.db"
    
    # Add Postgres keys (Paste from Vercel)
    POSTGRES_PRISMA_URL="..."
    POSTGRES_URL_NON_POOLING="..."
    ```

2.  **Run Migration:**
    Run this command in your local terminal:
    ```bash
    npx prisma migrate dev --name init_postgres
    ```
    This will connect to the remote database and create the tables.

3.  **Populate Data:**
    Now run your sync scripts to fill the remote database with data.
    ```bash
    npx tsx scripts/sync_cpca.ts
    # Run other sync scripts if you have them, e.g. sync_stock.ts
    ```

## Step 6: Redeploy

1.  Go back to Vercel Dashboard -> Deployments.
2.  Click the three dots on the latest deployment -> **Redeploy**.
3.  This time, it should connect to the database and work perfectly!

## Post-Deployment Maintenance

*   **Updating Logic**: Just `git push` changes. Vercel automatically redeploys.
*   **Updating Schema**:
    1.  Update `schema.prisma`.
    2.  Run `npx prisma migrate dev --name <change_name>` locally (ensure `.env` points to prod DB, or use a separate prod URL).
    3.  Push code.
*   **Checking Data**: You can browse your data via Vercel Dashboard -> Storage -> Browse.

