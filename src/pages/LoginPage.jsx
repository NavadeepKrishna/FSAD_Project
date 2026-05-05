import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage({ setActiveTab, onSwitchToRegister }) {
  const { login } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPass]     = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  function handleLogin() {
    setError('');
    if (!email.trim())  { setError('Email is required.'); return; }
    if (!password)      { setError('Password is required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email address.'); return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = login(email.trim(), password);
      setLoading(false);
      if (result.success) {
        setActiveTab(result.role === 'admin' ? 'admin' : 'home');
      } else {
        setError(result.error);
      }
    }, 600);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleLogin();
  }

  return (
    <div className="page" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'calc(100vh - 64px)' }}>
      <div className="animate-fadeUp" style={{
        background:'var(--bg-card)', border:'1px solid var(--border)',
        borderRadius:20, padding:'40px 36px', width:'100%', maxWidth:440,
        boxShadow:'var(--shadow-glow)',
      }}>
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <h1 style={{
            fontFamily:'var(--font-display)', fontSize:'1.5rem', fontWeight:900,
            background:'linear-gradient(135deg,#fff,var(--accent-cyan))',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:8,
          }}>TECHNOVA 2025</h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.82rem' }}>Sign in to your account</p>
        </div>

        <div autoComplete="off">
          {/* Email */}
          <div className="form-group" style={{ marginBottom:18 }}>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              id="login-email"
              name="login-email"
              autoComplete="username"
              className={`form-input ${error && !email.trim() ? 'error' : ''}`}
              placeholder="you@college.ac.in"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Password */}
          <div className="form-group" style={{ marginBottom:8, position:'relative' }}>
            <label className="form-label">Password</label>
            <input
              type={showPass ? 'text' : 'password'}
              id="login-password"
              name="login-password"
              autoComplete="current-password"
              className={`form-input ${error && !password ? 'error' : ''}`}
              placeholder="Enter your password"
              value={password}
              onChange={e => { setPass(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              style={{ paddingRight:44 }}
            />
            <button
              type="button"
              onClick={() => setShowPass(p => !p)}
              style={{ position:'absolute', right:14, top:36, background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', fontSize:'1rem' }}
            >
              {showPass ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              color:'var(--accent-pink)', fontSize:'0.8rem', margin:'12px 0',
              background:'rgba(247,37,133,0.08)', borderRadius:8, padding:'8px 12px',
              border:'1px solid rgba(247,37,133,0.2)', animation:'slideDown 0.3s ease',
            }}>
              ⚠ {error}
            </div>
          )}

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleLogin}
            style={{ width:'100%', marginTop:16, fontSize:'0.95rem', padding:'13px 0', opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'SIGN IN'}
          </button>
        </div>

        <div style={{ textAlign:'center', marginTop:22, fontSize:'0.82rem', color:'var(--text-muted)' }}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            style={{ background:'none', border:'none', color:'var(--accent-cyan)', cursor:'pointer', fontWeight:600, fontSize:'0.82rem' }}
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
}
