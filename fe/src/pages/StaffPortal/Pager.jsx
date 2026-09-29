// "Showing 1–10 of 38 clients" with page buttons.
export function Pager({
  page, pageSize, total, onPage, noun,
}) {
  if (!total) return null;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);
  return (
    <div className="cp-pager">
      <span>Showing {first}–{last} of {total} {noun}</span>
      {pages > 1 && (
        <nav aria-label="Pages">
          <button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label="Previous page">‹</button>
          {Array.from({ length: pages }, (_, i) => i + 1)
            .filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 1)
            .map((n, i, arr) => (
              <span key={n}>
                {i > 0 && n - arr[i - 1] > 1 && <span className="cp-ellipsis">…</span>}
                <button type="button" className={n === page ? 'on' : ''} aria-current={n === page ? 'page' : undefined} onClick={() => onPage(n)}>{n}</button>
              </span>
            ))}
          <button type="button" disabled={page >= pages} onClick={() => onPage(page + 1)} aria-label="Next page">›</button>
        </nav>
      )}
    </div>
  );
}
