# Lab: Creating an IAM User with Specific Permissions

This lab guides you through creating a new IAM user with restricted permissions. This is a fundamental security practice in AWS. We will create a user who has read-only access to Amazon S3.

## Prerequisites

*   An AWS account with administrator privileges.

## Steps

### 1. Create an IAM User

1.  Navigate to the **IAM** service in the AWS Management Console.
2.  In the navigation pane, choose **Users** and then click **Create user**.
3.  **User name:** Enter a name for the user, e.g., `s3-read-only-user`.
4.  Select **Provide user access to the AWS Management Console**.
5.  Select **I want to create an IAM user**.
6.  **Console password:** Select **Custom password** and enter a strong password.
7.  Uncheck **User must create a new password at next sign-in**. For a real user, you would typically leave this checked.
8.  Click **Next**.

### 2. Set Permissions

Now, you'll attach a policy that grants the user read-only access to S3.

1.  In the **Permissions options** section, select **Attach policies directly**.
2.  In the search box, type `S3Read` to filter the policies.
3.  Check the box next to the **AmazonS3ReadOnlyAccess** policy.
4.  Click **Next**.

### 3. Review and Create

1.  Review the user details and the permissions summary.
2.  Scroll to the bottom and click **Create user**.

### 4. Test the New User's Permissions

1.  After the user is created, you will see a success page with the user's sign-in URL, username, and password. **Copy the Console sign-in URL**. It will look like `https://<your_aws_account_id>.signin.aws.amazon.com/console`.
2.  Open a new incognito browser window (to avoid conflicts with your current login).
3.  Paste the sign-in URL into the new browser window.
4.  Log in with the `s3-read-only-user` username and the password you created.
5.  **Test S3 Access:**
    *   Navigate to the **S3** service. You should be able to list and view buckets and objects.
    *   Try to create a bucket or upload an object. You should receive an "Access Denied" error, confirming the read-only permissions are working correctly.
6.  **Test EC2 Access:**
    *   Navigate to the **EC2** service. You will see errors indicating that you are not authorized to perform actions like `ec2:DescribeInstances`. This confirms the user cannot access other services.

### 5. Clean Up

1.  Sign out of the `s3-read-only-user` session and close the incognito window.
2.  Back in your administrator account, navigate to the IAM Users page.
3.  Select the `s3-read-only-user`.
4.  Click **Delete**. Confirm the deletion by typing the user's name.
