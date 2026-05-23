import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUsers } from '@/hooks/use-users';
import { useAuth } from '@/components/providers/auth-provider';
import { Loader2, Search, User, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface SelectUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelected: (userId: string) => void;
}

export function SelectUserDialog({ open, onOpenChange, onSelected }: SelectUserDialogProps) {
    const { data: users = [], isLoading: isLoadingUsers } = useUsers();
    const { user: currentUser } = useAuth();
    const [search, setSearch] = useState('');

    const filteredUsers = users.filter(u =>
        u.id !== currentUser?.id &&
        (u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
            u.lastName?.toLowerCase().includes(search.toLowerCase()) ||
            u.username?.toLowerCase().includes(search.toLowerCase()))
    );

    const handleSelect = (userId: string) => {
        onSelected(userId);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        New Conversation
                    </DialogTitle>
                    <DialogDescription>
                        Select a user to start a private chat.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search users..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <ScrollArea className="h-60 rounded-md border">
                        {isLoadingUsers ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                        ) : (
                            <div className="p-2 space-y-1">
                                {filteredUsers.length === 0 ? (
                                    <div className="text-center p-4 text-muted-foreground text-sm">
                                        No users found
                                    </div>
                                ) : (
                                    filteredUsers.map((u) => (
                                        <button
                                            key={u.id}
                                            onClick={() => handleSelect(u.id)}
                                            className="w-full flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors text-left"
                                        >
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                                    {u.firstName[0]}{u.lastName[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{u.firstName} {u.lastName}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase opacity-70">
                                                    {u.accountType}
                                                </span>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}
