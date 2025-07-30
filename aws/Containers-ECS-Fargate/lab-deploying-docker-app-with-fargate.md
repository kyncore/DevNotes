# Lab: Deploying a Docker App with ECS and Fargate

This lab walks through the end-to-end process of taking a simple Dockerized web application, pushing its image to Amazon ECR, and deploying it as a scalable service using ECS and AWS Fargate.

## Prerequisites

*   An AWS account.
*   Docker installed and running on your local machine.
*   The AWS CLI installed and configured with credentials that have permission to access ECR, ECS, and related services.
*   A VPC with public subnets and an internet gateway. The Default VPC is sufficient.

## The Application

We will use a simple Node.js web server.

1.  **Create a project directory** on your local machine.
2.  **Create a file named `app.js`:**
    ```javascript
    const http = require('http');
    const port = 8080;

    const server = http.createServer((req, res) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Hello from my containerized application on AWS Fargate!');
    });

    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
    ```
3.  **Create a file named `Dockerfile`:**
    ```dockerfile
    # Use an official Node.js runtime as a parent image
    FROM node:18-alpine

    # Set the working directory in the container
    WORKDIR /usr/src/app

    # Copy the current directory contents into the container at /usr/src/app
    COPY . .

    # Make port 8080 available to the world outside this container
    EXPOSE 8080

    # Run app.js when the container launches
    CMD [ "node", "app.js" ]
    ```

## Steps

### 1. Build the Docker Image and Push to ECR

1.  **Create an ECR Repository:**
    *   Navigate to the **ECR** service in the AWS console.
    *   Click **Create repository**.
    *   **Visibility settings:** `Private`.
    *   **Repository name:** `my-fargate-app`.
    *   Click **Create repository**.
2.  **Authenticate Docker to ECR:**
    *   Select your new repository and click **View push commands**.
    *   Follow the instructions. The first command will retrieve an authentication token and use it to log your Docker client in to the registry. It will look something like this (run it in your terminal):
        ```bash
        aws ecr get-login-password --region <your-region> | docker login --username AWS --password-stdin <your-aws-account-id>.dkr.ecr.<your-region>.amazonaws.com
        ```
3.  **Build, Tag, and Push the Image:**
    *   Execute the remaining push commands from the ECR console in your project directory.
        ```bash
        # 1. Build the image
        docker build -t my-fargate-app .

        # 2. Tag the image with the ECR repository URI
        docker tag my-fargate-app:latest <your-aws-account-id>.dkr.ecr.<your-region>.amazonaws.com/my-fargate-app:latest

        # 3. Push the image to ECR
        docker push <your-aws-account-id>.dkr.ecr.<your-region>.amazonaws.com/my-fargate-app:latest
        ```
    *   After the push completes, you can see the image in your ECR repository.

### 2. Configure ECS

1.  **Create an ECS Cluster:**
    *   Navigate to the **ECS** service.
    *   Click **Create cluster**.
    *   **Cluster name:** `my-app-cluster`.
    *   **Infrastructure:** Select **AWS Fargate (serverless)**.
    *   Click **Create**.
2.  **Create a Task Definition:**
    *   In the ECS navigation pane, click **Task Definitions**, then **Create new task definition**.
    *   **Task definition family:** `my-app-task-def`.
    *   **Launch type:** `AWS Fargate`.
    *   **Operating system/Architecture:** `Linux/X86_64`.
    *   **Task size:** `0.5 GB` Memory, `0.25 vCPU`.
    *   **Container details:**
        *   **Name:** `my-app-container`.
        *   **Image URI:** Paste the URI of the image you pushed to ECR.
        *   **Container port:** `8080`.
    *   Click **Next**, then **Create**.
3.  **Create a Service:**
    *   Go to your `my-app-cluster` and click the **Services** tab, then **Create**.
    *   **Deployment configuration:**
        *   **Task Definition:** Select `my-app-task-def`.
        *   **Service name:** `my-app-service`.
        *   **Desired tasks:** `2`. This will run two instances of your container.
    *   **Networking:**
        *   Select your VPC and at least two **public subnets**.
        *   **Security group:** Create a new one or use an existing one that allows inbound traffic on port 8080.
        *   **Public IP:** Turn on. This will give each task a public IP.
    *   You can skip the Load Balancing section for this basic lab.
    *   Click **Create**.

### 3. Test the Service

1.  ECS will now pull your image from ECR and start two tasks.
2.  Go to your cluster's **Tasks** tab. Click on one of the running tasks.
3.  In the **Networking** section of the task details, find the **Public IP**.
4.  Open your browser and navigate to `http://<your-task-public-ip>:8080`.
5.  You should see the "Hello from my containerized application on AWS Fargate!" message. You can test the IP of the other task as well.

### 4. Clean Up

1.  **Delete the Service:** In your cluster, select `my-app-service` and click **Delete**. This will stop the running tasks.
2.  **Delete the Cluster:** Once the service is deleted, select your cluster and click **Delete**.
3.  **Deregister the Task Definition:** Go to Task Definitions, select `my-app-task-def`, click **Actions** -> **Deregister**.
4.  **Delete the ECR Repository:** Go to ECR, select `my-fargate-app`, and click **Delete**. You may need to delete the images inside it first.
