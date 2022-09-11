const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Users', [{
      name: 'Garegin',
      email: 'sangas@yandex.ru',
      password: await bcrypt.hash('123', Number(process.env.SALTROUNDS)),
      privateKey: 'privateKey',
      publicKey: 'publicKey',
      symbol: 'BTCUSDT',
      sizeDeposit: 10,
      leverage: 1,
      stoploss: 5,
      botStatus: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
