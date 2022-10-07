module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      publicKey: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      privateKey: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      balance: {
        type: Sequelize.INTEGER,
      },
      sizeDeposit: {
        type: Sequelize.INTEGER,
      },
      leverage: {
        type: Sequelize.INTEGER,
      },
      stoploss: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  },
};
