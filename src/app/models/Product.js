import Sequelize, { Model } from 'sequelize';

export class Product extends Model {
  static init(sequelize) {
    // biome-ignore lint: false positive
    super.init(
      {
        name: Sequelize.STRING,
        price: Sequelize.INTEGER,
        category: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http:localhost:3000/product-file/${this.path}`;
          },
        },
      },
      { sequelize, tableName: 'products' },
    );
  }
}
