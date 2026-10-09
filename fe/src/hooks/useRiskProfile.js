import { useEffect, useState } from 'react';
import { listRiskProfiles, sessionStatus } from '../api/authApi';

// The visitor's saved risk profile, for pages that adapt to it. The only
// place a result is stored is the signed-in client's account (the
// risk_profiles table, via /api/client/risk-profiles), so that is what this
// reads; an anonymous visitor's result lives only in their open browser tab.
//
//   status   'loading' | 'notStarted' | 'complete' | 'error'
//   profile  { id, tier, tierName, createdAt, allocation: { india, intl, debt, cash } } | null
//   isClient whether a client account is signed in (decides where the
//            "start the risk profile" link should point)
export function useRiskProfile() {
  const [state, setState] = useState({ status: 'loading', profile: null, isClient: false });

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const { user } = await sessionStatus();
        if (!user || user.role !== 'client') return { status: 'notStarted', profile: null, isClient: false };
        const { riskProfiles } = await listRiskProfiles();
        const profile = riskProfiles[0] || null;
        return { status: profile ? 'complete' : 'notStarted', profile, isClient: true };
      } catch {
        return { status: 'error', profile: null, isClient: false };
      }
    })().then((s) => { if (live) setState(s); });
    return () => { live = false; };
  }, []);

  return state;
}
