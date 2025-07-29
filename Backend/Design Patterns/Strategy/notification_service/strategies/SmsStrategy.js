class SmsStrategy {
  send(message) {
    console.log(`Sending SMS: ${message}`);
    // Add your SMS sending logic here (e.g., using Twilio)
  }
}

module.exports = SmsStrategy;
