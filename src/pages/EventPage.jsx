
import { EVENT } from '../data/eventData.js';

const infoCards = [
  { icon: 'DEPT', label: 'Department', value: EVENT.department },
  { icon: 'DATE', label: 'Date', value: EVENT.date },
  { icon: 'TIME', label: 'Time', value: EVENT.time },
  { icon: 'LOC', label: 'Venue', value: EVENT.venue },
  { icon: 'UNI', label: 'College', value: EVENT.college },
  { icon: 'FEE', label: 'Entry Fee', value: `₹${EVENT.price} per ticket` },
];

export default function EventPage({ availableTickets, setActiveTab }) {
  const pct = Math.round((availableTickets / EVENT.totalTickets) * 100);
  const barColor = pct > 50 ? 'var(--accent-green)' : pct > 20 ? 'var(--accent-gold)' : 'var(--accent-pink)';

  return (
    <div className="page">
      <div className="section">
        {/* Header */}
        <div className="animate-fadeUp" style={{ marginBottom: 40 }}>
          <div className="hero-eyebrow" style={{ justifyContent: 'flex-start', display: 'inline-flex' }}>
            <span /> Event Information
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,5vw,3rem)', fontWeight: 900, marginBottom: 12 }}>
            <span style={{ background: 'linear-gradient(135deg,#fff,var(--accent-cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {EVENT.name}
            </span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 700, lineHeight: 1.7 }}>{EVENT.description}</p>
        </div>

        {/* Info Cards */}
        <h2 className="section-title animate-fadeUp delay-1">
          <span className="section-accent">EVENT</span> DETAILS
        </h2>
        <div className="event-info-grid animate-fadeUp delay-2">
          {infoCards.map((c, i) => (
            <div key={i} className="info-card">
              <div className="info-card-icon">{c.icon}</div>
              <div>
                <div className="info-card-label">{c.label}</div>
                <div className="info-card-value">{c.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Ticket Meter */}
        <div className="ticket-availability animate-fadeUp delay-3">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>
                Ticket Availability
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: barColor }}>
                {availableTickets}
                <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}> / {EVENT.totalTickets}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: 900, color: barColor }}>{pct}%</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>remaining</div>
            </div>
          </div>
          <div className="ticket-meter-bar">
            <div className="ticket-meter-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${barColor}, var(--accent-cyan))` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>{EVENT.totalTickets - availableTickets} sold</span>
            <span>{availableTickets} available</span>
          </div>
        </div>

        {/* Schedule */}
        <h2 className="section-title animate-fadeUp">
          <span className="section-accent">EVENT</span> SCHEDULE
        </h2>
        <div className="timeline animate-fadeUp delay-1">
          {EVENT.schedule.map((s, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-time">{s.time}</div>
              <div className="timeline-event">{s.event}</div>
              <div className="timeline-desc">{s.desc}</div>
            </div>
          ))}
        </div>



        {/* Venue Location Text Only */}
        <h2 className="section-title animate-fadeUp" style={{ marginTop: 48 }}>
          <span className="section-accent">VENUE</span> LOCATION
        </h2>
        <div className="animate-fadeUp delay-1" style={{ marginBottom: 16 }}>
          <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:'20px 24px', marginBottom:20 }}>
            <div style={{ display:'flex', gap:16, alignItems:'center', flexWrap:'wrap' }}>
              <div style={{ width:48, height:48, borderRadius:12, background:'linear-gradient(135deg,rgba(0,212,255,0.15),rgba(124,58,237,0.15))', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', fontWeight:800, color:'var(--accent-cyan)', letterSpacing:'1px', flexShrink:0 }}>LOC</div>
              <div>
                <div style={{ fontWeight:700, color:'var(--text-primary)', marginBottom:3 }}>{EVENT.venue}</div>
                <div style={{ fontSize:'0.78rem', color:'var(--text-secondary)' }}>{EVENT.college}</div>
                <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginTop:2 }}>Chennai, Tamil Nadu</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="animate-fadeUp" style={{ textAlign: 'center', marginTop: 60 }}>
          <button className="btn btn-primary" style={{ fontSize: '1rem', padding: '16px 40px' }}
            onClick={() => setActiveTab('booking')}>
            BOOK TICKETS — ₹{EVENT.price}
          </button>
        </div>
      </div>
    </div>
  );
}