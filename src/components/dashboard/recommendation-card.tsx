'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getSmartRecommendation, SmartRecommendationInput, SmartRecommendationOutput } from '@/ai/flows/smart-recommendations';
import { Wand2, Droplets, Leaf, ShieldCheck, Sparkles, BrainCircuit } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/use-translation';
import { Separator } from '../ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function RecommendationCard() {
  const [recommendation, setRecommendation] = useState<SmartRecommendationOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const mockSensorData: SmartRecommendationInput = {
    soilMoisture: 45.2,
    lightLevel: 98,
    gasLevel: 29,
    temperature: 32.1,
    humidity: 74.0,
    nitrogen: 150,
    phosphorus: 50,
    potassium: 100,
  };

  const fetchRecommendation = async () => {
    setLoading(true);
    setError(null);
    setRecommendation(null);
    try {
      const variedData = { ...mockSensorData };
      const result = await getSmartRecommendation(variedData);
      setRecommendation(result);
    } catch (err) {
      setError('Failed to fetch recommendation. Service might be temporarily unavailable.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <Card className='flex flex-col glass-card border-primary/20 relative overflow-hidden h-full'>
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <BrainCircuit className="h-32 w-32 text-primary" />
      </div>

      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            {t('ai_recommendation')}
          </CardTitle>
          <div className="bg-primary/10 border border-primary/30 rounded-full px-2 py-0.5 flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[10px] font-bold text-primary uppercase">Gemini Pro</span>
          </div>
        </div>
        <CardDescription className="text-xs">Precision insights for optimized yield</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 flex flex-col flex-1 relative">
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 p-2"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                  <span className="text-xs font-mono text-primary animate-pulse">Analyzing satellite & sensor telemetry...</span>
                </div>
                <Skeleton className="h-16 w-full bg-primary/5" />
                <div className="grid grid-cols-3 gap-2">
                  <Skeleton className="h-20 w-full bg-primary/5" />
                  <Skeleton className="h-20 w-full bg-primary/5" />
                  <Skeleton className="h-20 w-full bg-primary/5" />
                </div>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-center"
              >
                <p className="text-sm text-destructive font-medium">{error}</p>
                <Button variant="ghost" size="sm" onClick={fetchRecommendation} className="mt-2 text-destructive hover:bg-destructive/10">Retry Analysis</Button>
              </motion.div>
            ) : recommendation ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="relative p-4 rounded-2xl bg-primary/5 border border-primary/10 overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                  <p className="text-sm text-foreground italic leading-relaxed relative z-10">
                    "{recommendation.overallAssessment}"
                  </p>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-blue-400/30 transition-colors group">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                      <Droplets className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Irrigation Path</h4>
                      <p className="text-sm text-muted-foreground leading-snug">{recommendation.irrigation}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-colors group">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                      <Leaf className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Fertilization Plan</h4>
                      <p className="text-sm text-muted-foreground leading-snug">{recommendation.fertilization}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-yellow-400/30 transition-colors group">
                    <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 group-hover:scale-110 transition-transform">
                      <ShieldCheck className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-yellow-500 uppercase tracking-wider">Health Shield</h4>
                      <p className="text-sm text-muted-foreground leading-snug">{recommendation.cropHealth}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className="flex flex-col items-center justify-center py-12 text-center space-y-4"
              >
                <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                  <Wand2 className="h-8 w-8 text-primary/40" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Ready for Intelligence?</h4>
                  <p className="text-sm text-muted-foreground px-4 mt-1">
                    Connect to the DharaAI brain to generate targeted recommendations for your crops.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button
          onClick={fetchRecommendation}
          disabled={loading}
          className={cn(
            "w-full h-12 relative overflow-hidden group transition-all duration-300",
            recommendation ? "variant-outline border-primary/30 text-primary hover:bg-primary/10" : "bg-primary text-white hover:bg-primary/90"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <Wand2 className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
          <span className="font-bold tracking-tight">
            {loading ? 'Synthesizing...' : recommendation ? 'Refresh Intelligence' : t('get_recommendation')}
          </span>
        </Button>
      </CardContent>
    </Card>
  );
}
