module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PositionsUsers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      position_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Positions',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      priority: {
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
    await queryInterface.dropTable('PositionsUsers');
  },
};
