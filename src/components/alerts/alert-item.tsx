import { Alert as AlertType } from "@/types";
import { AlertCircle, AlertTriangle, Info, Bell, Zap, ShieldAlert, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AlertItemProps {
    alert: AlertType;
}

const alertConfig = {
    critical: {
        icon: <ShieldAlert className="h-5 w-5 text-red-500" />,
        label: "Critical Breach",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/30",
        glowColor: "shadow-red-500/20",
        accentColor: "bg-red-500"
    },
    warning: {
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        label: "Risk Monitor",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/30",
        glowColor: "shadow-yellow-500/20",
        accentColor: "bg-yellow-500"
    },
    info: {
        icon: <Info className="h-5 w-5 text-blue-500" />,
        label: "Intelligence",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/30",
        glowColor: "shadow-blue-500/20",
        accentColor: "bg-blue-500"
    }
};

export function AlertItem({ alert }: AlertItemProps) {
    const config = alertConfig[alert.type];

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: 4 }}
            className={cn(
                "relative overflow-hidden rounded-2xl border glass-card p-4 transition-all duration-300",
                config.borderColor,
                config.bgColor,
                "shadow-lg"
            )}
        >
            <div className={cn("absolute top-0 left-0 w-1 h-full", config.accentColor)} />

            <div className="flex gap-4 items-start relative z-10">
                <div className={cn(
                    "h-10 w-10 flex-shrink-0 rounded-xl flex items-center justify-center border",
                    config.borderColor,
                    "bg-white/5"
                )}>
                    {alert.type === 'critical' ? (
                        <div className="relative">
                            <div className="absolute inset-0 animate-ping opacity-20 text-red-500">
                                <ShieldAlert className="h-5 w-5" />
                            </div>
                            {config.icon}
                        </div>
                    ) : config.icon}
                </div>

                <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <span className={cn("text-[10px] font-bold uppercase tracking-widest", alert.type === 'critical' ? "text-red-400" : alert.type === 'warning' ? "text-yellow-400" : "text-blue-400")}>
                                {config.label}
                            </span>
                            {alert.type === 'critical' && (
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                            )}
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground bg-white/5 px-2 py-0.5 rounded border border-white/10 uppercase">
                            {alert.timestamp}
                        </span>
                    </div>

                    <h4 className="text-sm font-bold text-foreground leading-tight tracking-tight">
                        {alert.message}
                    </h4>

                    <div className="flex items-center gap-3 pt-2">
                        <button className="text-[10px] font-bold text-muted-foreground hover:text-foreground underline underline-offset-4 decoration-white/20">Acknowledge</button>
                        <button className="text-[10px] font-bold text-muted-foreground hover:text-foreground underline underline-offset-4 decoration-white/20">View Telemetry</button>
                    </div>
                </div>
            </div>

            {/* Background design elements */}
            <div className="absolute -bottom-2 -right-2 opacity-[0.03] pointer-events-none">
                <Zap className="h-20 w-20" />
            </div>
        </motion.div>
    );
}
