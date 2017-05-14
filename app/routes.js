const { rootPath }  = require('./config');
const { weatherService } = require('./services');

module.exports = function(app) {
  app.get('/api/weather-records', function(req, res) {
    const { lat, long } = req.query;

    weatherService.requestWeather(lat, long)
      .then((data, err) => {
        if(err) {
          res.json(err);
        } else {
          res.json(data);
        }
      });
  });
  app.get('*', function(req, res) {
    res.sendFile('index.html', { root: rootPath }); // load our public/index.html file
  });
};
