# IAM (Identity and Access Management)

AWS Identity and Access Management (IAM) is a web service that helps you securely control access to AWS resources. You use IAM to control who is authenticated (signed in) and authorized (has permissions) to use resources.

## Key Concepts

*   **User:** An entity that you create in AWS to represent the person or application that uses it to interact with AWS.
*   **Group:** A collection of IAM users. Groups let you specify permissions for multiple users, which can make it easier to manage the permissions for those users.
*   **Policy:** An object in AWS that, when associated with an identity or resource, defines their permissions. Policies are stored in AWS as JSON documents.
    *   **Identity-based policies:** Attach policies to IAM users, groups, or roles. These policies grant permissions to the identity.
    *   **Resource-based policies:** Attach policies to resources. The most common examples are Amazon S3 bucket policies and IAM role trust policies.
*   **Role:** An IAM identity that you can create in your account that has specific permissions. An IAM role is similar to an IAM user, in that it is an AWS identity with permission policies that determine what the identity can and cannot do in AWS. However, instead of being uniquely associated with one person, a role is intended to be assumable by anyone who needs it.

## Best Practices

*   **Lock away your AWS account root user access keys:** Don't use the root user for everyday tasks.
*   **Create individual IAM users:** Create IAM users for anyone who needs access to your AWS account.
*   **Use groups to assign permissions to IAM users:** Manage permissions by placing users in groups with appropriate policies attached.
*   **Grant least privilege:** Grant only the permissions required to perform a task.
*   **Use roles for applications that run on EC2 instances:** This is more secure than storing access keys on the instance.

## Labs

*   [Lab: Creating an IAM User with Specific Permissions](./lab-creating-iam-user.md)
