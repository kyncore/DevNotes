# Lab: Launching a MySQL Database with RDS

This lab will guide you through launching a MySQL database instance using Amazon RDS.

## Prerequisites

*   An AWS account.

## Steps

### 1. Create an RDS Database

1.  Navigate to the **RDS** service in the AWS Management Console.
2.  In the navigation pane, click **Databases**, then click **Create database**.
3.  **Choose a database creation method:** Select **Standard Create**.
4.  **Engine options:**
    *   **Engine type:** Select **MySQL**.
    *   **Version:** Choose a recent version.
5.  **Templates:** Select **Free tier**. This will automatically limit options to those eligible for the AWS Free Tier to avoid charges.
6.  **Settings:**
    *   **DB instance identifier:** Give your database a unique name, e.g., `my-rds-database`.
    *   **Master username:** Enter a name for the master user, e.g., `admin`.
    *   **Master password:** Enter a strong password and confirm it.
7.  **DB instance size:** Leave the default `db.t2.micro` or `db.t3.micro` selected by the Free Tier template.
8.  **Storage:** Leave the default settings.
9.  **Connectivity:**
    *   **Virtual Private Cloud (VPC):** Select your default VPC.
    *   **Public access:** Select **Yes**. **Note:** For a real-world application, you would typically keep your database private and only allow access from specific EC2 instances or other resources within the VPC. For this lab, we enable public access to make it easier to connect from a local client.
10. **Database authentication:** Choose **Password authentication**.
11. **Create database:** Scroll to the bottom and click **Create database**. It will take several minutes for the database to be created and become available.

### 2. Connect to Your Database

1.  Wait for the database **Status** to change from `Creating` to `Available`.
2.  Select your database to view its details.
3.  Find the **Endpoint** name under the **Connectivity & security** tab. This is the hostname you will use to connect to your database.
4.  You can use any standard SQL client to connect. Examples include:
    *   MySQL Workbench (GUI)
    *   DBeaver (GUI)
    *   The `mysql` command-line client

    **Connection Details:**
    *   **Hostname/Endpoint:** The endpoint from the RDS console.
    *   **Port:** `3306` (the default for MySQL).
    *   **Username:** The master username you created (e.g., `admin`).
    *   **Password:** The master password you created.

    **Example using the `mysql` CLI:**
    ```bash
    mysql -h <your-rds-endpoint> -P 3306 -u admin -p
    ```
    You will be prompted for your password. Once connected, you can run standard SQL commands.
    ```sql
    SHOW DATABASES;
    CREATE DATABASE myapp;
    USE myapp;
    CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100));
    INSERT INTO users (name) VALUES ('Alice'), ('Bob');
    SELECT * FROM users;
    ```

### 3. Clean Up

To avoid incurring charges, you must delete the DB instance when you are finished.

1.  Go to the RDS Databases page.
2.  Select the database instance you created.
3.  Click **Actions** -> **Delete**.
4.  You will be asked if you want to create a final snapshot. For this lab, uncheck this option.
5.  Acknowledge the effects of deletion and click **Delete**.
