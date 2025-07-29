const WeatherStation = require('./WeatherStation');
const Display = require('./Display');

const weatherStation = new WeatherStation();

const display1 = new Display('Display 1');
const display2 = new Display('Display 2');

weatherStation.addObserver(display1);
weatherStation.addObserver(display2);

weatherStation.setTemperature(25);
weatherStation.setTemperature(30);
