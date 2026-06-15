import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface FileAttributes {
  id: string;
  conversion_id: string;
  original_name: string;
  stored_name: string;
  mime_type?: string;
  size?: number;
  file_type: 'input' | 'output';
  file_path: string;
  readonly created_at?: Date;
  readonly updated_at?: Date;
}

export interface FileCreationAttributes extends Optional<FileAttributes, 'id'> {}

class File extends Model<FileAttributes, FileCreationAttributes> implements FileAttributes {
  public id!: string;
  public conversion_id!: string;
  public original_name!: string;
  public stored_name!: string;
  public mime_type!: string;
  public size!: number;
  public file_type!: 'input' | 'output';
  public file_path!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

File.init(
  {
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
  },
  {
    sequelize,
    tableName: 'files',
    indexes: [
      { fields: ['conversion_id'] },
      { fields: ['file_type'] },
    ],
  }
);

export default File;
