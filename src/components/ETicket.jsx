import { useEffect, useRef } from 'react';
import { COMPETITIONS } from '../data/eventData.js';

function QRCanvas({ value, size=120 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cells = 21; const cell = size/cells;
    let hash = 0;
    for (let i=0;i<value.length;i++) hash = ((hash<<5)-hash+value.charCodeAt(i))|0;
    ctx.fillStyle='#fff'; ctx.fillRect(0,0,size,size);
    for (let r=0;r<cells;r++) {
      for (let c=0;c<cells;c++) {
        const inFinder=(r<8&&c<8)||(r<8&&c>=cells-8)||(r>=cells-8&&c<8);
        if (inFinder) {
          const isSep = r===7 || c===7 || (r>=cells-8 && r<=cells-1 && c===7);
          let lr = r, lc = c;
          if (c>=cells-7) lc = c - (cells-7);
          if (r>=cells-7) lr = r - (cells-7);
          const isWhiteRing = (lr===1 || lr===5 || lc===1 || lc===5) && lr<=6 && lc<=6;
          
          ctx.fillStyle = isSep || isWhiteRing ? '#fff' : '#000';
          ctx.fillRect(c*cell,r*cell,cell,cell); continue;
        }
        const bit = ((hash>>((r*cells+c)%32))&1)^((r+c+hash)%3===0?1:0);
        if (bit) {
          ctx.fillStyle = '#000';
          ctx.fillRect(c*cell, r*cell, cell, cell);
        }
      }
    }
  },[value,size]);
  return <canvas ref={canvasRef} width={size} height={size} style={{borderRadius:8}}/>;
}

export default function ETicket({ booking, onClose }) {
  if (!booking) return null;

  const bookedComps = (booking.competitions||[])
    .map(id => COMPETITIONS.find(c=>c.id===id))
    .filter(Boolean);

  // Fix name display — ensure it's a string
  const displayName = typeof booking.name === 'string'
    ? booking.name
    : String(booking.name || '');

  return (
    <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="modal-box" style={{
        background:'linear-gradient(135deg,#0a1220 0%,#0d1829 100%)',
        maxWidth:520, width:'100%', padding:0,
        maxHeight:'90vh', overflowY:'auto', margin:'0 auto'
      }}>
        {/* Header */}
        <div style={{background:'linear-gradient(135deg,#1e1b4b,#312e81,#4338ca)',padding:'28px 32px 24px',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:-40,right:-40,width:120,height:120,borderRadius:'50%',background:'rgba(255,255,255,0.05)'}}/>
          <div style={{fontFamily:'var(--font-display)',fontSize:'0.65rem',letterSpacing:'3px',color:'rgba(255,255,255,0.6)',marginBottom:6}}>ENTRY TICKET</div>
          <div style={{fontFamily:'var(--font-display)',fontSize:'1.6rem',fontWeight:900,color:'#fff',marginBottom:4}}>TechNova 2025</div>
          <div style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.7)'}}>Department of Computer Science & Engineering</div>
        </div>

        {/* Perforation */}
        <div style={{display:'flex',alignItems:'center',position:'relative',height:24}}>
          <div style={{position:'absolute',left:-12,width:24,height:24,borderRadius:'50%',background:'var(--bg-void)'}}/>
          <div style={{flex:1,borderTop:'2px dashed rgba(0,212,255,0.2)',margin:'0 16px'}}/>
          <div style={{position:'absolute',right:-12,width:24,height:24,borderRadius:'50%',background:'var(--bg-void)'}}/>
        </div>

        {/* Body */}
        <div style={{padding:'8px 32px 28px'}}>
          <div style={{display:'flex',gap:24,alignItems:'flex-start'}}>
            {/* QR */}
            <div style={{flexShrink:0,textAlign:'center'}}>
              <div style={{background:'#fff',borderRadius:12,padding:8,display:'inline-block',boxShadow:'0 0 20px rgba(0,212,255,0.2)'}}>
                <QRCanvas value={booking.bookingId} size={110}/>
              </div>
              <div style={{fontSize:'0.62rem',color:'var(--text-muted)',marginTop:6,letterSpacing:'1px'}}>SCAN AT ENTRY</div>
            </div>

            {/* Details */}
            <div style={{flex:1,minWidth:0}}>
              {[
                { label:'NAME',       value: displayName },
                { label:'BOOKING ID', value: booking.bookingId, mono:true },
                { label:'DEPARTMENT', value: booking.dept },
                { label:'TICKETS',    value: `${booking.qty} ticket${booking.qty>1?'s':''}` },
                { label:'DATE',       value: '24 May 2025' },
                { label:'TIME',       value: '9:00 AM onwards' },
                { label:'VENUE',      value: 'Main Auditorium' },
              ].map(r=>(
                <div key={r.label} style={{marginBottom:10}}>
                  <div style={{fontSize:'0.6rem',color:'var(--text-muted)',letterSpacing:'1.5px',marginBottom:2}}>{r.label}</div>
                  <div style={{fontSize:r.mono?'0.75rem':'0.88rem',color:r.mono?'var(--accent-cyan)':'var(--text-primary)',fontWeight:600,fontFamily:r.mono?'monospace':'var(--font-body)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                    {r.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitions registered */}
          {bookedComps.length>0&&(
            <div style={{marginTop:16,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,padding:'12px 16px'}}>
              <div style={{fontSize:'0.6rem',color:'var(--accent-cyan)',letterSpacing:'1.5px',marginBottom:10,fontWeight:700}}>COMPETITIONS REGISTERED</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                {bookedComps.map(c=>(
                  <div key={c.id} style={{display:'flex',alignItems:'center',gap:6,background:'rgba(0,212,255,0.1)',border:'1px solid rgba(0,212,255,0.2)',borderRadius:8,padding:'4px 10px',fontSize:'0.76rem',color:'var(--text-primary)'}}>
                    <span>{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:16,padding:'14px 18px',background:'linear-gradient(135deg,rgba(255,215,0,0.08),rgba(0,212,255,0.08))',border:'1px solid rgba(255,215,0,0.15)',borderRadius:10}}>
            <span style={{fontSize:'0.75rem',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'1px'}}>Amount Paid</span>
            <span style={{fontFamily:'var(--font-display)',fontSize:'1.4rem',fontWeight:700,color:'var(--accent-gold)'}}>₹{booking.total}</span>
          </div>

          <div style={{marginTop:14,fontSize:'0.68rem',color:'var(--text-muted)',textAlign:'center',lineHeight:1.6}}>
            ✓ Valid for one-time entry only · Non-transferable · No refunds
          </div>

          <div style={{display:'flex',gap:12,marginTop:20}}>
            <button className="btn btn-outline" style={{flex:1}} onClick={onClose}>← Back</button>
            <button className="btn btn-primary" style={{flex:1}} onClick={()=>window.print()}>🖨 Print Ticket</button>
          </div>
        </div>
      </div>
    </div>
  );
}
