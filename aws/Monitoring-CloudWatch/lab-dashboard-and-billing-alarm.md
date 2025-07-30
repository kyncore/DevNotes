# Lab: Creating a CloudWatch Dashboard and Billing Alarm

This lab covers two fundamental and highly recommended monitoring practices: creating a centralized dashboard to visualize the health of your resources, and setting up a billing alarm to prevent unexpected costs.

## Prerequisites

*   An AWS account. It's helpful to have some resources running (like an EC2 instance) to have metrics to visualize, but it's not strictly required.

## Part 1: Create a Billing Alarm

A billing alarm is a critical safety net for any AWS account. It will notify you when your estimated charges exceed a threshold that you define.

**Important:** You must first enable billing alerts in your account settings.
1.  Go to the **Billing** console.
2.  In the navigation pane, choose **Billing preferences**.
3.  Select **Receive billing alerts**.

**Now, create the alarm:**

1.  Navigate to the **CloudWatch** service.
2.  **Important:** The billing metric (`EstimatedCharges`) exists only in the **US East (N. Virginia) `us-east-1`** region. You must switch to this region to create a billing alarm.
3.  In the navigation pane, choose **Alarms**, then **All alarms**.
4.  Click **Create alarm**.
5.  Click **Select metric**.
6.  Under **All metrics**, select **Billing**, then **Total Estimated Charge**.
7.  Select the metric named `EstimatedCharges` and click **Select metric**.
8.  **Specify metric and conditions:**
    *   **Statistic:** `Maximum`.
    *   **Period:** `6 hours`.
    *   **Conditions:** `Static`.
    *   **Whenever EstimatedCharges is...:** `Greater`.
    *   **than...:** Enter a threshold value in USD (e.g., `10` for $10).
9.  Click **Next**.
10. **Configure actions:**
    *   **Alarm state trigger:** `In alarm`.
    *   **Select an SNS topic:** Select **Create new topic**.
    *   **Create a new topic...:** Give it a name, e.g., `my-billing-alarms`.
    *   **Email endpoints that you want to notify...:** Enter your email address.
    *   Click **Create topic**.
11. Click **Next**.
12. **Add name and description:**
    *   **Alarm name:** `My-Billing-Alarm`.
    *   **Alarm description:** `Alarm when AWS charges exceed $10`.
13. Click **Next**, review, and click **Create alarm**.
14. **Confirmation:** You will receive an email from AWS Notifications to confirm your subscription to the SNS topic. You must click the link in this email to activate the notifications.

## Part 2: Create a CloudWatch Dashboard

A dashboard provides a single-pane-of-glass view of your key resources.

1.  Navigate to the **CloudWatch** service (you can switch back to your preferred region).
2.  In the navigation pane, choose **Dashboards**.
3.  Click **Create dashboard**.
4.  **Dashboard name:** `My-Primary-Dashboard`. Click **Create dashboard**.
5.  You will be prompted to add your first widget. Let's add a graph of the CPU Utilization for an EC2 instance.
6.  **Add to this dashboard:** Select **Line** graph. Click **Next**.
7.  **Add metric graph:** Select **Metrics**.
8.  **Browse:**
    *   Select the **EC2** metric namespace.
    *   Select **Per-Instance Metrics**.
    *   Find the `CPUUtilization` metric for one of your running or recently stopped instances and check the box next to it.
9.  Click **Create widget**.
10. **Add another widget:**
    *   Click the `+` (Add widget) button on the dashboard.
    *   This time, let's add the Billing Alarm status.
    *   Select **Alarm status**. Click **Next**.
    *   **From:** Select the region where you created the alarm (`us-east-1`).
    *   Select the `My-Billing-Alarm` you created.
    *   Click **Create widget**.
11. You can resize and rearrange the widgets on your dashboard.
12. Click **Save dashboard**.

Now you have a central place to monitor key metrics and alarm statuses for your application.

## Clean Up

1.  In the CloudWatch console, go to **Dashboards**, select your dashboard, and click **Delete**.
2.  Go to **Alarms**, select your billing alarm, and click **Delete**.
3.  (Optional) Go to the **SNS** service, find the topic you created, and delete it.
