const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PositionsUsers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PositionsUsers.init({
    user_id: DataTypes.INTEGER,
    position_id: DataTypes.INTEGER,
    priority: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'PositionsUsers',
  });
  return PositionsUsers;
};
