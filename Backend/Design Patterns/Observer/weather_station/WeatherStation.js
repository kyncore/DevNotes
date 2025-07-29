class WeatherStation {
  constructor() {
    this.observers = [];
    this.temperature = 0;
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  setTemperature(temp) {
    this.temperature = temp;
    this.notifyObservers();
  }

  notifyObservers() {
    for (const observer of this.observers) {
      observer.update(this.temperature);
    }
  }
}

module.exports = WeatherStation;
