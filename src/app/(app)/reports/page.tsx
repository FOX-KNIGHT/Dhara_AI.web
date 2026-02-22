'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/reports/date-picker-range";
import { Download, FileText, Database, ShieldCheck, History, Search, Filter, Sparkles } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const availableDataPoints = [
    { id: "soilMoisture", label: "Soil Moisture", category: "Physical" },
    { id: "temperature", label: "Temperature", category: "Ambient" },
    { id: "humidity", label: "Humidity", category: "Ambient" },
    { id: "nitrogen", label: "Nitrogen (N)", category: "Chemical" },
    { id: "phosphorus", label: "Phosphorus (P)", category: "Chemical" },
    { id: "potassium", label: "Potassium (K)", category: "Chemical" },
];

const mockArchives = [
    { name: "Yield_Audit_Jan26.csv", date: "Jan 15, 2026", size: "2.4 MB" },
    { name: "Fertility_Map_Q4.pdf", date: "Dec 28, 2025", size: "8.1 MB" },
    { name: "Sensor_Telemetry_Logs.csv", date: "Feb 02, 2026", size: "12.7 MB" },
];

export default function ReportsPage() {
    const { t } = useTranslation();

    const handleExport = () => {
        const headers = "Date,Soil Moisture (%),Temperature (°C),Humidity (%),Nitrogen (mg/kg),Phosphorus (mg/kg),Potassium (mg/kg)\n";
        const rows = Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return `${date.toISOString().split('T')[0]},${(45 + Math.random() * 10).toFixed(1)},${(30 + Math.random() * 5).toFixed(1)},${(70 + Math.random() * 10).toFixed(1)},${(150 + Math.random() * 20).toFixed(0)},${(50 + Math.random() * 10).toFixed(0)},${(100 + Math.random() * 15).toFixed(0)}`;
        }).join('\n');

        const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "dharaai_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-[10px] uppercase">
                        <Database className="h-3 w-3" />
                        Central Repository
                    </div>
                    <h1 className="text-4xl font-headline font-bold text-glow tracking-tight">Digital Data Vault</h1>
                    <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
                        Access high-fidelity historical records and generated intelligence reports from your farm's telemetry bank.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary py-1 px-3">
                        <ShieldCheck className="h-3 w-3 mr-1" /> Secure Access
                    </Badge>
                </div>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 glass-card border-white/5 relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                    <CardHeader className="border-b border-white/5 bg-white/5">
                        <CardTitle className="text-lg font-headline flex items-center gap-2">
                            <Filter className="h-4 w-4 text-primary" />
                            Configuration & Extraction
                        </CardTitle>
                        <CardDescription>Select parameters for custom data export</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-10 flex-1">
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Search className="h-3 w-3" />
                                1. Temporal Window
                            </Label>
                            <div className="max-w-md">
                                <DatePickerWithRange />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Search className="h-3 w-3" />
                                2. Telemetry Parameters
                            </Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {availableDataPoints.map((item, idx) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="relative group h-full"
                                    >
                                        <div className="absolute inset-0 bg-primary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <Label
                                            htmlFor={item.id}
                                            className="flex flex-col gap-2 p-4 rounded-xl border border-white/5 hover:border-primary/30 transition-all cursor-pointer bg-white/5 h-full"
                                        >
                                            <div className="flex justify-between items-start">
                                                <Checkbox id={item.id} defaultChecked className="mt-1 border-white/20" />
                                                <span className="text-[8px] font-bold text-primary/50 uppercase tracking-tighter self-end">{item.category}</span>
                                            </div>
                                            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{item.label}</span>
                                        </Label>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                    <div className="p-6 bg-white/5 border-t border-white/5 mt-auto">
                        <Button
                            onClick={handleExport}
                            size="lg"
                            className="w-full h-14 bg-primary text-white hover:bg-emerald-600 shadow-xl shadow-primary/10 group overflow-hidden relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <Download className="mr-3 h-5 w-5" />
                            <span className="font-bold text-lg">{t('export_csv')}</span>
                        </Button>
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card className="glass-card border-white/5">
                        <CardHeader>
                            <CardTitle className="text-lg font-headline flex items-center gap-2">
                                <History className="h-4 w-4 text-primary" />
                                Vault History
                            </CardTitle>
                            <CardDescription>Recently generated datasets</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {mockArchives.map((archive, i) => (
                                <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5">
                                    <div className="h-10 w-10 flex-shrink-0 rounded bg-white/10 flex items-center justify-center">
                                        <FileText className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-foreground truncate">{archive.name}</p>
                                        <p className="text-[10px] text-muted-foreground">{archive.date} • {archive.size}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button variant="outline" className="w-full border-white/10 text-xs h-9">View Complete Archives</Button>
                        </CardContent>
                    </Card>

                    <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/20 space-y-3 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none group-hover:scale-125 transition-transform">
                            <Database className="h-16 w-16" />
                        </div>
                        <h4 className="font-bold text-primary flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            Automated Sync
                        </h4>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                            Telemetry data is automatically vaulted every 24 hours. Connect your API to enable real-time cloud synchronization.
                        </p>
                        <Button variant="link" className="p-0 text-primary h-auto text-[11px] font-bold">Configure Sync Settings →</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
