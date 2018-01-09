const request = require('request');
const { User } = require('../models');
const { refreshGoogleToken } = require('./oauth-service');

function requestEvents(googleId) {
  return new Promise((resolve, reject) => {
    lookupLatestCalendarEvents(googleId)
      .then(events => {
        console.log("First Time")
        resolve(buildSentCalendarPacket(events));
      })
      .catch(err => {
        refreshGoogleToken(googleId).then(u => {
          lookupLatestCalendarEvents(googleId)
            .then(events => {
              console.log("Second time!")
              resolve(buildSentCalendarPacket(events));
            })
            .catch(err => {
              reject(err);
            });
        });
      })
  });
}

function lookupLatestCalendarEvents(googleId) {

  return new Promise((resolve, reject) => {
    console.log("About to lookup user", googleId);
    User.findOne({where: { googleId: googleId }})
      .then(u => {
        let url;
        if(!u.chosenCalendar) {
          url = 'https://www.googleapis.com/calendar/v3/users/me/calendarList';
        } else {
          let now = new Date().toISOString();
          url = `https://www.googleapis.com/calendar/v3/calendars/${u.chosenCalendar}/events?timeMin=${now}&singleEvents=true&orderBy=startTime&maxResults=3`;
        }

        const options = {
          url,
          headers: {
            'Authorization': `Bearer ${u.oauthToken}`
          }
        };

        request(options, (error, response, body) => {
          let parsedBody, err;

          let errorMessage = 'Failed to fetch calendar records from Google';

          try {
            parsedBody = JSON.parse(body);
          } catch(e) {
            err = { errors: [errorMessage] };
          }

          if(err || !parsedBody || parsedBody.error) {
            err = err || ""
            reject('Error fetching records ' + err);
            return;
          }


          resolve(parsedBody);
        });

      });

  });



}

function buildSentCalendarPacket(events) {
  if(events.kind === 'calendar#events') {
    return {
      data:  events.items.map(googleEvent => {
        return {
          id: googleEvent.id,
          type: 'calendar-record',
          attributes: {
            'start-date': googleEvent.start.dateTime,
            'end-date': googleEvent.end.dateTime,
            title: googleEvent.summary,
            day: googleEvent.start.date,
          }
        };
      })
    };
  } else if(events.kind === 'calendar#calendarList') {
    return {
      data: events.items.map(calendar => {
        return {
          id: calendar.id,
          type: 'calendar-record',
          attributes: {
            type: 'calendar'
          }
        };
      })
    }
  }
}

function setChosenCalendar(googleId, calendar) {
  return new Promise((resolve, reject) => {
    User.findOne({where: { googleId: googleId }})
      .then(u => {

        // Get around ember data leaving out blank strings
        //if(calendar === "_") {
          //calendar = "";
        //}

        u.update({chosenCalendar: calendar})
          .then(() => {
            let now = new Date().toISOString();
            resolve({
              data: {
                id: googleId + " " + calendar,
                id: `${googleId} ${calendar} ${now}`,
                type: 'calendar-record',
                attributes: {
                  title: calendar
                }
              }
            });
          });
      });
  });
}

module.exports = { requestEvents, setChosenCalendar };
