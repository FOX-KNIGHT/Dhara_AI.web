'use client';

import { useTranslation } from "@/hooks/use-translation";
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

interface WelcomeBannerProps {
    name: string;
}

export function WelcomeBanner({ name: defaultName }: WelcomeBannerProps) {
    const { t } = useTranslation();
    const [date, setDate] = useState('');
    const [name, setName] = useState(defaultName);

    useEffect(() => {
        setDate(new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
        const storedName = localStorage.getItem('dharaai_user_name');
        if (storedName) {
            setName(storedName);
        }
    }, []);

    return (
        <div className="relative overflow-hidden p-8 rounded-2xl bg-gradient-to-br from-primary/90 to-primary/40 text-primary-foreground shadow-2xl border border-white/10 backdrop-blur-xl">
            <div className="absolute inset-0 bg-aurora-hero opacity-30 pointer-events-none"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold font-headline mb-2 flex items-center gap-3 tracking-tight">
                        Welcome Back, {name}!
                        <Sparkles className="w-8 h-8 text-secondary animate-pulse" />
                    </h1>
                    <p className="text-primary-foreground/90 text-lg font-medium">{date}</p>
                </div>
            </div>
        </div>
    );
}
