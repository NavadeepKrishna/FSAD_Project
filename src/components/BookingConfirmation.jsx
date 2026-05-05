const CONFETTI_COLORS = ['#00d4ff','#7c3aed','#f72585','#ffd700','#00ff88'];

function Confetti() {
  const pieces = Array.from({ length: 20 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: `${Math.random() * 1.2}s`,
    size: `${4 + Math.random() * 8}px`,
  }));
  return (
    <>
      {pieces.map((p, i) => (
        <div key={i} className="confetti-item" style={{
          left: p.left, top: 0,
          width: p.size, height: p.size,
          background: p.color,
          animationDelay: p.delay,
        }} />
      ))}
    </>
  );
}

export default function BookingConfirmation({ booking, onClose, onReset }) {
  if (!booking) return null;
  const { name, email, dept, qty, total, bookingId, eventName, eventDate } = booking;

  return (
    <div className="confirmation-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="confirmation-card">
        <Confetti />
        <div className="check-circle">✓</div>
        <div className="confirmation-title">Booking Confirmed!</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 8 }}>
          A confirmation has been sent to your email.
        </div>
        <div className="confirmation-id">Booking ID: {bookingId}</div>

        <div style={{ textAlign: 'left', marginBottom: 16 }}>
          {[
            { k: 'Name', v: name },
            { k: 'Email', v: email },
            { k: 'Department', v: dept },
            { k: 'Event', v: eventName },
            { k: 'Date', v: eventDate },
            { k: 'Tickets', v: `${qty} ticket${qty > 1 ? 's' : ''}` },
          ].map(r => (
            <div key={r.k} className="booking-detail-row">
              <span className="booking-detail-key">{r.k}</span>
              <span className="booking-detail-val">{r.v}</span>
            </div>
          ))}
        </div>

        <div className="total-highlight">
          <span style={{ color: 'var(--text-secondary)', alignSelf: 'center' }}>Total Paid</span>
          <span className="total-val">₹{total}</span>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => { onReset(); onClose(); }}>
            Book Again
          </button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={onClose}>
            Done ✓
          </button>
        </div>
      </div>
    </div>
  );
}
