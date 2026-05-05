import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar({ activeTab, setActiveTab, bookingCount }) {
  const { currentUser, logout } = useAuth();

  const publicTabs = [
    { key:'home',  label:'Home' },
    { key:'event', label:'Event Info' },
  ];
  const userTabs = [
    { key:'home',      label:'Home' },
    { key:'event',     label:'Event Info' },
    { key:'booking',   label:'Book Tickets' },
    { key:'dashboard', label:'My Dashboard' },
  ];
  const adminTabs = [
    { key:'home',  label:'Home' },
    { key:'event', label:'Event Info' },
    { key:'admin', label:'Admin Dashboard', badge: bookingCount },
  ];

  const tabs = !currentUser ? publicTabs : currentUser.role==='admin' ? adminTabs : userTabs;

  function handleLogout() { logout(); setActiveTab('home'); }

  return (
    <nav className="nav" style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
      <div className="nav-brand" style={{cursor:'pointer'}} onClick={()=>setActiveTab('home')}>
        ⚡ TECHNOVA
      </div>

      <div className="nav-tabs" style={{flex:1,justifyContent:'center'}}>
        {tabs.map(t=>(
          <button key={t.key}
            className={`nav-tab ${activeTab===t.key?'active':''}`}
            onClick={()=>setActiveTab(t.key)}>
            {t.label}
            {t.badge!==undefined&&<span className="nav-badge">{t.badge}</span>}
          </button>
        ))}
      </div>

      <div style={{display:'flex',alignItems:'center',gap:10}}>
        {currentUser ? (
          <>
            <div style={{display:'flex',alignItems:'center',gap:8,background:'rgba(0,212,255,0.07)',border:'1px solid rgba(0,212,255,0.2)',borderRadius:30,padding:'6px 14px',fontSize:'0.78rem',cursor:'pointer'}}
              onClick={()=>currentUser.role==='user'&&setActiveTab('dashboard')}>
              <div style={{width:26,height:26,borderRadius:'50%',background:'linear-gradient(135deg,var(--accent-cyan),var(--accent-violet))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.65rem',fontWeight:700,color:'#fff',flexShrink:0}}>
                {currentUser.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
              </div>
              <span style={{color:'var(--text-secondary)'}}>{currentUser.name}</span>
              {currentUser.role==='admin'&&(
                <span style={{background:'var(--accent-gold)',color:'#000',fontSize:'0.58rem',fontWeight:700,padding:'2px 6px',borderRadius:4}}>ADMIN</span>
              )}
            </div>
            <button onClick={handleLogout} style={{background:'rgba(247,37,133,0.08)',border:'1px solid rgba(247,37,133,0.25)',color:'var(--accent-pink)',borderRadius:8,padding:'7px 14px',fontSize:'0.78rem',fontWeight:600,cursor:'pointer',fontFamily:'var(--font-body)'}}>
              Logout
            </button>
          </>
        ) : (
          <button onClick={()=>setActiveTab('login')} className="btn btn-primary" style={{padding:'8px 18px',fontSize:'0.82rem'}}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
