const express = require('express');
const request = require('request');
const createJWT = require('jsonwebtoken');
const validateJWT = require('express-jwt');
const { User } = require('../models');

const secret = '09htfahpkc0qyw4ukrtag0gy20ktarpkcasht';

const middleware = express();
const routes = express();

const clientId = '973762602332-2pdqd1b7d1ln8noil93hpkp9k4b332d5.apps.googleusercontent.com';
const clientSecret = 'DtfAwMpxiOms9j9OPJXeDRjR';

var fs = require('fs')
    , path = require('path')
    //, certFile = path.resolve('/home/ubuntu/fullchain.pem');
    , certFile = path.resolve(__dirname, '../ssl/client.key')
    , keyFile = path.resolve(__dirname, '../ssl/client.key');

function signToken(userId) {
  return createJWT.sign(
      { userId },
      secret,
      { expiresIn: '60d'}
  )

}

function authenticateGoogle(token) {
  return new Promise((resolve, reject) => {

    const redirectUri = 'https://dashboard.michiganfyzical.com/torii/redirect.html';
    const url = `https://www.googleapis.com/oauth2/v4/token?code=${token}&redirect_uri=${redirectUri}&client_id=${clientId}&client_secret=${clientSecret}&grant_type=authorization_code`;

    const opts = {
      url,
      agentOptions: {
        ca: fs.readFileSync(certFile),
        //key: fs.readFileSync(keyFile),
      }
    };

    request.post(opts, (error, response, body) => {
      try {
        console.log(error, body);


        const parsedBody = JSON.parse(body);
        if(parsedBody.error) {
          resolve({ errors: [`${parsedBody.error} - ${parsedBody.error_description}`]})
        }

        const accessToken = parsedBody.access_token;
        const refreshToken = parsedBody.refresh_token;
        const expiredIn = parsedBody.expires_in;

        console.log(parsedBody)
        request('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + accessToken, (error, response, body) => {
            console.log(body);
          if (!error && response.statusCode == 200) {

            const userId = JSON.parse(body).user_id;
            const userEmail = JSON.parse(body).email;

            User.findOne({where: {googleId: userId}})
              .then(u => {
                console.log(userId);

                if (!u) {

                  User.create({ googleId: userId, email: userEmail, oauthToken: accessToken, refreshToken: refreshToken })
                    .then(newRecord => {
                      console.log("New User");
                      resolve({ token: signToken(userId) });
                    });

                } else {

                  u.update({oauthToken: accessToken, refreshToken: refreshToken})
                    .then(updatedRecord => {
                      console.log("Returning User");
                      resolve({ token: signToken(userId) });
                    });

                }

              });

          } else {
            resolve({ errors: ['Failed to validate Google Token']})
          }

        });



      } catch(error) {
        console.log("Error sending post for token to url: ", url, error)
        resolve({ errors: ['Failed to utilize provided authorization code.']})
      }

    })
  })

}

function refreshGoogleTokenFromJWT(oldToken) {
  return new Promise((resolve, reject) => {
    createJWT.verify(oldToken, secret, (err, decodedToken) => {

      if(!err) {
        const userId = decodedToken.userId;
        refreshGoogleToken(userId).then((user) => {
          resolve({ token: signToken(user.googleId) });
        }).catch(err => {
          resolve({ errors: ['Error while trying to refresh token: ' + err]})
        });

      } else {
        resolve({ errors: ['Error while trying to refresh token: ' + err]})
      }

    });
  });
}

function refreshGoogleToken(userId) {
  console.log("REFRESHING");
  return new Promise((resolve, reject) => {
    User.findOne({where: {googleId: userId}})
      .then(u => {
        if(u) {


          let url = `https://www.googleapis.com/oauth2/v4/token?client_secret=${clientSecret}&grant_type=refresh_token&refresh_token=${u.refreshToken}&client_id=${clientId}`;

          const opts = {
            url,
            agentOptions: {
              cert: fs.readFileSync(certFile),
              key: fs.readFileSync(keyFile),
            }
          };

          request.post(opts, (error, response, body) => {
            try {

              let parsedBody = JSON.parse(body);

              if(parsedBody.access_token) {
                console.log("SUCCESSFULLY REFRESHED");
                u.update({ oauthToken: parsedBody.access_token }).then(u => {
                  resolve(u);
                });
              } else {
                reject('There was an issue while fetching refresh token');
              }
            } catch(e) {
              console.log("ERROR:", e);
              reject('There was an issue while fetching refresh token');
            }

          });



        } else {
          reject('User does not exist');
        }
      });
  });
}

routes.post('/api/get-token', (req, res) => {
  const googleToken = req.body.password;
  authenticateGoogle(googleToken).then(result => {
    res.send(result);
  });
})

routes.post('/api/refresh-token', (req, res) => {
  const oldToken = req.body.token;
  refreshGoogleTokenFromJWT(oldToken).then(result => {
    res.send(result);
  });
});

function secureRoutes() {
  return validateJWT({ secret })
    .unless({ path: [ '/api/get-token', '/api/refresh-token', '/api/weather-records']})
}

function handleUnauthorized(err, req, res, next) {
  console.log("handling unauth")
    if (err.name === 'UnauthorizedError') {
      res.status(401).send('Invalid Token');
    }
}

middleware.use(secureRoutes());
middleware.use(handleUnauthorized);

module.exports = { routes, middleware, refreshGoogleToken }
