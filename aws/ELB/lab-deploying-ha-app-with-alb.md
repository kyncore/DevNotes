# Lab: Deploying a Highly Available Web App with an ALB

This lab demonstrates how to create a highly available web application by deploying two EC2 instances in different Availability Zones and distributing traffic between them with an Application Load Balancer (ALB).

## Prerequisites

*   An AWS account.
*   A custom VPC with at least two public subnets in different Availability Zones (AZs). You can use the VPC created in the VPC lab, but you may need to modify it to have a second public subnet if you only created one. Alternatively, you can use your Default VPC, which already has public subnets in each AZ.

## Steps

### 1. Launch Two Web Server Instances

You will launch two identical EC2 instances, but each in a different public subnet (and therefore a different AZ).

1.  Navigate to the **EC2** service and click **Launch instance**.
2.  **Launch Instance 1 (in AZ-a):**
    *   **Name:** `WebServer-A`.
    *   **AMI:** Amazon Linux 2.
    *   **Instance Type:** `t2.micro`.
    *   **Key Pair:** Choose an existing key pair.
    *   **Network settings:**
        *   Click **Edit**.
        *   **VPC:** Select your desired VPC (e.g., `my-custom-vpc` or the Default VPC).
        *   **Subnet:** Choose a **public subnet** in the first AZ (e.g., `us-east-1a`).
        *   **Auto-assign Public IP:** Enable.
        *   **Firewall (security groups):** Create a new security group named `web-sg`. Add rules to allow `SSH` (from My IP) and `HTTP` (from Anywhere).
    *   **Advanced details -> User data:** Paste the following script. This will install a web server and create a unique homepage for this instance.
        ```bash
        #!/bin/bash
        yum update -y
        yum install -y httpd
        systemctl start httpd
        systemctl enable httpd
        echo "<h1>Hello from WebServer-A in AZ-a</h1>" > /var/www/html/index.html
        ```
    *   Click **Launch instance**.

3.  **Launch Instance 2 (in AZ-b):**
    *   Repeat the process above with the following changes:
    *   **Name:** `WebServer-B`.
    *   **Subnet:** Choose a **public subnet** in a **different** AZ (e.g., `us-east-1b`).
    *   **Firewall (security groups):** Choose the **existing** `web-sg` security group.
    *   **User data:** Modify the script to identify this as the second server.
        ```bash
        #!/bin/bash
        yum update -y
        yum install -y httpd
        systemctl start httpd
        systemctl enable httpd
        echo "<h1>Hello from WebServer-B in AZ-b</h1>" > /var/www/html/index.html
        ```
    *   Click **Launch instance**.

### 2. Create a Target Group

The load balancer needs a target group to send traffic to.

1.  In the EC2 console, go to **Target Groups** (under Load Balancing).
2.  Click **Create target group**.
3.  **Choose a target type:** Select **Instances**.
4.  **Target group name:** `my-web-app-tg`.
5.  **Protocol / Port:** `HTTP` / `80`.
6.  **VPC:** Select the same VPC where you launched your instances.
7.  **Health checks:** Leave the defaults.
8.  Click **Next**.
9.  **Register targets:** Select your two instances (`WebServer-A` and `WebServer-B`) and click **Include as pending below**.
10. Click **Create target group**.

### 3. Create an Application Load Balancer

1.  In the EC2 console, go to **Load Balancers**.
2.  Click **Create Load Balancer**.
3.  **Application Load Balancer:** Click **Create**.
4.  **Load balancer name:** `my-app-lb`.
5.  **Scheme:** `Internet-facing`.
6.  **IP address type:** `IPv4`.
7.  **Network mapping:**
    *   **VPC:** Select your VPC.
    *   **Mappings:** Select the two public subnets where your instances are located.
8.  **Security groups:** Remove the default security group and select the `web-sg` you created earlier.
9.  **Listeners and routing:**
    *   The default listener should be `HTTP` on port `80`.
    *   In the **Default action** dropdown, select your target group `my-web-app-tg`.
10. **Create load balancer:** Review the summary and click **Create load balancer**.

### 4. Test the Load Balancer

1.  Wait for the load balancer **State** to become **Active**.
2.  Select your load balancer and copy its **DNS name** from the **Details** tab.
3.  Paste the DNS name into your web browser.
4.  You should see the homepage from either `WebServer-A` or `WebServer-B`.
5.  Refresh the page several times. You will see the load balancer distributing the traffic between your two instances, and the message will change. This demonstrates high availability!
6.  **Test Health Checks:** Stop one of your instances (e.g., `WebServer-A`). After a minute or two (the health check interval), the load balancer will detect the failure and only route traffic to the healthy instance (`WebServer-B`).

### 5. Clean Up

1.  Delete the load balancer.
2.  Delete the target group.
3.  Terminate the two EC2 instances.
4.  Delete the `web-sg` security group.
