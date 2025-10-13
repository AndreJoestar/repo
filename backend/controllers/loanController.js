const { sequelize, Loan, Debt } = require('../models');

function normalizeInstallments(installments) {
  return (installments || []).map((item, idx) => ({
    name: item.name && item.name.trim() ? item.name.trim() : `Cuota ${idx + 1}`,
    amount: Number(item.amount),
    due_date: item.due_date,
    installment_number: item.installment_number ? Number(item.installment_number) : idx + 1
  }));
}

async function listLoans(req, res) {
  try {
    const loans = await Loan.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Debt,
          as: 'installments'
        }
      ],
      order: [['id', 'ASC']]
    });

    const payload = loans.map((loan) => {
      const plain = loan.toJSON();
      const installments = (plain.installments || []).sort((a, b) => {
        if (a.due_date === b.due_date) {
          return (a.installment_number || 0) - (b.installment_number || 0);
        }
        return new Date(a.due_date) - new Date(b.due_date);
      });
      const total = plain.total_installments || installments.length;
      const paid = installments.filter((inst) => inst.status === 'paid').length;
      const pendingList = installments.filter((inst) => inst.status === 'pending');
      const nextDue = pendingList.length > 0 ? pendingList[0].due_date : null;
      return {
        id: plain.id,
        name: plain.name,
        principal_amount: plain.principal_amount,
        interest_rate: plain.interest_rate,
        total_installments: total,
        start_date: plain.start_date,
        notes: plain.notes,
        paid_installments: paid,
        pending_installments: pendingList.length,
        next_due: nextDue,
        installments: installments.map((inst) => ({
          id: inst.id,
          loan_id: inst.loan_id,
          name: inst.name,
          amount: inst.amount,
          due_date: inst.due_date,
          status: inst.status,
          installment_number: inst.installment_number
        }))
      };
    });

    res.json(payload);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener prestamos', error: err.message });
  }
}

async function createLoan(req, res) {
  const { name, principal_amount, interest_rate, start_date, notes, installments } = req.body;

  if (!name || !Array.isArray(installments) || installments.length === 0) {
    return res.status(400).json({ message: 'Nombre del prestamo e informacion de cuotas requeridos' });
  }

  const normalizedInstallments = normalizeInstallments(installments);
  if (normalizedInstallments.some((inst) => Number.isNaN(inst.amount) || !inst.due_date)) {
    return res.status(400).json({ message: 'Cada cuota debe incluir monto numerico y fecha de vencimiento' });
  }

  const t = await sequelize.transaction();
  try {
    const loan = await Loan.create({
      user_id: req.user.id,
      name: name.trim(),
      principal_amount: principal_amount !== undefined && principal_amount !== null && principal_amount !== ''
        ? Number(principal_amount)
        : null,
      interest_rate: interest_rate !== undefined && interest_rate !== null && interest_rate !== ''
        ? Number(interest_rate)
        : null,
      total_installments: normalizedInstallments.length,
      start_date: start_date || null,
      notes: notes || null
    }, { transaction: t });

    const debtPayload = normalizedInstallments.map((inst) => ({
      user_id: req.user.id,
      loan_id: loan.id,
      name: inst.name,
      installment_number: inst.installment_number,
      amount: inst.amount,
      due_date: inst.due_date,
      status: 'pending'
    }));

    await Debt.bulkCreate(debtPayload, { transaction: t });
    await t.commit();

    const created = await Loan.findByPk(loan.id, {
      include: [{ model: Debt, as: 'installments' }]
    });
    const plain = created.toJSON();
    res.status(201).json({
      id: plain.id,
      name: plain.name,
      principal_amount: plain.principal_amount,
      interest_rate: plain.interest_rate,
      total_installments: plain.total_installments,
      start_date: plain.start_date,
      notes: plain.notes,
      installments: plain.installments.map((inst) => ({
        id: inst.id,
        loan_id: inst.loan_id,
        name: inst.name,
        amount: inst.amount,
        due_date: inst.due_date,
        status: inst.status,
        installment_number: inst.installment_number
      }))
    });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: 'Error al crear prestamo', error: err.message });
  }
}

module.exports = { listLoans, createLoan };
