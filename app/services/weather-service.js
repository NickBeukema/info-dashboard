const DarkSky = require('dark-sky');
const { darkSkyApiKey, refreshThreshold } = require('../config');
const { WeatherRecord } = require('../models');

const forecast = new DarkSky(darkSkyApiKey);

function requestWeather(lat, long) {
  return new Promise((resolve, reject) => {
    lookupWeatherRecord(lat, long).then(record => {
      resolve(buildSentWeatherPacket(record.data));
    });
  });
}


function buildWeatherRecord(data) {
  let currently = data.currently;
  let hourly = data.hourly;
  let daily = data.daily;
  let alerts = data.alerts;

  return {
    'current-summary': currently.summary,
    'current-temperature': currently.temperature,
    'hourly-summary': hourly.summary,
    'hourly-data': hourly.data,
    'daily-summary': daily.summary,
    'daily-data': daily.data
  };
}

function buildSentWeatherPacket(data) {
  return {
    data: [
      {
        id: 'weather-record',
        type: 'weather-record',
        attributes: buildWeatherRecord(data)
      }
    ]
  };
}

function lookupWeatherRecord(lat, long) {
  return new Promise((resolve, reject) => {
    let roundedLat = Math.ceil(lat * 10) / 10;
    let roundedLong = Math.ceil(long * 10) / 10;

    WeatherRecord.findOne( { where: { latitude: roundedLat, longitude: roundedLong } })
      .then(record => {
        if(record) {
          console.log("sending old");
          validateOrUpdateRecord(record).then(record => {
            resolve(record);
          })
        } else {
          console.log("Fetching new")
          fetchAndStoreWeatherData(roundedLat, roundedLong)
            .then(record => {
              resolve(record);
            });
        }
      });
  });
}

function validateOrUpdateRecord(record) {
  return new Promise((resolve, reject) => {
    let timeDifference = new Date - new Date(record.updatedAt);

    if(timeDifference > refreshThreshold) {
      console.log("going to update from API");
      fetchAndUpdateRecord(record).then(newRecord => {
        resolve(newRecord);
      });
    } else {
      resolve(record);
    }
  });
}

function fetchAndStoreWeatherData(lat, long) {
  return new Promise((resolve, reject) => {
    fetchWeatherData(lat, long).then(data => {
      WeatherRecord.create({
        latitude: lat,
        longitude: long,
        data: data
      }).then(record => {
        resolve(record);
      });
    });
  });
}

function fetchAndUpdateRecord(record) {
  return new Promise((resolve, reject) => {
    fetchWeatherData(record.latitude, record.longitude).then(data => {
      record.update({ data: data }).then(newRecord => {
        resolve(newRecord);
      });
    });
  });
}

function fetchWeatherData(lat, long) {
  return new Promise((resolve, reject) => {
    console.log("Fetching data from API");
    forecast
      .latitude(lat)
      .longitude(long)
      .get()
      .then(data => {
        resolve(data);
      })
  });
}

module.exports = { requestWeather };
