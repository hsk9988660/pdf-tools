const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const File = sequelize.define('File', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  conversion_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'conversions',
      key: 'id',
    },
  },
  original_name: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  stored_name: {
    type: DataTypes.STRING(500),
    allowNull: false,
    comment: 'Name on disk',
  },
  mime_type: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  size: {
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: 'File size in bytes',
  },
  file_type: {
    type: DataTypes.ENUM('input', 'output'),
    allowNull: false,
    defaultValue: 'input',
  },
  file_path: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
}, {
  tableName: 'files',
  indexes: [
    { fields: ['conversion_id'] },
    { fields: ['file_type'] },
  ],
});

module.exports = File;
