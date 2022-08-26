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
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Aik',
      email: 'aikpapyan@mail.ru',
      password: await bcrypt.hash('123', Number(process.env.SALTROUNDS)),
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
