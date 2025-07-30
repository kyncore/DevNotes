# Route 53

Amazon Route 53 is a highly available and scalable cloud Domain Name System (DNS) web service. It is designed to give developers and businesses an extremely reliable and cost-effective way to route end users to Internet applications.

## Key Concepts

*   **Hosted Zones:** A container for records, and records contain information about how you want to route traffic for a specific domain.
*   **Record Sets:** The fundamental entities within a hosted zone. They define how traffic is routed for a domain or subdomain. Common record types include `A`, `AAAA`, `CNAME`, `MX`, and `NS`.
*   **Routing Policies:** Route 53 offers several routing policies to meet different needs:
    *   **Simple routing:** Route traffic to a single resource.
    *   **Failover routing:** Route traffic to a resource when the primary resource is unhealthy.
    *   **Geolocation routing:** Route traffic based on the geographic location of your users.
    *   **Latency-based routing:** Route traffic to the AWS region with the lowest latency for your users.
    *   **Weighted routing:** Route traffic to multiple resources in proportions that you specify.
*   **Health Checks:** Route 53 can monitor the health and performance of your application, web servers, and other resources.

## Labs

*   [Lab: Configuring DNS Failover with Route 53](./lab-dns-failover.md)
