export default function Donut({ title, segments }) {
  let acc = 0;
  const stops = segments
    .map((s) => {
      const start = acc;
      acc += s.value;
      const end = acc;
      return `${s.color} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
    })
    .join(', ');

  return (
    <div className="donut-block">
      <div className="d-title">{title}</div>
      <div className="donut-ring" style={{ background: `conic-gradient(${stops})` }}></div>
      <div className="donut-legend">
        {segments.map((s) => (
          <span key={s.label}>
            <span className="lbl"><i style={{ background: s.color }}></i>{s.label}</span>
            <b>{s.value.toFixed(1)}%</b>
          </span>
        ))}
      </div>
    </div>
  );
}
