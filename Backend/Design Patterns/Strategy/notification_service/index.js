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
