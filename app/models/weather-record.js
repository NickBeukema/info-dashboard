module.exports = function (sequelize, DataTypes) {
  let WeatherRecord = sequelize.define("WeatherRecord", {
    data: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  });
  return WeatherRecord;
};
