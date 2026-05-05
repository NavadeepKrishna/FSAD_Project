/* SVG-based mini bar chart — zero dependencies */
export function BarChart({ data, height = 140, color = 'var(--accent-cyan)' }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const barW = Math.floor(100 / data.length);

  return (
    <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{ width:'100%', height, display:'block' }}>
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--accent-violet)" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {data.map((d, i) => {
        const bh = (d.value / max) * (height - 20);
        const x = i * barW + barW * 0.15;
        const w = barW * 0.7;
        return (
          <g key={i}>
            <rect
              x={x} y={height - 20 - bh}
              width={w} height={bh}
              rx="2" fill="url(#barGrad)"
              opacity="0.85"
            />
            <text
              x={x + w / 2} y={height - 4}
              textAnchor="middle"
              fontSize="5" fill="rgba(123,167,196,0.8)"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function DonutChart({ segments, size = 120 }) {
  const total = segments.reduce((s, d) => s + d.value, 0) || 1;
  const r = 40; const cx = 60; const cy = 60;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="18" />
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circ;
        const gap  = circ - dash;
        const el = (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="18"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
        );
        offset += dash;
        return el;
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="14" fontWeight="700" fill="white">
        {total}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="7" fill="rgba(123,167,196,0.8)">
        total
      </text>
    </svg>
  );
}

export function SparkLine({ data, color = 'var(--accent-cyan)', height = 50 }) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 200; const h = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return `${x},${y}`;
  });
  const polyline = pts.join(' ');
  const area = `0,${h} ${polyline} ${w},${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width:'100%', height, display:'block' }}>
      <defs>
        <linearGradient id={`spk-${color.replace(/[^a-z]/gi,'')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#spk-${color.replace(/[^a-z]/gi,'')})`} />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Last point dot */}
      <circle cx={pts[pts.length-1].split(',')[0]} cy={pts[pts.length-1].split(',')[1]} r="3" fill={color} />
    </svg>
  );
}
