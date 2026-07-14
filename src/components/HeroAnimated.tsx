"use client";

import { useEffect, useRef } from "react";

export default function HeroAnimated() {
    const heroRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const rolesRef = useRef<HTMLParagraphElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const actionsRef = useRef<HTMLDivElement>(null);
    const scrollHintRef = useRef<HTMLParagraphElement>(null);
    const termRef = useRef<HTMLDivElement>(null);
    const glitchIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const rafRef = useRef<number>(0);
    const mouseRef = useRef({ x: 0, y: 0 });
    const currentRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        let gsap: typeof import("gsap").gsap | null = null;

        async function init() {
            const mod = await import("gsap");
            gsap = mod.gsap;

            const hero = heroRef.current;
            const title = titleRef.current;
            const roles = rolesRef.current;
            const sub = subRef.current;
            const actions = actionsRef.current;
            const scrollHint = scrollHintRef.current;
            const term = termRef.current;

            if (!hero || !title || !roles || !sub || !actions || !scrollHint || !term) return;

            // ── Split title into lines for reveal ──
            const lines = title.querySelectorAll<HTMLElement>(".hero-line");

            // Set initial states
            gsap.set(lines, { y: "110%", opacity: 0 });
            gsap.set([roles, sub, scrollHint], { y: 28, opacity: 0 });
            gsap.set(actions, { y: 20, opacity: 0 });
            gsap.set(term, { x: 40, opacity: 0 });

            // ── Main timeline ──
            const tl = gsap.timeline({ delay: 0.3 });

            // Lines stagger reveal
            tl.to(lines, {
                y: "0%",
                opacity: 1,
                duration: 1.1,
                stagger: 0.18,
                ease: "expo.out",
            });

            // Roles + sub
            tl.to([roles, sub], {
                y: 0,
                opacity: 1,
                duration: 0.9,
                stagger: 0.12,
                ease: "power3.out",
            }, "-=0.55");

            // Actions
            tl.to(actions, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
            }, "-=0.5");

            // Scroll hint
            tl.to(scrollHint, {
                y: 0,
                opacity: 1,
                duration: 0.7,
                ease: "power2.out",
            }, "-=0.4");

            // Terminal panel
            tl.to(term, {
                x: 0,
                opacity: 1,
                duration: 1.0,
                ease: "expo.out",
            }, "-=1.2");

            // ── Glitch effect on title ──
            const glitchChars = "!<>-_\\/[]{}—=+*^?#________";
            const originalText = title.textContent || "";

            function triggerGlitch() {
                if (!title) return;
                const lines2 = title.querySelectorAll<HTMLElement>(".hero-line");
                lines2.forEach((line) => {
                    const original = line.dataset.original || line.textContent || "";
                    if (!line.dataset.original) line.dataset.original = original;

                    let iteration = 0;
                    const maxIter = 8;
                    const interval = setInterval(() => {
                        line.textContent = original
                            .split("")
                            .map((char, idx) => {
                                if (char === " " || char === "\n") return char;
                                if (idx < iteration) return original[idx];
                                return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                            })
                            .join("");
                        iteration += 1.5;
                        if (iteration >= original.length) {
                            clearInterval(interval);
                            line.textContent = original;
                        }
                    }, 40);
                });
            }

            // Initial glitch burst after reveal
            tl.call(() => {
                triggerGlitch();
                // Periodic subtle glitch
                glitchIntervalRef.current = setInterval(() => {
                    if (Math.random() > 0.6) triggerGlitch();
                }, 5000);
            }, [], "+=0.2");

            // ── 3D Mouse Parallax ──
            function onMouseMove(e: MouseEvent) {
                const rect = hero.getBoundingClientRect();
                mouseRef.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
                mouseRef.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            }

            function onMouseLeave() {
                mouseRef.current.x = 0;
                mouseRef.current.y = 0;
            }

            hero.addEventListener("mousemove", onMouseMove);
            hero.addEventListener("mouseleave", onMouseLeave);

            // Parallax layers config: [element, depthX, depthY]
            const layers: [HTMLElement, number, number][] = [
                [title, 18, 10],
                [roles, 10, 6],
                [sub, 7, 4],
                [actions, 5, 3],
                [term, -14, -8],
            ];

            function animateParallax() {
                const lerpFactor = 0.06;
                currentRef.current.x += (mouseRef.current.x - currentRef.current.x) * lerpFactor;
                currentRef.current.y += (mouseRef.current.y - currentRef.current.y) * lerpFactor;

                const cx = currentRef.current.x;
                const cy = currentRef.current.y;

                layers.forEach(([el, dx, dy]) => {
                    if (!el) return;
                    el.style.transform = `translate3d(${cx * dx}px, ${cy * dy}px, 0)`;
                });

                rafRef.current = requestAnimationFrame(animateParallax);
            }

            rafRef.current = requestAnimationFrame(animateParallax);

            return () => {
                hero.removeEventListener("mousemove", onMouseMove);
                hero.removeEventListener("mouseleave", onMouseLeave);
            };
        }

        const cleanup = init();

        return () => {
            if (glitchIntervalRef.current) clearInterval(glitchIntervalRef.current);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            cleanup.then((fn) => fn?.());
        };
    }, []);

    return (
        <div ref={heroRef} className="hero-animated-wrapper">
            <div className="hero-copy reveal">
                <div className="stage-tag">[ stage 0/5 : boot ] — system power-on</div>
                <h1 ref={titleRef} id="hero-title" className="hero-title-animated" aria-label="Hosea Oktarivanes Ferdinan Sinaga">
                    <span className="hero-line-wrap"><span className="hero-line">Hosea Oktarivanes</span></span>
                    <span className="hero-line-wrap"><span className="hero-line">Ferdinan Sinaga<span className="caret">_</span></span></span>
                </h1>
                <p ref={rolesRef} className="roles mono">Informatics Engineering Student · Web Developer · Network Engineer</p>
                <p ref={subRef} className="hero-sub">This page is a system. Every skill is a node, every project is a build linked to the modules it actually uses. Scroll to fly through the dependency graph.</p>
                <div ref={actionsRef} className="hero-actions">
                    <a className="btn btn-primary" href="#builds">Explore the builds</a>
                    <a className="btn btn-ghost" href="https://github.com/SirHosen" target="_blank" rel="noopener noreferrer">github.com/SirHosen ↗</a>
                </div>
                <p ref={scrollHintRef} className="scroll-hint mono">scroll ↓ to boot the system</p>
            </div>
            <div ref={termRef} className="term" aria-label="whoami terminal">
                <div className="term-bar"><i></i><i></i><i></i><em>hosea@system:~$</em></div>
                <div className="term-body">
                    <div><span className="pr">$</span> ./whoami --verbose</div>
                    <div><span className="k">name     :</span> "Hosea Oktarivanes Ferdinan Sinaga"</div>
                    <div><span className="k">roles    :</span> [ web_developer, network_engineer ]</div>
                    <div><span className="k">stack    :</span> [ laravel, next.js, vue, python ]</div>
                    <div><span className="k">network  :</span> [ mikrotik:MTCNA, cisco ]</div>
                    <div><span className="k">location :</span> "Kota Bekasi, Jawa Barat, ID"</div>
                    <div><span className="k">status   :</span> open_to_work → internship | freelance</div>
                    <div><span className="pr">$</span> <span className="cursor"></span></div>
                </div>
            </div>
        </div>
    );
}
