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
      symbol: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      sizeDeposit: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      leverage: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      stoploss: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      botStatus: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
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
