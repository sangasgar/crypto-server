const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Bots extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Users }) {
      this.belongsTo(Users, { foreignKey: 'user_id' });
      // define association here
    }
  }
  Bots.init({
    botStatus: DataTypes.BOOLEAN,
    user_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Bots',
  });
  return Bots;
};
