/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    compress: true,
    generateEtags: true,

    // Optimasi gambar + cache agresif
    images: {
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 31536000,
        deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536],
        imageSizes: [16, 32, 48, 64, 96, 128, 256],
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
    },

    // Kompresi teks agresif
    experimental: {
        optimizeCss: true,       // tree-shake CSS mati (Next 14)
        optimizePackageImports: [
            'framer-motion', 'gsap', 'lenis', 'three',
        ],
        webVitalsAttribution: ['CLS', 'LCP', 'INP'],
    },

    // Cache header untuk asset statis
    async headers() {
        return [
            {
                source: '/:all*(js|css|woff2|woff|ttf|otf|png|jpg|jpeg|gif|svg|webp|avif|ico)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                source: '/:path*',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                ],
            },
        ];
    },
};

export default nextConfig;
