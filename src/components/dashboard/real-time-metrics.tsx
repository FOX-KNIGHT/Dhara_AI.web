import { useState, useEffect } from 'react';
import { MetricCard } from './metric-card';
import { Thermometer, Wind, Droplets, Mountain, Leaf, Zap } from 'lucide-react';
import type { SensorData } from '@/types';
import { useTranslation } from '@/hooks/use-translation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { motion } from 'framer-motion';

const initialData: SensorData = {
  soilMoisture: 45.2,
  lightLevel: 98,
  gasLevel: 29,
  temperature: 32.1,
  humidity: 74.0,
  nitrogen: 150,
  phosphorus: 50,
  potassium: 100,
  timestamp: Date.now(),
};

export default function RealTimeMetrics() {
  const [data, setData] = useState<SensorData>(initialData);
  const [lastUpdated, setLastUpdated] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    setLastUpdated(new Date(initialData.timestamp).toLocaleTimeString());

    const interval = setInterval(() => {
      const newTimestamp = Date.now();
      setData((prevData) => ({
        soilMoisture: parseFloat((prevData.soilMoisture + (Math.random() - 0.5)).toFixed(1)),
        temperature: parseFloat((prevData.temperature + (Math.random() - 0.5) * 0.2).toFixed(1)),
        humidity: parseFloat((prevData.humidity + (Math.random() - 0.5)).toFixed(1)),
        nitrogen: Math.round(prevData.nitrogen + (Math.random() - 0.5) * 2),
        phosphorus: Math.round(prevData.phosphorus + (Math.random() - 0.5) * 1),
        potassium: Math.round(prevData.potassium + (Math.random() - 0.5) * 1.5),
        lightLevel: 98,
        gasLevel: 29,
        timestamp: newTimestamp,
      }));
      setLastUpdated(new Date(newTimestamp).toLocaleTimeString());
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="glass-card border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Zap className="h-24 w-24 text-primary" />
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              {t('real_time_data')}
            </CardTitle>
            {lastUpdated && <CardDescription className="flex items-center gap-2">
              <span className="opacity-50">{t('last_updated')}</span>
              <span className="font-mono text-primary/80">{lastUpdated}</span>
            </CardDescription>}
          </div>
          <div className="hidden sm:block">
            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] text-primary font-bold uppercase tracking-wider">
              Live Stream
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 relative">
        <MetricCard
          title={t('soil_moisture')}
          value={data.soilMoisture}
          unit="%"
          icon={<Droplets className="h-4 w-4" />}
          trend={{ value: 2.1, isPositive: true }}
        />
        <MetricCard
          title={t('temperature')}
          value={data.temperature}
          unit="°C"
          icon={<Thermometer className="h-4 w-4" />}
          trend={{ value: 0.4, isPositive: false }}
        />
        <MetricCard
          title={t('humidity')}
          value={data.humidity}
          unit="%"
          icon={<Wind className="h-4 w-4" />}
          trend={{ value: 1.2, isPositive: true }}
        />
        <MetricCard
          title={t('nitrogen')}
          value={data.nitrogen}
          unit="mg/kg"
          icon={<Leaf className="h-4 w-4" />}
          trend={{ value: 5.4, isPositive: true }}
        />
        <MetricCard
          title={t('phosphorus')}
          value={data.phosphorus}
          unit="mg/kg"
          icon={<Mountain className="h-4 w-4" />}
          trend={{ value: 0.8, isPositive: false }}
        />
        <MetricCard
          title={t('potassium')}
          value={data.potassium}
          unit="mg/kg"
          icon={<Mountain className="h-4 w-4" />}
          trend={{ value: 3.2, isPositive: true }}
        />
      </CardContent>
    </Card>
  );
}
