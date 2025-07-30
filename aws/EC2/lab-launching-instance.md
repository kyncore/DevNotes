# Lab: Launching a Web Server on an EC2 Instance

This lab will guide you through the process of launching a simple web server on an Amazon EC2 instance.

## Prerequisites

*   An AWS account.
*   Basic knowledge of the AWS Management Console.

## Steps

### 1. Launch an EC2 Instance

1.  Navigate to the EC2 service in the AWS Management Console.
2.  Click **Launch instance**.
3.  **Name and tags:** Give your instance a name, e.g., `MyWebServer`.
4.  **Application and OS Images (Amazon Machine Image):** Choose an AMI. For this lab, select **Amazon Linux 2 AMI (HVM)**, which is Free Tier eligible.
5.  **Instance type:** Choose a type. For this lab, select **t2.micro**, which is Free Tier eligible.
6.  **Key pair (login):** Create a new key pair or choose an existing one. If you create a new one, download the `.pem` file and store it securely. You will need this to SSH into your instance.
7.  **Network settings:**
    *   Click **Edit**.
    *   For **Security group name**, create a new security group named `web-server-sg`.
    *   In **Inbound security groups rules**, add the following rules:
        *   **Type:** `SSH`, **Source:** `My IP` (This allows you to SSH from your current IP address).
        *   **Type:** `HTTP`, **Source:** `Anywhere` (This allows anyone to access your web server).
8.  **Configure storage:** Leave the default settings (8 GiB gp2).
9.  **Launch instance:** Review the summary and click **Launch instance**.

### 2. Connect to Your Instance and Install a Web Server

1.  Go to the EC2 Instances page and wait for your instance's **Instance state** to become **Running**.
2.  Select your instance and click **Connect**.
3.  Follow the instructions in the **SSH client** tab to connect to your instance using the key pair you downloaded.
    ```bash
    # Example:
    ssh -i "MyWebServer.pem" ec2-user@<your-instance-public-dns>
    ```
4.  Once connected, update the installed packages and install the Apache HTTP web server.
    ```bash
    sudo yum update -y
    sudo yum install -y httpd
    sudo systemctl start httpd
    sudo systemctl enable httpd
    ```
5.  Create a simple `index.html` file.
    ```bash
    echo "<h1>Hello from my EC2 Web Server!</h1>" | sudo tee /var/www/html/index.html
    ```

### 3. Test Your Web Server

1.  Find the **Public IPv4 DNS** of your instance from the EC2 console.
2.  Open a web browser and navigate to `http://<your-instance-public-dns>`.
3.  You should see the "Hello from my EC2 Web Server!" message.

### 4. Clean Up

To avoid incurring charges, **terminate** your EC2 instance when you are finished with this lab.
1.  Go to the EC2 Instances page.
2.  Select the instance you created.
3.  Click **Instance state** -> **Terminate instance**.
