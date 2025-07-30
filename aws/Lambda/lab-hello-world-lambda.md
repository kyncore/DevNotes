# Lab: Creating a "Hello, World" Lambda Function

This lab will guide you through creating and testing a simple "Hello, World" function using AWS Lambda.

## Prerequisites

*   An AWS account.

## Steps

### 1. Create a Lambda Function

1.  Navigate to the **Lambda** service in the AWS Management Console.
2.  Click **Create function**.
3.  **Function options:**
    *   Select **Author from scratch**.
    *   **Function name:** Enter a name, e.g., `HelloWorldFunction`.
    *   **Runtime:** Select **Node.js** (a recent version like 18.x or 20.x).
    *   **Architecture:** Leave the default `x86_64`.
4.  **Permissions:**
    *   Expand **Change default execution role**.
    *   Select **Create a new role with basic Lambda permissions**. This gives your function permission to write logs to CloudWatch, which is useful for debugging.
5.  Click **Create function**.

### 2. Review and Edit the Function Code

1.  After the function is created, you will be taken to its configuration page.
2.  Scroll down to the **Code source** editor. You will see the default `index.mjs` file with some boilerplate code.
3.  Replace the code with the following simple "Hello, World" example. This code receives an `event` object, logs it, and returns a response.

    ```javascript
    export const handler = async (event) => {
      // Log the event object to CloudWatch Logs
      console.log("Received event:", JSON.stringify(event, null, 2));

      // Get the 'name' from the event object, or default to 'World'
      const name = event.name || 'World';

      // Create a response object
      const response = {
        statusCode: 200,
        body: JSON.stringify(`Hello, ${name}!`),
      };

      return response;
    };
    ```
4.  Click the **Deploy** button above the code editor to save your changes.

### 3. Test the Function

1.  Select the **Test** tab.
2.  **Test event:**
    *   Select **Create new event**.
    *   **Event name:** `MyTestEvent`.
    *   **Event JSON:** Leave the default template (`"key1": "value1", ...`). We will modify it to pass a name to our function.
    *   Replace the template with the following JSON:
        ```json
        {
          "name": "Gemini"
        }
        ```
3.  Click the **Save** button to save the test event.
4.  Click the **Test** button to invoke your function with the event you just configured.

### 4. Review the Execution Results

1.  The **Execution results** will appear.
2.  You should see a **Status** of `Succeeded`.
3.  The **Response** section will show the output from your function:
    ```json
    {
      "statusCode": 200,
      "body": "\"Hello, Gemini!\""
    }
    ```
4.  The **Function logs** section will show the output from the `console.log()` statement, which is sent to CloudWatch Logs. You will see the full event object printed there.

### 5. Clean Up

To avoid incurring charges (though Lambda has a generous free tier), it's good practice to clean up resources.

1.  On your function's page, click **Actions** -> **Delete function**.
2.  Confirm the deletion.
3.  Lambda also creates a CloudWatch Log Group and an IAM Role. You can delete these from the CloudWatch and IAM services, respectively, to be thorough.
