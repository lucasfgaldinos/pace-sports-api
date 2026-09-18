import Sequelize, { Model } from 'sequelize';

export class Category extends Model {
  static init(sequelize) {
    // biome-ignore lint: false positive
    super.init(
      {
        name: Sequelize.STRING,
      },
      { sequelize, tableName: 'categories' },
    );
  }
}
