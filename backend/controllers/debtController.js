const { Debt, Payment, Reminder } = require('../models');

async function listDebts(req, res) {
  try {
    const debts = await Debt.findAll({ where: { user_id: req.user.id }, order: [['due_date','ASC']] });
    res.json(debts);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener deudas', error: err.message });
  }
}

async function payDebt(req, res) {
  try {
    const debtId = req.params.id;
    const debt = await Debt.findOne({ where: { id: debtId, user_id: req.user.id } });
    if (!debt) return res.status(404).json({ message: 'Deuda no encontrada' });
    debt.status = 'paid';
    await debt.save();
    await Payment.create({ debt_id: debt.id, amount: debt.amount });
    res.json({ message: 'Deuda marcada como pagada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al marcar deuda como pagada', error: err.message });
  }
}

module.exports = { listDebts, payDebt };
