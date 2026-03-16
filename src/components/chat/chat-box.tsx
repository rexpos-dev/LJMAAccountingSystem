'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/use-chat';
import { useAuth } from '@/components/providers/auth-provider';
import { MessageCircle, X, Send, Minus, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export function ChatBox() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const { messages, sendMessage, isSending } = useChat();
    const { user } = useAuth();
    const [inputValue, setInputValue] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages, isOpen, isMinimized]);

    const handleSend = () => {
        if (inputValue.trim()) {
            sendMessage(inputValue);
            setInputValue('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-primary hover:scale-110 transition-transform duration-300 z-50 flex items-center justify-center border-2 border-white/20"
            >
                <MessageCircle className="h-7 w-7 text-primary-foreground" />
            </Button>
        );
    }

    return (
        <div
            className={cn(
                "fixed bottom-6 right-6 w-80 sm:w-96 flex flex-col z-50 transition-all duration-300 ease-in-out shadow-2xl border border-white/10 overflow-hidden",
                isMinimized ? "h-14" : "h-[500px] max-h-[80vh]",
                "bg-background/80 backdrop-blur-xl rounded-2xl"
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-primary/10">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <h3 className="font-semibold text-sm">Centralized Chat</h3>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-white/10"
                        onClick={() => setIsMinimized(!isMinimized)}
                    >
                        {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-white/10 text-destructive"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages Area */}
                    <ScrollArea ref={scrollRef} className="flex-1 p-4">
                        <div className="flex flex-col gap-4">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-xs opacity-50">
                                    <MessageCircle className="h-8 w-8 mb-2" />
                                    <p>No messages yet. Start the conversation!</p>
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const isMine = msg.senderId === user?.id;
                                    return (
                                        <div
                                            key={msg.id}
                                            className={cn(
                                                "flex flex-col gap-1 max-w-[80%]",
                                                isMine ? "self-end items-end" : "self-start items-start"
                                            )}
                                        >
                                            <div className="flex items-center gap-2 px-1">
                                                <span className="text-[10px] font-medium opacity-70">
                                                    {isMine ? "You" : msg.senderName}
                                                </span>
                                                <span className="text-[10px] opacity-40">
                                                    {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                            <div
                                                className={cn(
                                                    "px-3 py-2 rounded-2xl text-sm break-words shadow-sm",
                                                    isMine
                                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                                        : "bg-muted text-muted-foreground rounded-tl-none border border-white/5"
                                                )}
                                            >
                                                {msg.content}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <div className="p-4 border-t border-white/10 bg-white/5">
                        <div className="relative flex items-center gap-2">
                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a message..."
                                className="w-full bg-background/50 border border-white/10 rounded-xl px-3 py-2 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-10 min-h-[40px] max-h-[100px] transition-all"
                                rows={1}
                            />
                            <Button
                                size="icon"
                                className="absolute right-1 top-1 h-8 w-8 rounded-lg shadow-lg hover:scale-105 transition-transform"
                                onClick={handleSend}
                                disabled={!inputValue.trim() || isSending}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
