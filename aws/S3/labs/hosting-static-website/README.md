# Lab: Hosting a Static Website on S3

This lab will guide you through hosting a simple static website on Amazon S3.

## Prerequisites

*   An AWS account.
*   A globally unique name for your S3 bucket.

## Steps

### 1. Create an S3 Bucket

1.  Navigate to the S3 service in the AWS Management Console.
2.  Click **Create bucket**.
3.  **Bucket name:** Enter a globally unique name (e.g., `my-unique-static-website-` followed by your name/initials).
4.  **AWS Region:** Choose a region.
5.  **Block Public Access settings for this bucket:** Uncheck **Block all public access**. You must allow public access to host a static website. Acknowledge the warning.
6.  Click **Create bucket**.

### 2. Enable Static Website Hosting

1.  Select the bucket you just created.
2.  Go to the **Properties** tab.
3.  Scroll down to **Static website hosting** and click **Edit**.
4.  Select **Enable**.
5.  In **Index document**, enter `index.html`.
6.  In **Error document**, enter `error.html`.
7.  Click **Save changes**.

### 3. Upload Website Files

1.  Create two simple HTML files on your local machine:
    *   `index.html`:
        ```html
        <!DOCTYPE html>
        <html>
        <head>
          <title>My Static Website</title>
        </head>
        <body>
          <h1>Welcome to my website hosted on S3!</h1>
        </body>
        </html>
        ```
    *   `error.html`:
        ```html
        <!DOCTYPE html>
        <html>
        <head>
          <title>Error</title>
        </head>
        <body>
          <h1>Oops! Page not found.</h1>
        </body>
        </html>
        ```
2.  Go to the **Objects** tab of your bucket and click **Upload**.
3.  Click **Add files** and select the `index.html` and `error.html` files you created.
4.  Click **Upload**.

### 4. Add a Bucket Policy for Public Access

1.  Go to the **Permissions** tab of your bucket.
2.  Under **Bucket policy**, click **Edit**.
3.  Paste the following policy, replacing `YOUR_BUCKET_NAME` with the name of your bucket.
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
4.  Click **Save changes**.

### 5. Test Your Website

1.  Go back to the **Properties** tab and scroll down to **Static website hosting**.
2.  You will find the **Bucket website endpoint**. It will look something like `http://<your-bucket-name>.s3-website.<region>.amazonaws.com`.
3.  Click the endpoint URL to open your website in a new tab. You should see your `index.html` page.
4.  Try navigating to a non-existent page (e.g., add `/test` to the URL) to see your `error.html` page.

### 6. Clean Up

To avoid incurring charges, delete the objects from your bucket and then delete the bucket itself when you are finished with this lab.
