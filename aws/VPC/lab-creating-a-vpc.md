# Lab: Creating a Custom VPC with Public and Private Subnets

This lab will guide you through creating a custom VPC from scratch. This is a common setup for a typical three-tier web application, where web servers are in a public subnet and databases or application servers are in a private subnet.

## Prerequisites

*   An AWS account.

## Architecture Diagram

We will build the following architecture:

```
                           ┌──────────────────────────────────────────┐
                           │                   VPC                    │
                           │              10.0.0.0/16                 │
                           │                                          │
                           │ ┌──────────────────┐ ┌───────────────────┐ │
                           │ │  Public Subnet   │ │   Private Subnet  │ │
                           │ │  10.0.1.0/24     │ │   10.0.2.0/24     │ │
                           │ │                  │ │                   │ │
                           │ │ ┌──────────────┐ │ │ ┌───────────────┐ │ │
                           │ │ │ EC2 Instance │ │ │ │  EC2 Instance │ │ │
                           │ │ │ (Web Server) │ │ │ │ (App/DB Server) │ │ │
                           │ │ └──────┬───────┘ │ │ └───────┬───────┘ │ │
                           │ └────────┼─────────┘ └─────────│─────────┘ │
                           └──────────┼─────────────────────┼───────────┘
                                      │                     │
      Internet <--> Internet Gateway │                     │
                                      │                     │
                                      └> Route Table (Public) <┘
                                                            │
                                                            │
                                      NAT Gateway <─────────┘
                                                            │
                                                            │
                                      └> Route Table (Private) <┘
```

## Steps

### 1. Create the VPC

1.  Navigate to the **VPC** service in the AWS Management Console.
2.  Click **Create VPC**.
3.  **Resources to create:** Select **VPC and more**. This wizard simplifies the process.
4.  **Name tag auto-generation:** Give it a name, e.g., `my-custom-vpc`.
5.  **IPv4 CIDR block:** `10.0.0.0/16`.
6.  **Number of Availability Zones (AZs):** Select **1**. (For production, you'd use at least 2).
7.  **Number of public subnets:** `1`.
8.  **Number of private subnets:** `1`.
9.  **NAT gateways:** Select **In 1 AZ**. This is required for instances in the private subnet to access the internet for updates, etc. It will incur costs.
10. **VPC endpoints:** None.
11. Click **Create VPC**.

The VPC wizard will now create and configure the following resources for you:
*   The VPC itself.
*   A public subnet and a private subnet.
*   An Internet Gateway (IGW) and a NAT Gateway.
*   Two Route Tables:
    *   A "public" route table associated with the public subnet, with a route (`0.0.0.0/0`) pointing to the Internet Gateway.
    *   A "private" route table associated with the private subnet, with a route (`0.0.0.0/0`) pointing to the NAT Gateway.

### 2. Explore the VPC Components

1.  Once the creation is complete, explore the resources that were created for you in the VPC console's left-hand navigation pane:
    *   **Your VPCs:** You will see `my-custom-vpc`.
    *   **Subnets:** You will see the public and private subnets. Note their names and CIDR blocks.
    *   **Route Tables:** Examine the routes for both the public and private route tables to understand how traffic is directed.
    *   **Internet Gateways:** You will see the IGW attached to your VPC.
    *   **NAT Gateways:** You will see the NAT Gateway, which has an Elastic IP address and resides in the public subnet.

### 3. Launch Instances to Test (Optional)

To verify the setup, you can launch two EC2 instances:

1.  **Launch a "Web Server" instance** into the **public subnet**.
    *   When configuring the instance, ensure you select `my-custom-vpc` and the public subnet.
    *   Enable **Auto-assign public IP**.
    *   You should be able to SSH into this instance from the internet.
2.  **Launch an "App Server" instance** into the **private subnet**.
    *   Select `my-custom-vpc` and the private subnet.
    *   **Auto-assign public IP** should be disabled.
    *   You cannot SSH into this instance directly from the internet. You would need to first SSH into the public "Web Server" (a "bastion host") and then SSH from there to the private instance using its private IP address.
    *   From the private instance, try to ping an external address (`ping 8.8.8.8`). It should work, demonstrating that the NAT Gateway is providing internet access.

### 4. Clean Up

This is very important as NAT Gateways incur hourly charges.

1.  Terminate any EC2 instances you launched.
2.  Go to the **VPC** console.
3.  Select your `my-custom-vpc`.
4.  Click **Actions** -> **Delete VPC**.
5.  A confirmation screen will show all the resources that will be deleted (VPC, subnets, gateways, etc.). Type `delete` to confirm and click **Delete**.
