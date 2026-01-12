'use client';

import { LoginForm } from '@/components/auth/login-form';
import Image from 'next/image';

export default function LoginPage() {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* Visual Side (Hidden on mobile) */}
            <div className="hidden lg:flex relative bg-slate-900 flex-col items-center justify-center p-12 text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/login-bg.png"
                        alt="Office Background"
                        fill
                        className="object-cover opacity-50"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-primary/80 to-slate-900/90 mix-blend-multiply" />
                </div>

                <div className="relative z-10 w-full max-w-lg text-center">
                    <h1 className="text-5xl font-extrabold tracking-tight mb-6 drop-shadow-sm">
                        LJMA Accounting
                    </h1>
                    <p className="text-xl text-white font-light leading-relaxed mb-8 italic drop-shadow-md">
                        "Precision in every transaction, clarity in every report. Empowering your business growth with robust financial management."
                    </p>

                    <div className="flex justify-center gap-4 mt-6 opacity-80 hover:opacity-100 transition-all duration-500">
                        <Image
                            src="/ljma-logo.png"
                            alt="LJMA Accounting Logo"
                            width={160}
                            height={160}
                            className="drop-shadow-lg"
                            priority
                        />
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute bottom-10 left-10 flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/20"></div>
                    <div className="w-2 h-2 rounded-full bg-white/20"></div>
                    <div className="w-2 h-2 rounded-full bg-white/40"></div>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="lg:hidden text-center mb-8">
                        <h1 className="text-3xl font-bold text-primary">LJMA Accounting</h1>
                    </div>

                    <LoginForm />

                    <p className="text-center text-xs text-muted-foreground mt-8">
                        &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> LJMA Accounting Services. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Background decoration for form side */}
            <div className="absolute -top-[10%] -right-[5%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-[10%] -left-[5%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px] pointer-events-none lg:hidden"></div>
        </div>
    );
}
