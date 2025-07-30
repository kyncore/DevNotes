# RDS (Relational Database Service)

Amazon Relational Database Service (Amazon RDS) makes it easy to set up, operate, and scale a relational database in the cloud. It provides cost-efficient and resizable capacity while automating time-consuming administration tasks such as hardware provisioning, database setup, patching, and backups.

## Key Concepts

*   **DB Instance:** A database environment in the cloud. It's the basic building block of Amazon RDS.
*   **Database Engine:** The specific relational database software that runs on your DB instance. Amazon RDS supports several popular engines, including:
    *   MySQL
    *   PostgreSQL
    *   MariaDB
    *   Oracle Database
    *   Microsoft SQL Server
    *   Amazon Aurora (a MySQL and PostgreSQL-compatible relational database built for the cloud)
*   **DB Instance Class:** Determines the computation and memory capacity of a DB instance.
*   **Multi-AZ Deployments:** Creates a primary DB instance and synchronously replicates the data to a standby instance in a different Availability Zone (AZ). This provides data redundancy and failover support.
*   **Read Replicas:** Allows you to create one or more read-only copies of your database instance. This can help you scale out beyond the capacity of a single DB instance for read-heavy database workloads.
*   **Security Groups:** Control access to your DB instance, just like with EC2 instances.

## Labs

*   [Lab: Launching a MySQL Database with RDS](./lab-launching-mysql-db.md)
