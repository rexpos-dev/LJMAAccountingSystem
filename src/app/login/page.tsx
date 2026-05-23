'use client';

import { LoginForm } from '@/components/auth/login-form';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const leftPanelVariants: Variants = {
    hidden: { x: -60, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.7, ease: 'easeOut' },
    },
};

const rightPanelVariants: Variants = {
    hidden: { x: 60, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.7, ease: 'easeOut' },
    },
};

const orb1Variants: Variants = {
    animate: {
        y: [0, -28, 0],
        x: [0, 14, 0],
        scale: [1, 1.08, 1],
        transition: { duration: 9, repeat: Infinity, ease: 'easeInOut' as const },
    },
};

const orb2Variants: Variants = {
    animate: {
        y: [0, 22, 0],
        x: [0, -18, 0],
        scale: [1, 0.94, 1],
        transition: { duration: 11, repeat: Infinity, ease: 'easeInOut' as const, delay: 1.5 },
    },
};

const orb3Variants: Variants = {
    animate: {
        y: [0, -16, 0],
        x: [0, 20, 0],
        scale: [1, 1.05, 1],
        transition: { duration: 13, repeat: Infinity, ease: 'easeInOut' as const, delay: 3 },
    },
};

const textItemVariants: Variants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
};

export default function LoginPage() {
    return (
        <div
            className="min-h-screen flex relative overflow-hidden"
            style={{ background: '#080d1a' }}
        >
            {/* ── LEFT VISUAL PANEL ─────────────────────────────────── */}
            <motion.div
                variants={leftPanelVariants}
                initial="hidden"
                animate="visible"
                className="hidden lg:flex relative flex-1 flex-col items-center justify-center p-14 overflow-hidden"
            >
                {/* Dark gradient base */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(135deg, #050b18 0%, #0d1b35 50%, #091525 100%)',
                    }}
                />

                {/* Dot grid overlay */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle, rgba(59,130,246,0.5) 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                    }}
                />

                {/* Diagonal line accent */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage:
                            'repeating-linear-gradient(45deg, rgba(59,130,246,0.8) 0, rgba(59,130,246,0.8) 1px, transparent 0, transparent 50%)',
                        backgroundSize: '24px 24px',
                    }}
                />

                {/* Animated orbs */}
                <motion.div
                    variants={orb1Variants}
                    animate="animate"
                    className="absolute top-[15%] left-[10%] w-80 h-80 rounded-full pointer-events-none"
                    style={{
                        background:
                            'radial-gradient(circle, rgba(59,130,246,0.35) 0%, rgba(99,102,241,0.15) 50%, transparent 70%)',
                        filter: 'blur(40px)',
                    }}
                />
                <motion.div
                    variants={orb2Variants}
                    animate="animate"
                    className="absolute bottom-[15%] right-[8%] w-96 h-96 rounded-full pointer-events-none"
                    style={{
                        background:
                            'radial-gradient(circle, rgba(56,189,248,0.25) 0%, rgba(59,130,246,0.1) 50%, transparent 70%)',
                        filter: 'blur(50px)',
                    }}
                />
                <motion.div
                    variants={orb3Variants}
                    animate="animate"
                    className="absolute top-[55%] left-[40%] w-64 h-64 rounded-full pointer-events-none"
                    style={{
                        background:
                            'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
                        filter: 'blur(35px)',
                    }}
                />

                {/* Content */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative z-10 w-full max-w-lg text-center flex flex-col items-center gap-8"
                >
                    {/* Logo with glow ring */}
                    <motion.div
                        variants={textItemVariants}
                        className="relative flex items-center justify-center"
                    >
                        <div
                            className="absolute w-48 h-48 rounded-full pointer-events-none"
                            style={{
                                background:
                                    'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
                                filter: 'blur(20px)',
                            }}
                        />
                        <Image
                            src="/ljma-logo.png"
                            alt="LJMA Accounting Logo"
                            width={140}
                            height={140}
                            className="relative drop-shadow-2xl"
                            priority
                        />
                    </motion.div>

                    <motion.h1
                        variants={textItemVariants}
                        className="text-5xl font-extrabold tracking-tight text-foreground"
                        style={{ fontFamily: 'Poppins, sans-serif', textShadow: '0 0 40px rgba(59,130,246,0.4)' }}
                    >
                        LJMA Accounting
                    </motion.h1>

                    {/* Divider line */}
                    <motion.div
                        variants={textItemVariants}
                        className="w-16 h-0.5 rounded-full"
                        style={{ background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)' }}
                    />

                    <motion.p
                        variants={textItemVariants}
                        className="text-lg leading-relaxed"
                        style={{ color: 'rgba(148,163,184,0.9)', fontStyle: 'italic', maxWidth: '380px' }}
                    >
                        "Precision in every transaction, clarity in every report. Empowering your business growth with robust financial management."
                    </motion.p>

                    {/* Feature pills */}
                    <motion.div
                        variants={textItemVariants}
                        className="flex flex-wrap justify-center gap-3 mt-2"
                    >
                        {['Financial Reports', 'Audit Trails', 'Real-time Insights'].map((tag) => (
                            <span
                                key={tag}
                                className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase"
                                style={{
                                    background: 'rgba(59,130,246,0.12)',
                                    border: '1px solid rgba(59,130,246,0.3)',
                                    color: 'rgba(147,197,253,0.9)',
                                    letterSpacing: '0.08em',
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Bottom decorative dots */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2.5">
                    {[0.2, 0.5, 1].map((op, i) => (
                        <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: `rgba(59,130,246,${op})` }}
                        />
                    ))}
                </div>
            </motion.div>

            {/* ── VERTICAL DIVIDER ──────────────────────────────────── */}
            <div
                className="hidden lg:block w-px flex-shrink-0 self-stretch"
                style={{ background: 'linear-gradient(180deg, transparent, rgba(59,130,246,0.3) 30%, rgba(59,130,246,0.3) 70%, transparent)' }}
            />

            {/* ── RIGHT FORM PANEL ──────────────────────────────────── */}
            <motion.div
                variants={rightPanelVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-1 flex-col items-center justify-center p-6 sm:p-12 relative"
            >
                {/* Subtle background glow */}
                <div
                    className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none opacity-20"
                    style={{
                        background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)',
                        filter: 'blur(60px)',
                        transform: 'translate(30%, -30%)',
                    }}
                />
                <div
                    className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none opacity-10"
                    style={{
                        background: 'radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)',
                        filter: 'blur(50px)',
                        transform: 'translate(-30%, 30%)',
                    }}
                />

                <div className="relative z-10 w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden text-center mb-8">
                        <Image
                            src="/ljma-logo.png"
                            alt="LJMA Logo"
                            width={80}
                            height={80}
                            className="mx-auto mb-3 drop-shadow-lg"
                        />
                        <h1
                            className="text-2xl font-extrabold text-foreground tracking-tight"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                            LJMA Accounting
                        </h1>
                    </div>

                    <LoginForm />

                    <p
                        className="text-center text-xs mt-8"
                        style={{ color: 'rgba(100,116,139,0.8)' }}
                    >
                        &copy;{' '}
                        <span suppressHydrationWarning>{new Date().getFullYear()}</span>{' '}
                        LJMA Accounting Services. All rights reserved.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
