const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
      // Define your User model attributes here
      firstName: Sequelize.STRING,
      lastName: Sequelize.STRING,
      age: Sequelize.INTEGER,
      eMail: Sequelize.STRING,
      password: Sequelize.STRING,
    });
  
    // Other model definitions...
  
    return User;
  };

