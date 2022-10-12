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
      leverage: 1,
      stoploss: 10,
      sizeDeposit: 20,
      balance: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
    await queryInterface.bulkInsert('Positions', [{
      symbol: 'BTCUSDT',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
    await queryInterface.bulkInsert('Bots', [{
      user_id: 1,
      botStatus: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
    await queryInterface.bulkInsert('PositionsUsers', [{
      user_id: 1,
      position_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
    await queryInterface.bulkInsert('Users', [{
      name: 'Garegin',
      email: 'papyangaregin@gmail.com',
      password: await bcrypt.hash('123', Number(process.env.SALTROUNDS)),
      privateKey: 'privateKey',
      publicKey: 'publicKey',
      leverage: 1,
      stoploss: 10,
      sizeDeposit: 20,
      balance: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
    await queryInterface.bulkInsert('Positions', [{
      symbol: 'ETHUSDT',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
    await queryInterface.bulkInsert('Bots', [{
      user_id: 2,
      botStatus: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
    await queryInterface.bulkInsert('PositionsUsers', [{
      user_id: 2,
      position_id: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
    await queryInterface.bulkInsert('Users', [{
      name: 'Garegin',
      email: 'test@gmail.com',
      password: await bcrypt.hash('123', Number(process.env.SALTROUNDS)),
      privateKey: 'privateKey',
      publicKey: 'publicKey',
      leverage: 1,
      stoploss: 10,
      sizeDeposit: 20,
      balance: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
    await queryInterface.bulkInsert('Positions', [{
      symbol: 'ETHUSDT',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
    await queryInterface.bulkInsert('Bots', [{
      user_id: 3,
      botStatus: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
    await queryInterface.bulkInsert('PositionsUsers', [{
      user_id: 3,
      position_id: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
    await queryInterface.bulkInsert('Users', [{
      name: 'Garegin',
      email: 'test@yandex.com',
      password: await bcrypt.hash('123', Number(process.env.SALTROUNDS)),
      privateKey: 'privateKey',
      publicKey: 'publicKey',
      leverage: 1,
      stoploss: 10,
      sizeDeposit: 20,
      balance: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
    await queryInterface.bulkInsert('Positions', [{
      symbol: 'ETHUSDT',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
    await queryInterface.bulkInsert('Bots', [{
      user_id: 4,
      botStatus: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
    await queryInterface.bulkInsert('PositionsUsers', [{
      user_id: 4,
      position_id: 4,
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
