'use client';

import { useState } from 'react';
import { useTranslation } from "@/hooks/use-translation";
import { NewPostForm } from '@/components/community/new-post-form';
import { PostCard } from '@/components/community/post-card';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, TrendingUp, Award, MessageSquare, Zap, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const initialPosts = [
    {
        id: '1',
        author: 'Ram Kumar',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ram',
        timestamp: '2 hours ago',
        content: "My wheat crop is showing signs of yellowing leaves. I've already applied urea, but it's not helping. Any suggestions for what might be the cause? Could it be a nutrient deficiency other than nitrogen?",
        likes: 12,
        comments: [
            { author: 'Sita Devi', text: 'It could be a sulfur deficiency. Have you tested your soil for that recently?' },
            { author: 'Vijay Singh', text: 'Check the pH of your soil as well. High pH can block nutrient uptake.' },
        ],
        likedByMe: false,
    },
    {
        id: '2',
        author: 'Sita Devi',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sita',
        timestamp: '1 day ago',
        content: "Has anyone tried the new drought-resistant maize variety (Pioneer P3501)? I'm thinking of planting it this season in the Vidarbha region. Looking for feedback on its yield and water requirements.",
        likes: 25,
        comments: [],
        likedByMe: true,
    },
    {
        id: '3',
        author: 'Vijay Singh',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vijay',
        timestamp: '3 days ago',
        content: "Sharing a success story! I used the AI recommendation for drip irrigation scheduling, and it's saved me almost 30% on my water usage for my tomato crop without affecting the yield. Highly recommend trusting the AI!",
        likes: 42,
        comments: [],
        likedByMe: false,
    }
];

const trendingTopics = ["Sustainable Farming", "Water Conservation", "Market Fluctuations", "Pest Management", "Soil pH Fixes"];

export default function CommunityForumPage() {
    const { t } = useTranslation();
    const [posts, setPosts] = useState(initialPosts);

    const handleAddPost = (content: string) => {
        const newPost = {
            id: `${Date.now()}`,
            author: 'Vivek',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vivek',
            timestamp: 'Just now',
            content,
            likes: 0,
            comments: [],
            likedByMe: false,
        };
        setPosts([newPost, ...posts]);
    };

    const handleLikePost = (postId: string) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    likes: post.likedByMe ? post.likes - 1 : post.likes + 1,
                    likedByMe: !post.likedByMe
                };
            }
            return post;
        }));
    };

    const handleAddComment = (postId: string, commentText: string) => {
        const newComment = {
            author: 'Vivek',
            text: commentText
        };
        setPosts(posts.map(post =>
            post.id === postId
                ? { ...post, comments: [...post.comments, newComment] }
                : post
        ));
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-[10px] uppercase">
                        <Users className="h-3 w-3" />
                        Global Agri-Hub
                    </div>
                    <h1 className="text-4xl font-headline font-bold text-glow tracking-tight">Community Forum</h1>
                    <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
                        Connect with fellow farmers, share insights, and get expert advice from the DharaAI network.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input placeholder="Search discussions..." className="pl-10 glass-card bg-white/2 border-white/5 h-10 text-xs focus:ring-primary/20" />
                    </div>
                    <Button className="bg-primary text-white hover:bg-emerald-600 h-10 text-xs font-bold px-6 shadow-lg shadow-primary/10">Ask a Question</Button>
                </div>
            </header>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-6">
                    <NewPostForm onAddPost={handleAddPost} />

                    <div className="space-y-4">
                        <AnimatePresence initial={false}>
                            {posts.map(post => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    layout
                                >
                                    <PostCard
                                        post={post}
                                        onLike={() => handleLikePost(post.id)}
                                        onAddComment={(commentText) => handleAddComment(post.id, commentText)}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                <aside className="lg:col-span-4 space-y-6">
                    <Card className="glass-card border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <TrendingUp className="h-16 w-16" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                <Zap className="h-4 w-4" />
                                Trending Topics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {trendingTopics.map((topic, i) => (
                                <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group">
                                    <span className="text-xs text-muted-foreground group-hover:text-foreground">#{topic.replace(/\s+/g, '')}</span>
                                    <Badge variant="secondary" className="text-[9px] bg-white/5 border-none">Trending</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-white/5 bg-gradient-to-br from-primary/10 to-transparent">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                                <Award className="h-4 w-4 text-secondary" />
                                Expert Highlights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                                <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/30">
                                    <MessageSquare className="h-5 w-5 text-secondary" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-secondary uppercase">Recommended</p>
                                    <p className="text-xs font-medium text-foreground leading-snug">"Dr. Rao on Organic Fertilization Strategies"</p>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full h-8 text-[10px] border-white/10 uppercase font-bold tracking-widest">Read More</Button>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}
