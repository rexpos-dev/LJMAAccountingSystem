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
import { Loader2, Lock, Mail } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().min(1, { message: 'Username is required' }),
    password: z.string().min(1, { message: 'Password is required' }),
});

export function LoginForm() {
    const { login } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

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
                    Don't have an account? <span className="text-primary font-semibold hover:underline cursor-pointer">Contact Administration</span>
                </div>
            </CardFooter>
        </Card>
    );
}
