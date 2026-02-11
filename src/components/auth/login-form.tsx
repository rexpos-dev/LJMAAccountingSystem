'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, Lock, Mail, Phone, User } from 'lucide-react';
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
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        setLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: values.email,
                    password: values.password
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

            if (!response.ok) {
                throw new Error('Failed to send request');
            }

            toast({
                title: 'Request Sent',
                description: 'Administration has been notified. We will call you back shortly.',
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
        <Card className="w-full max-w-md mx-auto border-none shadow-2xl bg-white/80 backdrop-blur-md dark:bg-slate-900/80">
            <CardHeader className="space-y-1 text-center">
                <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                </div>
                <CardTitle className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome Back</CardTitle>
                <CardDescription className="text-muted-foreground italic">
                    Please enter your credentials to access your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="email@example.com"
                                                className="pl-10 h-11 focus-visible:ring-primary"
                                                disabled={loading}
                                                autoComplete="email"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-10 h-11 focus-visible:ring-primary"
                                                disabled={loading}
                                                autoComplete="current-password"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full h-11 text-lg font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>


                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground">
                <div className="w-full border-t border-muted/20 pt-4">
                    Don't have an account? <span
                        className="text-primary font-semibold hover:underline cursor-pointer"
                        onClick={() => setShowContactDialog(true)}
                    >
                        Contact Administration
                    </span>
                </div>

                <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Contact Administration</DialogTitle>
                            <DialogDescription>
                                Leave your details below and our administrator will reach out to you to set up your account.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleContactSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        className="pl-10"
                                        value={contactName}
                                        onChange={(e) => setContactName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Number to call</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="0912 345 6789"
                                        className="pl-10"
                                        value={contactNumber}
                                        onChange={(e) => setContactNumber(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <DialogFooter className="pt-4">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isSubmittingContact}
                                >
                                    {isSubmittingContact ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending Request...
                                        </>
                                    ) : (
                                        'Submit Request'
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    );
}
