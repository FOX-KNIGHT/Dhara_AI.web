'use client';

import { AlertItem } from "@/components/alerts/alert-item";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Alert } from "@/types";
import { motion } from "framer-motion";
import { Bell, Activity, ShieldCheck, Zap, Filter, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mockAlerts: Alert[] = [
    { id: '1', type: 'critical', message: 'Soil moisture is critically low (20%). Immediate irrigation required.', timestamp: '2 hours ago' },
    { id: '2', type: 'warning', message: 'Temperature approaching critical threshold (38°C). Monitor crop stress.', timestamp: '1 day ago' },
    { id: '3', type: 'info', message: 'Nitrogen levels are optimal after recent fertilization.', timestamp: '2 days ago' },
    { id: '4', type: 'warning', message: 'Phosphorus levels are slightly below the recommended range.', timestamp: '3 days ago' },
];

export default function AlertsPage() {
    const { t } = useTranslation();
    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-[10px] uppercase">
                        <Activity className="h-3 w-3 animate-pulse text-red-500" />
                        Live Security Feed
                    </div>
                    <h1 className="text-4xl font-headline font-bold text-glow tracking-tight">Command Center</h1>
                    <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
                        Automated monitoring systems are online. Review critical breaches and environmental anomalies.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/5 text-emerald-400 py-1 px-3">
                        <ShieldCheck className="h-3 w-3 mr-1" /> All Systems Nominal
                    </Badge>
                    <Button size="icon" variant="ghost" className="glass-card border-white/5 h-10 w-10">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </header>

            <div className="grid md:grid-cols-3 gap-6">
                {[
                    { label: "Active Alerts", value: "02", color: "text-red-500", icon: Bell },
                    { label: "Resolved", value: "14", color: "text-emerald-500", icon: ShieldCheck },
                    { label: "Uptime", value: "99.9%", color: "text-blue-500", icon: Zap },
                ].map((stat, i) => (stat && (
                    <Card key={i} className="glass-card border-white/5 group hover:border-primary/20 transition-all overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <stat.icon className="h-12 w-12" />
                        </div>
                        <CardContent className="p-6">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                            <h3 className={cn("text-3xl font-headline font-bold mt-1", stat.color)}>{stat.value}</h3>
                        </CardContent>
                    </Card>
                )))}
            </div>

            <Card className="glass-card border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 bg-white/5 py-4">
                    <div>
                        <CardTitle className="text-lg font-headline flex items-center gap-2">
                            Notification Log
                        </CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold tracking-widest text-primary">Clear All</Button>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {mockAlerts.map((alert, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <AlertItem alert={alert} />
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-center">
                        <Button variant="outline" className="border-white/10 text-xs text-muted-foreground hover:text-foreground">
                            Load Historical Logs
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
