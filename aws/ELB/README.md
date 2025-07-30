# Elastic Load Balancing (ELB)

AWS Elastic Load Balancing (ELB) automatically distributes incoming application traffic across multiple targets, such as Amazon EC2 instances, containers, IP addresses, and Lambda functions. It helps you achieve greater levels of fault tolerance in your applications, seamlessly providing the required amount of load balancing capacity needed to distribute application traffic.

## Types of Load Balancers

ELB provides four types of load balancers, but we will focus on the most common one for web traffic:

*   **Application Load Balancer (ALB):** This is the best choice for load balancing of HTTP and HTTPS traffic. ALBs operate at the application layer (Layer 7) and allow you to create advanced routing rules based on path, host, or headers. They are ideal for modern application architectures, including microservices and containers.
*   **Network Load Balancer (NLB):** Best for ultra-high performance and low-latency applications. NLBs operate at the transport layer (Layer 4) and can handle millions of requests per second.
*   **Gateway Load Balancer (GWLB):** Used to deploy, scale, and manage third-party virtual network appliances (e.g., firewalls, IDS/IPS).
*   **Classic Load Balancer (CLB):** This is the previous generation of load balancer. It's recommended to use ALB or NLB for new applications.

## Key Concepts for Application Load Balancers

*   **Listeners:** A listener checks for connection requests from clients, using the protocol and port that you configure. The rules that you define for a listener determine how the load balancer routes requests to its registered targets.
*   **Target Groups:** You register targets, such as EC2 instances, with a target group. The load balancer routes requests to the registered targets in a target group using the settings you specify. You can configure health checks on a per target group basis.
*   **Health Checks:** The load balancer periodically sends requests to its registered targets to test their status. If a target becomes unhealthy, the load balancer stops sending traffic to it and reroutes traffic to healthy targets.

## Labs

*   [Lab: Deploying a Highly Available Web Application with an Application Load Balancer](./lab-deploying-ha-app-with-alb.md)
