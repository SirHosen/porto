'use client';

import { useEffect, useRef } from 'react';

export default function PremiumEffects() {
    const lenisRef = useRef<any>(null);

    useEffect(() => {
        let lenis: any = null;
        let rafId: number | undefined;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let curDotX = mouseX, curDotY = mouseY;
        let curRingX = mouseX, curRingY = mouseY;
        let trailPoints: Array<{ x: number; y: number; el: HTMLElement }> = [];
        const TRAIL_COUNT = 8;

        // ============================================================
        // LENIS SMOOTH SCROLL
        // ============================================================
        const initLenis = async () => {
            try {
                const LenisModule = await import('lenis');
                const Lenis = LenisModule.default;
                lenis = new Lenis({
                    duration: 1.4,
                    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    orientation: 'vertical',
                    smoothWheel: true,
                    wheelMultiplier: 0.9,
                    touchMultiplier: 1.5,
                });
                lenisRef.current = lenis;

                const raf = (time: number) => {
                    lenis.raf(time);
                    rafId = requestAnimationFrame(raf);
                };
                rafId = requestAnimationFrame(raf);
            } catch (e) {
                console.warn('Lenis not available, using native scroll');
            }
        };

        // ============================================================
        // AURORA BACKGROUND — activate blobs
        // ============================================================
        const initAurora = () => {
            const blobs = document.querySelectorAll('.aurora-blob');
            blobs.forEach((blob, i) => {
                setTimeout(() => blob.classList.add('active'), i * 300);
            });
        };

        // ============================================================
        // MOUSE-REACTIVE AURORA
        // ============================================================
        const auroraEl = document.getElementById('aurora-mouse');
        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (auroraEl) {
                auroraEl.style.left = mouseX + 'px';
                auroraEl.style.top = mouseY + 'px';
            }
        };

        // ============================================================
        // CUSTOM CURSOR
        // ============================================================
        const curDot = document.getElementById('cur-dot');
        const curRing = document.getElementById('cur-ring');

        const initCursor = () => {
            if (!curDot || !curRing) return;
            if (!window.matchMedia('(pointer: fine)').matches) return;

            document.body.classList.add('cc');
            curDot.classList.add('live');
            curRing.classList.add('live');

            // Create trail particles
            for (let i = 0; i < TRAIL_COUNT; i++) {
                const el = document.createElement('div');
                el.className = 'cur-trail';
                el.style.cssText = `
          width: ${4 - i * 0.3}px;
          height: ${4 - i * 0.3}px;
          opacity: 0;
          background: hsl(${260 + i * 8}, 80%, 70%);
        `;
                document.body.appendChild(el);
                trailPoints.push({ x: mouseX, y: mouseY, el });
            }

            // Cursor animation loop
            let cursorRaf: number;
            const animateCursor = () => {
                // Dot follows mouse directly
                curDotX += (mouseX - curDotX) * 0.85;
                curDotY += (mouseY - curDotY) * 0.85;
                // Ring follows with lag
                curRingX += (mouseX - curRingX) * 0.12;
                curRingY += (mouseY - curRingY) * 0.12;

                if (curDot) {
                    curDot.style.left = curDotX + 'px';
                    curDot.style.top = curDotY + 'px';
                }
                if (curRing) {
                    curRing.style.left = curRingX + 'px';
                    curRing.style.top = curRingY + 'px';
                }

                // Trail
                trailPoints.forEach((pt, i) => {
                    const prev = i === 0 ? { x: curDotX, y: curDotY } : trailPoints[i - 1];
                    pt.x += (prev.x - pt.x) * (0.35 - i * 0.03);
                    pt.y += (prev.y - pt.y) * (0.35 - i * 0.03);
                    pt.el.style.left = pt.x + 'px';
                    pt.el.style.top = pt.y + 'px';
                    pt.el.style.opacity = String((1 - i / TRAIL_COUNT) * 0.5);
                });

                cursorRaf = requestAnimationFrame(animateCursor);
            };
            cursorRaf = requestAnimationFrame(animateCursor);

            // Hover states
            const interactiveEls = 'a, button, .chip, .card, .btn, .logo, .nav-links a';
            document.addEventListener('mouseover', (e) => {
                if ((e.target as Element)?.closest(interactiveEls)) {
                    curRing?.classList.add('on');
                }
            });
            document.addEventListener('mouseout', (e) => {
                if ((e.target as Element)?.closest(interactiveEls)) {
                    curRing?.classList.remove('on');
                }
            });
            document.addEventListener('mousedown', () => {
                curRing?.classList.add('click');
                curDot && (curDot.style.transform = 'translate(-50%, -50%) scale(0.5)');
            });
            document.addEventListener('mouseup', () => {
                curRing?.classList.remove('click');
                curDot && (curDot.style.transform = 'translate(-50%, -50%) scale(1)');
            });

            return () => cancelAnimationFrame(cursorRaf);
        };

        // ============================================================
        // FLOATING PARTICLES CANVAS
        // ============================================================
        const initParticles = () => {
            const canvas = document.getElementById('particles-canvas') as HTMLCanvasElement;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            let W = window.innerWidth, H = window.innerHeight;
            canvas.width = W;
            canvas.height = H;

            const PARTICLE_COUNT = 80;
            const particles: Array<{
                x: number; y: number; vx: number; vy: number;
                size: number; opacity: number; color: string; life: number; maxLife: number;
            }> = [];

            const colors = ['rgba(123, 111, 255,', 'rgba(0, 212, 255,', 'rgba(191, 95, 255,', 'rgba(0, 255, 179,'];

            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * W,
                    y: Math.random() * H,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: -Math.random() * 0.5 - 0.1,
                    size: Math.random() * 2 + 0.5,
                    opacity: Math.random() * 0.6 + 0.1,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    life: Math.random() * 200,
                    maxLife: 200 + Math.random() * 200,
                });
            }

            let particleRaf: number;
            const animateParticles = () => {
                ctx.clearRect(0, 0, W, H);

                // Mouse influence
                const mx = mouseX, my = mouseY;

                particles.forEach((p) => {
                    p.life++;
                    if (p.life > p.maxLife) {
                        p.x = Math.random() * W;
                        p.y = H + 10;
                        p.life = 0;
                        p.maxLife = 200 + Math.random() * 200;
                    }

                    // Subtle mouse attraction
                    const dx = mx - p.x, dy = my - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist > 0.001 && dist < 150) {
                        p.vx += (dx / dist) * 0.008;
                        p.vy += (dy / dist) * 0.008;
                    }

                    p.vx *= 0.99;
                    p.vy *= 0.99;
                    p.x += p.vx;
                    p.y += p.vy;

                    const alpha = Math.sin((p.life / p.maxLife) * Math.PI) * p.opacity;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = p.color + alpha + ')';
                    ctx.fill();
                });

                particleRaf = requestAnimationFrame(animateParticles);
            };
            particleRaf = requestAnimationFrame(animateParticles);

            const handleResize = () => {
                W = window.innerWidth;
                H = window.innerHeight;
                canvas.width = W;
                canvas.height = H;
            };
            window.addEventListener('resize', handleResize);

            return () => {
                cancelAnimationFrame(particleRaf);
                window.removeEventListener('resize', handleResize);
            };
        };

        // ============================================================
        // SCROLL PROGRESS BAR
        // ============================================================
        const initScrollProgress = () => {
            const bar = document.getElementById('scroll-progress');
            if (!bar) return;
            const update = () => {
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                bar.style.width = pct + '%';
            };
            window.addEventListener('scroll', update, { passive: true });
            return () => window.removeEventListener('scroll', update);
        };

        // ============================================================
        // NAV SCROLL STATE
        // ============================================================
        const initNavScroll = () => {
            const nav = document.getElementById('topnav');
            if (!nav) return;
            const update = () => {
                nav.classList.toggle('scrolled', window.scrollY > 40);
            };
            window.addEventListener('scroll', update, { passive: true });
            return () => window.removeEventListener('scroll', update);
        };

        // ============================================================
        // MAGNETIC BUTTONS
        // ============================================================
        const initMagneticButtons = () => {
            const btns = document.querySelectorAll('.btn');
            const cleanups: Array<() => void> = [];

            btns.forEach((btn) => {
                const el = btn as HTMLElement;
                const onMove = (e: MouseEvent) => {
                    const rect = el.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    const dx = (e.clientX - cx) * 0.25;
                    const dy = (e.clientY - cy) * 0.25;
                    el.style.transform = `translate(${dx}px, ${dy}px) translateY(-3px)`;
                };
                const onLeave = () => {
                    el.style.transform = '';
                };
                el.addEventListener('mousemove', onMove);
                el.addEventListener('mouseleave', onLeave);
                cleanups.push(() => {
                    el.removeEventListener('mousemove', onMove);
                    el.removeEventListener('mouseleave', onLeave);
                });
            });

            return () => cleanups.forEach((fn) => fn());
        };

        // ============================================================
        // 3D CARD TILT
        // ============================================================
        const initCardTilt = () => {
            const cards = document.querySelectorAll('.card');
            const cleanups: Array<() => void> = [];

            cards.forEach((card) => {
                const el = card as HTMLElement;
                // Add glow element
                const glow = document.createElement('div');
                glow.className = 'card-glow';
                el.appendChild(glow);

                // Add border animation element
                const borderAnim = document.createElement('div');
                borderAnim.className = 'card-border-anim';
                el.appendChild(borderAnim);

                const onMove = (e: MouseEvent) => {
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const cx = rect.width / 2;
                    const cy = rect.height / 2;
                    const rotX = ((y - cy) / cy) * -8;
                    const rotY = ((x - cx) / cx) * 8;

                    el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale(1.02)`;
                    el.style.boxShadow = `
            ${-rotY * 2}px ${rotX * 2}px 40px rgba(0,0,0,0.5),
            0 0 40px rgba(123, 111, 255, 0.12)
          `;

                    // Move glow
                    glow.style.left = x + 'px';
                    glow.style.top = y + 'px';
                };
                const onLeave = () => {
                    el.style.transform = '';
                    el.style.boxShadow = '';
                };
                el.addEventListener('mousemove', onMove);
                el.addEventListener('mouseleave', onLeave);
                cleanups.push(() => {
                    el.removeEventListener('mousemove', onMove);
                    el.removeEventListener('mouseleave', onLeave);
                });
            });

            return () => cleanups.forEach((fn) => fn());
        };

        // ============================================================
        // PANEL TILT (subtle)
        // ============================================================
        const initPanelTilt = () => {
            const panels = document.querySelectorAll('.panel, .term');
            const cleanups: Array<() => void> = [];

            panels.forEach((panel) => {
                const el = panel as HTMLElement;
                const onMove = (e: MouseEvent) => {
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const cx = rect.width / 2;
                    const cy = rect.height / 2;
                    const rotX = ((y - cy) / cy) * -3;
                    const rotY = ((x - cx) / cx) * 3;
                    el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
                };
                const onLeave = () => {
                    el.style.transform = '';
                };
                el.addEventListener('mousemove', onMove);
                el.addEventListener('mouseleave', onLeave);
                cleanups.push(() => {
                    el.removeEventListener('mousemove', onMove);
                    el.removeEventListener('mouseleave', onLeave);
                });
            });

            return () => cleanups.forEach((fn) => fn());
        };

        // ============================================================
        // KONAMI CODE EASTER EGG
        // ============================================================
        const initKonami = () => {
            const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
            let idx = 0;
            const overlay = document.getElementById('konami-overlay');
            const closeBtn = document.getElementById('konami-close');

            const onKey = (e: KeyboardEvent) => {
                if (e.key === KONAMI[idx]) {
                    idx++;
                    if (idx === KONAMI.length) {
                        idx = 0;
                        overlay?.classList.add('show');
                    }
                } else {
                    idx = 0;
                }
            };
            const onClose = () => overlay?.classList.remove('show');

            document.addEventListener('keydown', onKey);
            closeBtn?.addEventListener('click', onClose);

            return () => {
                document.removeEventListener('keydown', onKey);
                closeBtn?.removeEventListener('click', onClose);
            };
        };

        // ============================================================
        // LOGO EASTER EGG — click 5 times
        // ============================================================
        const initLogoEgg = () => {
            const logo = document.querySelector('.logo') as HTMLElement;
            if (!logo) return;
            let clicks = 0;
            let timer: ReturnType<typeof setTimeout>;

            const onClick = () => {
                clicks++;
                clearTimeout(timer);
                if (clicks >= 5) {
                    clicks = 0;
                    logo.style.animation = 'konamiPulse 0.5s ease-in-out 3';
                    logo.style.color = 'var(--accent-cyan)';
                    setTimeout(() => {
                        logo.style.animation = '';
                        logo.style.color = '';
                    }, 1500);
                }
                timer = setTimeout(() => { clicks = 0; }, 1000);
            };

            logo.addEventListener('click', onClick);
            return () => logo.removeEventListener('click', onClick);
        };

        // ============================================================
        // CHIP RIPPLE EFFECT
        // ============================================================
        const initChipRipple = () => {
            const chips = document.querySelectorAll('button.chip');
            const cleanups: Array<() => void> = [];

            chips.forEach((chip) => {
                const el = chip as HTMLElement;
                const onClick = (e: MouseEvent) => {
                    const rect = el.getBoundingClientRect();
                    const ripple = document.createElement('span');
                    const size = Math.max(rect.width, rect.height);
                    ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${e.clientX - rect.left - size / 2}px;
            top: ${e.clientY - rect.top - size / 2}px;
            background: rgba(123, 111, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleAnim 0.5s ease-out forwards;
            pointer-events: none;
          `;
                    el.style.position = 'relative';
                    el.style.overflow = 'hidden';
                    el.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 500);
                };
                el.addEventListener('click', onClick);
                cleanups.push(() => el.removeEventListener('click', onClick));
            });

            // Add ripple keyframe
            if (!document.getElementById('ripple-style')) {
                const style = document.createElement('style');
                style.id = 'ripple-style';
                style.textContent = `
          @keyframes rippleAnim {
            to { transform: scale(2.5); opacity: 0; }
          }
        `;
                document.head.appendChild(style);
            }

            return () => cleanups.forEach((fn) => fn());
        };

        // ============================================================
        // COUNTER ANIMATION (for stats)
        // ============================================================
        const initCounters = () => {
            const counters = document.querySelectorAll('[data-count]');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target as HTMLElement;
                    const target = parseFloat(el.dataset.count || '0');
                    const decimals = el.dataset.count?.includes('.') ? 2 : 0;
                    const duration = 1500;
                    const start = performance.now();

                    const animate = (now: number) => {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        el.textContent = (target * eased).toFixed(decimals);
                        if (progress < 1) requestAnimationFrame(animate);
                    };
                    requestAnimationFrame(animate);
                    observer.unobserve(el);
                });
            }, { threshold: 0.5 });

            counters.forEach((el) => observer.observe(el));
            return () => observer.disconnect();
        };

        // ============================================================
        // SECTION GLOW ACCENT CHANGE
        // ============================================================
        const initSectionAccents = () => {
            const sections = document.querySelectorAll('.stage');
            const accents = [
                'rgba(0, 212, 255, 0.06)',
                'rgba(123, 111, 255, 0.06)',
                'rgba(191, 95, 255, 0.06)',
                'rgba(0, 255, 179, 0.05)',
                'rgba(255, 159, 28, 0.06)',
                'rgba(0, 212, 255, 0.06)',
            ];

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    let idx = Array.from(sections).indexOf(entry.target);
                    const aurora = document.getElementById('aurora-mouse');
                    if (aurora) {
                        aurora.style.background = `radial-gradient(ellipse, ${accents[idx % accents.length]} 0%, transparent 70%)`;
                    }
                });
            }, { threshold: 0.4 });

            sections.forEach((s) => observer.observe(s));
            return () => observer.disconnect();
        };

        // ============================================================
        // INIT ALL
        // ============================================================
        const cleanups: Array<(() => void) | undefined> = [];

        if (!reduceMotion) initLenis();
        initAurora();
        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // Delay non-critical inits
        let timer = setTimeout(() => {
            // Cursor, card tilt and panel tilt already live in the legacy interaction
            // layer (main.js). Do not initialize duplicate transform loops here.
            if (!reduceMotion) cleanups.push(initParticles());
            cleanups.push(initScrollProgress());
            cleanups.push(initNavScroll());
            if (!reduceMotion) cleanups.push(initMagneticButtons());
            cleanups.push(initKonami());
            cleanups.push(initLogoEgg());
            cleanups.push(initChipRipple());
            cleanups.push(initCounters());
            cleanups.push(initSectionAccents());
        }, 200);

        return () => {
            clearTimeout(timer);
            if (rafId !== undefined) cancelAnimationFrame(rafId);
            if (lenis) lenis.destroy();
            window.removeEventListener('mousemove', handleMouseMove);
            cleanups.forEach((fn) => fn?.());
            // Remove trail elements
            trailPoints.forEach((pt) => pt.el.remove());
        };
    }, []);

    return null;
}
