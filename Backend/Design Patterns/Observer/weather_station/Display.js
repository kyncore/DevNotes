class Display {
  constructor(name) {
    this.name = name;
  }

  update(temperature) {
    console.log(`${this.name}: The temperature is now ${temperature}°C`);
  }
}

module.exports = Display;
