import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clientPortfolioAdmin, searchClients } from '../../api/authApi';
import { Icons, PageHead } from '../ClientPortal/ui';
import { OrderForm, Typeahead, initials } from './common';

const B = '/employee-portal';

// /employee-portal/purchase (choose a client first) or
// /employee-portal/clients/:id/purchase.
export default function RecordPurchase({ id }) {
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [err, setErr] = useState('');
  const findClients = useCallback((q) => searchClients(q).then((r) => r.clients), []);

  useEffect(() => {
    if (!id) { setClient(null); return; }
    clientPortfolioAdmin(id).then((r) => setClient(r.client)).catch((e) => setErr(e.message));
  }, [id]);

  return (
    <>
      <Link to={id ? `${B}/clients/${id}` : `${B}/clients`} className="sp-backlink"><Icons.back /> {id ? 'Back to client' : 'Client portfolios'}</Link>
      <PageHead title="Record a purchase" sub={client ? `Add a mutual fund purchase for ${client.fullName}.` : 'Choose the client, then enter the purchase from their statement.'} />
      {err && <p className="auth-note" role="alert">{err}</p>}

      <section className="cp-card sp-purchase">
        {!client ? (
          id ? <p className="cp-muted">Loading…</p> : (
            <div className="ta-wrap">
              <Typeahead
                id="purClient" label="Client" placeholder="Search by name, email or mobile" minLength={2}
                search={findClients}
                hint="Clients appear here once they’ve signed up on the Client Login page."
                render={(c) => <><strong>{c.fullName}</strong><span>{c.email}{c.phone ? ` · ${c.phone}` : ''} · Client ID {c.id}</span></>}
                onPick={(c) => navigate(`${B}/clients/${c.id}/purchase`)}
              />
            </div>
          )
        ) : (
          <>
            <div className="sp-client-card">
              <span className="sp-initials" aria-hidden="true">{initials(client.fullName)}</span>
              <div>
                <strong>{client.fullName}</strong>
                <span>{client.email} · Client ID {client.id}</span>
              </div>
              <Link to={`${B}/purchase`} className="btn cp-btn-sm">Change client</Link>
            </div>
            <OrderForm
              key={client.id}
              client={client}
              onSaved={(text) => navigate(`${B}/clients/${client.id}/transactions`, { state: { saved: `${text} It’s now in ${client.fullName.split(' ')[0]}’s portfolio.` } })}
            />
          </>
        )}
      </section>
    </>
  );
}
