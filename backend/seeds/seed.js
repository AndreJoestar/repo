require('dotenv').config();
const { sequelize, User, Debt, Loan } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    let user = await User.findOne({ where: { email: 'test@user.com' } });
    if (!user) {
      user = await User.create({ name: 'Test User', email: 'test@user.com', password: 'password' });
      console.log('Usuario creado: test@user.com / password');
    } else {
      console.log('Usuario de prueba ya existe');
    }

    let loan = await Loan.findOne({ where: { user_id: user.id, name: 'Prestamo Auto Familiar' } });
    if (!loan) {
      loan = await Loan.create({
        user_id: user.id,
        name: 'Prestamo Auto Familiar',
        principal_amount: 12000,
        total_installments: 3,
        start_date: '2025-09-01'
      });

      await Debt.bulkCreate([
        { user_id: user.id, loan_id: loan.id, installment_number: 1, name: 'Cuota 1', amount: 400.00, due_date: '2025-10-05', status: 'pending' },
        { user_id: user.id, loan_id: loan.id, installment_number: 2, name: 'Cuota 2', amount: 400.00, due_date: '2025-11-05', status: 'pending' },
        { user_id: user.id, loan_id: loan.id, installment_number: 3, name: 'Cuota 3', amount: 400.00, due_date: '2025-12-05', status: 'pending' }
      ]);
      console.log('Prestamo de ejemplo creado con cuotas.');
    } else {
      console.log('Prestamo de ejemplo ya existe.');
    }

    const standaloneDebts = [
      { user_id: user.id, name: 'Tarjeta Visa', amount: 120.50, due_date: '2025-10-08', status: 'pending' },
      { user_id: user.id, name: 'Servicios Hogar', amount: 75.25, due_date: '2025-10-20', status: 'pending' }
    ];

    for (const debt of standaloneDebts) {
      const existing = await Debt.findOne({ where: { user_id: user.id, name: debt.name, due_date: debt.due_date } });
      if (!existing) {
        await Debt.create(debt);
        console.log(`Deuda creada: ${debt.name}`);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
