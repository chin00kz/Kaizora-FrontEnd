import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/api/client';

const SystemStatusContext = createContext({
  status: { maintenance_mode: 'none', maintenance_message: '' },
  isLoading: true,
  refreshStatus: () => {},
});

export const SystemStatusProvider = ({ children }) => {
  const [status, setStatus] = useState({ maintenance_mode: 'none', maintenance_message: '' });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const response = await api.get('/system/status');
      if (response.data.status === 'success') {
        const rawStatus = response.data.data.status;
        
        const safeParse = (val) => {
          if (typeof val !== 'string') return val;
          try { return JSON.parse(val); } catch (e) { return val; }
        };

        setStatus({
          maintenance_mode: safeParse(rawStatus.maintenance_mode),
          maintenance_message: safeParse(rawStatus.maintenance_message),
          api_debug_mode: safeParse(rawStatus.api_debug_mode)
        });
      }
    } catch (error) {
      console.error('[SystemStatusContext] Failed to fetch system status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Poll every 30 seconds for maintenance updates
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SystemStatusContext.Provider value={{ status, isLoading, refreshStatus: fetchStatus }}>
      {children}
    </SystemStatusContext.Provider>
  );
};

export const useSystemStatus = () => useContext(SystemStatusContext);
