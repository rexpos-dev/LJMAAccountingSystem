import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUsers } from '@/hooks/use-users';
import { useAuth } from '@/components/providers/auth-provider';
import { Loader2, Search, Users } from 'lucide-react';

interface CreateGroupDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated: (participantIds: string[], name: string) => void;
    isLoading?: boolean;
}

export function CreateGroupDialog({ open, onOpenChange, onCreated, isLoading }: CreateGroupDialogProps) {
    const { data: users = [], isLoading: isLoadingUsers } = useUsers();
    const { user: currentUser } = useAuth();
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [groupName, setGroupName] = useState('');
    const [search, setSearch] = useState('');

    const filteredUsers = users.filter(u =>
        u.id !== currentUser?.id &&
        (u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
            u.lastName?.toLowerCase().includes(search.toLowerCase()) ||
            u.username?.toLowerCase().includes(search.toLowerCase()))
    );

    const toggleUser = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const handleCreate = () => {
        if (selectedUsers.length > 0 && groupName.trim()) {
            onCreated(selectedUsers, groupName.trim());
            setSelectedUsers([]);
            setGroupName('');
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Create New Group
                    </DialogTitle>
                    <DialogDescription>
                        Select participants and choose a name for your group chat.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Group Name</Label>
                        <Input id="name" placeholder="e.g. Finance Team" value={groupName} onChange={(e) => setGroupName(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Participants ({selectedUsers.length})</Label>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search users..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <ScrollArea className="h-60 rounded-md border p-2">
                            {isLoadingUsers ? (
                                <div className="flex justify-center p-4">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredUsers.map((u) => (
                                        <div key={u.id} className="flex items-center space-x-2 p-1 hover:bg-muted/50 rounded-md transition-colors">
                                            <Checkbox
                                                id={u.id}
                                                checked={selectedUsers.includes(u.id)}
                                                onCheckedChange={() => toggleUser(u.id)}
                                            />
                                            <label
                                                htmlFor={u.id}
                                                className="flex-1 text-sm font-medium leading-none cursor-pointer"
                                            >
                                                {u.firstName} {u.lastName}
                                                <span className="ml-2 text-[10px] text-muted-foreground uppercase opacity-50">
                                                    {u.accountType}
                                                </span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleCreate} disabled={selectedUsers.length === 0 || !groupName.trim() || isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Group
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
