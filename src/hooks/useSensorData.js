import { useEffect } from 'react';
import { subscribeToLatestReading } from '../services/sensor.service';
import useAppStore from '../store/useAppStore';
import { SENSOR_STATUS } from '../constants/thresholds';

const OFFLINE_TIMEOUT_MS = 30000;

const useSensorData = () => {
  const setLatestReading = useAppStore((s) => s.setLatestReading);
  const setSensorStatus = useAppStore((s) => s.setSensorStatus);
  const latestReading = useAppStore((s) => s.latestReading);
  const sensorStatus = useAppStore((s) => s.sensorStatus);

  useEffect(() => {
    const unsubscribe = subscribeToLatestReading((data) => {
      if (!data) {
        setSensorStatus(SENSOR_STATUS.OFFLINE);
        return;
      }
      setLatestReading(data);
      const age = Date.now() - data.timestamp;
      setSensorStatus(
        age > OFFLINE_TIMEOUT_MS ? SENSOR_STATUS.OFFLINE : SENSOR_STATUS.ACTIVE
      );
    });
    return unsubscribe;
  }, []);

  return { latestReading, sensorStatus };
};

export default useSensorData;
