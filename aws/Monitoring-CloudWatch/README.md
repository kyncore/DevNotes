# Monitoring with Amazon CloudWatch

Amazon CloudWatch is a monitoring and observability service built for DevOps engineers, developers, site reliability engineers (SREs), and IT managers. CloudWatch provides you with data and actionable insights to monitor your applications, respond to system-wide performance changes, optimize resource utilization, and get a unified view of operational health.

## Core CloudWatch Concepts

*   **Metrics:** The fundamental concept in CloudWatch. A metric represents a time-ordered set of data points. Think of a metric as a variable to monitor, and the data points as the values of that variable over time. Most AWS services (like EC2, S3, RDS) automatically send metrics to CloudWatch.
    *   **Namespaces:** A container for CloudWatch metrics. Metrics from different services are in different namespaces (e.g., `AWS/EC2`, `AWS/S3`).
    *   **Dimensions:** A name/value pair that is part of the identity of a metric. You can think of dimensions as categories for a metric. For example, an EC2 CPUUtilization metric can have a dimension of `InstanceId`.

*   **Alarms:** An alarm watches a single CloudWatch metric over a time period you specify and performs one or more actions based on the value of the metric relative to a threshold over time. The action is a notification sent to an Amazon Simple Notification Service (SNS) topic or an Amazon EC2 Auto Scaling policy.

*   **Logs:** CloudWatch Logs lets you monitor, store, and access your log files from Amazon EC2 instances, AWS CloudTrail, Route 53, and other sources. You can query them with a powerful query language and set alarms based on specific log patterns.

*   **Dashboards:** Reusable dashboards in the CloudWatch console that you can use to monitor your AWS resources in a single view, even resources that are in different regions. You can create customized views of the metrics and alarms for your AWS resources.

## Why is Monitoring Important?

*   **Performance:** Identify bottlenecks and performance issues before they impact users.
*   **Reliability:** Get alerted to failures and automate responses to improve application uptime.
*   **Cost Optimization:** Monitor resource utilization to identify underused resources that can be downsized or terminated.
*   **Security:** Monitor for unusual activity by analyzing logs and setting alarms on specific metrics (e.g., high number of failed login attempts).

## Labs

*   [Lab: Creating a CloudWatch Dashboard and Billing Alarm](./lab-dashboard-and-billing-alarm.md)
