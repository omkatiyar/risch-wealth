import RiskProfiler from '../RiskProfiler/RiskProfiler';

// The eight-question assessment, inside the portal. The client's details
// are filled in, and the portal's risk profile reloads once it's saved.
export default function RiskAssessment({ data, reloadOverview }) {
  const { profile } = data;
  return (
    <RiskProfiler
      embedded
      prefill={{ name: profile.fullName, email: profile.email, phone: profile.phone || '' }}
      onSaved={reloadOverview}
    />
  );
}
