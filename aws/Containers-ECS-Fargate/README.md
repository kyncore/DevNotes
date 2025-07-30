# Modern Applications with Containers on AWS

Containerization has become the standard for modern application development and deployment. It allows you to package your application's code, libraries, and dependencies into a single, portable unit called a container. AWS provides a powerful ecosystem for running and managing containers.

## Core Concepts

*   **Docker:** The most popular containerization platform. It provides the tools to build, share, and run containers. A `Dockerfile` is a text file that contains instructions for building a Docker image.
*   **Container Image:** A lightweight, standalone, executable package that includes everything needed to run a piece of software, including the code, a runtime, libraries, environment variables, and config files.
*   **Amazon ECR (Elastic Container Registry):** A fully-managed Docker container registry that makes it easy for developers to store, manage, and deploy Docker container images. It's the AWS equivalent of Docker Hub, but private and integrated with IAM.
*   **Amazon ECS (Elastic Container Service):** A highly scalable, high-performance container orchestration service that supports Docker containers. It allows you to easily run and scale containerized applications on AWS.
*   **ECS Launch Types:**
    *   **EC2:** You manage a cluster of EC2 instances that ECS uses to run your containers. This gives you more control over the underlying infrastructure.
    *   **Fargate:** This is the **serverless** compute engine for containers. With Fargate, you don't have to provision or manage servers. You just define your application, specify the CPU and memory it needs, and Fargate launches and manages the containers for you. **Fargate is the recommended approach for most new applications.**

## ECS Components

*   **Cluster:** A logical grouping of tasks or services. When using the Fargate launch type, a cluster is a namespace that provides isolation.
*   **Task Definition:** A blueprint for your application. It's a text file in JSON format that describes one or more containers that form your application. You specify the Docker image to use, CPU/memory requirements, launch type, networking information, and more.
*   **Task:** A running instance of a Task Definition within a cluster.
*   **Service:** Allows you to run and maintain a specified number of instances of a task definition simultaneously in an ECS cluster. If any of your tasks fail or stop, the ECS service scheduler launches another instance of your task definition to replace it. It can also optionally be integrated with an Application Load Balancer (ALB) to distribute traffic to the tasks.

## Labs

*   [Lab: Deploying a Dockerized Application with ECS and Fargate](./lab-deploying-docker-app-with-fargate.md)
