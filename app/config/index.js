require('dotenv').config();

module.exports = {
  darkSkyApiKey: process.env.DARK_SKY_API_KEY,
  rootPath: './public/',
  databaseName: 'dashboard_app',
  databaseUser: 'root',
  databasePassword: null,
  refreshThreshold: 1000 * 60 * 30
}
