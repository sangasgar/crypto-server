const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Bots, Positions }) {
      this.hasOne(Bots, { foreignKey: 'user_id' });
      this.belongsToMany(Positions, { through: 'PositionsUsers', foreignKey: 'user_id' });
      // define association here
    }
  }
  Users.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    publicKey: DataTypes.STRING,
    privateKey: DataTypes.STRING,
    balance: DataTypes.INTEGER,
    sizeDeposit: DataTypes.INTEGER,
    leverage: DataTypes.INTEGER,
    stoploss: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};
