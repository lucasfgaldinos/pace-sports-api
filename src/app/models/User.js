import Sequelize, { Model } from 'sequelize';

export class User extends Model {
  static init(sequelize) {
    // biome-ignore lint: false positive
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        is_admin: Sequelize.BOOLEAN,
      },
      { sequelize, tableName: 'users' },
    );
  }
}
