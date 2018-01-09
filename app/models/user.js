module.exports = function (sequelize, DataTypes) {
  let User = sequelize.define("User", {
    googleId: {
      type: DataTypes.STRING,
      unique: true
    },

    email: {
      type: DataTypes.STRING,
      unique: true
    },

    oauthToken: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
    chosenCalendar: DataTypes.STRING,

  });
  return User;
};
