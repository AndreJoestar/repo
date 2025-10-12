require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, User, Debt } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const password = 'password';
    const hash = await bcrypt.hash(password, 10);

    let user = await User.findOne({ where: { email: 'test@user.com' } });
    if (!user) {
      user = await User.create({ name: 'Test User', email: 'test@user.com', password_hash: hash });
      console.log('Usuario creado: test@user.com / password');
    } else {
      console.log('Usuario de prueba ya existe');
    }

    const existing = await Debt.findAll({ where: { user_id: user.id } });
    if (existing.length === 0) {
      await Debt.bulkCreate([
        { user_id: user.id, name: 'Crédito Auto', amount: 300.00, due_date: '2025-10-15', status: 'pending' },
        { user_id: user.id, name: 'Tarjeta Visa', amount: 120.50, due_date: '2025-10-08', status: 'pending' },
        { user_id: user.id, name: 'Préstamo Estudiantil', amount: 75.25, due_date: '2025-11-01', status: 'pending' }
      ]);
      console.log('Deudas de ejemplo creadas.');
    } else {
      console.log('Deudas ya existentes.');
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
