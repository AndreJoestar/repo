import React, { useState } from "react";

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [debts, setDebts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || err.error || "Credenciales incorrectas");
      }
      const data = await res.json();
      setUser(data.user);
      setToken(data.token);

      const debtsRes = await fetch(`${API}/api/debts`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      const debtsData = await debtsRes.json();
      setDebts(debtsData);

      const soon = debtsData.filter(
        (x) => x.status !== "paid" && new Date(x.due_date) <= new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
      );
      setNotifications(soon.map((x) => ({ id: x.id, text: `Pago próximo: ${x.name} - S/ ${x.amount} el ${x.due_date}` })));
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markPaid = async (id) => {
    try {
      await fetch(`http://localhost:4000/api/debts/${id}/pay`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setDebts(ds => ds.map(d => d.id===id ? {...d, status:'paid'} : d));
      setNotifications(n => n.filter(no => no.id !== id));
    } catch {
      alert('Error al marcar pagado');
    }
  };

  const addReminder = async (id) => {
    try {
      await fetch(`http://localhost:4000/api/reminders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ debt_id: id }),
      });
      alert('Recordatorio agregado');
    } catch {
      alert('Error al crear recordatorio');
    }
  };

  if (!token) {
    return (
      <div style={{ maxWidth:420, margin:'40px auto', padding:20, border:'1px solid #ccc', borderRadius:8 }}>
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom:8 }}>
            <label style={{ display:'block', marginBottom:4 }}>Email</label>
            <input style={{ width:'100%', padding:8 }} value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="test@user.com" />
          </div>
          <div style={{ marginBottom:8 }}>
            <label style={{ display:'block', marginBottom:4 }}>Contraseña</label>
            <input type="password" style={{ width:'100%', padding:8 }} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="password" />
          </div>
          <div>
            <button type="submit" style={{ padding:'8px 12px' }} disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth:980, margin:'20px auto', display:'grid', gridTemplateColumns:'1fr 320px', gap:20 }}>
      <div>
        <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h2>Dashboard - {user.name}</h2>
          <button onClick={() => { setUser(null); setToken(null); setDebts([]); setNotifications([]); }}>Cerrar sesión</button>
        </header>
        <section style={{ marginTop:18 }}>
          <h3>Deudas</h3>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign:'left', padding:6 }}>Deuda</th>
                <th style={{ textAlign:'left', padding:6 }}>Vencimiento</th>
                <th style={{ textAlign:'left', padding:6 }}>Monto</th>
                <th style={{ textAlign:'left', padding:6 }}>Estado</th>
                <th style={{ textAlign:'left', padding:6 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {debts.map(d => (
                <tr key={d.id} style={{ borderTop:'1px solid #eee' }}>
                  <td style={{ padding:8 }}>{d.name}</td>
                  <td style={{ padding:8 }}>{d.due_date}</td>
                  <td style={{ padding:8 }}>{Number(d.amount).toFixed(2)}</td>
                  <td style={{ padding:8 }}>{d.status === 'paid' ? 'Pagado' : 'Pendiente'}</td>
                  <td style={{ padding:8 }}>
                    {d.status !== 'paid' && <button style={{ marginRight:8 }} onClick={() => markPaid(d.id)}>Marcar pagado</button>}
                    {d.status !== 'paid' && <button onClick={() => addReminder(d.id)}>Recordarme</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
      <aside style={{ borderLeft:'1px solid #ddd', paddingLeft:16 }}>
        <h3>Notificaciones</h3>
        {notifications.length === 0 ? <p>No hay notificaciones</p> : <ul>{notifications.map(n => <li key={n.id} style={{ marginBottom:8 }}>{n.text}</li>)}</ul>}
      </aside>
    </div>
  );
}
