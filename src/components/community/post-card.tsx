'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MessageCircle, ThumbsUp, MoreHorizontal, Share2, ShieldCheck, Heart } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from '../ui/badge';

interface Comment {
    author: string;
    text: string;
}
interface Post {
    id: string;
    author: string;
    avatar: string;
    timestamp: string;
    content: string;
    likes: number;
    comments: Comment[];
    likedByMe: boolean;
}

interface PostCardProps {
    post: Post;
    onLike: () => void;
    onAddComment: (commentText: string) => void;
}

export function PostCard({ post, onLike, onAddComment }: PostCardProps) {
    const [newComment, setNewComment] = useState('');
    const [isCommenting, setIsCommenting] = useState(false);

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            onAddComment(newComment);
            setNewComment('');
        }
    };

    const isExpert = post.author === 'Vijay Singh' || post.author === 'Sita Devi';

    return (
        <Collapsible asChild open={isCommenting} onOpenChange={setIsCommenting}>
            <Card className="glass-card border-white/5 overflow-hidden hover:border-primary/20 transition-all duration-300 group">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Avatar className="ring-2 ring-primary/20 ring-offset-2 ring-offset-background group-hover:ring-primary/40 transition-all">
                                    <AvatarImage src={post.avatar} alt={post.author} />
                                    <AvatarFallback className="bg-primary/10 text-primary">{post.author.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {isExpert && (
                                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                        <ShieldCheck className="h-3 w-3 text-primary fill-primary/10" />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-sm tracking-tight text-foreground group-hover:text-primary transition-colors">{post.author}</p>
                                    {isExpert && <Badge variant="secondary" className="text-[8px] h-4 bg-primary/10 text-primary border-none font-bold uppercase tracking-wider">Expert</Badge>}
                                </div>
                                <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                                    <span className="h-1 w-1 rounded-full bg-muted-foreground opacity-50" />
                                    {post.timestamp}
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pb-4">
                    <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap font-medium">
                        {post.content}
                    </p>
                </CardContent>
                <CardFooter className="flex-col items-start bg-white/2 border-t border-white/5 pt-3">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex gap-4">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={onLike}
                                className={cn(
                                    "flex items-center gap-2 text-xs font-bold transition-colors",
                                    post.likedByMe ? "text-primary" : "text-muted-foreground hover:text-primary"
                                )}
                            >
                                <Heart className={cn("h-4 w-4 transition-all", post.likedByMe && "fill-primary stroke-primary")} />
                                <span>{post.likes}</span>
                            </motion.button>

                            <CollapsibleTrigger asChild>
                                <button className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>{post.comments.length}</span>
                                </button>
                            </CollapsibleTrigger>
                        </div>

                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-emerald-400">
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>

                    <CollapsibleContent className="w-full space-y-4 overflow-hidden">
                        <div className="pt-4 space-y-4">
                            <Separator className="bg-white/5" />
                            <div className="space-y-4">
                                {post.comments.map((comment, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-start gap-3"
                                    >
                                        <Avatar className="h-7 w-7 border border-white/10">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author}`} alt={comment.author} />
                                            <AvatarFallback className="text-[10px]">{comment.author.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none flex-1 border border-white/5">
                                            <p className="font-bold text-[10px] text-primary uppercase tracking-wider">{comment.author}</p>
                                            <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{comment.text}</p>
                                        </div>
                                    </motion.div>
                                ))}
                                {post.comments.length === 0 && (
                                    <div className="py-6 text-center">
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-50">Be the first to reply</p>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleCommentSubmit} className="flex gap-2 pt-2 relative">
                                <Textarea
                                    placeholder="Add to the conversation..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="min-h-[44px] bg-white/5 border-white/5 text-xs focus-visible:ring-primary/20 rounded-xl py-3 resize-none"
                                />
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={!newComment.trim()}
                                    className="h-[44px] px-4 bg-primary text-white hover:bg-emerald-600 font-bold"
                                >
                                    Reply
                                </Button>
                            </form>
                        </div>
                    </CollapsibleContent>
                </CardFooter>
            </Card>
        </Collapsible>
    );
}
