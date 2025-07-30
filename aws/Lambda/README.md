# Lambda

AWS Lambda is a serverless, event-driven compute service that lets you run code for virtually any type of application or backend service without provisioning or managing servers. You can trigger Lambda from over 200 AWS services and software as a service (SaaS) applications, and only pay for what you use.

## Key Concepts

*   **Function:** A script or program that runs in Lambda. Lambda passes invocation events to your function.
*   **Runtime:** The environment in which your Lambda function runs. It provides a language-specific environment that includes the AWS SDK. Lambda supports many popular languages like Node.js, Python, Go, Java, and more.
*   **Event:** A JSON document that contains data for a Lambda function to process. An event can be a custom payload you provide, or it can be an event from an AWS service (like an S3 bucket event or an API Gateway request).
*   **Trigger:** A resource or configuration that invokes a Lambda function. Triggers can be other AWS services or can be invoked directly using the AWS SDK.
*   **Execution Role:** An IAM role that grants your Lambda function permission to access AWS services and resources.
*   **Handler:** The method in your function code that processes events. When your function is invoked, Lambda runs the handler method.

## Common Use Cases

*   **Web Applications:** Process requests from an Amazon API Gateway endpoint.
*   **Data Processing:** Trigger off of S3 events to process files as they are uploaded (e.g., creating image thumbnails).
*   **Real-time Data Streams:** Process data from Kinesis or DynamoDB Streams.
*   **Scheduled Jobs:** Run code on a regular schedule using EventBridge (CloudWatch Events) triggers.

## Labs

*   [Lab: Creating a "Hello, World" Lambda Function](./lab-hello-world-lambda.md)
