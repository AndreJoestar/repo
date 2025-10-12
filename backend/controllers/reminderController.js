const { Reminder, Debt } = require('../models');

async function createReminder(req, res) {
  try {
    const { debt_id, remind_at } = req.body;
    if (!debt_id) return res.status(400).json({ message: 'debt_id requerido' });
    const debt = await Debt.findOne({ where: { id: debt_id, user_id: req.user.id } });
    if (!debt) return res.status(404).json({ message: 'Deuda no encontrada' });
    const remindDate = remind_at ? new Date(remind_at) : new Date(debt.due_date + 'T09:00:00');
    const r = await Reminder.create({ user_id: req.user.id, debt_id, remind_at: remindDate });
    res.status(201).json(r);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear reminder', error: err.message });
  }
}

module.exports = { createReminder };
