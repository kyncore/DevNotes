# Lab: Creating a Dynamic Auto Scaling Group

This lab demonstrates how to create an Auto Scaling Group (ASG) that automatically scales a fleet of EC2 instances based on CPU utilization. This builds on the high-availability architecture from the ELB lab by adding elasticity.

## Prerequisites

*   An AWS account.
*   A custom VPC with at least two public subnets in different Availability Zones.
*   An Application Load Balancer (ALB) with a target group. You can reuse the resources from the ELB lab, but ensure the EC2 instances are terminated so the ASG can manage them.

## Steps

### 1. Create a Launch Template

A Launch Template defines what kind of EC2 instances the ASG will create.

1.  Navigate to the **EC2** service. In the left navigation pane, go to **Launch Templates**.
2.  Click **Create launch template**.
3.  **Launch template name:** `my-web-app-template`.
4.  **Template version description:** `Version 1 for web server`.
5.  **Application and OS Images (AMI):** Select **Amazon Linux 2**.
6.  **Instance type:** Select `t2.micro`.
7.  **Key pair (login):** Choose an existing key pair.
8.  **Network settings:**
    *   **Subnet:** Don't include in template. We will specify the subnets in the Auto Scaling Group itself.
    *   **Security groups:** Select the `web-sg` security group you created in the ELB lab (which allows HTTP and SSH).
9.  **Advanced details -> User data:** Paste the following script. This script installs a web server and a tool called `stress` which we will use to increase CPU load for testing the scaling policy.
    ```bash
    #!/bin/bash
    yum update -y
    yum install -y httpd
    systemctl start httpd
    systemctl enable httpd
    amazon-linux-extras install epel -y
    yum install -y stress
    INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)
    echo "<h1>Hello from instance ${INSTANCE_ID}</h1>" > /var/www/html/index.html
    ```
10. Click **Create launch template**.

### 2. Create the Auto Scaling Group

1.  In the EC2 console, go to **Auto Scaling Groups**.
2.  Click **Create Auto Scaling group**.
3.  **Auto Scaling group name:** `my-web-app-asg`.
4.  **Launch template:** Select the `my-web-app-template` you just created. Click **Next**.
5.  **Network:**
    *   **VPC:** Choose the VPC you used for the ELB lab.
    *   **Availability Zones and subnets:** Select the two **public subnets** that you used for your ALB.
6.  Click **Next**.
7.  **Load balancing:**
    *   Select **Attach to an existing load balancer**.
    *   Choose **Choose from your load balancer target groups**.
    *   Select the `my-web-app-tg` target group you created in the ELB lab.
8.  **Health checks:**
    *   Enable **ELB** health checks. This is a best practice.
9.  Click **Next**.
10. **Group size and scaling policies:**
    *   **Desired capacity:** `2`. This is the number of instances the ASG will start with.
    *   **Minimum capacity:** `1`. The ASG will never terminate instances if it means going below this number.
    *   **Maximum capacity:** `4`. The ASG will never launch instances if it means going above this number.
    *   **Scaling policies:** Select **Target tracking scaling policy**.
        *   **Metric type:** `Average CPU utilization`.
        *   **Target value:** `50`. This means the ASG will try to keep the average CPU usage across all instances at 50%. It will launch new instances if it goes above this, and terminate instances if it goes below.
11. Click **Next** through the remaining steps (Add notifications, Add tags) and finally click **Create Auto Scaling group**.

### 3. Test the Auto Scaling

1.  The ASG will now launch two instances. Go to the **Instances** page in the EC2 console. You will see two new instances being created.
2.  Once they are running, go to your Application Load Balancer's DNS name in a browser. You should see the homepages, and refreshing will alternate between the two new instances.
3.  **Trigger a Scale-Out Event:**
    *   SSH into **one** of your new instances.
    *   Run the `stress` command to generate CPU load:
        ```bash
        stress --cpu 1 --timeout 300s
        ```
        This will max out one CPU core for 5 minutes.
    *   Go to the **CloudWatch** console. Find the alarm that the ASG created. After a few minutes, you will see the average CPU utilization metric cross the 50% threshold and the alarm will go into the `ALARM` state.
    *   Go back to the **Auto Scaling Groups** page and look at the **Activity** tab for your ASG. You will see a scaling activity in progress, and a third instance will be launched to bring the average CPU back down.
4.  **Observe the Scale-In Event:**
    *   After the `stress` command finishes (or you stop it), the average CPU utilization will drop.
    *   After a few minutes, the ASG will trigger a scale-in event, terminating one of the instances to bring the group size back to the desired capacity of 2.

### 4. Clean Up

1.  Delete the Auto Scaling Group. This will also terminate the instances it manages.
2.  Delete the Launch Template.
3.  (If you haven't already) Delete the Application Load Balancer and its Target Group.
