import { useState } from 'react';
import { updateClientProfile } from '../../api/authApi';
import PasswordCard from '../../components/PasswordCard';
import { PageHead, fmtDate } from './ui';

export default function ProfileSecurity({ data, reloadOverview }) {
  const { profile } = data;
  const [tab, setTab] = useState('details');
  const [form, setForm] = useState({ fullName: profile.fullName, phone: profile.phone || '' });
  const [note, setNote] = useState({ text: '', ok: false });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateClientProfile(form);
      setNote({ text: 'Details saved.', ok: true });
      reloadOverview();
    } catch (err) {
      setNote({ text: err.message, ok: false });
    }
  };

  return (
    <>
      <PageHead title="Your profile" sub={`Client since ${fmtDate(profile.memberSince)}.`} />
      <div className="cp-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'details'} className={tab === 'details' ? 'on' : ''} onClick={() => setTab('details')}>Personal details</button>
        <button type="button" role="tab" aria-selected={tab === 'security'} className={tab === 'security' ? 'on' : ''} onClick={() => setTab('security')}>Security</button>
      </div>

      {tab === 'details' ? (
        <section className="cp-card cp-form-card">
          <form noValidate onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="pfName">Full name</label>
              <input id="pfName" type="text" autoComplete="name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="pfEmail">Email</label>
              <input id="pfEmail" type="email" value={profile.email} disabled />
              <p className="cp-fine">To change your email, send us a request from Messages.</p>
            </div>
            <div className="field">
              <label htmlFor="pfPhone">Mobile number</label>
              <input id="pfPhone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <button type="submit" className="btn">Save changes</button>
            {note.text && <p className={'auth-note' + (note.ok ? ' ok' : '')} role="status">{note.text}</p>}
          </form>
        </section>
      ) : (
        <PasswordCard className="cp-card cp-form-card" />
      )}
    </>
  );
}
