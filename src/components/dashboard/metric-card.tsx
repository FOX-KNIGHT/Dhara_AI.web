import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: ReactNode;
  className?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function MetricCard({ title, value, unit, icon, className, trend }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      viewport={{ once: true }}
    >
      <Card className={cn("glass-card border-white/5 overflow-hidden group transition-all duration-300", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">{title}</CardTitle>
          <div className="text-muted-foreground group-hover:text-primary transition-colors duration-300 transform group-hover:scale-110">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-1">
            <div className="text-2xl font-bold font-headline text-glow group-hover:text-primary transition-colors duration-500">{value}</div>
            <span className="text-xs text-muted-foreground font-medium">{unit}</span>
          </div>
          {trend && (
            <div className={cn(
              "text-[10px] mt-1 font-medium flex items-center gap-1",
              trend.isPositive ? "text-emerald-400" : "text-rose-400"
            )}>
              <span>{trend.isPositive ? '↑' : '↓'} {trend.value}%</span>
              <span className="text-muted-foreground font-normal">than typical</span>
            </div>
          )}
        </CardContent>
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-500" />
      </Card>
    </motion.div>
  );
}
