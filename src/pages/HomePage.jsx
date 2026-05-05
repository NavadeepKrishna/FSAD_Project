import { useState, useEffect } from 'react';
import { EVENT, COMPETITIONS, COMP_CATEGORIES } from '../data/eventData.js';
import { useAuth } from '../context/AuthContext.jsx';

// Event date: 10 days from the time the app first loads
const EVENT_TARGET = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);

function CountdownTimer() {
  const [time, setTime] = useState({ days:0, hours:0 });
  useEffect(() => {
    function tick() {
      const diff = Math.max(0, EVENT_TARGET - new Date());
      setTime({
        days:  Math.floor(diff/(1000*60*60*24)),
        hours: Math.floor((diff%(1000*60*60*24))/(1000*60*60)),
      });
    }
    tick(); const id = setInterval(tick,1000); return ()=>clearInterval(id);
  }, []);

  const labels = { days: 'Days', hours: 'Hours' };
  return (
    <div style={{display:'flex',gap:16,justifyContent:'center',marginBottom:40}}>
      {Object.entries(time).map(([key,val])=>(
        <div key={key} style={{background:'rgba(0,212,255,0.07)',border:'1px solid rgba(0,212,255,0.25)',borderRadius:14,padding:'18px 32px',textAlign:'center',minWidth:110}}>
          <div style={{fontFamily:'var(--font-display)',fontSize:'2.6rem',fontWeight:700,color:'var(--accent-cyan)',lineHeight:1}}>{String(val).padStart(2,'0')}</div>
          <div style={{fontSize:'0.7rem',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'2px',marginTop:6}}>{labels[key]}</div>
        </div>
      ))}
    </div>
  );
}

const catColors = { Technical:'var(--accent-cyan)', Cultural:'var(--accent-pink)', Gaming:'var(--accent-violet)', Academic:'var(--accent-gold)', Creative:'var(--accent-green)', Sports:'#ff8c42' };

export default function HomePage({ setActiveTab, availableTickets }) {
  const { currentUser } = useAuth();
  const [activeCategory, setActiveCategory] = useState('All');
  const sold = EVENT.totalTickets - availableTickets;

  const filtered = activeCategory==='All' ? COMPETITIONS : COMPETITIONS.filter(c=>c.category===activeCategory);

  const tickerItems = ['⚡ TechNova 2025','MAY 24','₹1L+ PRIZES','HACKATHON',`${availableTickets} SEATS LEFT`,'ROBOTICS EXPO','ESPORTS','DANCE BATTLE','COOKING CHALLENGE','₹299 ENTRY'];

  return (
    <div className="page">
      {/* Hero */}
      <div className="hero">
        <div className="hero-bg-glow" /><div className="scanline" />
        <div className="hero-eyebrow animate-fadeUp"><span /> SVCE · Open to All Colleges · 2025</div>
        <div className="hero-title animate-fadeUp delay-1">
          <span className="line1">TechNova</span>
          <span className="line2">Annual Technical Festival</span>
        </div>
        <p className="hero-subtitle animate-fadeUp delay-2">
          Hackathons · Esports · Dance · Singing · Cooking · Robotics & more.
          Open to <strong style={{color:'var(--accent-cyan)'}}>ALL colleges</strong>. Only{' '}
          <strong style={{color:'var(--accent-gold)'}}>{availableTickets} seats</strong> remaining.
        </p>
        <CountdownTimer />
        <div className="hero-cta-row animate-fadeUp delay-3">
          <button className="btn btn-primary" onClick={()=>setActiveTab(currentUser?'booking':'login')}>
            BOOK TICKET — ₹{EVENT.price}
          </button>
          <button className="btn btn-outline" onClick={()=>setActiveTab('event')}>VIEW DETAILS</button>
        </div>
        <div style={{marginTop:20,display:'inline-flex',alignItems:'center',gap:8,background:'rgba(255,215,0,0.08)',border:'1px solid rgba(255,215,0,0.2)',borderRadius:30,padding:'8px 20px',fontSize:'0.76rem',color:'var(--accent-gold)'}}>
          OUTSIDE CAMPUS? Pay entry fee → choose any 3 competitions → compete for prizes!
        </div>
      </div>

      {/* Ticker */}
      <div className="ticker-wrap">
        <div className="ticker-content">
          {[...tickerItems,...tickerItems].map((item,i)=>(
            <span key={i}>{item}<span className="ticker-sep">◆</span></span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {[
          {icon:'TKT',value:`${availableTickets}`,label:'Tickets Left'},
          {icon:'USR',value:`${sold}+`,label:'Already Booked'},
          {icon:'PRZ',value:'₹1L+',label:'Total Prizes'},
          {icon:'SPK',value:'8+',label:'Expert Speakers'},
          {icon:'CMP',value:`${COMPETITIONS.length}`,label:'Competitions'},
          {icon:'UNI',value:'All',label:'Colleges Welcome'},
        ].map((s,i)=>(
          <div key={i} className={`stat-card animate-fadeUp delay-${i+1}`}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>



      {/* Competitions */}
      <div className="section">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:24,flexWrap:'wrap',gap:12}}>
          <h2 className="section-title" style={{margin:0}}><span className="section-accent">COMPETITIONS</span> TO ENTER</h2>
          <span style={{fontSize:'0.76rem',color:'var(--text-muted)'}}>Register for up to <strong style={{color:'var(--accent-cyan)'}}>3 competitions</strong> after booking</span>
        </div>
        {/* Category filter */}
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:24}}>
          {COMP_CATEGORIES.map(cat=>(
            <button key={cat} onClick={()=>setActiveCategory(cat)} style={{padding:'6px 14px',borderRadius:20,border:'1px solid',borderColor:activeCategory===cat?'var(--accent-cyan)':'var(--border)',background:activeCategory===cat?'rgba(0,212,255,0.12)':'transparent',color:activeCategory===cat?'var(--accent-cyan)':'var(--text-muted)',fontSize:'0.78rem',fontWeight:600,cursor:'pointer',fontFamily:'var(--font-body)',transition:'all 0.2s'}}>
              {cat}
            </button>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:16}}>
          {filtered.map(comp=>(
            <div key={comp.id} style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:14,padding:'18px 20px',display:'flex',flexDirection:'column',gap:10,transition:'all 0.25s'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=catColors[comp.category]||'var(--accent-cyan)';e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,0.3)';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none';}}>
              <div style={{display:'flex',justifyContent:'flex-end'}}>
                <span style={{fontSize:'0.62rem',fontWeight:700,padding:'4px 10px',borderRadius:6,background:`${catColors[comp.category]}22`,color:catColors[comp.category]||'var(--accent-cyan)',border:`1px solid ${catColors[comp.category]}44`,textTransform:'uppercase',letterSpacing:'1px'}}>{comp.category}</span>
              </div>
              <div style={{fontWeight:700,color:'var(--text-primary)',fontSize:'0.95rem'}}>{comp.name}</div>
              <div style={{color:'var(--text-muted)',fontSize:'0.76rem',lineHeight:1.5,flex:1}}>{comp.desc}</div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:8,borderTop:'1px solid var(--border)'}}>
                <span style={{fontSize:'0.72rem',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'1px'}}>TEAM: {comp.maxTeam===1?'SOLO':`MAX ${comp.maxTeam}`}</span>
                <span style={{fontWeight:800,color:'var(--accent-gold)',fontSize:'0.85rem'}}>{comp.prize}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{textAlign:'center',marginTop:32}}>
          <button className="btn btn-primary" style={{padding:'14px 36px'}} onClick={()=>setActiveTab(currentUser?'booking':'login')}>
            BOOK TICKET & REGISTER FOR COMPETITIONS
          </button>
          <p style={{color:'var(--text-muted)',fontSize:'0.76rem',marginTop:10}}>₹299 entry fee · Choose any 3 competitions · Open to all colleges</p>
        </div>
      </div>


    </div>
  );
}