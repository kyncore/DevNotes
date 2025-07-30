# Infrastructure as Code (IaC) with CloudFormation

AWS CloudFormation is a service that gives you an easy way to model a collection of related AWS and third-party resources, provision them quickly and consistently, and manage them throughout their lifecycles, by treating infrastructure as code.

## Key Concepts

*   **Template:** A JSON or YAML formatted text file that describes your AWS infrastructure. You define the resources you want, their properties, and any dependencies between them in the template.
*   **Stack:** A collection of AWS resources that you can manage as a single unit. All the resources in a stack are defined by the stack's CloudFormation template. When you create a stack, CloudFormation provisions the resources described in your template.
*   **Change Set:** A summary of proposed changes to your stack that allows you to see how those changes might impact your running resources before you implement them. This is a crucial safety feature.
*   **Resources:** The `Resources` section of the template is where you declare the AWS resources you want to create, such as an `AWS::EC2::Instance` or `AWS::S3::Bucket`. This is the only required section of a template.
*   **Parameters:** The `Parameters` section lets you input custom values to your template each time you create or update a stack. They are like arguments to a function, making your templates reusable.
*   **Outputs:** The `Outputs` section declares output values that you can import into other stacks, view on the AWS CloudFormation console, or query using the AWS CLI. For example, you can output the DNS name of a load balancer or the ID of a VPC.

## Why Use CloudFormation?

*   **Automation & Consistency:** By codifying your infrastructure, you eliminate human error and ensure you deploy the exact same environment every time.
*   **Speed:** Provisioning a complex environment is as fast as uploading a template.
*   **Safety:** Use change sets to preview changes before they are applied. CloudFormation will also roll back to the previous known good state if an update fails.
*   **Reusability:** Use parameters to make your templates reusable for different environments (e.g., dev, test, prod).

## Labs

*   [Lab: Defining and Deploying a VPC with CloudFormation](./lab-deploying-vpc-with-cfn.md)
