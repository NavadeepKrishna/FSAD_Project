import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { DEPARTMENTS } from '../data/eventData.js';

export default function RegisterPage({ setActiveTab, onSwitchToLogin }) {
  const { registerUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', dept: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate() {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 3) e.name = 'Name must be at least 3 characters.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.dept) e.dept = 'Please select your department.';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match.';
    return e;
  }

  function handleChange(field, val) {
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  }

  function handleRegister() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => {
      const result = registerUser({ name: form.name.trim(), email: form.email.trim(), password: form.password, dept: form.dept });
      setLoading(false);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => setActiveTab('home'), 1500);
      } else {
        setErrors({ email: result.error });
      }
    }, 600);
  }

  if (success) {
    return (
      <div className="page" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'calc(100vh - 64px)' }}>
        <div className="animate-fadeUp" style={{ textAlign:'center', padding:40 }}>
          <h2 style={{ fontFamily:'var(--font-display)', color:'var(--accent-cyan)', marginBottom:8 }}>Account Created!</h2>
          <p style={{ color:'var(--text-secondary)' }}>Welcome to TechNova 2025. Redirecting you to home...</p>
        </div>
      </div>
    );
  }

  const Field = ({ id, label, children }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {children}
      {errors[id] && <div className="form-error">⚠ {errors[id]}</div>}
    </div>
  );

  const passStrength = form.password.length === 0 ? null
    : form.password.length < 6  ? { w:'25%',  color:'var(--accent-pink)',  label:'Weak' }
    : form.password.length < 10 ? { w:'60%',  color:'var(--accent-gold)',  label:'Medium' }
    :                              { w:'100%', color:'var(--accent-green)', label:'Strong' };

  return (
    <div className="page" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'calc(100vh - 64px)', padding:'24px 16px' }}>
      <div className="animate-fadeUp" style={{
        background:'var(--bg-card)', border:'1px solid var(--border)',
        borderRadius:20, padding:'40px 36px', width:'100%', maxWidth:480,
        boxShadow:'var(--shadow-glow)',
      }}>
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <h1 style={{
            fontFamily:'var(--font-display)', fontSize:'1.4rem', fontWeight:900,
            background:'linear-gradient(135deg, #fff, var(--accent-cyan))',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:6,
          }}>Create Account</h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.82rem' }}>Register to book tickets for TechNova 2025</p>
        </div>

        {/*
          autoComplete="off" on the wrapper div stops Chrome from
          autofilling the whole form.
          Individual fields also get specific autoComplete values.
        */}
        <div autoComplete="off">

          <div className="form-row">
            <Field id="name" label="Full Name *">
              <input
                type="text"
                id="reg-name"
                name="reg-name"
                autoComplete="new-password"
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="e.g. Arjun Mehta"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
              />
            </Field>
            <Field id="dept" label="Department *">
              <select
                id="reg-dept"
                name="reg-dept"
                autoComplete="off"
                className={`form-select ${errors.dept ? 'error' : ''}`}
                value={form.dept}
                onChange={e => handleChange('dept', e.target.value)}
              >
                <option value="">Select department…</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
          </div>

          <Field id="email" label="Email Address *">
            <input
              type="email"
              id="reg-email"
              name="reg-email"
              autoComplete="new-password"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="you@svce.ac.in"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
            />
          </Field>

          <div className="form-row">
            <Field id="password" label="Password *">
              <div style={{ position:'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  id="reg-password"
                  name="reg-password"
                  autoComplete="new-password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => handleChange('password', e.target.value)}
                  style={{ paddingRight:44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{ position:'absolute', right:14, top:12, background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </Field>
            <Field id="confirm" label="Confirm Password *">
              <input
                type={showPass ? 'text' : 'password'}
                id="reg-confirm"
                name="reg-confirm"
                autoComplete="new-password"
                className={`form-input ${errors.confirm ? 'error' : ''}`}
                placeholder="Re-enter password"
                value={form.confirm}
                onChange={e => handleChange('confirm', e.target.value)}
              />
            </Field>
          </div>

          {/* Password strength bar */}
          {passStrength && (
            <div style={{ marginBottom:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.72rem', color:'var(--text-muted)', marginBottom:4 }}>
                <span>Password strength</span>
                <span style={{ color: passStrength.color, fontWeight:600 }}>{passStrength.label}</span>
              </div>
              <div style={{ height:4, background:'var(--bg-deep)', borderRadius:2, overflow:'hidden' }}>
                <div style={{
                  height:'100%', borderRadius:2,
                  transition:'width 0.3s, background 0.3s',
                  width: passStrength.w,
                  background: passStrength.color,
                }} />
              </div>
            </div>
          )}

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleRegister}
            style={{ width:'100%', fontSize:'0.95rem', padding:'13px 0', opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'CREATE ACCOUNT'}
          </button>

        </div>{/* end autoComplete wrapper */}

        <div style={{ textAlign:'center', marginTop:20, fontSize:'0.82rem', color:'var(--text-muted)' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            style={{ background:'none', border:'none', color:'var(--accent-cyan)', cursor:'pointer', fontWeight:600, fontSize:'0.82rem' }}
          >
            Sign in here
          </button>
        </div>
      </div>
    </div>
  );
}
