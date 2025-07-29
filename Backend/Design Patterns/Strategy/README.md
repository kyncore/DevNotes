# Strategy Pattern

## Core Explanation

The Strategy Pattern is a behavioral design pattern that enables selecting an algorithm at runtime. Instead of implementing a single algorithm directly, code receives runtime instructions as to which in a family of algorithms to use.

The key idea is to create objects which represent various strategies and a context object whose behavior varies as per its strategy object. The strategy object changes the executing algorithm of the context object.

**When to use it:**

*   When you have multiple variants of an algorithm and you want to switch between them at runtime.
*   To avoid conditional statements (if-else or switch) for selecting an algorithm.
*   When you want to isolate the business logic of a class from the implementation details of its algorithms.

## Real-World Project Example: A Notification Service

Imagine you're building a notification service that can send notifications via different channels: email, SMS, or push notifications. The core logic of creating and sending a notification remains the same, but the actual delivery mechanism changes based on the chosen channel.

We'll use **Node.js** for this example.

### Project Structure

```
/Design Patterns/Strategy
|-- README.md
|-- notification_service/
    |-- index.js
    |-- NotificationContext.js
    |-- strategies/
        |-- EmailStrategy.js
        |-- SmsStrategy.js
        |-- PushNotificationStrategy.js
```

### Implementation

First, let's create the directory for our project.
```bash
mkdir -p "Design Patterns/Strategy/notification_service/strategies"
```

**`strategies/EmailStrategy.js`**
```javascript
class EmailStrategy {
  send(message) {
    console.log(`Sending email: ${message}`);
    // Add your email sending logic here (e.g., using Nodemailer)
  }
}

module.exports = EmailStrategy;
```

**`strategies/SmsStrategy.js`**
```javascript
class SmsStrategy {
  send(message) {
    console.log(`Sending SMS: ${message}`);
    // Add your SMS sending logic here (e.g., using Twilio)
  }
}

module.exports = SmsStrategy;
```

**`strategies/PushNotificationStrategy.js`**
```javascript
class PushNotificationStrategy {
  send(message) {
    console.log(`Sending push notification: ${message}`);
    // Add your push notification logic here (e.g., using Firebase Cloud Messaging)
  }
}

module.exports = PushNotificationStrategy;
```

**`NotificationContext.js`**
```javascript
class NotificationContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  sendNotification(message) {
    this.strategy.send(message);
  }
}

module.exports = NotificationContext;
```

**`index.js`**
```javascript
const NotificationContext = require('./NotificationContext');
const EmailStrategy = require('./strategies/EmailStrategy');
const SmsStrategy = require('./strategies/SmsStrategy');
const PushNotificationStrategy = require('./strategies/PushNotificationStrategy');

// Create a notification context with an initial strategy (e.g., email)
const notification = new NotificationContext(new EmailStrategy());
notification.sendNotification('Hello, this is an email!');

// Change the strategy to SMS
notification.setStrategy(new SmsStrategy());
notification.sendNotification('Hello, this is an SMS!');

// Change the strategy to Push Notification
notification.setStrategy(new PushNotificationStrategy());
notification.sendNotification('Hello, this is a push notification!');
```

## Step-by-Step Explanation

1.  **Define the Strategy Interface:** In this Node.js example, we don't have explicit interfaces like in TypeScript or Java. However, all our strategy classes (`EmailStrategy`, `SmsStrategy`, `PushNotificationStrategy`) adhere to a common contract by implementing a `send(message)` method. This is the core of the Strategy pattern.

2.  **Implement Concrete Strategies:** Each class in the `strategies` directory is a concrete implementation of the strategy. `EmailStrategy` would contain the logic to send an email, `SmsStrategy` for SMS, and so on. For this example, we're just logging to the console, but in a real-world scenario, you'd integrate with services like AWS SES, Twilio, or Firebase.

3.  **Implement the Context:** The `NotificationContext` class holds a reference to a strategy object. It has a `setStrategy` method that allows changing the strategy at runtime. The `sendNotification` method delegates the actual sending logic to the current strategy object.

4.  **Client Code (`index.js`):** The client code creates a `NotificationContext` instance and provides it with an initial strategy. It can then change the strategy at any time by calling `setStrategy`. This allows the client to dynamically change the notification sending behavior without changing the context's code.

This example demonstrates how the Strategy pattern can be used to create a flexible and extensible notification system. Adding a new notification channel (e.g., Slack) is as simple as creating a new strategy class (`SlackStrategy.js`) without modifying any existing code.
