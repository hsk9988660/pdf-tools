const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conversion = sequelize.define('Conversion', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tool_type: {
    type: DataTypes.ENUM(
      'merge',
      'split',
      'compress',
      'rotate',
      'watermark',
      'page_numbers',
      'jpg_to_pdf',
      'pdf_to_jpg'
    ),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
    defaultValue: 'pending',
    allowNull: false,
  },
  original_filename: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  output_filename: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  original_size: {
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: 'Original file size in bytes',
  },
  output_size: {
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: 'Output file size in bytes',
  },
  compression_ratio: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Compression ratio percentage',
  },
  page_count: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Number of pages in the PDF',
  },
  options: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Tool-specific options (rotation angle, watermark text, etc.)',
  },
  error_message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  user_agent: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  processing_time_ms: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Processing time in milliseconds',
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'conversions',
  indexes: [
    { fields: ['tool_type'] },
    { fields: ['status'] },
    { fields: ['created_at'] },
    { fields: ['ip_address'] },
  ],
});

module.exports = Conversion;
