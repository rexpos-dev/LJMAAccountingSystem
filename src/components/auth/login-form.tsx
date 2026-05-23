'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, type Variants } from 'framer-motion';
import { useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Lock, Mail, Phone, User, ShieldCheck } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const loginSchema = z.object({
    email: z.string().min(1, { message: 'Username is required' }),
    password: z.string().min(1, { message: 'Password is required' }),
});

/* ── Animation variants ───────────────────────────────────────── */
const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.09, delayChildren: 0.1 },
    },
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: 'easeOut' },
    },
};

/* ── Glass card styles ────────────────────────────────────────── */
const glassCard: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '20px',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow:
        '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)',
    padding: '40px 36px',
};

const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#f8fafc',
    borderRadius: '10px',
    height: '46px',
};

/* ──────────────────────────────────────────────────────────────── */

export function LoginForm() {
    const { login } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [showContactDialog, setShowContactDialog] = useState(false);
    const [contactName, setContactName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [isSubmittingContact, setIsSubmittingContact] = useState(false);

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        setLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: values.email,
                    password: values.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast({
                    title: 'Login failed',
                    description: data.error || 'Invalid credentials',
                    variant: 'destructive',
                });
                return;
            }

            toast({
                title: 'Welcome!',
                description: `Successfully signed in as ${data.user.firstName}`,
            });

            login(data.user);
        } catch (error) {
            console.error('Login error:', error);
            toast({
                title: 'Error',
                description: 'An unexpected error occurred during login.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!contactName || !contactNumber) {
            toast({
                title: 'Validation Error',
                description: 'Please provide both your name and contact number.',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmittingContact(true);
        try {
            const response = await fetch('/api/auth/contact-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: contactName, phone: contactNumber }),
            });

            if (!response.ok) throw new Error('Failed to send request');

            toast({
                title: 'Request Sent',
                description:
                    'Administration has been notified. We will call you back shortly.',
            });
            setShowContactDialog(false);
            setContactName('');
            setContactNumber('');
        } catch (error) {
            console.error('Contact request error:', error);
            toast({
                title: 'Error',
                description: 'Failed to send request. Please try again later.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmittingContact(false);
        }
    };

    return (
        <>
            <motion.div
                style={glassCard}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col items-center text-center mb-8 gap-3"
                >
                    {/* Icon badge */}
                    <div
                        className="flex items-center justify-center w-14 h-14 rounded-2xl mb-1"
                        style={{
                            background:
                                'linear-gradient(135deg, rgba(59,130,246,0.25) 0%, rgba(99,102,241,0.2) 100%)',
                            border: '1px solid rgba(59,130,246,0.35)',
                            boxShadow: '0 0 20px rgba(59,130,246,0.2)',
                        }}
                    >
                        <ShieldCheck className="w-7 h-7" style={{ color: '#60a5fa' }} />
                    </div>

                    <h2
                        className="text-3xl font-extrabold text-foreground tracking-tight"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Welcome Back
                    </h2>
                    <p className="text-sm" style={{ color: 'rgba(148,163,184,0.8)' }}>
                        Sign in to access your accounting dashboard
                    </p>
                </motion.div>

                {/* Form */}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-5"
                    >
                        <motion.div variants={itemVariants}>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className="text-xs font-semibold uppercase tracking-widest"
                                            style={{ color: 'rgba(148,163,184,0.7)' }}
                                        >
                                            Email / Username
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
                                                    style={{ color: 'rgba(100,116,139,0.9)' }}
                                                />
                                                <Input placeholder="email@example.com" className="pl-10 focus-visible:ring-blue-500 focus-visible:ring-1 placeholder:text-slate-600" style={inputStyle} disabled={loading} autoComplete="email" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-400 text-xs" />
                                    </FormItem>
                                )}
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className="text-xs font-semibold uppercase tracking-widest"
                                            style={{ color: 'rgba(148,163,184,0.7)' }}
                                        >
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
                                                    style={{ color: 'rgba(100,116,139,0.9)' }}
                                                />
                                                <Input type="password" placeholder="••••••••" className="pl-10 focus-visible:ring-blue-500 focus-visible:ring-1 placeholder:text-slate-600" style={inputStyle} disabled={loading} autoComplete="current-password" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-400 text-xs" />
                                    </FormItem>
                                )}
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="pt-1">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            >
                                <Button type="submit" className="w-full text-sm font-semibold tracking-wide relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)', border: 'none', borderRadius: '10px', boxShadow: '0 4px 20px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.15)', color: '#fff', }} disabled={loading} >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Signing in...
                                        </span>
                                    ) : (
                                        'Sign In'
                                    )}
                                </Button>
                            </motion.div>
                        </motion.div>
                    </form>
                </Form>

                {/* Footer link */}
                <motion.div
                    variants={itemVariants}
                    className="mt-7 pt-6 text-center text-sm"
                    style={{
                        borderTop: '1px solid rgba(255,255,255,0.07)',
                        color: 'rgba(100,116,139,0.8)',
                    }}
                >
                    Don&apos;t have an account?{' '}
                    <button
                        type="button"
                        className="font-semibold transition-colors hover:text-blue-300"
                        style={{ color: '#60a5fa' }}
                        onClick={() => setShowContactDialog(true)}
                    >
                        Contact Administration
                    </button>
                </motion.div>
            </motion.div>

            {/* ── Contact Dialog ────────────────────────────────────── */}
            <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Contact Administration</DialogTitle>
                        <DialogDescription>
                            Leave your details below and our administrator will reach out to
                            you to set up your account.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={handleContactSubmit}
                        className="space-y-4 py-4"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input id="name" placeholder="John Doe" className="pl-10" value={contactName} onChange={(e) => setContactName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Number to call</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input id="phone" type="tel" placeholder="0912 345 6789" className="pl-10" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="submit" className="w-full" disabled={isSubmittingContact} >
                                {isSubmittingContact ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Sending Request...
                                    </span>
                                ) : (
                                    'Submit Request'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
