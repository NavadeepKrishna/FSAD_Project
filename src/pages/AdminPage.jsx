import { useState } from 'react';
import { EVENT, EVENTS_LIST } from '../data/eventData.js';
import { BarChart, DonutChart, SparkLine } from '../components/Charts.jsx';

const EMPTY_EVENT = { name:'', dept:'', date:'', venue:'', price:'', capacity:'' };

function AddEventModal({ onAdd, onClose }) {
  const [form, setForm] = useState(EMPTY_EVENT);
  const [errs, setErrs] = useState({});
  function validate() {
    const e={};
    if(!form.name.trim()) e.name='Required';
    if(!form.dept.trim()) e.dept='Required';
    if(!form.date) e.date='Required';
    if(!form.venue.trim()) e.venue='Required';
    if(!form.price||isNaN(form.price)||+form.price<=0) e.price='Valid price required';
    if(!form.capacity||isNaN(form.capacity)||+form.capacity<=0) e.capacity='Valid capacity required';
    return e;
  }
  function handleSubmit() {
    const e=validate();
    if(Object.keys(e).length){setErrs(e);return;}
    onAdd({ id:'EVT-'+Date.now(), ...form, price:+form.price, capacity:+form.capacity, sold:0, status:'upcoming' });
    onClose();
  }
  return (
    <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="modal-box" style={{maxWidth:520}}>
        <div className="modal-title">ADD NEW EVENT</div>
        <div className="form-row">
          {[{id:'name',label:'Event Name',ph:'TechFest 2025'},{id:'dept',label:'Department',ph:'CSE'}].map(f=>(
            <div className="form-group" key={f.id}>
              <label className="form-label">{f.label} *</label>
              <input type="text" className={`form-input ${errs[f.id]?'error':''}`} placeholder={f.ph}
                value={form[f.id]} onChange={e=>{setForm(v=>({...v,[f.id]:e.target.value}));setErrs(v=>({...v,[f.id]:''}));}} />
              {errs[f.id]&&<div className="form-error">⚠ {errs[f.id]}</div>}
            </div>
          ))}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Date *</label>
            <input type="date" className={`form-input ${errs.date?'error':''}`}
              value={form.date} onChange={e=>{setForm(v=>({...v,date:e.target.value}));setErrs(v=>({...v,date:''}));}} />
            {errs.date&&<div className="form-error">⚠ {errs.date}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Venue *</label>
            <input type="text" className={`form-input ${errs.venue?'error':''}`} placeholder="Auditorium A"
              value={form.venue} onChange={e=>{setForm(v=>({...v,venue:e.target.value}));setErrs(v=>({...v,venue:''}));}} />
            {errs.venue&&<div className="form-error">⚠ {errs.venue}</div>}
          </div>
        </div>
        <div className="form-row">
          {[{id:'price',label:'Ticket Price (Rs.)',ph:'299'},{id:'capacity',label:'Capacity',ph:'200'}].map(f=>(
            <div className="form-group" key={f.id}>
              <label className="form-label">{f.label} *</label>
              <input type="number" className={`form-input ${errs[f.id]?'error':''}`} placeholder={f.ph}
                value={form[f.id]} onChange={e=>{setForm(v=>({...v,[f.id]:e.target.value}));setErrs(v=>({...v,[f.id]:''}));}} />
              {errs[f.id]&&<div className="form-error">⚠ {errs[f.id]}</div>}
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:12,marginTop:8}}>
          <button className="btn btn-outline" style={{flex:1}} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{flex:1}} onClick={handleSubmit}>Add Event</button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ item, type, onConfirm, onClose }) {
  return (
    <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="modal-box" style={{textAlign:'center'}}>
        <div style={{fontSize:'3rem',marginBottom:16}}>!</div>
        <div className="modal-title" style={{color:'var(--accent-pink)',textAlign:'center'}}>Confirm Delete</div>
        <p style={{color:'var(--text-secondary)',marginBottom:24,fontSize:'0.88rem'}}>
          Delete {type==='booking'?`booking by ${item.name}`:`event "${item.name}"`}? This cannot be undone.
        </p>
        <div style={{display:'flex',gap:12}}>
          <button className="btn btn-outline" style={{flex:1}} onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" style={{flex:1}} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

const SIDEBAR = [
  {key:'overview', icon:'DASH', label:'Overview'},
  {key:'charts',   icon:'CHRT', label:'Analytics'},
  {key:'bookings', icon:'TKT',  label:'Bookings'},
  {key:'payments', icon:'PAY',  label:'Payments'},
  {key:'events',   icon:'EVT',  label:'Events'},
  {key:'users',    icon:'USR',  label:'Users'},
];

export default function AdminPage({ bookings, setBookings, availableTickets }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [search, setSearch]   = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [events, setEvents]   = useState(EVENTS_LIST);
  const [delTarget, setDelTarget] = useState(null);
  const [delType,   setDelType]   = useState(null);

  const confirmed = bookings.filter(b=>b.status==='confirmed');
  const totalRev  = confirmed.reduce((s,b)=>s+b.total,0);
  const totalSold = confirmed.reduce((s,b)=>s+b.qty,0);
  const uniqueDepts = [...new Set(bookings.map(b=>b.dept))].length;
  const cancelled = bookings.filter(b=>b.status==='cancelled').length;

  const filteredBookings = bookings.filter(b=>
    b.name.toLowerCase().includes(search.toLowerCase())||
    b.email.toLowerCase().includes(search.toLowerCase())||
    b.dept.toLowerCase().includes(search.toLowerCase())||
    b.id.toLowerCase().includes(search.toLowerCase())
  );
  const filteredEvents = events.filter(e=>
    e.name.toLowerCase().includes(search.toLowerCase())||
    e.dept.toLowerCase().includes(search.toLowerCase())
  );

  // Chart data
  const deptCounts = bookings.reduce((acc,b)=>{acc[b.dept]=(acc[b.dept]||0)+b.qty;return acc;},{});
  const barData = Object.entries(deptCounts).sort((a,b)=>b[1]-a[1]).slice(0,7).map(([label,value])=>({label,value}));
  const donutSegs = [
    {label:'Confirmed', value:confirmed.length,        color:'var(--accent-green)'},
    {label:'Cancelled', value:cancelled,               color:'var(--accent-pink)'},
    {label:'Available', value:Math.max(availableTickets,0), color:'rgba(0,212,255,0.4)'},
  ];
  const sparkData = [8,12,5,18,22,14,28,19,31,25,38,42];

  function deleteBooking(id){ setBookings(b=>b.filter(x=>x.id!==id)); setDelTarget(null); }
  function deleteEvent(id){
    setEvents(e=>e.filter(x=>x.id!==id));
    // Refund/Cancel all bookings associated with the deleted event
    setBookings(prevBookings => prevBookings.map(b => {
      if (b.eventId === id || (!b.eventId && id === 'EVT-2025-NOVA')) {
        return { ...b, status: 'cancelled' };
      }
      return b;
    }));
    setDelTarget(null);
  }
  function toggleBooking(id){ setBookings(b=>b.map(x=>x.id===id?{...x,status:x.status==='confirmed'?'cancelled':'confirmed'}:x)); }
  function toggleEvent(id){ setEvents(e=>e.map(x=>x.id===id?{...x,status:x.status==='active'?'upcoming':'active'}:x)); }

  const topStats = [
    { label:'Total Revenue',   val:`Rs.${totalRev.toLocaleString()}`, sub:`${confirmed.length} confirmed bookings`, color:'var(--accent-gold)',  top:'linear-gradient(90deg,#ffd700,#f59e0b)' },
    { label:'Tickets Sold',    val:totalSold,    sub:`${availableTickets} remaining`,          color:'var(--accent-cyan)',  top:'linear-gradient(90deg,var(--accent-cyan),var(--accent-violet))' },
    { label:'Total Bookings',  val:bookings.length, sub:`${cancelled} cancelled`,              color:'var(--accent-green)',top:'linear-gradient(90deg,var(--accent-green),var(--accent-cyan))' },
    { label:'Departments',     val:uniqueDepts,  sub:'across campus',                          color:'var(--accent-pink)', top:'linear-gradient(90deg,var(--accent-pink),var(--accent-violet))' },
  ];

  return (
    <div className="page" style={{paddingTop:64}}>
      {showAdd&&<AddEventModal onAdd={e=>setEvents(v=>[e,...v])} onClose={()=>setShowAdd(false)} />}
      {delTarget&&<DeleteModal item={delTarget} type={delType}
        onConfirm={()=>delType==='booking'?deleteBooking(delTarget.id):deleteEvent(delTarget.id)}
        onClose={()=>setDelTarget(null)} />}

      <div className="dashboard-grid">
        {/* Sidebar */}
        <div className="admin-sidebar">
          <div style={{padding:'16px 20px 8px',marginBottom:8}}>
            <div style={{fontFamily:'var(--font-display)',fontSize:'0.85rem',color:'var(--accent-cyan)',fontWeight:700,letterSpacing:1}}>ADMIN PANEL</div>
            <div style={{fontSize:'0.72rem',color:'var(--text-muted)',marginTop:2}}>TechNova 2025</div>
          </div>
          <div style={{height:'1px',background:'var(--border)',margin:'0 16px 16px'}} />
          {SIDEBAR.map(item=>(
            <div key={item.key}
              className={`sidebar-item ${activeSection===item.key?'active':''}`}
              onClick={()=>{setActiveSection(item.key);setSearch('');}}>
              <span className="sidebar-icon" style={{fontSize:'0.65rem',fontWeight:800,color:'var(--accent-cyan)',background:'rgba(0,212,255,0.1)',padding:'4px 8px',borderRadius:6}}>{item.icon}</span>{item.label}
            </div>
          ))}
          <div style={{height:'1px',background:'var(--border)',margin:'16px 16px'}} />
          <div style={{padding:'0 20px'}}>
            <div style={{fontSize:'0.72rem',color:'var(--text-muted)',marginBottom:12,letterSpacing:'1px',textTransform:'uppercase'}}>Live Stats</div>
            {[
              {label:'Bookings', val:bookings.length, color:'var(--accent-cyan)'},
              {label:'Revenue',  val:`Rs.${totalRev.toLocaleString()}`, color:'var(--accent-gold)'},
              {label:'Seats Left',val:availableTickets, color:'var(--accent-green)'},
              {label:'Cancelled', val:cancelled, color:'var(--accent-pink)'},
            ].map(s=>(
              <div key={s.label} style={{fontSize:'0.8rem',color:'var(--text-secondary)',marginBottom:8}}>
                <span style={{color:s.color,fontWeight:700}}>{s.val}</span> {s.label}
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="admin-main">

          {/* ── OVERVIEW ── */}
          {activeSection==='overview'&&(
            <div className="animate-fadeUp">
              <div style={{marginBottom:28}}>
                <h2 style={{fontFamily:'var(--font-display)',fontSize:'1.3rem',fontWeight:700,marginBottom:4}}>
                  Welcome back, <span style={{color:'var(--accent-cyan)'}}>Admin</span>
                </h2>
                <p style={{color:'var(--text-secondary)',fontSize:'0.85rem'}}>TechNova 2025 — Live Dashboard</p>
              </div>

              <div className="admin-stats-grid">
                {topStats.map((s,i)=>(
                  <div key={i} className={`admin-stat animate-fadeUp`} style={{animationDelay:`${i*0.1}s`}}>
                    <div className="admin-stat-accent" style={{background:s.top}} />
                    <div className="admin-stat-label">{s.label}</div>
                    <div className="admin-stat-val" style={{color:s.color}}>{s.val}</div>
                    <div className="admin-stat-sub">{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Mini charts row */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:24}}>
                <div className="data-table-wrap" style={{padding:'20px 24px'}}>
                  <div style={{fontSize:'0.78rem',fontWeight:700,color:'var(--text-primary)',marginBottom:12}}>Tickets by Department</div>
                  <BarChart data={barData} height={120} />
                </div>
                <div className="data-table-wrap" style={{padding:'20px 24px',display:'flex',flexDirection:'column',alignItems:'center'}}>
                  <div style={{fontSize:'0.78rem',fontWeight:700,color:'var(--text-primary)',marginBottom:12,width:'100%'}}>Booking Status</div>
                  <DonutChart segments={donutSegs} size={130} />
                  <div style={{display:'flex',gap:16,marginTop:12,flexWrap:'wrap',justifyContent:'center'}}>
                    {donutSegs.map(s=>(
                      <div key={s.label} style={{display:'flex',alignItems:'center',gap:5,fontSize:'0.72rem',color:'var(--text-secondary)'}}>
                        <div style={{width:8,height:8,borderRadius:'50%',background:s.color}} />
                        {s.label} ({s.value})
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dept breakdown */}
              <div className="data-table-wrap" style={{marginBottom:24}}>
                <div className="data-table-header">
                  <div className="data-table-title">Bookings by Department</div>
                </div>
                <div style={{padding:'16px 24px'}}>
                  {Object.entries(deptCounts).sort((a,b)=>b[1]-a[1]).map(([dept,qty])=>{
                    const p=Math.round((qty/Math.max(totalSold,1))*100);
                    return (
                      <div key={dept} style={{marginBottom:14}}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:5,fontSize:'0.82rem'}}>
                          <span style={{color:'var(--text-primary)',fontWeight:500}}>{dept}</span>
                          <span style={{color:'var(--text-secondary)'}}>{qty} tickets ({p}%)</span>
                        </div>
                        <div style={{height:6,background:'rgba(255,255,255,0.06)',borderRadius:3,overflow:'hidden'}}>
                          <div style={{height:'100%',width:`${p}%`,background:'linear-gradient(90deg,var(--accent-cyan),var(--accent-violet))',borderRadius:3,transition:'width 0.8s ease'}} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent */}
              <div className="data-table-wrap">
                <div className="data-table-header"><div className="data-table-title">RECENT BOOKINGS</div></div>
                <table className="data-table">
                  <thead><tr><th>ID</th><th>Name</th><th>Dept</th><th>Tickets</th><th>Total</th><th>Status</th></tr></thead>
                  <tbody>
                    {[...bookings].slice(-6).reverse().map(b=>(
                      <tr key={b.id}>
                        <td><span style={{fontFamily:'monospace',color:'var(--accent-cyan)',fontSize:'0.78rem'}}>{b.id}</span></td>
                        <td style={{color:'var(--text-primary)',fontWeight:500}}>{b.name}</td>
                        <td><span className="badge badge-cyan">{b.dept}</span></td>
                        <td>{b.qty}</td>
                        <td style={{color:'var(--accent-gold)',fontWeight:600}}>Rs.{b.total}</td>
                        <td><span className={`badge ${b.status==='confirmed'?'badge-green':'badge-pink'}`}>{b.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {activeSection==='charts'&&(
            <div className="animate-fadeUp">
              <h2 style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:700,marginBottom:24,color:'var(--accent-cyan)'}}>
                ANALYTICS DASHBOARD
              </h2>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
                <div className="data-table-wrap" style={{padding:'24px'}}>
                  <div style={{fontSize:'0.78rem',fontWeight:700,color:'var(--text-primary)',marginBottom:4}}>Bookings Trend (Monthly)</div>
                  <div style={{fontSize:'0.72rem',color:'var(--text-muted)',marginBottom:16}}>Simulated 12-month view</div>
                  <SparkLine data={sparkData} color="var(--accent-cyan)" height={80} />
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.7rem',color:'var(--text-muted)',marginTop:8}}>
                    <span>May 2024</span><span>Apr 2025</span>
                  </div>
                </div>
                <div className="data-table-wrap" style={{padding:'24px'}}>
                  <div style={{fontSize:'0.78rem',fontWeight:700,color:'var(--text-primary)',marginBottom:4}}>Revenue Trend (Rs.)</div>
                  <div style={{fontSize:'0.72rem',color:'var(--text-muted)',marginBottom:16}}>Monthly revenue simulation</div>
                  <SparkLine data={sparkData.map(v=>v*299)} color="var(--accent-gold)" height={80} />
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.7rem',color:'var(--text-muted)',marginTop:8}}>
                    <span>May 2024</span><span>Apr 2025</span>
                  </div>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
                <div className="data-table-wrap" style={{padding:'24px'}}>
                  <div style={{fontSize:'0.78rem',fontWeight:700,color:'var(--text-primary)',marginBottom:12}}>Tickets by Dept (Bar)</div>
                  <BarChart data={barData} height={160} />
                </div>
                <div className="data-table-wrap" style={{padding:'24px',display:'flex',flexDirection:'column',alignItems:'center'}}>
                  <div style={{fontSize:'0.78rem',fontWeight:700,color:'var(--text-primary)',marginBottom:12,width:'100%'}}>Booking Status (Donut)</div>
                  <DonutChart segments={donutSegs} size={160} />
                  <div style={{display:'flex',gap:16,marginTop:16,flexWrap:'wrap',justifyContent:'center'}}>
                    {donutSegs.map(s=>(
                      <div key={s.label} style={{display:'flex',alignItems:'center',gap:6,fontSize:'0.75rem',color:'var(--text-secondary)'}}>
                        <div style={{width:10,height:10,borderRadius:'50%',background:s.color}} />
                        <span>{s.label}: <strong style={{color:'var(--text-primary)'}}>{s.value}</strong></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* KPI cards */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
                {[
                  {label:'Avg Tickets/Booking', val:(totalSold/Math.max(bookings.length,1)).toFixed(1), color:'var(--accent-cyan)'},
                  {label:'Avg Revenue/Booking',  val:`Rs.${Math.round(totalRev/Math.max(bookings.length,1))}`, color:'var(--accent-gold)'},
                  {label:'Conversion Rate',      val:`${Math.round((confirmed.length/Math.max(bookings.length,1))*100)}%`, color:'var(--accent-green)'},
                ].map(k=>(
                  <div key={k.label} className="admin-stat">
                    <div className="admin-stat-label">{k.label}</div>
                    <div className="admin-stat-val" style={{color:k.color}}>{k.val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── BOOKINGS ── */}
          {activeSection==='bookings'&&(
            <div className="animate-fadeUp">
              <div className="data-table-wrap">
                <div className="data-table-header">
                  <div className="data-table-title">ALL BOOKINGS ({filteredBookings.length})</div>
                  <input className="search-input" placeholder="Search name, email, dept…"
                    value={search} onChange={e=>setSearch(e.target.value)} />
                </div>
                <div style={{overflowX:'auto'}}>
                  <table className="data-table">
                    <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Dept</th><th>Qty</th><th>Total</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {filteredBookings.length===0&&(
                        <tr><td colSpan={9} style={{textAlign:'center',padding:40,color:'var(--text-muted)'}}>No bookings found</td></tr>
                      )}
                      {filteredBookings.map(b=>(
                        <tr key={b.id}>
                          <td><span style={{fontFamily:'monospace',color:'var(--accent-cyan)',fontSize:'0.78rem'}}>{b.id}</span></td>
                          <td style={{color:'var(--text-primary)',fontWeight:500}}>{b.name}</td>
                          <td style={{fontSize:'0.78rem'}}>{b.email}</td>
                          <td><span className="badge badge-cyan">{b.dept}</span></td>
                          <td>{b.qty}</td>
                          <td style={{color:'var(--accent-gold)',fontWeight:600}}>Rs.{b.total}</td>
                          <td style={{fontSize:'0.78rem'}}>{b.date}</td>
                          <td>
                            <span className={`badge ${b.status==='confirmed'?'badge-green':'badge-pink'}`}
                              style={{cursor:'pointer'}} title="Click to toggle" onClick={()=>toggleBooking(b.id)}>
                              {b.status}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-danger btn-sm"
                              onClick={()=>{setDelTarget(b);setDelType('booking');}}>DELETE</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── PAYMENTS ── */}
          {activeSection==='payments'&&(
            <div className="animate-fadeUp">
              <div className="data-table-wrap">
                <div className="data-table-header">
                  <div className="data-table-title">RECENT PAYMENTS ({filteredBookings.filter(b=>b.status==='confirmed').length})</div>
                  <input className="search-input" placeholder="Search by name or ID…"
                    value={search} onChange={e=>setSearch(e.target.value)} />
                </div>
                <div style={{overflowX:'auto'}}>
                  <table className="data-table">
                    <thead><tr><th>Payment ID</th><th>Booking ID</th><th>User</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                    <tbody>
                      {filteredBookings.filter(b=>b.status==='confirmed').length===0&&(
                        <tr><td colSpan={6} style={{textAlign:'center',padding:40,color:'var(--text-muted)'}}>No payments found</td></tr>
                      )}
                      {filteredBookings.filter(b=>b.status==='confirmed').reverse().map(b=>(
                        <tr key={b.id}>
                          <td><span style={{fontFamily:'var(--font-display)',color:'var(--accent-green)',fontSize:'0.78rem',letterSpacing:'1px'}}>{b.paymentId || `PAY-${b.id.split('-')[1]}`}</span></td>
                          <td><span style={{fontFamily:'var(--font-display)',color:'var(--accent-cyan)',fontSize:'0.78rem',letterSpacing:'1px'}}>{b.id}</span></td>
                          <td style={{color:'var(--text-primary)',fontWeight:500}}>{b.name}</td>
                          <td style={{color:'var(--accent-gold)',fontWeight:600}}>Rs.{b.total}</td>
                          <td><span className="badge badge-green">SUCCESS</span></td>
                          <td style={{fontSize:'0.78rem'}}>{b.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── EVENTS ── */}
          {activeSection==='events'&&(
            <div className="animate-fadeUp">
              <div className="data-table-wrap">
                <div className="data-table-header">
                  <div className="data-table-title">EVENTS ({filteredEvents.length})</div>
                  <div style={{display:'flex',gap:10}}>
                    <input className="search-input" placeholder="Search events…"
                      value={search} onChange={e=>setSearch(e.target.value)} />
                    <button className="btn btn-primary btn-sm" onClick={()=>setShowAdd(true)}>ADD EVENT</button>
                  </div>
                </div>
                <div style={{overflowX:'auto'}}>
                  <table className="data-table">
                    <thead><tr><th>ID</th><th>Event</th><th>Dept</th><th>Date</th><th>Venue</th><th>Price</th><th>Sold/Cap</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                      {filteredEvents.map(e=>{
                        const p=Math.round((e.sold/e.capacity)*100);
                        return (
                          <tr key={e.id}>
                            <td><span style={{fontFamily:'monospace',color:'var(--accent-violet)',fontSize:'0.72rem'}}>{e.id}</span></td>
                            <td style={{color:'var(--text-primary)',fontWeight:600}}>{e.name}</td>
                            <td><span className="badge badge-cyan">{e.dept}</span></td>
                            <td style={{fontSize:'0.78rem'}}>{e.date}</td>
                            <td style={{fontSize:'0.78rem',maxWidth:110}}>{e.venue}</td>
                            <td style={{color:'var(--accent-gold)',fontWeight:600}}>Rs.{e.price}</td>
                            <td>
                              <div style={{display:'flex',alignItems:'center',gap:8}}>
                                <div style={{width:44,height:4,background:'rgba(255,255,255,0.08)',borderRadius:2,overflow:'hidden'}}>
                                  <div style={{height:'100%',width:`${p}%`,background:'var(--accent-cyan)',borderRadius:2}} />
                                </div>
                                <span style={{fontSize:'0.75rem'}}>{e.sold}/{e.capacity}</span>
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${e.status==='active'?'badge-green':e.status==='upcoming'?'badge-gold':'badge-pink'}`}
                                style={{cursor:'pointer'}} onClick={()=>toggleEvent(e.id)}>{e.status}</span>
                            </td>
                            <td>
                              <button className="btn btn-danger btn-sm"
                                onClick={()=>{setDelTarget(e);setDelType('event');}}>DELETE</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── USERS ── */}
          {activeSection==='users'&&(
            <div className="animate-fadeUp">
              <div className="data-table-wrap">
                <div className="data-table-header">
                  <div className="data-table-title">USERS ({filteredBookings.length})</div>
                  <input className="search-input" placeholder="Search users…"
                    value={search} onChange={e=>setSearch(e.target.value)} />
                </div>
                <table className="data-table">
                  <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Department</th><th>Tickets</th><th>Spent</th><th>Status</th></tr></thead>
                  <tbody>
                    {filteredBookings.length===0&&(
                      <tr><td colSpan={7} style={{textAlign:'center',padding:40,color:'var(--text-muted)'}}>No users found</td></tr>
                    )}
                    {filteredBookings.map((b,i)=>(
                      <tr key={b.id}>
                        <td style={{color:'var(--text-muted)',fontSize:'0.78rem'}}>{i+1}</td>
                        <td>
                          <div style={{display:'flex',alignItems:'center',gap:10}}>
                            <div style={{
                              width:32,height:32,borderRadius:'50%',flexShrink:0,
                              background:`hsl(${b.name.charCodeAt(0)*7%360},50%,20%)`,
                              border:'1px solid var(--border)',
                              display:'flex',alignItems:'center',justifyContent:'center',
                              fontSize:'0.72rem',color:'var(--accent-cyan)',fontWeight:700,
                            }}>
                              {b.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                            </div>
                            <span style={{color:'var(--text-primary)',fontWeight:500}}>{b.name}</span>
                          </div>
                        </td>
                        <td style={{fontSize:'0.78rem'}}>{b.email}</td>
                        <td><span className="badge badge-cyan">{b.dept}</span></td>
                        <td>{b.qty}</td>
                        <td style={{color:'var(--accent-gold)',fontWeight:600}}>Rs.{b.total}</td>
                        <td><span className={`badge ${b.status==='confirmed'?'badge-green':'badge-pink'}`}>{b.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
