const sequelize = require('../config/database');
const Conversion = require('./Conversion');
const File = require('./File');

// Associations
Conversion.hasMany(File, { foreignKey: 'conversion_id', as: 'files' });
File.belongsTo(Conversion, { foreignKey: 'conversion_id', as: 'conversion' });

const db = {
  sequelize,
  Sequelize: require('sequelize'),
  Conversion,
  File,
};

module.exports = db;
