const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Positions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Users }) {
      this.belongsToMany(Users, { through: 'PositionsUsers', foreignKey: 'position_id' });
      // define association here
    }
  }
  Positions.init({
    symbol: DataTypes.STRING,
    position: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Positions',
  });
  return Positions;
};
