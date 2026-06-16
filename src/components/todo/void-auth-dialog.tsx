'use client';

import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldAlert, Eye, EyeOff, Loader2 } from 'lucide-react';

interface VoidAuthDialogProps {
    open: boolean;
    requestNumber: string;
    onConfirm: (verifiedBy: string) => void;
    onCancel: () => void;
}

export function VoidAuthDialog({ open, requestNumber, onConfirm, onCancel }: VoidAuthDialogProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const reset = () => {
        setUsername('');
        setPassword('');
        setShowPassword(false);
        setError('');
        setLoading(false);
    };

    const handleCancel = () => {
        reset();
        onCancel();
    };

    const handleSubmit = async () => {
        if (!username.trim() || !password.trim()) {
            setError('Please enter both username and password.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/verify-superadmin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username.trim(), password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Verification failed.');
                setLoading(false);
                return;
            }

            reset();
            onConfirm(data.verifiedBy);
        } catch {
            setError('Network error. Please try again.');
            setLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={(v) => !v && handleCancel()}>
            <AlertDialogContent className="max-w-sm border border-foreground/10 bg-background/95 backdrop-blur-xl shadow-2xl rounded-2xl p-0 overflow-hidden gap-0">
                {/* Top accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-red-500 to-rose-600" />

                <div className="px-6 pt-6 pb-5 space-y-4">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="p-3 rounded-2xl ring-4 bg-red-500/10 text-red-500 ring-red-500/20">
                            <ShieldAlert className="h-6 w-6" />
                        </div>
                    </div>

                    <AlertDialogHeader className="space-y-1.5 text-center">
                        <AlertDialogTitle className="text-base font-bold text-foreground">
                            Super Admin Authorization Required
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
                            Voiding <span className="font-semibold text-foreground">{requestNumber}</span> requires Super Admin credentials to proceed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {/* Fields */}
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="void-username" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Super Admin Username
                            </Label>
                            <Input
                                id="void-username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                autoComplete="off"
                                disabled={loading}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="void-password" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="void-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password"
                                    autoComplete="new-password"
                                    disabled={loading}
                                    className="pr-10"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="text-xs text-red-500 font-medium text-center">{error}</p>
                        )}
                    </div>

                    <AlertDialogFooter className="flex-row justify-center gap-3 sm:space-x-0 mt-2">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={loading}
                            className="flex-1 border-foreground/10 hover:bg-foreground/5 font-semibold"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 font-semibold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
                        >
                            {loading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</>
                            ) : (
                                'Confirm Void'
                            )}
                        </Button>
                    </AlertDialogFooter>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}
