import React from 'react';

// ==========================================
// 1. LINE CHART COMPONENT
// ==========================================
export const LineChart = ({ data = [], height = 180, color = 'var(--color-primary)' }) => {
  const padding = 30;
  const chartHeight = height;
  const chartWidth = 500;

  if (data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        No data available to plot
      </div>
    );
  }

  const values = data.map(d => d.value);
  const maxVal = Math.max(...values, 1);
  const minVal = Math.min(...values, 0);
  const range = maxVal - minVal || 1;

  const points = data.map((d, i) => {
    const x = padding + (i * (chartWidth - padding * 2)) / (data.length - 1 || 1);
    const y = chartHeight - padding - ((d.value - minVal) / range) * (chartHeight - padding * 2);
    return { x, y, label: d.label, value: d.value };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z` 
    : '';

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height={chartHeight} style={{ overflow: 'visible' }}>
        {/* Horizontal grid lines */}
        <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="var(--glass-border)" strokeWidth={1} strokeDasharray="3 3" />
        <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="var(--glass-border)" strokeWidth={1} strokeDasharray="3 3" />
        <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="var(--glass-border)" strokeWidth={1} />

        {/* Filled Area */}
        {areaPath && <path d={areaPath} fill="var(--color-primary-glow)" opacity={0.4} style={{ transition: 'all 0.3s ease' }} />}

        {/* Plot Line */}
        {linePath && <path d={linePath} fill="transparent" stroke={color} strokeWidth={2.5} strokeLinecap="round" style={{ transition: 'all 0.3s ease' }} />}

        {/* Dots + Labels */}
        {points.map((p, idx) => (
          <g key={idx}>
            <circle cx={p.x} cy={p.y} r={4} fill="var(--bg-secondary)" stroke={color} strokeWidth={2} className="hover-scale" style={{ cursor: 'pointer', transition: 'all 0.2s ease' }} />
            {/* Tooltip value */}
            <text x={p.x} y={p.y - 8} textAnchor="middle" style={{ fontSize: '9px', fill: 'var(--text-primary)', fontWeight: 700, fontFamily: 'var(--mono)' }}>
              {p.value}
            </text>
            {/* Axis Label */}
            <text x={p.x} y={chartHeight - 8} textAnchor="middle" style={{ fontSize: '9px', fill: 'var(--text-muted)', fontWeight: 600 }}>
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// ==========================================
// 2. BAR CHART COMPONENT
// ==========================================
export const BarChart = ({ data = [], height = 180, color = 'var(--color-secondary)' }) => {
  const padding = 30;
  const chartHeight = height;
  const chartWidth = 500;

  if (data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        No data available to plot
      </div>
    );
  }

  const values = data.map(d => d.value);
  const maxVal = Math.max(...values, 1);
  const minVal = 0;
  const range = maxVal - minVal || 1;

  const barWidth = Math.min(40, (chartWidth - padding * 2) / (data.length * 1.5 || 1));
  const spacing = (chartWidth - padding * 2 - barWidth * data.length) / (data.length - 1 || 1);

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height={chartHeight} style={{ overflow: 'visible' }}>
        {/* Grid lines */}
        <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="var(--glass-border)" strokeWidth={1} strokeDasharray="3 3" />
        <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="var(--glass-border)" strokeWidth={1} strokeDasharray="3 3" />
        <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="var(--glass-border)" strokeWidth={1} />

        {data.map((d, i) => {
          const x = padding + i * (barWidth + spacing);
          const barHeight = ((d.value - minVal) / range) * (chartHeight - padding * 2);
          const y = chartHeight - padding - barHeight;

          return (
            <g key={i}>
              {/* Vertical Column Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(2, barHeight)}
                rx={4}
                fill={color}
                opacity={0.85}
                style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                className="glass-card-hover"
              />
              {/* Value Label */}
              <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" style={{ fontSize: '9px', fill: 'var(--text-primary)', fontWeight: 700, fontFamily: 'var(--mono)' }}>
                {d.value}
              </text>
              {/* Axis Label */}
              <text x={x + barWidth / 2} y={chartHeight - 8} textAnchor="middle" style={{ fontSize: '9px', fill: 'var(--text-muted)', fontWeight: 600 }}>
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ==========================================
// 3. DOUGHNUT CHART COMPONENT
// ==========================================
export const DoughnutChart = ({ data = [], size = 120 }) => {
  const radius = 35;
  const circ = 2 * Math.PI * radius;
  const strokeWidth = 10;
  const center = size / 2;

  const total = data.reduce((acc, d) => acc + (d.value || 0), 0) || 1;

  let accumulatedPercent = 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
        <svg height={size} width={size}>
          {/* Base Background Circle */}
          <circle cx={center} cy={center} r={radius} fill="transparent" stroke="var(--glass-border)" strokeWidth={strokeWidth} />
          
          {/* Segment Arcs */}
          {data.map((seg, idx) => {
            const pct = (seg.value / total) * 100;
            const offset = circ - (pct / 100) * circ;
            const rotation = (accumulatedPercent * 360) / 100 - 90;
            accumulatedPercent += pct;

            if (seg.value === 0) return null;

            return (
              <circle
                key={idx}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={circ}
                strokeDashoffset={offset}
                style={{
                  strokeLinecap: 'round',
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: `${center}px ${center}px`,
                  transition: 'all 0.3s ease'
                }}
              />
            );
          })}
        </svg>

        {/* Central Display */}
        <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {total === 1 && data.every(d => d.value === 0) ? 0 : total}
          </span>
          <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total</span>
        </div>
      </div>

      {/* Legend Grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 16px', justifyContent: 'center', fontSize: '0.75rem' }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.color }} />
            <span style={{ color: 'var(--text-secondary)' }}>
              {d.label}: {d.value} ({Math.round((d.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 4. ACTIVITY HEATMAP COMPONENT
// ==========================================
export const ActivityHeatmap = ({ data = {} }) => {
  // Renders a grid representing activity levels (0 to 4) over the last 12 weeks
  const weeks = 12;
  const days = 7;
  const cellWidth = 11;
  const gap = 3;
  const padding = 20;

  const width = weeks * (cellWidth + gap) + padding * 2;
  const height = days * (cellWidth + gap) + padding * 2;

  const levels = [
    'var(--glass-border)',
    'rgba(79, 70, 229, 0.15)',
    'rgba(79, 70, 229, 0.35)',
    'rgba(79, 70, 229, 0.6)',
    'var(--color-primary)'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ overflow: 'visible' }}>
        {Array.from({ length: weeks }).map((_, w) => (
          <g key={w}>
            {Array.from({ length: days }).map((_, d) => {
              const x = padding + w * (cellWidth + gap);
              const y = padding + d * (cellWidth + gap);
              
              // Determine simulated activity level based on key or generate random nice patterns
              const key = `${w}-${d}`;
              const level = data[key] !== undefined ? data[key] : (Math.sin(w + d) > 0.4 ? Math.floor(Math.random() * 5) : 0);

              return (
                <rect
                  key={d}
                  x={x}
                  y={y}
                  width={cellWidth}
                  height={cellWidth}
                  rx={2}
                  fill={levels[level]}
                  style={{ transition: 'fill 0.2s ease', cursor: 'pointer' }}
                  title={`Activity Level: ${level}`}
                />
              );
            })}
          </g>
        ))}
      </svg>
      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', color: 'var(--text-muted)', alignSelf: 'flex-end', paddingRight: '20px' }}>
        <span>Less</span>
        {levels.map((c, i) => (
          <div key={i} style={{ width: '8px', height: '8px', borderRadius: '1.5px', background: c }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};
