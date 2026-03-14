import { useEffect } from 'react';
import { subscribeToAlerts } from '../services/sensor.service';
import useAppStore from '../store/useAppStore';

/**
 * Subscribes to real-time alerts from Firestore.
 * Updates global store with latest alerts array.
 * Used by: Alerts screen
 */
const useAlerts = () => {
  const setAlerts = useAppStore((s) => s.setAlerts);
  const alerts = useAppStore((s) => s.alerts);

  useEffect(() => {
    const unsubscribe = subscribeToAlerts((data) => {
      setAlerts(data);
    });
    return unsubscribe;
  }, []);

  return { alerts };
};

export default useAlerts;