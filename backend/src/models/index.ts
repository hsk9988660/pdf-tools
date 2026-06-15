import { Sequelize } from 'sequelize';
import sequelize from '../config/database';
import Conversion from './Conversion';
import File from './File';

// Associations
Conversion.hasMany(File, { foreignKey: 'conversion_id', as: 'files' });
File.belongsTo(Conversion, { foreignKey: 'conversion_id', as: 'conversion' });

const db: {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  Conversion: typeof Conversion;
  File: typeof File;
} = {
  sequelize,
  Sequelize,
  Conversion,
  File,
};

export default db;
export { sequelize, Sequelize, Conversion, File };
