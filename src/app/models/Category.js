import Sequelize, { Model } from 'sequelize';

export class Category extends Model {
  static init(sequelize) {
    // biome-ignore lint: false positive
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/category-file/${this.path}`;
          },
        },
      },
      { sequelize, tableName: 'categories' },
    );
  }
}
