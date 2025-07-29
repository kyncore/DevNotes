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
