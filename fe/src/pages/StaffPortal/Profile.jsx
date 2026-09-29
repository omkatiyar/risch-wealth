import PasswordCard from '../../components/PasswordCard';
import { PageHead } from '../ClientPortal/ui';
import { initials } from './common';

export default function Profile({ user }) {
  return (
    <>
      <PageHead title="Profile & security" sub="Your account details and password." />
      <section className="cp-card sp-profile">
        <div>
          <h2 className="cp-card-title">Profile information</h2>
          <dl className="sp-dl">
            <div><dt>Full name</dt><dd>{user.fullName}</dd></div>
            <div><dt>Employee ID</dt><dd>{user.employeeId}</dd></div>
            <div><dt>Work email</dt><dd>{user.email}</dd></div>
            <div><dt>Role</dt><dd>{user.role === 'admin' ? 'Admin' : 'Employee'}</dd></div>
          </dl>
          <p className="cp-fine">To change these details, ask an administrator.</p>
        </div>
        <span className="sp-initials sp-initials-lg" aria-hidden="true">{initials(user.fullName)}</span>
      </section>
      <PasswordCard className="cp-card cp-form-card" />
    </>
  );
}
