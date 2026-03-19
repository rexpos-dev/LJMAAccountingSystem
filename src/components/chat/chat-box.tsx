'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat, ChatRoom, ChatMessage } from '@/hooks/use-chat';
import { useAuth } from '@/components/providers/auth-provider';
import {
    MessageCircle, X, Send, Minus, Maximize2,
    ChevronLeft, Users, UserPlus, Paperclip,
    FileText, Image as ImageIcon, Download,
    Settings, Edit3, Loader2, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { SelectUserDialog } from './select-user-dialog';
import { CreateGroupDialog } from './create-group-dialog';
import { Input } from '@/components/ui/input';

export function ChatBox() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [view, setView] = useState<'rooms' | 'chat'>('rooms');
    const [isSelectUserOpen, setIsSelectUserOpen] = useState(false);
    const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [roomNameInput, setRoomNameInput] = useState('');

    const {
        rooms, activeRoomId, setActiveRoomId, messages,
        isLoadingRooms, isLoadingMessages, sendMessage,
        createRoom, uploadFile, isSending, renameRoom,
        unreadCount, markAsRead
    } = useChat();

    const { user } = useAuth();
    const [inputValue, setInputValue] = useState('');
    const [attachments, setAttachments] = useState<any[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const activeRoom = rooms.find(r => r.id === activeRoomId);

    useEffect(() => {
        if (scrollRef.current && view === 'chat') {
            const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }

        // Automatically mark as read if looking at the room
        if (isOpen && !isMinimized && view === 'chat' && activeRoomId) {
            markAsRead(activeRoomId);
        }
    }, [messages, isOpen, isMinimized, view, activeRoomId, markAsRead]);

    const handleSend = async () => {
        if (inputValue.trim() || attachments.length > 0) {
            sendMessage(inputValue, attachments);
            setInputValue('');
            setAttachments([]);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        try {
            const newAttachments = [...attachments];
            for (let i = 0; i < files.length; i++) {
                const uploaded = await uploadFile(files[i]);
                newAttachments.push(uploaded);
            }
            setAttachments(newAttachments);
        } catch (err) {
            console.error('Upload failed', err);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleStartDM = (targetUserId: string) => {
        createRoom({ participantIds: [targetUserId], isGroup: false });
        setView('chat');
    };

    const handleCreateGroup = (participantIds: string[], name: string) => {
        createRoom({ participantIds, isGroup: true, name });
        setView('chat');
    };

    const handleRename = () => {
        if (activeRoomId && roomNameInput.trim()) {
            renameRoom(activeRoomId, roomNameInput.trim());
            setIsRenaming(false);
        }
    };

    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <Button
                    onClick={() => setIsOpen(true)}
                    className={cn(
                        "h-14 w-14 rounded-full shadow-2xl bg-primary hover:scale-110 transition-all duration-300 flex items-center justify-center border-2 border-white/20 relative group",
                        unreadCount > 0 && "animate-bounce shadow-[0_0_20px_rgba(var(--primary),0.4)]"
                    )}
                >
                    <MessageCircle className="h-7 w-7 text-primary-foreground group-hover:rotate-12 transition-transform" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-6 w-6 bg-destructive text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-background shadow-lg animate-in zoom-in duration-300">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </div>
        );
    }

    const getRoomName = (room: ChatRoom) => {
        if (room.isGroup) return room.name || 'Group Chat';
        const otherParticipant = room.participants.find(p => p.user.id !== user?.id);
        return otherParticipant ? `${otherParticipant.user.firstName} ${otherParticipant.user.lastName}` : 'Chat';
    };

    return (
        <div
            className={cn(
                "fixed bottom-6 right-6 w-[350px] sm:w-[400px] flex flex-col z-50 transition-all duration-300 ease-in-out shadow-2xl border border-white/10 overflow-hidden",
                isMinimized ? "h-14" : "h-[550px] max-h-[85vh]",
                "bg-background/80 backdrop-blur-xl rounded-2xl"
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-primary/5">
                <div className="flex items-center gap-2 overflow-hidden">
                    {view === 'chat' && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 -ml-2"
                            onClick={() => setView('rooms')}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    )}

                    <div className="flex flex-col min-w-0">
                        {view === 'rooms' ? (
                            <h3 className="font-semibold text-sm">Conversations</h3>
                        ) : (
                            <div className="flex items-center gap-2">
                                {isRenaming ? (
                                    <div className="flex items-center gap-1">
                                        <Input
                                            className="h-6 text-xs w-32"
                                            value={roomNameInput}
                                            onChange={(e) => setRoomNameInput(e.target.value)}
                                            autoFocus
                                        />
                                        <Button size="icon" className="h-6 w-6" onClick={handleRename}><Send className="h-3 w-3" /></Button>
                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setIsRenaming(false)}><X className="h-3 w-3" /></Button>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="font-semibold text-sm truncate max-w-[150px]">
                                            {activeRoom ? getRoomName(activeRoom) : 'Loading...'}
                                        </h3>
                                        {activeRoom?.isGroup && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-5 w-5 opacity-50 hover:opacity-100"
                                                onClick={() => {
                                                    setRoomNameInput(activeRoom.name || '');
                                                    setIsRenaming(true);
                                                }}
                                            >
                                                <Edit3 className="h-3 w-3" />
                                            </Button>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {view === 'rooms' && (
                        <>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsSelectUserOpen(true)}>
                                <UserPlus className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsCreateGroupOpen(true)}>
                                <Users className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-white/10"
                        onClick={() => setIsMinimized(!isMinimized)}
                    >
                        {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                        {isMinimized && unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full border border-background animate-pulse" />
                        )}
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
                    {view === 'rooms' ? (
                        /* Room List View */
                        <ScrollArea className="flex-1 p-2">
                            <div className="space-y-1">
                                {isLoadingRooms ? (
                                    <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
                                ) : rooms.length === 0 ? (
                                    <div className="text-center p-12 text-muted-foreground text-xs opacity-50">
                                        <MessageCircle className="h-8 w-8 mx-auto mb-2" />
                                        <p>No conversations yet.</p>
                                    </div>
                                ) : (
                                    rooms.map((room) => (
                                        <button
                                            key={room.id}
                                            onClick={() => {
                                                setActiveRoomId(room.id);
                                                setView('chat');
                                            }}
                                            className={cn(
                                                "w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-all text-left group relative",
                                                activeRoomId === room.id && "bg-white/10 border border-white/5 shadow-inner"
                                            )}
                                        >
                                            {(() => {
                                                const lastSeen = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('chat_last_seen') || '{}') : {};
                                                const isUnread = room.messages?.[0] &&
                                                    room.messages[0].senderId !== user?.id &&
                                                    (!lastSeen[room.id] || new Date(room.messages[0].createdAt) > new Date(lastSeen[room.id]));

                                                return isUnread ? (
                                                    <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)] animate-pulse" />
                                                ) : null;
                                            })()}
                                            <Avatar className="h-10 w-10 border border-white/10">
                                                <AvatarFallback className={cn(
                                                    "bg-primary/10 text-primary font-bold text-xs",
                                                    room.isGroup && "bg-blue-500/10 text-blue-500"
                                                )}>
                                                    {room.isGroup ? <Users className="h-4 w-4" /> : getRoomName(room).split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-0.5">
                                                    <span className="text-sm font-semibold truncate pr-2 group-hover:text-primary transition-colors">
                                                        {getRoomName(room)}
                                                    </span>
                                                    <span className="text-[10px] opacity-40 whitespace-nowrap">
                                                        {formatDistanceToNow(new Date(room.updatedAt), { addSuffix: false })}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate opacity-70">
                                                    {room.messages && room.messages[0]
                                                        ? `${room.messages[0].senderId === user?.id ? 'You: ' : ''}${room.messages[0].content || (room.messages[0].attachments?.length ? 'Shared a file' : '')}`
                                                        : 'No messages'}
                                                </p>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    ) : (
                        /* Chat View */
                        <>
                            <ScrollArea ref={scrollRef} className="flex-1 p-4">
                                <div className="flex flex-col gap-4">
                                    {isLoadingMessages ? (
                                        <div className="flex justify-center p-4"><Loader2 className="h-4 w-4 animate-spin opacity-50" /></div>
                                    ) : messages.length === 0 ? (
                                        <div className="text-center p-8 text-muted-foreground text-xs opacity-50">
                                            <p>Send a message to start chatting.</p>
                                        </div>
                                    ) : (
                                        messages.map((msg) => {
                                            const isMine = msg.senderId === user?.id;
                                            return (
                                                <div
                                                    key={msg.id}
                                                    className={cn(
                                                        "flex flex-col gap-1 max-w-[85%]",
                                                        isMine ? "self-end items-end" : "self-start items-start"
                                                    )}
                                                >
                                                    {!isMine && (
                                                        <span className="text-[10px] font-medium opacity-70 px-1">
                                                            {msg.senderName}
                                                        </span>
                                                    )}
                                                    <div
                                                        className={cn(
                                                            "px-3 py-2 rounded-2xl text-sm break-words shadow-sm",
                                                            isMine
                                                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                                                : "bg-muted text-muted-foreground rounded-tl-none border border-white/5"
                                                        )}
                                                    >
                                                        {msg.content}

                                                        {msg.attachments && msg.attachments.length > 0 && (
                                                            <div className="mt-2 flex flex-col gap-1">
                                                                {msg.attachments.map((att) => (
                                                                    <a
                                                                        key={att.id}
                                                                        href={att.fileUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className={cn(
                                                                            "flex items-center gap-2 p-1.5 rounded-lg text-xs transition-colors group/file",
                                                                            isMine ? "bg-white/10 hover:bg-white/20" : "bg-background/50 hover:bg-background/80"
                                                                        )}
                                                                    >
                                                                        {att.fileType.startsWith('image/') ? <ImageIcon className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                                                                        <span className="truncate max-w-[150px]">{att.fileName}</span>
                                                                        <Download className="h-3 w-3 ml-auto opacity-0 group-hover/file:opacity-100" />
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-[10px] opacity-40 px-1">
                                                        {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </ScrollArea>

                            {/* Input Area */}
                            <div className="p-4 border-t border-white/10 bg-white/5">
                                {attachments.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {attachments.map((att, i) => (
                                            <div key={i} className="flex items-center gap-2 bg-primary/20 p-1.5 rounded-lg border border-primary/30 animate-in fade-in zoom-in duration-200">
                                                {att.fileType.startsWith('image/') ? <ImageIcon className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                                                <span className="text-[10px] truncate max-w-[100px]">{att.fileName}</span>
                                                <button onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}>
                                                    <X className="h-3 w-3 hover:text-destructive" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex flex-col gap-2">
                                    <div className="relative flex items-center gap-2">
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-xl bg-background/50 border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all"
                                            disabled={isUploading}
                                        >
                                            {isUploading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Paperclip className="h-4 w-4 opacity-50" />}
                                        </button>

                                        <textarea
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSend();
                                                }
                                            }}
                                            placeholder="Type a message..."
                                            className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-10 min-h-[40px] max-h-[100px] transition-all scrollbar-hide"
                                            rows={1}
                                        />

                                        <Button
                                            size="icon"
                                            className="flex-shrink-0 h-9 w-9 rounded-xl shadow-lg hover:scale-105 transition-transform"
                                            onClick={handleSend}
                                            disabled={(!inputValue.trim() && attachments.length === 0) || isSending}
                                        >
                                            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>

                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                            </div>
                        </>
                    )}

                    <SelectUserDialog
                        open={isSelectUserOpen}
                        onOpenChange={setIsSelectUserOpen}
                        onSelected={handleStartDM}
                    />

                    <CreateGroupDialog
                        open={isCreateGroupOpen}
                        onOpenChange={setIsCreateGroupOpen}
                        onCreated={handleCreateGroup}
                    />
                </>
            )}
        </div>
    );
}
