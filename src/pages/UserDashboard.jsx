import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { COMPETITIONS, EVENT } from '../data/eventData.js';

const catColors = { Technical:'var(--accent-cyan)', Cultural:'var(--accent-pink)', Gaming:'var(--accent-violet)', Academic:'var(--accent-gold)', Creative:'var(--accent-green)', Sports:'#ff8c42' };

export default function UserDashboard({ bookings, setActiveTab }) {
  const { currentUser } = useAuth();
  const [activeTab, setTab] = useState('overview');

  // Only show this user's bookings
  const myBookings = bookings.filter(b =>
    b.email === currentUser?.email || b.name === currentUser?.name
  );

  const confirmed = myBookings.filter(b=>b.status==='confirmed');
  const totalSpent = confirmed.reduce((s,b)=>s+b.total,0);
  const totalTickets = confirmed.reduce((s,b)=>s+b.qty,0);
  const allMyComps = confirmed.flatMap(b=>b.competitions||[]);
  const myCompObjects = allMyComps.map(id=>COMPETITIONS.find(c=>c.id===id)).filter(Boolean);

  const TABS = [
    { key:'overview',     icon:'', label:'Overview' },
    { key:'mytickets',    icon:'', label:'My Tickets' },
    { key:'competitions', icon:'', label:'My Competitions' },
    { key:'profile',      icon:'', label:'Profile' },
  ];

  return (
    <div className="page" style={{paddingTop:64}}>
      <div style={{display:'flex',minHeight:'calc(100vh - 64px)'}}>

        {/* Sidebar */}
        <div style={{width:220,background:'var(--bg-card)',borderRight:'1px solid var(--border)',padding:'24px 0',flexShrink:0}}>
          {/* User card */}
          <div style={{padding:'0 20px 24px',borderBottom:'1px solid var(--border)',marginBottom:16}}>
            <div style={{width:52,height:52,borderRadius:'50%',background:'linear-gradient(135deg,var(--accent-cyan),var(--accent-violet))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',fontWeight:700,color:'#fff',marginBottom:10}}>
              {currentUser?.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
            </div>
            <div style={{fontWeight:700,color:'var(--text-primary)',fontSize:'0.9rem'}}>{currentUser?.name}</div>
            <div style={{fontSize:'0.72rem',color:'var(--text-muted)',marginTop:2}}>{currentUser?.dept}</div>
            <div style={{fontSize:'0.68rem',color:'var(--accent-cyan)',marginTop:4}}>{currentUser?.email}</div>
          </div>

          {TABS.map(t=>(
            <button key={t.key} onClick={()=>setTab(t.key)}
              style={{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'11px 20px',border:'none',background:activeTab===t.key?'rgba(0,212,255,0.08)':'transparent',color:activeTab===t.key?'var(--accent-cyan)':'var(--text-secondary)',fontSize:'0.84rem',fontWeight:activeTab===t.key?600:400,cursor:'pointer',fontFamily:'var(--font-body)',borderLeft:`3px solid ${activeTab===t.key?'var(--accent-cyan)':'transparent'}`,textAlign:'left',transition:'all 0.2s'}}>
              {t.icon && <span>{t.icon}</span>} {t.label}
            </button>
          ))}

          <div style={{padding:'16px 20px',borderTop:'1px solid var(--border)',marginTop:'auto'}}>
            <div style={{fontSize:'0.68rem',color:'var(--text-muted)',marginBottom:6}}>LIVE STATS</div>
            <div style={{fontSize:'0.78rem',color:'var(--text-secondary)',lineHeight:2}}>
              <div><span style={{color:'var(--accent-cyan)',fontWeight:700}}>{totalTickets}</span> Tickets</div>
              <div><span style={{color:'var(--accent-gold)',fontWeight:700}}>₹{totalSpent}</span> Spent</div>
              <div><span style={{color:'var(--accent-green)',fontWeight:700}}>{myCompObjects.length}</span> Competitions</div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div style={{flex:1,padding:'28px 32px',overflowY:'auto'}}>

          {/* Overview Tab */}
          {activeTab==='overview'&&(
            <div>
              <h2 style={{fontFamily:'var(--font-display)',fontSize:'1.2rem',marginBottom:24,color:'var(--text-primary)'}}>
                Welcome back, <span style={{color:'var(--accent-cyan)'}}>{currentUser?.name?.split(' ')[0]}</span>
              </h2>

              {/* Stat cards */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:16,marginBottom:32}}>
                {[
                  {label:'Tickets Booked',value:totalTickets,color:'var(--accent-cyan)',icon:'🎟'},
                  {label:'Total Spent',value:`₹${totalSpent}`,color:'var(--accent-gold)',icon:'💰'},
                  {label:'Competitions',value:myCompObjects.length,color:'var(--accent-violet)',icon:'🏆'},
                  {label:'Events',value:confirmed.length,color:'var(--accent-green)',icon:'📅'},
                ].map((s,i)=>(
                  <div key={i} style={{background:'var(--bg-card2)',border:'1px solid var(--border)',borderRadius:14,padding:'18px 20px'}}>
                    <div style={{fontFamily:'var(--font-display)',fontSize:'1.4rem',fontWeight:700,color:s.color}}>{s.value}</div>
                    <div style={{fontSize:'0.72rem',color:'var(--text-muted)',marginTop:4}}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:14,padding:'20px 24px',marginBottom:24}}>
                <div style={{fontSize:'0.78rem',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:16}}>Quick Actions</div>
                <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                  <button className="btn btn-primary" style={{padding:'10px 20px',fontSize:'0.82rem', fontWeight: 600, letterSpacing: '0.5px'}} onClick={()=>setActiveTab('booking')}>
                    BOOK MORE TICKETS
                  </button>
                  <button className="btn btn-outline" style={{padding:'10px 20px',fontSize:'0.82rem', fontWeight: 600, letterSpacing: '0.5px'}} onClick={()=>setTab('mytickets')}>
                    VIEW MY TICKETS
                  </button>
                  <button className="btn btn-outline" style={{padding:'10px 20px',fontSize:'0.82rem', fontWeight: 600, letterSpacing: '0.5px'}} onClick={()=>setActiveTab('event')}>
                    EVENT DETAILS
                  </button>
                </div>
              </div>

              {/* My competitions preview */}
              {myCompObjects.length>0&&(
                <div style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:14,padding:'20px 24px'}}>
                  <div style={{fontSize:'0.78rem',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:14}}>Registered Competitions</div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:10}}>
                    {myCompObjects.map(c=>(
                      <div key={c.id} style={{display:'flex',alignItems:'center',gap:8,background:`${catColors[c.category]}12`,border:`1px solid ${catColors[c.category]}30`,borderRadius:10,padding:'8px 14px'}}>
                        <span style={{width: 4, height: 24, borderRadius: 2, background: catColors[c.category], marginRight: 6}}></span>
                        <div>
                          <div style={{fontSize:'0.8rem',fontWeight:600,color:'var(--text-primary)'}}>{c.name}</div>
                          <div style={{fontSize:'0.65rem',color:catColors[c.category]}}>{c.category} · {c.prize}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {myBookings.length===0&&(
                <div style={{textAlign:'center',padding:'60px 20px',color:'var(--text-muted)'}}>
                  <div style={{fontSize:'1rem',marginBottom:8,color:'var(--text-secondary)'}}>No bookings yet</div>
                  <div style={{fontSize:'0.82rem',marginBottom:24}}>Book your ticket for TechNova 2025 and register for competitions!</div>
                  <button className="btn btn-primary" onClick={()=>setActiveTab('booking')}>Book Now — ₹299</button>
                </div>
              )}
            </div>
          )}

          {/* My Tickets Tab */}
          {activeTab==='mytickets'&&(
            <div>
              <h2 style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',marginBottom:24}}>My Tickets</h2>
              {myBookings.length===0 ? (
                <div style={{textAlign:'center',padding:'60px 20px',color:'var(--text-muted)'}}>
                  <div>No tickets booked yet.</div>
                  <button className="btn btn-primary" style={{marginTop:16}} onClick={()=>setActiveTab('booking')}>Book Now</button>
                </div>
              ) : myBookings.map(b=>(
                <div key={b.id} style={{background:'var(--bg-card)',border:`1px solid ${b.status==='confirmed'?'rgba(0,255,136,0.2)':'rgba(247,37,133,0.2)'}`,borderRadius:14,padding:'20px 24px',marginBottom:16}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:'0.95rem',color:'var(--text-primary)',marginBottom:4}}>{b.eventName||EVENT.name}</div>
                      <div style={{fontSize:'0.72rem',color:'var(--text-muted)',fontFamily:'monospace'}}>{b.bookingId||b.id}</div>
                    </div>
                    <span style={{padding:'4px 12px',borderRadius:20,fontSize:'0.72rem',fontWeight:700,background:b.status==='confirmed'?'rgba(0,255,136,0.1)':'rgba(247,37,133,0.1)',color:b.status==='confirmed'?'var(--accent-green)':'var(--accent-pink)',border:`1px solid ${b.status==='confirmed'?'rgba(0,255,136,0.25)':'rgba(247,37,133,0.25)'}`}}>
                      {b.status}
                    </span>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))',gap:12}}>
                    {[
                      {label:'Date',value:b.date},
                      {label:'Tickets',value:b.qty},
                      {label:'Amount',value:`₹${b.total}`},
                      {label:'Dept',value:b.dept},
                    ].map(f=>(
                      <div key={f.label}>
                        <div style={{fontSize:'0.62rem',color:'var(--text-muted)',marginBottom:2}}>{f.label}</div>
                        <div style={{fontSize:'0.82rem',fontWeight:600,color:'var(--text-primary)'}}>{f.value}</div>
                      </div>
                    ))}
                  </div>
                  {(b.competitions||[]).length>0&&(
                    <div style={{marginTop:14,paddingTop:14,borderTop:'1px solid var(--border)'}}>
                      <div style={{fontSize:'0.65rem',color:'var(--text-muted)',marginBottom:8}}>REGISTERED COMPETITIONS</div>
                      <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                        {(b.competitions||[]).map(id=>{
                          const c=COMPETITIONS.find(x=>x.id===id);
                          return c?<span key={id} style={{fontSize:'0.72rem',padding:'3px 10px',borderRadius:6,background:'rgba(124,58,237,0.1)',border:'1px solid rgba(124,58,237,0.2)',color:'var(--text-secondary)'}}>{c.name}</span>:null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Competitions Tab */}
          {activeTab==='competitions'&&(
            <div>
              <h2 style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',marginBottom:24}}>My Competitions</h2>
              {myCompObjects.length===0 ? (
                <div style={{textAlign:'center',padding:'60px 20px',color:'var(--text-muted)'}}>
                  <div>No competitions registered yet.</div>
                  <button className="btn btn-primary" style={{marginTop:16}} onClick={()=>setActiveTab('booking')}>Book & Register</button>
                </div>
              ) : (
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:16}}>
                  {myCompObjects.map(c=>(
                    <div key={c.id} style={{background:'var(--bg-card)',border:`1px solid ${catColors[c.category]}30`,borderRadius:14,padding:'20px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                        <span style={{width: 8, height: 24, borderRadius: 4, background: catColors[c.category]}}></span>
                        <span style={{fontSize:'0.65rem',fontWeight:700,padding:'3px 8px',borderRadius:6,background:`${catColors[c.category]}18`,color:catColors[c.category]}}>{c.category}</span>
                      </div>
                      <div style={{fontWeight:700,color:'var(--text-primary)',marginBottom:6}}>{c.name}</div>
                      <div style={{fontSize:'0.76rem',color:'var(--text-muted)',marginBottom:12,lineHeight:1.5}}>{c.desc}</div>
                      <div style={{display:'flex',justifyContent:'space-between',paddingTop:10,borderTop:'1px solid var(--border)'}}>
                        <span style={{fontSize:'0.72rem',color:'var(--text-muted)'}}>Team: {c.maxTeam===1?'Solo':`Up to ${c.maxTeam}`}</span>
                        <span style={{fontWeight:700,color:'var(--accent-gold)',fontSize:'0.82rem'}}>{c.prize}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab==='profile'&&(
            <div>
              <h2 style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',marginBottom:24}}>Profile</h2>
              <div style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:14,padding:'28px 32px',maxWidth:480}}>
                <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:28}}>
                  <div style={{width:64,height:64,borderRadius:'50%',background:'linear-gradient(135deg,var(--accent-cyan),var(--accent-violet))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem',fontWeight:700,color:'#fff'}}>
                    {currentUser?.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{fontWeight:700,fontSize:'1.1rem',color:'var(--text-primary)'}}>{currentUser?.name}</div>
                    <div style={{fontSize:'0.78rem',color:'var(--text-muted)',marginTop:2}}>Student · {currentUser?.dept}</div>
                  </div>
                </div>
                {[
                  {label:'Full Name',value:currentUser?.name},
                  {label:'Email',value:currentUser?.email},
                  {label:'Department',value:currentUser?.dept},
                  {label:'User ID',value:currentUser?.id},
                  {label:'Role',value:'Student / Attendee'},
                ].map(f=>(
                  <div key={f.label} style={{display:'flex',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid var(--border)'}}>
                    <span style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>{f.label}</span>
                    <span style={{fontSize:'0.82rem',fontWeight:600,color:'var(--text-primary)'}}>{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
