# VPC (Virtual Private Cloud)

Amazon Virtual Private Cloud (VPC) lets you provision a logically isolated section of the AWS Cloud where you can launch AWS resources in a virtual network that you define. You have complete control over your virtual networking environment, including selection of your own IP address range, creation of subnets, and configuration of route tables and network gateways.

## Key Components

*   **CIDR Block (Classless Inter-Domain Routing):** The IP address range for your VPC. For example, `10.0.0.0/16`. This defines the private IP addresses you can use.
*   **Subnets:** A range of IP addresses in your VPC. You launch AWS resources, such as EC2 instances, into your subnets.
    *   **Public Subnet:** A subnet whose traffic is routed to an internet gateway. Resources in a public subnet can access the internet directly.
    *   **Private Subnet:** A subnet that does not have a direct route to the internet. Resources in a private subnet require a NAT Gateway to access the internet.
*   **Route Tables:** A set of rules, called routes, that are used to determine where network traffic from your subnet or gateway is directed.
*   **Internet Gateway (IGW):** A horizontally scaled, redundant, and highly available VPC component that allows communication between your VPC and the internet.
*   **NAT Gateway (Network Address Translation):** A service that enables instances in a private subnet to connect to the internet or other AWS services, but prevents the internet from initiating a connection with those instances.
*   **NACLs (Network Access Control Lists):** An optional layer of security for your VPC that acts as a firewall for controlling traffic in and out of one or more subnets. They are stateless.
*   **Security Groups:** Act as a virtual firewall for your instances to control inbound and outbound traffic. They are stateful.

## Default vs. Custom VPC

*   **Default VPC:** Every AWS account comes with a default VPC in each region. It's pre-configured to allow you to launch resources immediately. It has a default CIDR, default subnets in each AZ, an internet gateway, and a main route table.
*   **Custom VPC:** You can create your own VPC from scratch. This is the best practice for production environments as it gives you full control over the network architecture.

## Labs

*   [Lab: Creating a Custom VPC with Public and Private Subnets](./lab-creating-a-vpc.md)
