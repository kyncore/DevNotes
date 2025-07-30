# Lab: Creating a Simple CI/CD Pipeline for a Static Website

This lab demonstrates how to create a complete CI/CD pipeline using AWS CodePipeline. The pipeline will automatically deploy a simple static HTML website to an S3 bucket whenever a change is pushed to a CodeCommit repository.

## Prerequisites

*   An AWS account.
*   A configured AWS CLI with Git credentials for CodeCommit.
*   A local machine with Git installed.

## Architecture

The pipeline will have two stages:
1.  **Source:** Triggered by a push to a CodeCommit Git repository.
2.  **Deploy:** Deploys the source code directly to an S3 bucket configured for static website hosting.

## Steps

### 1. Create the S3 Bucket for Your Website

1.  Navigate to the **S3** service.
2.  Create a new, globally unique bucket (e.g., `my-codepipeline-website-` followed by your initials).
3.  **Enable Static Website Hosting:**
    *   Go to the bucket's **Properties** tab.
    *   Scroll down to **Static website hosting** and enable it.
    *   Set the **Index document** to `index.html`.
4.  **Add a Bucket Policy:**
    *   Go to the **Permissions** tab and add the following bucket policy to allow public access. Replace `YOUR_BUCKET_NAME` with your bucket's name.
    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicReadGetObject",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
            }
        ]
    }
    ```

### 2. Create a CodeCommit Repository and Initial Content

1.  **Create the Repo:**
    *   Navigate to the **CodeCommit** service.
    *   Click **Create repository**.
    *   **Repository name:** `my-website-repo`. Click **Create**.
2.  **Clone the Repo Locally:**
    *   From the repository page, copy the **Clone URL** for HTTPS.
    *   In your local terminal, run: `git clone <your-clone-url>`
3.  **Add Website Content:**
    *   Navigate into the new `my-website-repo` directory.
    *   Create a file named `index.html`:
        ```html
        <!DOCTYPE html>
        <html>
        <head><title>My Website</title></head>
        <body><h1>Welcome to my website! Version 1</h1></body>
        </html>
        ```
4.  **Commit and Push:**
    *   Run the following Git commands:
        ```bash
        git add index.html
        git commit -m "Initial version of website"
        git push
        ```

### 3. Create the CI/CD Pipeline

1.  Navigate to the **CodePipeline** service.
2.  Click **Create pipeline**.
3.  **Pipeline settings:**
    *   **Pipeline name:** `my-website-pipeline`.
    *   Leave other settings as default. Click **Next**.
4.  **Source stage:**
    *   **Source provider:** `AWS CodeCommit`.
    *   **Repository name:** `my-website-repo`.
    *   **Branch name:** `master` (or `main` if that's your default).
    *   Leave other settings as default. Click **Next**.
5.  **Build stage:**
    *   Click **Skip build stage**, and confirm by clicking **Skip**. We are deploying raw HTML, so no build step is needed.
6.  **Deploy stage:**
    *   **Deploy provider:** `Amazon S3`.
    *   **Region:** The region where you created your S3 bucket.
    *   **Bucket:** Select your `my-codepipeline-website-...` bucket.
    *   Check the **Extract file before deploy** box. This unzips the source artifact before deploying.
    *   Click **Next**.
7.  **Review** the pipeline configuration and click **Create pipeline**.

### 4. Test the Pipeline

1.  The pipeline will automatically run for the first time, pulling the `index.html` file from your repo and deploying it to S3.
2.  Once the "Deploy" stage turns green, find your S3 bucket's website endpoint (from the **Static website hosting** section of the bucket properties) and open it in a browser. You should see "Welcome to my website! Version 1".
3.  **Trigger a change:**
    *   On your local machine, edit `index.html`:
        ```html
        <!DOCTYPE html>
        <html>
        <head><title>My Website</title></head>
        <body><h1>Welcome to my website! This is Version 2!</h1></body>
        </html>
        ```
    *   Commit and push the change:
        ```bash
        git commit -am "Update to version 2"
        git push
        ```
4.  Go back to the CodePipeline console. You will see the pipeline automatically triggers again.
5.  Once it completes, refresh your website in the browser. The new version will be live.

### 5. Clean Up

1.  Delete the pipeline in CodePipeline.
2.  Delete the repository in CodeCommit.
3.  Empty and delete the S3 bucket.
