import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/api/client';

const SystemStatusContext = createContext({
  status: { maintenance_mode: 'none', maintenance_message: '' },
  isLoading: true,
  isWakingUp: false,
  refreshStatus: () => {},
});

export const SystemStatusProvider = ({ children }) => {
  const [status, setStatus] = useState({ maintenance_mode: 'none', maintenance_message: '' });
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatus = async () => {
    // Start a timer to detect "Cold Start" if the backend doesn't respond in 2.5 seconds
    const wakingUpTimer = setTimeout(() => {
      if (isLoading) setIsWakingUp(true);
    }, 2500);

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
          api_debug_mode: safeParse(rawStatus.api_debug_mode),
          hero_banner_image: rawStatus.hero_banner_image || '',
          hero_banner_texts: safeParse(rawStatus.hero_banner_texts) || [],
          admin_bypass_pin: safeParse(rawStatus.admin_bypass_pin)
        });
      }
    } catch (error) {
      console.error('[SystemStatusContext] Failed to fetch system status:', error);
    } finally {
      clearTimeout(wakingUpTimer);
      setIsWakingUp(false);
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
    <SystemStatusContext.Provider value={{ status, isLoading, isWakingUp, refreshStatus: fetchStatus }}>
      {children}
    </SystemStatusContext.Provider>
  );
};

export const useSystemStatus = () => useContext(SystemStatusContext);
