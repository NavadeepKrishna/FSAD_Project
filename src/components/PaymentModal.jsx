import { useState } from 'react';
import { openRazorpayCheckout } from '../services/razorpayService.js';
import { isRazorpayConfigured } from '../config.js';

export default function PaymentModal({ booking, onSuccess, onClose }) {
  const [step, setStep]       = useState('confirm');
  const [paymentId, setPayId] = useState('');
  const [errMsg, setErrMsg]   = useState('');

  if (!booking) return null;
  const isReal = isRazorpayConfigured();

  async function handlePay() {
    setStep('processing');
    setErrMsg('');
    await openRazorpayCheckout(booking, {
      onSuccess: (pid) => { setPayId(pid); setStep('success'); },
      onFailure: (err) => { setErrMsg(err.message || 'Payment failed.'); setStep('error'); },
      onDismiss: () => setStep('confirm'),
    });
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget && step !== 'processing') onClose(); }}>
      <div className="modal-box" style={{ maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', margin: '0 auto' }}>

        {step === 'confirm' && (
          <>
            <div style={{ textAlign:'center', marginBottom:20 }}>
              <div className="modal-title" style={{ textAlign:'center', marginBottom:4 }}>Confirm Payment</div>
              <div style={{ fontSize:'0.82rem', color:'var(--text-secondary)' }}>
                {booking.qty} ticket{booking.qty>1?'s':''} · {booking.eventName}
              </div>
            </div>

            <div style={{ background:'linear-gradient(135deg,rgba(0,212,255,0.06),rgba(124,58,237,0.06))', border:'1px solid var(--border)', borderRadius:14, padding:'16px 20px', marginBottom:20 }}>
              {[
                {k:'Attendee', v:booking.name},
                {k:'Email',    v:booking.email},
                {k:'Event',    v:booking.eventName},
                {k:'Date',     v:booking.eventDate},
                {k:'Tickets',  v:`${booking.qty} x Rs.${booking.total/booking.qty}`},
              ].map(r=>(
                <div key={r.k} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid var(--border)', fontSize:'0.84rem' }}>
                  <span style={{ color:'var(--text-muted)' }}>{r.k}</span>
                  <span style={{ color:'var(--text-primary)', fontWeight:500 }}>{r.v}</span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 0 0', fontWeight:700 }}>
                <span style={{ color:'var(--text-secondary)' }}>Total</span>
                <span style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', color:'var(--accent-gold)' }}>Rs.{booking.total}</span>
              </div>
            </div>

            <div style={{
              display:'flex', alignItems:'center', justifyContent:'center', gap:10,
              background: isReal ? 'rgba(0,255,136,0.06)' : 'rgba(255,215,0,0.06)',
              border:`1px solid ${isReal?'rgba(0,255,136,0.2)':'rgba(255,215,0,0.2)'}`,
              borderRadius:10, padding:'10px 16px', marginBottom:20, fontSize:'0.78rem',
              color: isReal ? 'var(--accent-green)' : 'var(--accent-gold)',
            }}>
              {isReal
                ? <><span>🔒</span> Secured by <strong>Razorpay</strong> · UPI · Cards · Net Banking</>
                : <><span>⚙</span> Demo mode — Add VITE_RAZORPAY_KEY_ID to .env for live payments</>}
            </div>

            <div style={{ display:'flex', gap:12 }}>
              <button className="btn btn-outline" style={{ flex:0.4 }} onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" style={{ flex:1 }} onClick={handlePay}>
                {isReal ? `🔒 Pay Rs.${booking.total} via Razorpay` : `⚡ Pay Rs.${booking.total} (Demo)`}
              </button>
            </div>
            <div style={{ textAlign:'center', marginTop:14, fontSize:'0.68rem', color:'var(--text-muted)' }}>
              🔒 256-bit SSL · PCI-DSS Compliant · RBI Approved
            </div>
          </>
        )}

        {step === 'processing' && (
          <div style={{ textAlign:'center', padding:'40px 20px' }}>
            <div style={{ width:64, height:64, borderRadius:'50%', border:'3px solid transparent', borderTopColor:'var(--accent-cyan)', borderRightColor:'var(--accent-violet)', margin:'0 auto 24px', animation:'spin 1s linear infinite' }} />
            <div style={{ fontFamily:'var(--font-display)', fontSize:'1rem', color:'var(--text-primary)', marginBottom:8 }}>Opening Payment Gateway…</div>
            <div style={{ fontSize:'0.82rem', color:'var(--text-secondary)' }}>Complete the payment in the Razorpay popup</div>
          </div>
        )}

        {step === 'success' && (
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,var(--accent-green),var(--accent-cyan))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.2rem', margin:'0 auto 20px', boxShadow:'0 0 40px rgba(0,255,136,0.4)', animation:'successPop 0.6s cubic-bezier(0.34,1.56,0.64,1)' }}>✓</div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', color:'var(--accent-green)', marginBottom:8 }}>Payment Successful!</div>
            <div style={{ color:'var(--text-secondary)', fontSize:'0.85rem', marginBottom:20 }}>Rs.{booking.total} paid for {booking.qty} ticket{booking.qty>1?'s':''}</div>
            {paymentId && (
              <div style={{ background:'rgba(0,212,255,0.06)', border:'1px solid rgba(0,212,255,0.2)', borderRadius:10, padding:'10px 16px', marginBottom:24, fontSize:'0.78rem' }}>
                <div style={{ color:'var(--text-muted)', marginBottom:4 }}>Payment Reference</div>
                <div style={{ fontFamily:'monospace', color:'var(--accent-cyan)', wordBreak:'break-all' }}>{paymentId}</div>
              </div>
            )}
            <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginBottom:24 }}>
              📧 A confirmation email will be sent to <strong style={{ color:'var(--text-primary)' }}>{booking.email}</strong>
            </div>
            <button className="btn btn-success" style={{ width:'100%' }} onClick={() => onSuccess(paymentId)}>🎟 View My E-Ticket →</button>
          </div>
        )}

        {step === 'error' && (
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <div style={{ fontSize:'3.5rem', marginBottom:16 }}>❌</div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', color:'var(--accent-pink)', marginBottom:12 }}>Payment Failed</div>
            <div style={{ background:'rgba(247,37,133,0.07)', border:'1px solid rgba(247,37,133,0.2)', borderRadius:10, padding:'12px 16px', marginBottom:24, fontSize:'0.82rem', color:'var(--accent-pink)' }}>
              {errMsg || 'Something went wrong. Please try again.'}
            </div>
            <div style={{ display:'flex', gap:12 }}>
              <button className="btn btn-outline" style={{ flex:1 }} onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" style={{ flex:1 }} onClick={() => setStep('confirm')}>↺ Try Again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
