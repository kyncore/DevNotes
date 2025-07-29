class PushNotificationStrategy {
  send(message) {
    console.log(`Sending push notification: ${message}`);
    // Add your push notification logic here (e.g., using Firebase Cloud Messaging)
  }
}

module.exports = PushNotificationStrategy;
