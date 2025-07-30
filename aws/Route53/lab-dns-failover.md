# Lab: Configuring DNS Failover with Route 53

This lab demonstrates how to set up a DNS failover configuration using Route 53. This will automatically route traffic to a secondary resource if the primary resource becomes unavailable.

For this lab, we will simulate a primary web server and a secondary "static failover" page on S3.

## Prerequisites

*   An AWS account.
*   A registered domain name (or a subdomain in a hosted zone you control in Route 53).
*   Two resources to serve as primary and secondary endpoints. We will use:
    1.  An EC2 instance running a web server (your primary endpoint). You can use the instance from the EC2 lab.
    2.  An S3 bucket configured for static website hosting (your secondary/failover endpoint). You can use the bucket from the S3 lab.

## Steps

### 1. Create Health Checks

First, create a health check for your primary endpoint (the EC2 instance).

1.  Navigate to the **Route 53** service in the AWS Management Console.
2.  In the navigation pane, choose **Health checks**.
3.  Click **Create health check**.
4.  **Name:** Give it a name, e.g., `primary-web-server-health-check`.
5.  **What to monitor:** Select **Endpoint**.
6.  **Specify endpoint by:** Select **IP address**.
7.  **Protocol:** `HTTP`.
8.  **IP address:** Enter the public IP address of your EC2 instance.
9.  **Port:** `80`.
10. **Domain name:** Enter the public IP address of your EC2 instance (Route 53 uses this for the `Host` header).
11. Click **Next** and then **Create health check**.

### 2. Create Failover Record Sets

Now, create two `A` records in your hosted zone: one primary and one secondary.

1.  In the Route 53 console, go to **Hosted zones** and select your domain.
2.  Click **Create record**.

#### Primary Record (for the EC2 instance)

3.  **Record name:** Leave it blank to route for the root domain (e.g., `example.com`), or enter a subdomain (e.g., `www`).
4.  **Record type:** `A`.
5.  **Value:** Enter the public IP address of your EC2 instance.
6.  **TTL (Seconds):** `60`.
7.  **Routing policy:** Select **Failover**.
8.  **Failover record type:** Select **Primary**.
9.  **Health check ID:** Select the health check you created earlier.
10. **Record ID:** Give it a unique ID, e.g., `primary-ec2-instance`.
11. Click **Create records**.

#### Secondary Record (for the S3 bucket)

12. Click **Create record** again.
13. **Record name:** Use the same name as the primary record.
14. **Record type:** `A`.
15. **Value:**
    *   Turn on the **Alias** toggle.
    *   **Route traffic to:** Choose **Alias to S3 website endpoint**.
    *   Choose the region your S3 bucket is in.
    *   Select your S3 bucket from the dropdown.
16. **TTL (Seconds):** `60`.
17. **Routing policy:** Select **Failover**.
18. **Failover record type:** Select **Secondary**.
19. **Health check ID:** Leave this blank. The secondary record does not need a health check.
20. **Record ID:** Give it a unique ID, e.g., `secondary-s3-failover`.
21. Click **Create records**.

### 3. Test the Failover

1.  Wait for the DNS changes to propagate.
2.  Navigate to your domain in a web browser. You should see the content from your primary EC2 instance.
3.  Now, simulate a failure. Stop the EC2 instance.
4.  Wait for the Route 53 health check to fail (this may take a few minutes).
5.  Refresh your browser. You should now see the content from your secondary S3 bucket.

### 4. Clean Up

*   Start your EC2 instance again.
*   Delete the record sets you created in Route 53.
*   Delete the health check.
*   Terminate the EC2 instance and delete the S3 bucket if you no longer need them.
