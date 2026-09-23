export default function MandateBanner({ mandate }) {
  return (
    <>
      <div className="mandate-banner">
        <div>
          <div className="mb-label">Validated Suitability Profile</div>
          <h4>{mandate.name}</h4>
        </div>
        <div className="mb-tag">RECOMMENDED</div>
      </div>
      {mandate.note && (
        <p className="body-s" style={{ marginTop: 10, color: 'var(--muted)', fontSize: '10.5px' }}><em>{mandate.note}</em></p>
      )}
    </>
  );
}
