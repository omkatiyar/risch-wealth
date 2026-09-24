import { createContext, useContext, useEffect, useState } from 'react';
import { fetchRiskProfilerConfig } from '../../api/riskProfilerApi';

const RiskProfilerConfigContext = createContext(null);

export function RiskProfilerConfigProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchRiskProfilerConfig()
      .then((data) => { if (!cancelled) setConfig(data); })
      .catch((err) => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, []);

  return (
    <RiskProfilerConfigContext.Provider value={{ config, error }}>
      {children}
    </RiskProfilerConfigContext.Provider>
  );
}

// Returns { config, error }. `config` is null while loading.
export function useRiskProfilerConfig() {
  const ctx = useContext(RiskProfilerConfigContext);
  if (!ctx) throw new Error('useRiskProfilerConfig must be used inside RiskProfilerConfigProvider');
  return ctx;
}
