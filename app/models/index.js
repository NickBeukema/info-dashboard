const fs        = require("fs");
const path      = require("path");
const Sequelize = require("sequelize");
const config    = require("../config");

var db = {};

// Create Sequalize connection
let sequelize = new Sequelize(config.databaseName, config.databaseUser, config.databasePassword, {
  dialect: 'postgres',
  logging: false
});


// Load in each model within current directory
fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js") && (file.endsWith('.js'));
  })
  .forEach(function (file) {
    var model = sequelize.import(path.join(__dirname, file));
    model.sync();
    db[model.name] = model;
  });

// Place each model within db to be exported
Object.keys(db).forEach(function (modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
