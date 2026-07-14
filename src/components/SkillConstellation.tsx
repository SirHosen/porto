"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface SkillNode {
    id: string;
    label: string;
    category: string;
    color: string;
    position: [number, number, number];
}

interface TooltipState {
    visible: boolean;
    x: number;
    y: number;
    node: SkillNode | null;
}

const CAT_COLORS: Record<string, string> = {
    "cat-lang": "#00e5ff",
    "cat-web": "#a855f7",
    "cat-db": "#10b981",
    "cat-net": "#f59e0b",
    "cat-sys": "#ef4444",
    "cat-prac": "#3b82f6",
};

const CAT_LABELS: Record<string, string> = {
    "cat-lang": "Languages",
    "cat-web": "Web & Frameworks",
    "cat-db": "Databases",
    "cat-net": "Networking",
    "cat-sys": "Systems & Tools",
    "cat-prac": "Practices",
};

const SKILLS: [string, string, string][] = [
    ["php", "PHP", "cat-lang"],
    ["jsts", "JavaScript / TypeScript", "cat-lang"],
    ["python", "Python", "cat-lang"],
    ["java", "Java", "cat-lang"],
    ["dart", "Dart", "cat-lang"],
    ["sql", "SQL", "cat-lang"],
    ["htmlcss", "HTML / CSS", "cat-lang"],
    ["laravel", "Laravel", "cat-web"],
    ["nextjs", "Next.js", "cat-web"],
    ["vue", "Vue.js", "cat-web"],
    ["alpine", "Alpine.js", "cat-web"],
    ["flutter", "Flutter", "cat-web"],
    ["tailwind", "Tailwind CSS", "cat-web"],
    ["django", "Django", "cat-web"],
    ["mysql", "MySQL / MariaDB", "cat-db"],
    ["postgres", "PostgreSQL", "cat-db"],
    ["supabase", "Supabase", "cat-db"],
    ["sqlite", "SQLite", "cat-db"],
    ["erd", "ERD / LRS design", "cat-db"],
    ["prisma", "Prisma ORM", "cat-db"],
    ["mikrotik", "MikroTik (MTCNA)", "cat-net"],
    ["cisco", "Cisco", "cat-net"],
    ["lanwlan", "LAN / WLAN", "cat-net"],
    ["qos", "QoS", "cat-net"],
    ["cabling", "Cabling & troubleshooting", "cat-net"],
    ["windows", "Windows (advanced)", "cat-sys"],
    ["linux", "Linux (Arch, Ubuntu)", "cat-sys"],
    ["git", "Git / GitHub", "cat-sys"],
    ["pm2", "PM2", "cat-sys"],
    ["nginx", "Nginx", "cat-sys"],
    ["tasksched", "Task Scheduler", "cat-sys"],
    ["systemd", "systemd", "cat-sys"],
    ["fullstack", "Full-stack dev", "cat-prac"],
    ["rest", "REST APIs", "cat-prac"],
    ["scrum", "Scrum", "cat-prac"],
    ["rad", "RAD", "cat-prac"],
    ["codereview", "Code review", "cat-prac"],
    ["blackbox", "Black-box testing", "cat-prac"],
];

function seeded(n: number): number {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x) - 0.5;
}

function buildNodes(): SkillNode[] {
    const cats = Object.keys(CAT_COLORS);
    const byCat: Record<string, [string, string, string][]> = {};
    SKILLS.forEach((s) => {
        if (!byCat[s[2]]) byCat[s[2]] = [];
        byCat[s[2]].push(s);
    });

    const hubAngles: Record<string, number> = {};
    cats.forEach((cid, i) => {
        hubAngles[cid] = (i / cats.length) * Math.PI * 2 - Math.PI / 7;
    });

    const nodes: SkillNode[] = [];
    cats.forEach((cid, ci) => {
        const arr = byCat[cid] || [];
        arr.forEach((s, j) => {
            const phi = hubAngles[cid] + (j - (arr.length - 1) / 2) * 0.34;
            const rr = 44 + seeded(j * 13 + cid.length) * 5;
            const hubY = (ci % 2 ? 9 : -9) + seeded(ci) * 4;
            const y = hubY * 1.35 + seeded(j * 7 + cid.length * 3) * 7;
            nodes.push({
                id: s[0],
                label: s[1],
                category: s[2],
                color: CAT_COLORS[s[2]],
                position: [rr * Math.cos(phi), y, rr * Math.sin(phi)],
            });
        });
    });
    return nodes;
}

export default function SkillConstellation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const animRef = useRef<number>(0);
    const stateRef = useRef({
        rotX: 0.15,
        rotY: 0,
        targetRotX: 0.15,
        targetRotY: 0,
        zoom: 1,
        targetZoom: 1,
        isDragging: false,
        lastX: 0,
        lastY: 0,
        autoRotate: true,
        hoveredId: null as string | null,
        nodes: buildNodes(),
    });

    const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, node: null });
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);

    const project3D = useCallback(
        (
            pos: [number, number, number],
            rotX: number,
            rotY: number,
            zoom: number,
            w: number,
            h: number
        ): { x: number; y: number; z: number; scale: number } => {
            // Rotate Y
            const cosY = Math.cos(rotY);
            const sinY = Math.sin(rotY);
            const x1 = pos[0] * cosY + pos[2] * sinY;
            const z1 = -pos[0] * sinY + pos[2] * cosY;
            // Rotate X
            const cosX = Math.cos(rotX);
            const sinX = Math.sin(rotX);
            const y2 = pos[1] * cosX - z1 * sinX;
            const z2 = pos[1] * sinX + z1 * cosX;

            const fov = 300 * zoom;
            const scale = fov / (fov + z2 + 80);
            return {
                x: w / 2 + x1 * scale,
                y: h / 2 + y2 * scale,
                z: z2,
                scale,
            };
        },
        []
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            const container = containerRef.current;
            if (!container) return;
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        };
        resize();
        const ro = new ResizeObserver(() => {
            requestAnimationFrame(resize);
        });
        if (containerRef.current) ro.observe(containerRef.current);

        const draw = () => {
            const s = stateRef.current;
            const w = canvas.width;
            const h = canvas.height;

            // Smooth interpolation
            s.rotX += (s.targetRotX - s.rotX) * 0.08;
            s.rotY += (s.targetRotY - s.rotY) * 0.08;
            s.zoom += (s.targetZoom - s.zoom) * 0.08;
            if (s.autoRotate && !s.isDragging) {
                s.targetRotY += 0.003;
            }

            ctx.clearRect(0, 0, w, h);

            // Project all nodes
            const projected = s.nodes.map((node) => ({
                node,
                proj: project3D(node.position, s.rotX, s.rotY, s.zoom, w, h),
            }));

            // Sort by z (back to front)
            projected.sort((a, b) => b.proj.z - a.proj.z);

            // Draw edges (constellation lines)
            const cats = Object.keys(CAT_COLORS);
            cats.forEach((cid) => {
                const catNodes = projected.filter((p) => p.node.category === cid);
                if (catNodes.length < 2) return;
                const isActive = activeCategory === null || activeCategory === cid;
                const color = CAT_COLORS[cid];
                const alpha = isActive ? 0.18 : 0.04;

                // Connect nodes in same category
                for (let i = 0; i < catNodes.length - 1; i++) {
                    const a = catNodes[i].proj;
                    const b = catNodes[i + 1].proj;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    const hex = parseInt(color.slice(1), 16);
                    const r = (hex >> 16) & 255;
                    const g = (hex >> 8) & 255;
                    const bl = hex & 255;
                    ctx.strokeStyle = `rgba(${r},${g},${bl},${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });

            // Draw nodes
            projected.forEach(({ node, proj }) => {
                const isHovered = s.hoveredId === node.id;
                const isSelected = selectedNode?.id === node.id;
                const isCatActive = activeCategory === null || activeCategory === node.category;
                const baseR = 3.5 * proj.scale;
                const r = isHovered || isSelected ? baseR * 2.2 : baseR;
                const alpha = isCatActive ? 1 : 0.2;

                const hex = parseInt(node.color.slice(1), 16);
                const cr = (hex >> 16) & 255;
                const cg = (hex >> 8) & 255;
                const cb = hex & 255;

                // Glow
                if ((isHovered || isSelected) && isCatActive) {
                    const grd = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, r * 4);
                    grd.addColorStop(0, `rgba(${cr},${cg},${cb},0.4)`);
                    grd.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
                    ctx.beginPath();
                    ctx.arc(proj.x, proj.y, r * 4, 0, Math.PI * 2);
                    ctx.fillStyle = grd;
                    ctx.fill();
                }

                // Outer ring for selected
                if (isSelected) {
                    ctx.beginPath();
                    ctx.arc(proj.x, proj.y, r * 2.5, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.6)`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }

                // Node dot
                ctx.beginPath();
                ctx.arc(proj.x, proj.y, r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
                ctx.fill();

                // White center
                ctx.beginPath();
                ctx.arc(proj.x, proj.y, r * 0.4, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${alpha * 0.9})`;
                ctx.fill();

                // Label for hovered/selected or close nodes
                if ((isHovered || isSelected || proj.scale > 0.85) && isCatActive) {
                    const fontSize = Math.max(9, Math.min(13, 11 * proj.scale));
                    ctx.font = `${isHovered || isSelected ? "600" : "400"} ${fontSize}px 'JetBrains Mono', monospace`;
                    ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
                    ctx.textAlign = "center";
                    ctx.fillText(node.label, proj.x, proj.y - r - 5);
                }
            });

            animRef.current = requestAnimationFrame(draw);
        };

        animRef.current = requestAnimationFrame(draw);
        return () => {
            cancelAnimationFrame(animRef.current);
            ro.disconnect();
        };
    }, [project3D, activeCategory, selectedNode]);

    // Mouse / touch handlers
    const getNodeAtPoint = useCallback(
        (cx: number, cy: number): SkillNode | null => {
            const canvas = canvasRef.current;
            if (!canvas) return null;
            const s = stateRef.current;
            const w = canvas.width;
            const h = canvas.height;
            let closest: SkillNode | null = null;
            let minDist = 20;
            s.nodes.forEach((node) => {
                const proj = project3D(node.position, s.rotX, s.rotY, s.zoom, w, h);
                const dist = Math.hypot(cx - proj.x, cy - proj.y);
                const r = 3.5 * proj.scale * 2.5;
                if (dist < r && dist < minDist) {
                    minDist = dist;
                    closest = node;
                }
            });
            return closest;
        },
        [project3D]
    );

    const onMouseMove = useCallback(
        (e: React.MouseEvent<HTMLCanvasElement>) => {
            const s = stateRef.current;
            const rect = canvasRef.current!.getBoundingClientRect();
            const cx = e.clientX - rect.left;
            const cy = e.clientY - rect.top;

            if (s.isDragging) {
                const dx = e.clientX - s.lastX;
                const dy = e.clientY - s.lastY;
                s.targetRotY += dx * 0.008;
                s.targetRotX += dy * 0.008;
                s.targetRotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, s.targetRotX));
                s.lastX = e.clientX;
                s.lastY = e.clientY;
                s.autoRotate = false;
            } else {
                const node = getNodeAtPoint(cx, cy);
                s.hoveredId = node?.id ?? null;
                if (node) {
                    setTooltip({ visible: true, x: e.clientX, y: e.clientY, node });
                    if (canvasRef.current) canvasRef.current.style.cursor = "pointer";
                } else {
                    setTooltip((t) => ({ ...t, visible: false }));
                    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
                }
            }
        },
        [getNodeAtPoint]
    );

    const onMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const s = stateRef.current;
        s.isDragging = true;
        s.lastX = e.clientX;
        s.lastY = e.clientY;
        if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    }, []);

    const onMouseUp = useCallback(
        (e: React.MouseEvent<HTMLCanvasElement>) => {
            const s = stateRef.current;
            const wasDragging = s.isDragging;
            s.isDragging = false;
            if (canvasRef.current) canvasRef.current.style.cursor = "grab";

            if (!wasDragging || (Math.abs(e.clientX - s.lastX) < 3 && Math.abs(e.clientY - s.lastY) < 3)) {
                const rect = canvasRef.current!.getBoundingClientRect();
                const node = getNodeAtPoint(e.clientX - rect.left, e.clientY - rect.top);
                if (node) {
                    setSelectedNode((prev) => (prev?.id === node.id ? null : node));
                }
            }
        },
        [getNodeAtPoint]
    );

    const onWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const s = stateRef.current;
        s.targetZoom = Math.max(0.4, Math.min(3, s.targetZoom - e.deltaY * 0.001));
    }, []);

    const onMouseLeave = useCallback(() => {
        const s = stateRef.current;
        s.isDragging = false;
        s.hoveredId = null;
        setTooltip((t) => ({ ...t, visible: false }));
        if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    }, []);

    // Touch support
    const touchRef = useRef({ lastX: 0, lastY: 0, lastDist: 0 });
    const onTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
        if (e.touches.length === 1) {
            stateRef.current.isDragging = true;
            stateRef.current.lastX = e.touches[0].clientX;
            stateRef.current.lastY = e.touches[0].clientY;
            stateRef.current.autoRotate = false;
        } else if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            touchRef.current.lastDist = Math.hypot(dx, dy);
        }
    }, []);

    const onTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const s = stateRef.current;
        if (e.touches.length === 1 && s.isDragging) {
            const dx = e.touches[0].clientX - s.lastX;
            const dy = e.touches[0].clientY - s.lastY;
            s.targetRotY += dx * 0.008;
            s.targetRotX += dy * 0.008;
            s.targetRotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, s.targetRotX));
            s.lastX = e.touches[0].clientX;
            s.lastY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const dist = Math.hypot(dx, dy);
            const delta = dist - touchRef.current.lastDist;
            s.targetZoom = Math.max(0.4, Math.min(3, s.targetZoom + delta * 0.005));
            touchRef.current.lastDist = dist;
        }
    }, []);

    const onTouchEnd = useCallback(() => {
        stateRef.current.isDragging = false;
    }, []);

    const resetView = useCallback(() => {
        const s = stateRef.current;
        s.targetRotX = 0.15;
        s.targetRotY = 0;
        s.targetZoom = 1;
        s.autoRotate = true;
    }, []);

    return (
        <div className="constellation-wrapper" ref={containerRef}>
            {/* Canvas */}
            <canvas
                ref={canvasRef}
                className="constellation-canvas"
                style={{ cursor: "grab" }}
                onMouseMove={onMouseMove}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                onWheel={onWheel}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            />

            {/* Category legend / filter */}
            <div className="constellation-legend">
                {Object.entries(CAT_COLORS).map(([cid, color]) => (
                    <button
                        key={cid}
                        className={`legend-btn${activeCategory === cid ? " active" : ""}`}
                        style={{ "--cat-color": color } as React.CSSProperties}
                        onClick={() => setActiveCategory((prev) => (prev === cid ? null : cid))}
                    >
                        <span className="legend-dot" />
                        {CAT_LABELS[cid]}
                    </button>
                ))}
            </div>

            {/* Controls hint */}
            <div className="constellation-hint mono">
                <span>drag to rotate</span>
                <span>scroll to zoom</span>
                <span>click node to inspect</span>
                <button className="reset-btn" onClick={resetView}>reset view</button>
            </div>

            {/* Selected node panel */}
            {selectedNode && (
                <div
                    className="node-panel"
                    style={{ "--panel-color": selectedNode.color } as React.CSSProperties}
                >
                    <button className="node-panel-close" onClick={() => setSelectedNode(null)}>×</button>
                    <div className="node-panel-cat mono" style={{ color: selectedNode.color }}>
                        {CAT_LABELS[selectedNode.category]}
                    </div>
                    <div className="node-panel-name">{selectedNode.label}</div>
                    <div className="node-panel-id mono" style={{ color: "var(--text-muted, #666)" }}>
                        node: {selectedNode.id}
                    </div>
                </div>
            )}

            {/* Hover tooltip */}
            {tooltip.visible && tooltip.node && !selectedNode && (
                <div
                    className="constellation-tooltip"
                    style={{
                        left: tooltip.x + 14,
                        top: tooltip.y - 10,
                        borderColor: tooltip.node.color,
                        color: tooltip.node.color,
                    }}
                >
                    {tooltip.node.label}
                </div>
            )}
        </div>
    );
}
