import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ConversionAttributes {
  id: string;
  tool_type: 'merge' | 'split' | 'compress' | 'rotate' | 'watermark' | 'page_numbers' | 'jpg_to_pdf' | 'pdf_to_jpg';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  original_filename?: string;
  output_filename?: string;
  original_size?: number;
  output_size?: number;
  compression_ratio?: number;
  page_count?: number;
  options?: Record<string, unknown>;
  error_message?: string;
  ip_address?: string;
  user_agent?: string;
  processing_time_ms?: number;
  completed_at?: Date;
  readonly created_at?: Date;
  readonly updated_at?: Date;
}

export interface ConversionCreationAttributes extends Optional<ConversionAttributes, 'id' | 'status'> {}

class Conversion extends Model<ConversionAttributes, ConversionCreationAttributes> implements ConversionAttributes {
  public id!: string;
  public tool_type!: ConversionAttributes['tool_type'];
  public status!: ConversionAttributes['status'];
  public original_filename!: string;
  public output_filename!: string;
  public original_size!: number;
  public output_size!: number;
  public compression_ratio!: number;
  public page_count!: number;
  public options!: Record<string, unknown>;
  public error_message!: string;
  public ip_address!: string;
  public user_agent!: string;
  public processing_time_ms!: number;
  public completed_at!: Date;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Conversion.init(
  {
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
  },
  {
    sequelize,
    tableName: 'conversions',
    indexes: [
      { fields: ['tool_type'] },
      { fields: ['status'] },
      { fields: ['created_at'] },
      { fields: ['ip_address'] },
    ],
  }
);

export default Conversion;
