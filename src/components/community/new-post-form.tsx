'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PenLine, Image as ImageIcon, Link as LinkIcon, Paperclip, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewPostFormProps {
    onAddPost: (content: string) => void;
}

const categories = ["Question", "Success Story", "Advisory", "General"];

export function NewPostForm({ onAddPost }: NewPostFormProps) {
    const [content, setContent] = useState('');
    const [activeCategory, setActiveCategory] = useState("Question");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim()) {
            onAddPost(content);
            setContent('');
        }
    };

    return (
        <Card className="glass-card border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-50 group-focus-within:opacity-100 transition-opacity" />
            <CardHeader className="pb-4">
                <CardTitle className="font-headline text-lg flex items-center gap-2">
                    <PenLine className="h-4 w-4 text-primary" />
                    Join the Discussion
                </CardTitle>
                <CardDescription className="text-xs">Share your findings or ask the DharaAI network for help.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border",
                                    activeCategory === cat
                                        ? "bg-primary/20 border-primary/30 text-primary"
                                        : "bg-white/5 border-white/5 text-muted-foreground hover:border-white/20"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <Textarea
                            placeholder={`Describe your ${activeCategory.toLowerCase()}...`}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[120px] bg-white/5 border-white/5 focus-visible:ring-primary/20 focus-visible:border-primary/30 text-sm resize-none rounded-xl transition-all"
                            required
                        />
                        <div className="absolute top-2 right-2 opacity-10 pointer-events-none">
                            <Sparkles className="h-8 w-8 text-primary" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-2">
                        <div className="flex items-center gap-1">
                            <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10">
                                <ImageIcon className="h-4 w-4" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10">
                                <LinkIcon className="h-4 w-4" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10">
                                <Paperclip className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button
                            type="submit"
                            disabled={!content.trim()}
                            className="bg-primary text-white hover:bg-emerald-600 font-bold px-8 shadow-lg shadow-primary/10 transition-all active:scale-95"
                        >
                            Publish Insight
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
