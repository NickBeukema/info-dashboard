const { rootPath }  = require('./config');
const bodyParser = require('body-parser');
const {

  weatherService,
  calendarService,
  oauthService

} = require('./services');

module.exports = function(app) {

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ type: 'application/vnd.api+json' }));
  app.use(oauthService.middleware);

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

  app.get('/api/calendar-records', function(req, res) {
    calendarService.requestEvents(req.user.userId)
      .then(data => {
        res.json(data);
      }).
      catch(err => {
        res.status(500).send(err);
      });
  });

  app.post('/api/calendar-records', function(req, res) {
    const calendar = JSON.parse(Object.keys(req.body)[0]).data.attributes.title;
    calendarService.setChosenCalendar(req.user.userId, calendar)
      .then((data, err) => {
        res.json(data);
      });
  });

  app.use(oauthService.routes);

  app.get('*', function(req, res) {
    res.sendFile('index.html', { root: rootPath }); // load our public/index.html file
  });
};
