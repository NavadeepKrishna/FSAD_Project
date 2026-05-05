
import { useState } from 'react';
import { EVENT, DEPARTMENTS, COMPETITIONS } from '../data/eventData.js';
import { useAuth } from '../context/AuthContext.jsx';
import PaymentModal from '../components/PaymentModal.jsx';
import ETicket from '../components/ETicket.jsx';

const catColors = { Technical:'var(--accent-cyan)', Cultural:'var(--accent-pink)', Gaming:'var(--accent-violet)', Academic:'var(--accent-gold)', Creative:'var(--accent-green)', Sports:'#ff8c42' };

function validate(form, available) {
  const e = {};
  if (!form.name.trim()) e.name = 'Full name is required.';
  else if (form.name.trim().length < 3) e.name = 'Name must be at least 3 characters.';
  if (!form.email.trim()) e.email = 'Email ID is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
  if (!form.dept) e.dept = 'Please select your department.';
  if (!form.qty) e.qty = 'Number of tickets is required.';
  else if (isNaN(form.qty)||Number(form.qty)<1) e.qty = 'Enter a positive number.';
  else if (!Number.isInteger(+form.qty)) e.qty = 'Must be a whole number.';
  else if (Number(form.qty)>10) e.qty = 'Maximum 10 tickets per booking.';
  else if (Number(form.qty)>available) e.qty = `Only ${available} ticket${available>1?'s':''} remaining.`;
  if (form.competitions.length === 0) e.competitions = 'Please select at least 1 competition.';
  if (form.competitions.length > 3) e.competitions = 'You can select a maximum of 3 competitions.';
  return e;
}

function genBookingId() { return 'TN-' + String(Math.floor(Math.random()*9000)+1000); }

const Field = ({id,label,error,children})=>(
  <div className="form-group">
    <label className="form-label" htmlFor={id}>{label}</label>
    {children}
    {error&&<div className="form-error">⚠ {error}</div>}
  </div>
);

export default function BookingPage({ availableTickets, setAvailableTickets, onNewBooking }) {
  const { currentUser } = useAuth();

  const EMPTY_FORM = {
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    dept: currentUser?.dept || '',
    qty: '',
    competitions: [],
  };

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [pendingBooking, setPending] = useState(null);
  const [confirmedBooking, setConfirmed] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [compFilter, setCompFilter] = useState('All');

  const qty = Number(form.qty)||0;
  const total = qty * EVENT.price;
  const pct = Math.round((availableTickets/EVENT.totalTickets)*100);
  const barColor = pct>50?'var(--accent-green)':pct>20?'var(--accent-gold)':'var(--accent-pink)';

  function handleChange(field, val) {
    setForm(f=>({...f,[field]:val}));
    if (errors[field]) setErrors(e=>({...e,[field]:''}));
  }

  function toggleComp(id) {
    setForm(f=>{
      const has = f.competitions.includes(id);
      if (has) return {...f, competitions: f.competitions.filter(c=>c!==id)};
      if (f.competitions.length>=3) return f; // max 3
      return {...f, competitions:[...f.competitions,id]};
    });
    if (errors.competitions) setErrors(e=>({...e,competitions:''}));
  }

  function handleProceedToPayment() {
    const errs = validate(form, availableTickets);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const booking = {
      bookingId: genBookingId(),
      name: form.name.trim(),
      email: form.email.trim(),
      dept: form.dept,
      qty, total,
      eventName: EVENT.name,
      eventDate: EVENT.date,
      status: 'confirmed',
      date: new Date().toISOString().split('T')[0],
      competitions: form.competitions,
    };
    setPending(booking);
    setShowPayment(true);
  }

  async function handlePaymentSuccess(paymentId) {
    const confirmedB = { ...pendingBooking, paymentId: paymentId || '' };
    setShowPayment(false);
    setAvailableTickets(t => t - confirmedB.qty);
    onNewBooking(confirmedB);
    setConfirmed(confirmedB);
    setShowTicket(true);
    setPending(null);
  }

  function handleReset() {
    setForm(EMPTY_FORM);
    setErrors({});
    setConfirmed(null);
    setShowTicket(false);
    setPending(null);
  }

  const filteredComps = compFilter==='All' ? COMPETITIONS : COMPETITIONS.filter(c=>c.category===compFilter);

  return (
    <div className="page">
      {showPayment&&pendingBooking&&(
        <PaymentModal booking={pendingBooking} onSuccess={handlePaymentSuccess} onClose={()=>{setShowPayment(false);setPending(null);}} />
      )}
      {showTicket&&confirmedBooking&&(
        <ETicket booking={confirmedBooking} onClose={()=>setShowTicket(false)} />
      )}

      <div className="booking-container">
        {/* Left Panel — Event Summary */}
        <div className="booking-summary-panel animate-slideLeft">
          <div style={{borderRadius:14,overflow:'hidden',border:'1px solid var(--border)',marginBottom:20}}>
            <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80" alt="TechNova" style={{width:'100%',height:150,objectFit:'cover',display:'block'}}/>
            <div style={{padding:'14px 16px',background:'rgba(0,212,255,0.04)'}}>
              <div style={{fontFamily:'var(--font-display)',fontSize:'0.95rem',fontWeight:700,color:'var(--accent-cyan)',marginBottom:6}}>{EVENT.name}</div>
              {[{icon:'DATE',text:EVENT.date},{icon:'TIME',text:EVENT.time},{icon:'LOC',text:'Main Auditorium, Block A'}].map(r=>(
                <div key={r.icon} style={{display:'flex',gap:8,fontSize:'0.76rem',color:'var(--text-secondary)',marginBottom:3}}>
                  <span style={{fontWeight:800,color:'var(--accent-cyan)'}}>{r.icon}</span><span>{r.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket meter */}
          <div style={{marginBottom:20}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
              <span style={{fontSize:'0.72rem',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'1px'}}>Seats Available</span>
              <span style={{fontFamily:'var(--font-display)',fontSize:'0.88rem',color:barColor,fontWeight:700}}>{availableTickets} / {EVENT.totalTickets}</span>
            </div>
            <div className="ticket-meter-bar">
              <div className="ticket-meter-fill" style={{width:`${pct}%`,background:`linear-gradient(90deg,${barColor},var(--accent-cyan))`}}/>
            </div>
          </div>

          {/* Price */}
          <div className="price-display">
            <div>
              <div className="price-label">Unit Price</div>
              <div style={{color:'var(--text-primary)',fontWeight:600,marginTop:2}}>Rs.{EVENT.price} × {qty||0}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div className="price-label">Total</div>
              <div className="price-amount">Rs.{total}</div>
            </div>
          </div>

          {/* Selected competitions summary */}
          {form.competitions.length>0&&(
            <div style={{background:'rgba(0,212,255,0.05)',border:'1px solid rgba(0,212,255,0.15)',borderRadius:10,padding:'12px 14px',marginTop:16}}>
              <div style={{fontSize:'0.7rem',color:'var(--text-muted)',marginBottom:8,textTransform:'uppercase',letterSpacing:'1px'}}>
                Selected Competitions ({form.competitions.length}/3)
              </div>
              {form.competitions.map(id=>{
                const c = COMPETITIONS.find(x=>x.id===id);
                return c ? (
                  <div key={id} style={{display:'flex',alignItems:'center',gap:8,marginBottom:6,fontSize:'0.78rem',color:'var(--text-primary)'}}>
                    <span>{c.icon}</span><span>{c.name}</span>
                    <span style={{marginLeft:'auto',color:catColors[c.category],fontSize:'0.68rem'}}>{c.prize}</span>
                  </div>
                ) : null;
              })}
            </div>
          )}

          <div style={{borderTop:'1px solid var(--border)',paddingTop:16,fontSize:'0.74rem',color:'var(--text-muted)',lineHeight:1.8,marginTop:16}}>
            <div>SECURE 256-bit SSL payment</div>
            <div>E-TICKET sent to your email</div>
            <div>QR CODE for entry at venue</div>
            <div>INSTANT confirmation</div>
          </div>

          {confirmedBooking&&(
            <button className="btn btn-outline" style={{width:'100%',marginTop:16}} onClick={()=>setShowTicket(true)}>
              VIEW E-TICKET
            </button>
          )}
        </div>

        {/* Right Panel — Form */}
        <div className="booking-form-panel animate-slideRight">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:28}}>
            <div className="form-title" style={{margin:0}}>BOOK YOUR TICKET</div>
            <div style={{display:'flex',gap:8,alignItems:'center',fontSize:'0.72rem',color:'var(--text-muted)'}}>
              <span style={{color:'var(--accent-cyan)',fontWeight:600}}>① Details</span>
              <span>→</span><span>② Competitions</span><span>→</span><span>③ Payment</span>
            </div>
          </div>

          {/* Personal Details */}
          <div style={{background:'rgba(0,212,255,0.03)',border:'1px solid var(--border)',borderRadius:12,padding:'18px 20px',marginBottom:24}}>
            <div style={{fontSize:'0.72rem',color:'var(--accent-cyan)',fontWeight:600,textTransform:'uppercase',letterSpacing:'1px',marginBottom:16}}>
              PERSONAL DETAILS
            </div>
            <div className="form-row">
              <Field id="name" label="Full Name *" error={errors.name}>
                <input id="name" type="text" className={`form-input ${errors.name?'error':''}`}
                  placeholder="e.g. Arjun Mehta" value={form.name} onChange={e=>handleChange('name',e.target.value)}/>
              </Field>
              <Field id="email" label="Email ID *" error={errors.email}>
                <input id="email" type="email" className={`form-input ${errors.email?'error':''}`}
                  placeholder="you@college.ac.in" value={form.email} onChange={e=>handleChange('email',e.target.value)}/>
              </Field>
            </div>
            <div className="form-row">
              <Field id="dept" label="Department *" error={errors.dept}>
                <select id="dept" className={`form-select ${errors.dept?'error':''}`}
                  value={form.dept} onChange={e=>handleChange('dept',e.target.value)}>
                  <option value="">Select department…</option>
                  {DEPARTMENTS.map(d=><option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
              <Field id="qty" label="No. of Tickets *" error={errors.qty}>
                <input id="qty" type="number" min="1" max="10" className={`form-input ${errors.qty?'error':''}`}
                  placeholder="1–10" value={form.qty} onChange={e=>handleChange('qty',e.target.value)}/>
              </Field>
            </div>
          </div>

          {/* Competition Selection */}
          <div style={{background:'rgba(124,58,237,0.04)',border:'1px solid rgba(124,58,237,0.2)',borderRadius:12,padding:'18px 20px',marginBottom:24}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
              <div style={{fontSize:'0.72rem',color:'var(--accent-violet)',fontWeight:600,textTransform:'uppercase',letterSpacing:'1px'}}>
                CHOOSE COMPETITIONS <span style={{color:'var(--text-muted)',fontWeight:400}}>({form.competitions.length}/3 selected)</span>
              </div>
            </div>

            {/* Category filter */}
            <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:14}}>
              {['All','Technical','Cultural','Gaming','Academic','Creative','Sports'].map(cat=>(
                <button key={cat} onClick={()=>setCompFilter(cat)}
                  style={{padding:'4px 10px',borderRadius:14,border:'1px solid',borderColor:compFilter===cat?'var(--accent-cyan)':'var(--border)',background:compFilter===cat?'rgba(0,212,255,0.12)':'transparent',color:compFilter===cat?'var(--accent-cyan)':'var(--text-muted)',fontSize:'0.7rem',fontWeight:600,cursor:'pointer',fontFamily:'var(--font-body)',transition:'all 0.2s'}}>
                  {cat}
                </button>
              ))}
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:8}}>
              {filteredComps.map(comp=>{
                const selected = form.competitions.includes(comp.id);
                const disabled = !selected && form.competitions.length>=3;
                return (
                  <div key={comp.id} onClick={()=>!disabled&&toggleComp(comp.id)}
                    style={{
                      background: selected?`${catColors[comp.category]}18`:'var(--bg-deep)',
                      border:`1px solid ${selected?(catColors[comp.category]||'var(--accent-cyan)'):'var(--border)'}`,
                      borderRadius:10, padding:'10px 12px', cursor:disabled?'not-allowed':'pointer',
                      opacity:disabled?0.4:1, transition:'all 0.2s',
                      display:'flex',alignItems:'center',gap:8,
                    }}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:'0.75rem',fontWeight:600,color: selected?(catColors[comp.category]||'var(--accent-cyan)'):'var(--text-primary)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{comp.name}</div>
                      <div style={{fontSize:'0.62rem',color:'var(--accent-gold)'}}>{comp.prize}</div>
                    </div>
                    {selected&&<span style={{color:catColors[comp.category]||'var(--accent-cyan)',fontSize:'0.8rem',flexShrink:0}}>✓</span>}
                  </div>
                );
              })}
            </div>
            {errors.competitions&&<div className="form-error" style={{marginTop:10}}>⚠ {errors.competitions}</div>}
          </div>

          {/* Order Summary */}
          {qty>0&&!errors.qty&&(
            <div style={{background:'linear-gradient(135deg,rgba(0,212,255,0.06),rgba(124,58,237,0.06))',border:'1px solid var(--border)',borderRadius:12,padding:'16px 20px',marginBottom:24,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontSize:'0.72rem',color:'var(--text-muted)',marginBottom:4}}>ORDER SUMMARY</div>
                <div style={{color:'var(--text-primary)',fontSize:'0.88rem'}}>{qty} ticket{qty>1?'s':''} · {EVENT.name}</div>
                <div style={{fontSize:'0.75rem',color:'var(--text-secondary)',marginTop:2}}>{EVENT.date} · {form.name||'Your name'}</div>
              </div>
              <div style={{fontFamily:'var(--font-display)',fontSize:'1.5rem',color:'var(--accent-gold)',fontWeight:700}}>Rs.{total}</div>
            </div>
          )}

          {availableTickets===0 ? (
            <div style={{background:'rgba(247,37,133,0.08)',border:'1px solid rgba(247,37,133,0.2)',borderRadius:10,padding:'16px 20px',color:'var(--accent-pink)',fontSize:'0.88rem',textAlign:'center',fontWeight:700}}>
              SOLD OUT
            </div>
          ) : (
            <div style={{display:'flex',gap:14}}>
              <button className="btn btn-outline" onClick={handleReset} style={{flex:0.4}}>RESET</button>
              <button className="btn btn-primary" onClick={handleProceedToPayment} style={{flex:1}}>
                PROCEED TO PAYMENT · Rs.{total||EVENT.price}
              </button>
            </div>
          )}

          <div style={{marginTop:20,display:'flex',gap:16,justifyContent:'center',fontSize:'0.7rem',color:'var(--text-muted)',flexWrap:'wrap'}}>
            {['SECURE','INSTANT','EMAIL CONFIRMATION','QR ENTRY'].map(b=>(
              <span key={b}>{b}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
