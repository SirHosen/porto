'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
    const [pct, setPct] = useState(0);
    const [done, setDone] = useState(false);
    const [gone, setGone] = useState(false);

    useEffect(() => {
        // Simulate loading progress
        const steps = [
            { target: 15, delay: 100 },
            { target: 35, delay: 300 },
            { target: 55, delay: 500 },
            { target: 75, delay: 700 },
            { target: 90, delay: 900 },
            { target: 100, delay: 1100 },
        ];

        const timers: ReturnType<typeof setTimeout>[] = [];

        steps.forEach(({ target, delay }) => {
            timers.push(setTimeout(() => {
                setPct(target);
            }, delay));
        });

        // Exit
        timers.push(setTimeout(() => {
            setDone(true);
            setTimeout(() => setGone(true), 900);
        }, 1400));

        return () => timers.forEach(clearTimeout);
    }, []);

    if (gone) return null;

    return (
        <div
            id="premium-loader"
            className={done ? 'exit' : ''}
            style={{ display: gone ? 'none' : undefined }}
        >
            <div className="loader-bg" />
            <div className="loader-grid" />
            <LoaderParticles />
            <div className="loader-content">
                <div className="loader-logo">
                    hosea<span>.dev</span>
                </div>
                <div className="loader-tagline">system initializing</div>
                <div className="loader-bar-wrap">
                    <div
                        className="loader-bar"
                        style={{ width: pct + '%' }}
                    />
                </div>
                <div className="loader-pct">
                    {String(pct).padStart(3, '0')}%
                </div>
            </div>
        </div>
    );
}

function LoaderParticles() {
    const count = 20;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="loader-particles" />;
    }

    return (
        <div className="loader-particles">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="loader-particle"
                    style={{
                        left: Math.random() * 100 + '%',
                        animationDuration: (3 + Math.random() * 4) + 's',
                        animationDelay: (Math.random() * 3) + 's',
                        width: (1 + Math.random() * 2) + 'px',
                        height: (1 + Math.random() * 2) + 'px',
                        background: ['#7B6FFF', '#00D4FF', '#BF5FFF', '#00FFB3'][Math.floor(Math.random() * 4)],
                    }}
                />
            ))}
        </div>
    );
}
