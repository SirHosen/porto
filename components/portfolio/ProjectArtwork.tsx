// Bespoke architectural & technical blueprint plates for portfolio projects.
// Conceptual feature sketches based on the audited project descriptions, not live telemetry.

export function ProjectArtwork({ index, instance = "plate" }: { index: number; instance?: string }) {
  const id = "art-" + index + "-" + instance;

  return (
    <div className={"mp-art mp-art-" + index} aria-hidden="true">
      <svg viewBox="0 0 560 210" focusable="false">
        <defs>
          {/* Subtle millimeter blueprint grid */}
          <pattern id={id + "-grid"} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1a2333" strokeWidth="0.75" opacity="0.8" />
            <circle cx="20" cy="20" r="0.8" fill="#2d3d59" />
          </pattern>
          <pattern id={id + "-dots"} width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="0.75" fill="#3b4d6e" opacity="0.5" />
          </pattern>

          {/* Gradients */}
          <linearGradient id={id + "-grad-vermilion"} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f24b3e" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#d83a2e" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id={id + "-grad-steel"} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#83b9b4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#55817c" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id={id + "-grad-paper"} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#eeeade" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#eeeade" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id={id + "-fade-right"} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f24b3e" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#f24b3e" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Base dark canvas */}
        <rect width="560" height="210" fill="#090b10" />
        <rect width="560" height="210" fill={"url(#" + id + "-grid)"} />

        {/* Outer technical border & corner registration marks */}
        <rect x="12" y="12" width="536" height="186" fill="none" stroke="#1e293b" strokeWidth="1" />
        <path d="M 8 18 H 16 M 12 14 V 22 M 544 18 H 552 M 548 14 V 22 M 8 192 H 16 M 12 188 V 196 M 544 192 H 552 M 548 188 V 196" stroke="#00f0ff" strokeWidth="1" opacity="0.6" />

        {/* Interactive hover container */}
        <g className="mp-art-object">
          {/* ============================================================== */}
          {/* 01: NESTfetch — Distributed Async Scraper & SQLite Pipeline     */}
          {/* ============================================================== */}
          {index === 0 && (
            <g transform="translate(24, 20)">
              {/* Header telemetry readout */}
              <text x="6" y="12" fill="#83b9b4" fontFamily="monospace" fontSize="8.5" letterSpacing="0.08em">ASYNC SCRAPING // CONFIGURABLE PIPELINE</text>
              <text x="400" y="12" fill="#aba9a1" fontFamily="monospace" fontSize="8.5" letterSpacing="0.05em">CONCEPT SCHEMATIC</text>

              {/* Ingestion Sources (Left) */}
              <g transform="translate(6, 26)">
                <rect width="84" height="26" rx="3" fill="#1b1f1d" stroke="#3b423f" />
                <text x="8" y="16" fill="#eeeade" fontFamily="monospace" fontSize="8">SITE SOURCES</text>
                <circle cx="74" cy="13" r="3" fill="#83b9b4" />

                <rect y="34" width="84" height="26" rx="3" fill="#1b1f1d" stroke="#3b423f" />
                <text x="8" y="50" fill="#eeeade" fontFamily="monospace" fontSize="8">PAGE CONTENT</text>
                <circle cx="74" cy="47" r="3" fill="#f24b3e" />

                <rect y="68" width="84" height="26" rx="3" fill="#1b1f1d" stroke="#3b423f" />
                <text x="8" y="84" fill="#eeeade" fontFamily="monospace" fontSize="8">CONFIGURATION</text>
                <circle cx="74" cy="81" r="3" fill="#83b9b4" />
              </g>

              {/* Data streams to Worker Hub */}
              <path d="M 90 39 H 122 M 90 73 H 122 M 90 107 H 122" stroke="#5a635f" strokeWidth="1.2" strokeDasharray="3 3" />
              <path d="M 122 39 V 107" stroke="#83b9b4" strokeWidth="1.2" />
              <path d="M 122 73 H 146" stroke="#f24b3e" strokeWidth="1.5" />

              {/* Worker Pool Matrix (Center) */}
              <g transform="translate(146, 24)">
                <rect width="168" height="102" rx="4" fill="#181c1a" stroke="#48514d" />
                <rect width="168" height="18" rx="4" fill="#222724" />
                <text x="10" y="12" fill="#eeeade" fontFamily="monospace" fontSize="8.5" fontWeight="bold">ASYNC DISPATCHER</text>
                <text x="132" y="12" fill="#f24b3e" fontFamily="monospace" fontSize="8">ASYNC</text>

                {/* 4 Worker Lanes */}
                {[0, 1, 2, 3].map((w) => (
                  <g key={w} transform={`translate(10, ${26 + w * 18})`}>
                    <text x="0" y="11" fill="#aba9a1" fontFamily="monospace" fontSize="7.5">{["Fetch", "Retry", "Cache", "Export"][w]}</text>
                    <rect x="36" y="2" width="82" height="9" rx="2" fill="#101211" stroke="#2d3330" />
                    <rect x="37" y="3" width={22 + w * 16} height="7" rx="1.5" fill={w === 1 ? "#f24b3e" : "#83b9b4"} opacity="0.85" />
                    <text x="124" y="10" fill="#eeeade" fontFamily="monospace" fontSize="7">{["FETCH", "RETRY", "CACHE", "CSV"][w]}</text>
                  </g>
                ))}
              </g>

              {/* Data stream to Output (Right) */}
              <path d="M 314 75 H 348" stroke="#f24b3e" strokeWidth="1.5" />
              <polygon points="348,72 354,75 348,78" fill="#f24b3e" />

              {/* Structured Storage Block (Right) */}
              <g transform="translate(356, 24)">
                <rect width="142" height="102" rx="4" fill="#1b1f1d" stroke="#48514d" />
                <rect width="142" height="18" rx="4" fill="#222724" />
                <text x="10" y="12" fill="#eeeade" fontFamily="monospace" fontSize="8.5" fontWeight="bold">SQLITE STORAGE</text>

                {/* Table Schema preview */}
                <g transform="translate(10, 26)">
                  <rect width="122" height="15" fill="#282e2b" />
                  <text x="6" y="11" fill="#83b9b4" fontFamily="monospace" fontSize="7.5">Structured records</text>
                  <line x1="0" y1="21" x2="122" y2="21" stroke="#333a36" />
                  <line x1="0" y1="36" x2="122" y2="36" stroke="#333a36" />
                  <line x1="0" y1="51" x2="122" y2="51" stroke="#333a36" />
                  <line x1="0" y1="66" x2="122" y2="66" stroke="#333a36" />
                  <rect x="6" y="24" width="40" height="7" fill="#eeeade" opacity="0.4" />
                  <rect x="52" y="24" width="60" height="7" fill="#f24b3e" opacity="0.6" />
                  <rect x="6" y="39" width="55" height="7" fill="#eeeade" opacity="0.4" />
                  <rect x="68" y="39" width="44" height="7" fill="#83b9b4" opacity="0.6" />
                </g>
              </g>

              {/* Bottom footer status strip */}
              <line x1="6" y1="138" x2="498" y2="138" stroke="#2e3532" strokeWidth="1" />
              <text x="6" y="150" fill="#aba9a1" fontFamily="monospace" fontSize="7.5">CONFIG-DRIVEN FETCH  ·  RETRIES & CACHING  ·  SQLITE / CSV EXPORT</text>
            </g>
          )}

          {/* ============================================================== */}
          {/* 02: GameNest — Game Catalog CMS & Relational Architecture      */}
          {/* ============================================================== */}
          {index === 1 && (
            <g transform="translate(24, 20)">
              <text x="6" y="12" fill="#f24b3e" fontFamily="monospace" fontSize="8.5" letterSpacing="0.08em">GAME CATALOG // NEXT.JS + SUPABASE</text>
              <text x="390" y="12" fill="#aba9a1" fontFamily="monospace" fontSize="8.5">CONCEPT SCHEMATIC</text>

              {/* Isometric Game Card Stack (Left) */}
              <g transform="translate(10, 24)">
                {/* Underlayer card shadow */}
                <rect x="14" y="6" width="136" height="98" rx="4" fill="#181c1a" stroke="#333b37" />
                {/* Primary Card */}
                <rect width="136" height="98" rx="4" fill="#202522" stroke="#5c6661" strokeWidth="1.2" />
                {/* Media banner image placeholder */}
                <rect x="6" y="6" width="124" height="46" rx="2" fill="#131614" />
                <path d="M 6 40 L 40 18 L 74 38 L 102 24 L 130 46 H 6 Z" fill="#2e3531" />
                <circle cx="34" cy="18" r="6" fill="#f24b3e" opacity="0.85" />
                <rect x="94" y="10" width="30" height="12" rx="2" fill="#f24b3e" />
                <text x="98" y="19" fill="#101010" fontFamily="monospace" fontSize="7.5" fontWeight="bold">SEO</text>

                {/* Game Title & Badges */}
                <text x="8" y="64" fill="#eeeade" fontFamily="monospace" fontSize="9" fontWeight="bold">GAME CATALOG</text>
                <rect x="8" y="70" width="28" height="9" rx="2" fill="#2c332f" />
                <text x="11" y="77" fill="#83b9b4" fontFamily="monospace" fontSize="6.5">GENRE</text>
                <rect x="40" y="70" width="22" height="9" rx="2" fill="#2c332f" />
                <text x="43" y="77" fill="#83b9b4" fontFamily="monospace" fontSize="6.5">TAGS</text>
                <text x="8" y="90" fill="#aba9a1" fontFamily="monospace" fontSize="7">SEARCHABLE METADATA</text>
              </g>

              {/* Relational Database Connectors (Center) */}
              <g transform="translate(160, 24)">
                {/* Users Table */}
                <rect width="108" height="42" rx="3" fill="#1b1f1d" stroke="#48514d" />
                <rect width="108" height="12" rx="3" fill="#252b27" />
                <text x="6" y="9" fill="#eeeade" fontFamily="monospace" fontSize="7" fontWeight="bold">AUTHENTICATION</text>
                <text x="6" y="24" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">Protected CMS</text>
                <text x="6" y="34" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">Access control</text>

                {/* Games Table */}
                <rect y="54" width="108" height="48" rx="3" fill="#1b1f1d" stroke="#f24b3e" strokeWidth="1.2" />
                <rect y="54" width="108" height="12" rx="3" fill="#351a18" />
                <text x="6" y="63" fill="#f24b3e" fontFamily="monospace" fontSize="7" fontWeight="bold">GAME CATALOG</text>
                <text x="6" y="78" fill="#eeeade" fontFamily="monospace" fontSize="6.5">Titles + metadata</text>
                <text x="6" y="88" fill="#eeeade" fontFamily="monospace" fontSize="6.5">title · metadata · SEO</text>

                {/* Connector lines */}
                <path d="M 108 21 H 136 V 45 H 154" stroke="#83b9b4" strokeWidth="1.2" fill="none" />
                <path d="M 108 78 H 136 V 65 H 154" stroke="#f24b3e" strokeWidth="1.2" fill="none" />
              </g>

              {/* Reviews & Storage Table (Right) */}
              <g transform="translate(330, 24)">
                <rect width="168" height="42" rx="3" fill="#1b1f1d" stroke="#48514d" />
                <rect width="168" height="12" rx="3" fill="#252b27" />
                <text x="6" y="9" fill="#eeeade" fontFamily="monospace" fontSize="7" fontWeight="bold">IMAGE STORAGE</text>
                <text x="6" y="24" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">Catalog media</text>
                <text x="6" y="34" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">Stored images</text>

                {/* Search & SEO Index */}
                <g transform="translate(0, 54)">
                  <rect width="168" height="48" rx="3" fill="#181b19" stroke="#3b433f" />
                  <text x="8" y="14" fill="#83b9b4" fontFamily="monospace" fontSize="7.5">SEARCH + SEO</text>
                  <text x="8" y="26" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">Find games in the catalog</text>
                  <rect x="8" y="32" width="152" height="8" rx="2" fill="#242a27" />
                  <rect x="8" y="32" width="118" height="8" rx="2" fill="#83b9b4" opacity="0.6" />
                </g>
              </g>

              <line x1="6" y1="138" x2="498" y2="138" stroke="#2e3532" strokeWidth="1" />
              <text x="6" y="150" fill="#aba9a1" fontFamily="monospace" fontSize="7.5">IMAGE STORAGE  ·  SEARCH & SEO  ·  PROTECTED ADMIN CMS</text>
            </g>
          )}

          {/* ============================================================== */}
          {/* 03: Spinwheel AI Lab — Applied ML (CV + Bayesian + LSTM)        */}
          {/* ============================================================== */}
          {index === 2 && (
            <g transform="translate(24, 20)">
              <text x="6" y="12" fill="#83b9b4" fontFamily="monospace" fontSize="8.5" letterSpacing="0.08em">APPLIED ML // CV, BAYESIAN & LSTM</text>
              <text x="396" y="12" fill="#f24b3e" fontFamily="monospace" fontSize="8.5">CONCEPT SCHEMATIC</text>

              {/* Recurrent LSTM Cell Structure (Left) */}
              <g transform="translate(6, 24)">
                <rect width="144" height="102" rx="4" fill="#181c1a" stroke="#48514d" />
                <rect width="144" height="16" rx="4" fill="#222724" />
                <text x="8" y="11" fill="#eeeade" fontFamily="monospace" fontSize="7.5" fontWeight="bold">LSTM SEQUENCE MODEL</text>

                {/* Cell State flow line */}
                <path d="M 6 34 H 138" stroke="#f24b3e" strokeWidth="1.5" />
                <text x="12" y="30" fill="#f24b3e" fontFamily="monospace" fontSize="6.5">Sequence state</text>

                {/* Gates */}
                <rect x="14" y="44" width="30" height="22" rx="2" fill="#252b27" stroke="#3d4642" />
                <text x="21" y="58" fill="#83b9b4" fontFamily="monospace" fontSize="9">CV</text>
                <text x="16" y="74" fill="#aba9a1" fontFamily="monospace" fontSize="6">INPUT</text>

                <rect x="56" y="44" width="30" height="22" rx="2" fill="#252b27" stroke="#3d4642" />
                <text x="63" y="58" fill="#83b9b4" fontFamily="monospace" fontSize="9">LSTM</text>
                <text x="59" y="74" fill="#aba9a1" fontFamily="monospace" fontSize="6">MODEL</text>

                <rect x="98" y="44" width="30" height="22" rx="2" fill="#252b27" stroke="#3d4642" />
                <text x="105" y="58" fill="#83b9b4" fontFamily="monospace" fontSize="9">TEST</text>
                <text x="99" y="74" fill="#aba9a1" fontFamily="monospace" fontSize="6">OUTPUT</text>

                <path d="M 6 86 H 138" stroke="#83b9b4" strokeWidth="1.2" />
                <text x="12" y="96" fill="#83b9b4" fontFamily="monospace" fontSize="6.5">Temporal modelling</text>
              </g>

              {/* Bayesian Posterior Probability Curve (Center) */}
              <g transform="translate(162, 24)">
                <rect width="168" height="102" rx="4" fill="#181c1a" stroke="#48514d" />
                <rect width="168" height="16" rx="4" fill="#222724" />
                <text x="8" y="11" fill="#eeeade" fontFamily="monospace" fontSize="7.5" fontWeight="bold">BAYESIAN INFERENCE</text>

                {/* Axes */}
                <line x1="16" y1="88" x2="154" y2="88" stroke="#3b423f" />
                <line x1="16" y1="28" x2="16" y2="88" stroke="#3b423f" />

                {/* Prior curve (dashed) */}
                <path d="M 20 84 Q 50 82 85 58 Q 120 82 150 84" fill="none" stroke="#68736e" strokeWidth="1" strokeDasharray="3 3" />

                {/* Shaded Credible Region 95% */}
                <path d="M 52 88 Q 85 30 118 88 Z" fill={"url(#" + id + "-fade-right)"} opacity="0.4" />

                {/* Posterior curve (solid vermilion) */}
                <path d="M 30 88 Q 60 84 85 32 Q 110 84 140 88" fill="none" stroke="#f24b3e" strokeWidth="1.8" />
                <line x1="85" y1="32" x2="85" y2="88" stroke="#f24b3e" strokeWidth="1" strokeDasharray="2 2" />
                <text x="90" y="44" fill="#f24b3e" fontFamily="monospace" fontSize="6.5">Posterior</text>
                <text x="32" y="98" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">Illustrative distribution</text>
              </g>

              {/* Walk-Forward Validation & Loss (Right) */}
              <g transform="translate(342, 24)">
                <rect width="156" height="102" rx="4" fill="#181c1a" stroke="#48514d" />
                <rect width="156" height="16" rx="4" fill="#222724" />
                <text x="8" y="11" fill="#eeeade" fontFamily="monospace" fontSize="7.5" fontWeight="bold">WALK-FORWARD BACKTEST</text>

                {/* Partitions */}
                <g transform="translate(10, 24)">
                  <text x="0" y="8" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">FOLD 01</text>
                  <rect x="42" y="0" width="56" height="8" rx="1.5" fill="#3b423f" />
                  <rect x="100" y="0" width="30" height="8" rx="1.5" fill="#f24b3e" />

                  <text x="0" y="22" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">FOLD 02</text>
                  <rect x="42" y="14" width="70" height="8" rx="1.5" fill="#3b423f" />
                  <rect x="114" y="14" width="24" height="8" rx="1.5" fill="#f24b3e" />

                  <text x="0" y="36" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">FOLD 03</text>
                  <rect x="42" y="28" width="82" height="8" rx="1.5" fill="#3b423f" />
                  <rect x="126" y="28" width="16" height="8" rx="1.5" fill="#83b9b4" />

                  <line x1="0" y1="46" x2="136" y2="46" stroke="#2d3330" />
                  <text x="0" y="58" fill="#83b9b4" fontFamily="monospace" fontSize="7">LOG-LOSS / BRIER SCORING</text>
                  <text x="0" y="68" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">WALK-FORWARD VALIDATION</text>
                </g>
              </g>

              <line x1="6" y1="138" x2="498" y2="138" stroke="#2e3532" strokeWidth="1" />
              <text x="6" y="150" fill="#aba9a1" fontFamily="monospace" fontSize="7.5">COMPUTER VISION  ·  TEMPORAL BACKTESTING  ·  MODEL EVALUATION</text>
            </g>
          )}

          {/* ============================================================== */}
          {/* 04: Sonorus — Classical Music Streaming Audio Architecture      */}
          {/* ============================================================== */}
          {index === 3 && (
            <g transform="translate(24, 20)">
              <text x="6" y="12" fill="#eeeade" fontFamily="monospace" fontSize="8.5" letterSpacing="0.08em">CLASSICAL MUSIC // LARAVEL + MYSQL</text>
              <text x="400" y="12" fill="#83b9b4" fontFamily="monospace" fontSize="8.5">CONCEPT SCHEMATIC</text>

              {/* Acoustic Waterfall Spectrum (Center / Top) */}
              <g transform="translate(6, 24)">
                <rect width="320" height="102" rx="4" fill="#181c1a" stroke="#48514d" />
                <rect width="320" height="16" rx="4" fill="#222724" />
                <text x="8" y="11" fill="#eeeade" fontFamily="monospace" fontSize="7.5" fontWeight="bold">MUSIC PLAYBACK</text>
                <text x="238" y="11" fill="#f24b3e" fontFamily="monospace" fontSize="7.5">L ────●──── R</text>

                {/* Frequency waterfall bars (24 frequency bands) */}
                <g transform="translate(14, 24)">
                  {[
                    28, 42, 60, 52, 48, 65, 58, 40, 32, 45, 55, 62, 50, 44, 38, 30, 26, 22, 18, 14, 12, 8, 6, 4
                  ].map((val, i) => (
                    <g key={i} transform={`translate(${i * 12.5}, 0)`}>
                      <rect y={62 - val} width="8.5" height={val} rx="1.5" fill={val > 50 ? "#f24b3e" : "#83b9b4"} opacity="0.85" />
                      <line x1="0" y1={60 - val} x2="8.5" y2={60 - val} stroke="#eeeade" strokeWidth="1" />
                    </g>
                  ))}
                  {/* Frequency labels */}
                  <text x="0" y="72" fill="#aba9a1" fontFamily="monospace" fontSize="6">STREAM</text>
                  <text x="96" y="72" fill="#aba9a1" fontFamily="monospace" fontSize="6">PLAYLISTS</text>
                  <text x="190" y="72" fill="#aba9a1" fontFamily="monospace" fontSize="6">HISTORY</text>
                  <text x="270" y="72" fill="#aba9a1" fontFamily="monospace" fontSize="6">SEARCH</text>
                </g>
              </g>

              {/* Classical Track Meta & Playback Pipeline (Right) */}
              <g transform="translate(338, 24)">
                <rect width="160" height="102" rx="4" fill="#181c1a" stroke="#48514d" />
                <rect width="160" height="16" rx="4" fill="#222724" />
                <text x="8" y="11" fill="#eeeade" fontFamily="monospace" fontSize="7.5" fontWeight="bold">CATALOG TAXONOMY</text>

                <g transform="translate(10, 24)">
                  <text x="0" y="10" fill="#f24b3e" fontFamily="monospace" fontSize="7.5" fontWeight="bold">CLASSICAL MUSIC</text>
                  <text x="0" y="21" fill="#eeeade" fontFamily="monospace" fontSize="7">PLAYLISTS & FAVORITES</text>
                  <text x="0" y="31" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">HISTORY + SEARCH</text>

                  {/* Playhead progress bar */}
                  <rect y="40" width="138" height="6" rx="2" fill="#101211" stroke="#2c332f" />
                  <rect y="40" width="62" height="6" rx="2" fill="#f24b3e" />
                  <circle cx="62" cy="43" r="4" fill="#eeeade" />

                  <text x="0" y="58" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">Playback</text>
                  <text x="80" y="58" fill="#83b9b4" fontFamily="monospace" fontSize="6.5">Illustration</text>

                  <line x1="0" y1="64" x2="138" y2="64" stroke="#2d3330" />
                  <text x="0" y="74" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">LARAVEL AUTH · ROLE RBAC · PLAYLISTS</text>
                </g>
              </g>

              <line x1="6" y1="138" x2="498" y2="138" stroke="#2e3532" strokeWidth="1" />
              <text x="6" y="150" fill="#aba9a1" fontFamily="monospace" fontSize="7.5">ROLE-BASED ADMIN  ·  MYSQL  ·  BLADE STREAMING UI</text>
            </g>
          )}

          {/* ============================================================== */}
          {/* 05: SonicCipher — Desktop Audio DSP Steganography (PyQt+NumPy) */}
          {/* ============================================================== */}
          {index === 4 && (
            <g transform="translate(24, 20)">
              <text x="6" y="12" fill="#83b9b4" fontFamily="monospace" fontSize="8.5" letterSpacing="0.08em">TEXT TO SOUND // WAVEFORM, SPECTROGRAM & FFT</text>
              <text x="400" y="12" fill="#f24b3e" fontFamily="monospace" fontSize="8.5">CONCEPT SCHEMATIC</text>

              {/* Spectrogram Waterfall Grid (Left / Center) */}
              <g transform="translate(6, 24)">
                <rect width="320" height="102" rx="4" fill="#181c1a" stroke="#48514d" />
                <rect width="320" height="16" rx="4" fill="#222724" />
                <text x="8" y="11" fill="#eeeade" fontFamily="monospace" fontSize="7.5" fontWeight="bold">SPECTROGRAM VISUALIZATION</text>
                <text x="250" y="11" fill="#83b9b4" fontFamily="monospace" fontSize="7.5">FFT</text>

                {/* Waterfall frequency time slices */}
                <g transform="translate(10, 22)">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((row) => (
                    <g key={row} transform={`translate(0, ${row * 9})`}>
                      <rect x="0" y="0" width="300" height="7" fill="#131614" />
                      {/* Carrier tone packets simulating encoded text */}
                      <rect x={20 + (row * 33) % 180} width="24" height="7" fill="#f24b3e" opacity="0.85" />
                      <rect x={80 + (row * 47) % 190} width="18" height="7" fill="#83b9b4" opacity="0.7" />
                      <rect x={140 + (row * 23) % 150} width="32" height="7" fill="#eeeade" opacity="0.5" />
                    </g>
                  ))}
                  <text x="0" y="80" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">TIME DOMAIN (s) ──►</text>
                  <text x="210" y="80" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">Illustrative frequency bands</text>
                </g>
              </g>

              {/* Text Encoding & Decryption Matrix (Right) */}
              <g transform="translate(338, 24)">
                <rect width="160" height="102" rx="4" fill="#181c1a" stroke="#48514d" />
                <rect width="160" height="16" rx="4" fill="#222724" />
                <text x="8" y="11" fill="#eeeade" fontFamily="monospace" fontSize="7.5" fontWeight="bold">TEXT ENCODING (PYQT)</text>

                <g transform="translate(10, 24)">
                  <text x="0" y="9" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">INPUT STRING:</text>
                  <rect y="12" width="138" height="15" rx="2" fill="#212623" stroke="#363f3a" />
                  <text x="6" y="23" fill="#eeeade" fontFamily="monospace" fontSize="7.5" fontWeight="bold">TEXT → SOUND</text>

                  <text x="0" y="38" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">AUDIO ENCODING:</text>
                  <text x="0" y="48" fill="#83b9b4" fontFamily="monospace" fontSize="7">Waveform + spectrogram</text>

                  <line x1="0" y1="56" x2="138" y2="56" stroke="#2d3330" />
                  <text x="0" y="67" fill="#f24b3e" fontFamily="monospace" fontSize="7">NUMPY SIGNAL PROCESSING</text>
                  <text x="0" y="76" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">PYINSTALLER STANDALONE</text>
                </g>
              </g>

              <line x1="6" y1="138" x2="498" y2="138" stroke="#2e3532" strokeWidth="1" />
              <text x="6" y="150" fill="#aba9a1" fontFamily="monospace" fontSize="7.5">NUMPY  ·  PYQT DESKTOP APP  ·  WAVEFORM, SPECTROGRAM & FFT</text>
            </g>
          )}

          {/* ============================================================== */}
          {/* 06: Adaptive Form QA — Automated Testing & Dynamic DOM DAG      */}
          {/* ============================================================== */}
          {index === 5 && (
            <g transform="translate(24, 20)">
              <text x="6" y="12" fill="#eeeade" fontFamily="monospace" fontSize="8.5" letterSpacing="0.08em">AUTHORIZED QA // SELENIUM + JSON PROFILES</text>
              <text x="408" y="12" fill="#83b9b4" fontFamily="monospace" fontSize="8.5">CONCEPT SCHEMATIC</text>

              {/* Execution Flow DAG (Left / Center) */}
              <g transform="translate(6, 24)">
                <rect width="320" height="102" rx="4" fill="#181c1a" stroke="#48514d" />
                <rect width="320" height="16" rx="4" fill="#222724" />
                <text x="8" y="11" fill="#eeeade" fontFamily="monospace" fontSize="7.5" fontWeight="bold">DYNAMIC STEP EXECUTION TREE</text>
                <text x="248" y="11" fill="#83b9b4" fontFamily="monospace" fontSize="7.5">TEST FLOW</text>

                {/* Step Flowchart */}
                <g transform="translate(12, 24)">
                  {/* Step 1 */}
                  <rect width="60" height="24" rx="2" fill="#212623" stroke="#83b9b4" />
                  <text x="6" y="11" fill="#83b9b4" fontFamily="monospace" fontSize="6.5">01: INIT</text>
                  <text x="6" y="20" fill="#eeeade" fontFamily="monospace" fontSize="6">START BROWSER</text>

                  <path d="M 60 12 H 78" stroke="#83b9b4" strokeWidth="1.2" />

                  {/* Step 2 */}
                  <rect x="78" width="68" height="24" rx="2" fill="#212623" stroke="#f24b3e" />
                  <text x="84" y="11" fill="#f24b3e" fontFamily="monospace" fontSize="6.5">02: DOM TRAV</text>
                  <text x="84" y="20" fill="#eeeade" fontFamily="monospace" fontSize="6">PARSE FIELDS</text>

                  <path d="M 146 12 H 164" stroke="#f24b3e" strokeWidth="1.2" />

                  {/* Step 3 */}
                  <rect x="164" width="68" height="24" rx="2" fill="#212623" stroke="#83b9b4" />
                  <text x="170" y="11" fill="#83b9b4" fontFamily="monospace" fontSize="6.5">03: INJECT</text>
                  <text x="170" y="20" fill="#eeeade" fontFamily="monospace" fontSize="6">JSON PROFILE</text>

                  <path d="M 232 12 H 250" stroke="#83b9b4" strokeWidth="1.2" />

                  {/* Step 4 */}
                  <rect x="250" width="46" height="24" rx="2" fill="#1b3024" stroke="#48996b" />
                  <text x="256" y="11" fill="#60d394" fontFamily="monospace" fontSize="6.5">04: CHECK</text>
                  <text x="256" y="20" fill="#eeeade" fontFamily="monospace" fontSize="6">RESULT</text>

                  {/* Dynamic Branching Line below */}
                  <path d="M 112 24 V 44 H 198 V 24" stroke="#59635e" strokeWidth="1" strokeDasharray="3 2" fill="none" />
                  <text x="120" y="41" fill="#aba9a1" fontFamily="monospace" fontSize="6">CONDITIONAL BRANCH / SKIP</text>

                  <line x1="0" y1="56" x2="296" y2="56" stroke="#2d3330" />
                  <text x="0" y="68" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">MULTI-PAGE FORMS  ·  PROFILE CONCEPTS  ·  SELENIUM</text>
                </g>
              </g>

              {/* JSON Profile Inspector (Right) */}
              <g transform="translate(338, 24)">
                <rect width="160" height="102" rx="4" fill="#181c1a" stroke="#48514d" />
                <rect width="160" height="16" rx="4" fill="#222724" />
                <text x="8" y="11" fill="#eeeade" fontFamily="monospace" fontSize="7.5" fontWeight="bold">PROFILE CONCEPT</text>

                <g transform="translate(10, 24)">
                  <text x="0" y="9" fill="#83b9b4" fontFamily="monospace" fontSize="6.5">{"{"}</text>
                  <text x="8" y="19" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">"target": "dynamic_v2",</text>
                  <text x="8" y="29" fill="#f24b3e" fontFamily="monospace" fontSize="6.5">"profile_id": "usr_99",</text>
                  <text x="8" y="39" fill="#eeeade" fontFamily="monospace" fontSize="6.5">"steps": [1, 2, 4, 7],</text>
                  <text x="8" y="49" fill="#83b9b4" fontFamily="monospace" fontSize="6.5">"assert_no_error": true</text>
                  <text x="0" y="59" fill="#83b9b4" fontFamily="monospace" fontSize="6.5">{"}"}</text>

                  <line x1="0" y1="65" x2="138" y2="65" stroke="#2d3330" />
                  <text x="0" y="75" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">CONFIGURABLE ANSWERS</text>
                </g>
              </g>

              <line x1="6" y1="138" x2="498" y2="138" stroke="#2e3532" strokeWidth="1" />
              <text x="6" y="150" fill="#aba9a1" fontFamily="monospace" fontSize="7.5">CONFIG-DRIVEN QA  ·  DYNAMIC MULTI-PAGE FORMS  ·  AUTHORIZED TESTING</text>
            </g>
          )}

          {/* ============================================================== */}
          {/* 07: Browser Session Reliability Lab — Systems Concurrency Matrix */}
          {/* ============================================================== */}
          {index === 6 && (
            <g transform="translate(24, 20)">
              <text x="6" y="12" fill="#83b9b4" fontFamily="monospace" fontSize="8.5" letterSpacing="0.08em">BROWSER LIFECYCLE // CONTROLLED TESTING</text>
              <text x="408" y="12" fill="#eeeade" fontFamily="monospace" fontSize="8.5">CONCEPT SCHEMATIC</text>

              {/* Multi-tenant Browser Lanes (Left / Center) */}
              <g transform="translate(6, 24)">
                <rect width="320" height="102" rx="4" fill="#181c1a" stroke="#48514d" />
                <rect width="320" height="16" rx="4" fill="#222724" />
                <text x="8" y="11" fill="#eeeade" fontFamily="monospace" fontSize="7.5" fontWeight="bold">CONCURRENT WORKER SLOTS</text>
                <text x="248" y="11" fill="#f24b3e" fontFamily="monospace" fontSize="7.5">CONCURRENCY</text>

                <g transform="translate(10, 24)">
                  {[
                    { id: "SESSION_01", ping: "Init", status: "START", col: "#83b9b4", w: 180 },
                    { id: "SESSION_02", ping: "Run", status: "CHECK", col: "#83b9b4", w: 155 },
                    { id: "SESSION_03", ping: "Close", status: "END", col: "#f24b3e", w: 90 },
                    { id: "SESSION_04", ping: "Log", status: "RECORD", col: "#83b9b4", w: 195 }
                  ].map((s, i) => (
                    <g key={s.id} transform={`translate(0, ${i * 18})`}>
                      <text x="0" y="10" fill="#eeeade" fontFamily="monospace" fontSize="7">{s.id}</text>
                      <rect x="74" y="2" width="138" height="9" rx="2" fill="#121513" stroke="#2d3430" />
                      <rect x="75" y="3" width={s.w * 0.7} height="7" rx="1.5" fill={s.col} opacity="0.8" />
                      <text x="220" y="10" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">{s.ping}</text>
                      <text x="260" y="10" fill={s.col} fontFamily="monospace" fontSize="6.5" fontWeight="bold">{s.status}</text>
                    </g>
                  ))}
                </g>
              </g>

              {/* Lifecycle State Machine (Right) */}
              <g transform="translate(338, 24)">
                <rect width="160" height="102" rx="4" fill="#181c1a" stroke="#48514d" />
                <rect width="160" height="16" rx="4" fill="#222724" />
                <text x="8" y="11" fill="#eeeade" fontFamily="monospace" fontSize="7.5" fontWeight="bold">LIFECYCLE TESTING</text>

                <g transform="translate(10, 24)">
                  <text x="0" y="10" fill="#83b9b4" fontFamily="monospace" fontSize="7">BROWSER LIFECYCLE:</text>
                  <rect y="14" width="138" height="8" rx="2" fill="#121513" />
                  <rect y="14" width="24" height="8" rx="2" fill="#83b9b4" />
                  <text x="0" y="32" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">Session management</text>

                  <line x1="0" y1="40" x2="138" y2="40" stroke="#2d3330" />
                  <text x="0" y="52" fill="#f24b3e" fontFamily="monospace" fontSize="7">RELIABILITY CHECKS:</text>
                  <text x="0" y="62" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">HTTP / proxy testing</text>
                  <text x="0" y="72" fill="#eeeade" fontFamily="monospace" fontSize="6.5">Logging and diagnostics</text>
                </g>
              </g>

              <line x1="6" y1="138" x2="498" y2="138" stroke="#2e3532" strokeWidth="1" />
              <text x="6" y="150" fill="#aba9a1" fontFamily="monospace" fontSize="7.5">MULTI-SESSION UI  ·  HTTP / PROXY RELIABILITY  ·  LOGGING</text>
            </g>
          )}

          {/* ============================================================== */}
          {/* 08: This portfolio — 3D Camera Raycaster & Waypoint Spline     */}
          {/* ============================================================== */}
          {index === 7 && (
            <g transform="translate(24, 20)">
              <text x="6" y="12" fill="#f24b3e" fontFamily="monospace" fontSize="8.5" letterSpacing="0.08em">THIS PORTFOLIO // CAMERA PATH & PROJECTION</text>
              <text x="408" y="12" fill="#83b9b4" fontFamily="monospace" fontSize="8.5">PROCEDURAL SCENE</text>

              {/* Isometric 3D Camera Spline Path (Left / Center) */}
              <g transform="translate(6, 24)">
                <rect width="320" height="102" rx="4" fill="#181c1a" stroke="#48514d" />
                <rect width="320" height="16" rx="4" fill="#222724" />
                <text x="8" y="11" fill="#eeeade" fontFamily="monospace" fontSize="7.5" fontWeight="bold">ARC-LENGTH SPLINE TRAJECTORY</text>
                <text x="238" y="11" fill="#f24b3e" fontFamily="monospace" fontSize="7.5">13 WAYPOINTS</text>

                {/* Perspective Coordinate Grid */}
                <g transform="translate(14, 24)">
                  {/* Distant building blocks wireframe */}
                  <rect x="20" y="14" width="22" height="42" fill="none" stroke="#2f3733" strokeWidth="1" />
                  <rect x="70" y="8" width="34" height="48" fill="none" stroke="#2f3733" strokeWidth="1" />
                  <rect x="180" y="18" width="28" height="38" fill="none" stroke="#2f3733" strokeWidth="1" />
                  <rect x="230" y="6" width="38" height="50" fill="none" stroke="#2f3733" strokeWidth="1" />

                  {/* Continuous 3D S-curve spline */}
                  <path d="M 10 52 Q 60 14 110 38 T 200 48 T 280 20" fill="none" stroke="#f24b3e" strokeWidth="2.2" />

                  {/* Waypoint nodes */}
                  {[
                    [10, 52, "01"], [55, 26, "02"], [110, 38, "03"],
                    [155, 48, "06"], [200, 48, "09"], [240, 34, "11"], [280, 20, "13"]
                  ].map(([px, py, lbl], idx) => (
                    <g key={idx} transform={`translate(${px}, ${py})`}>
                      <circle r="3.5" fill="#141716" stroke="#f24b3e" strokeWidth="1.5" />
                      <circle r="1.5" fill="#eeeade" />
                      <text x="-4" y="-7" fill="#83b9b4" fontFamily="monospace" fontSize="6">{lbl}</text>
                    </g>
                  ))}

                  {/* Camera Frustum pyramid at active waypoint */}
                  <polygon points="110,38 140,24 140,52" fill="#f24b3e" opacity="0.15" />
                  <line x1="110" y1="38" x2="140" y2="24" stroke="#f24b3e" strokeWidth="1" />
                  <line x1="110" y1="38" x2="140" y2="52" stroke="#f24b3e" strokeWidth="1" />
                  <text x="144" y="38" fill="#eeeade" fontFamily="monospace" fontSize="6.5">FOV: 58°</text>
                </g>
              </g>

              {/* Spatial Matrix & Telemetry (Right) */}
              <g transform="translate(338, 24)">
                <rect width="160" height="102" rx="4" fill="#181c1a" stroke="#48514d" />
                <rect width="160" height="16" rx="4" fill="#222724" />
                <text x="8" y="11" fill="#eeeade" fontFamily="monospace" fontSize="7.5" fontWeight="bold">PROJECTION MATRIX</text>

                <g transform="translate(10, 24)">
                  <text x="0" y="10" fill="#83b9b4" fontFamily="monospace" fontSize="7">VECTORS [X, Y, Z]:</text>
                  <text x="0" y="21" fill="#eeeade" fontFamily="monospace" fontSize="7">World → camera → clip</text>
                  <text x="0" y="32" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">Clip → screen coordinates</text>

                  <line x1="0" y1="40" x2="138" y2="40" stroke="#2d3330" />
                  <text x="0" y="52" fill="#f24b3e" fontFamily="monospace" fontSize="7">LENIS SMOOTH TICKER:</text>
                  <text x="0" y="62" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">GSAP + SCROLLTRIGGER</text>
                  <text x="0" y="72" fill="#83b9b4" fontFamily="monospace" fontSize="6.5">ON-DEMAND WEBGL RENDER</text>
                </g>
              </g>

              <line x1="6" y1="138" x2="498" y2="138" stroke="#2e3532" strokeWidth="1" />
              <text x="6" y="150" fill="#aba9a1" fontFamily="monospace" fontSize="7.5">INSTANCED MESHES  ·  DOM PROJECTION  ·  REDUCED-MOTION FALLBACK</text>
            </g>
          )}

          {/* ============================================================== */}
          {/* 09: Aqila Atelier — Flutter Retail & EOQ Restock Optimizer     */}
          {/* ============================================================== */}
          {index === 8 && (
            <g transform="translate(24, 20)">
              <text x="6" y="12" fill="#d2ba85" fontFamily="monospace" fontSize="8.5" letterSpacing="0.08em">RETAIL OPERATIONS // FLUTTER + SUPABASE</text>
              <text x="408" y="12" fill="#83b9b4" fontFamily="monospace" fontSize="8.5">CONCEPT SCHEMATIC</text>

              {/* EOQ Cost Curves Graph (Left / Center) */}
              <g transform="translate(6, 24)">
                <rect width="320" height="102" rx="4" fill="#181c1a" stroke="#48514d" />
                <rect width="320" height="16" rx="4" fill="#222724" />
                <text x="8" y="11" fill="#eeeade" fontFamily="monospace" fontSize="7.5" fontWeight="bold">ECONOMIC ORDER QUANTITY (EOQ) CURVES</text>
                <text x="240" y="11" fill="#d2ba85" fontFamily="monospace" fontSize="7.5">OPTIMAL: Q*</text>

                <g transform="translate(16, 24)">
                  {/* Coordinate axes */}
                  <line x1="16" y1="64" x2="280" y2="64" stroke="#3d4541" />
                  <line x1="16" y1="10" x2="16" y2="64" stroke="#3d4541" />

                  {/* Holding cost (straight line ascending) */}
                  <line x1="16" y1="60" x2="260" y2="18" stroke="#83b9b4" strokeWidth="1.4" />
                  <text x="220" y="16" fill="#83b9b4" fontFamily="monospace" fontSize="6">HOLDING COST</text>

                  {/* Setup/Order cost (hyperbolic curve descending) */}
                  <path d="M 22 14 Q 50 48 135 56 T 270 60" fill="none" stroke="#aba9a1" strokeWidth="1.2" strokeDasharray="3 2" />
                  <text x="40" y="24" fill="#aba9a1" fontFamily="monospace" fontSize="6">SETUP COST</text>

                  {/* Total cost curve (U-shaped curve) */}
                  <path d="M 24 16 Q 70 54 135 38 T 260 26" fill="none" stroke="#f24b3e" strokeWidth="1.8" />
                  <text x="144" y="22" fill="#f24b3e" fontFamily="monospace" fontSize="6.5">TOTAL COST</text>

                  {/* Optimal Point Q* */}
                  <line x1="135" y1="12" x2="135" y2="64" stroke="#f24b3e" strokeWidth="1" strokeDasharray="2 2" />
                  <circle cx="135" cy="38" r="3" fill="#f24b3e" />
                  <text x="140" y="44" fill="#d2ba85" fontFamily="monospace" fontSize="7" fontWeight="bold">Q* = √(2DS/H)</text>
                  <text x="120" y="72" fill="#aba9a1" fontFamily="monospace" fontSize="6">BATCH SIZE (Q)</text>
                </g>
              </g>

              {/* SKU & Inventory Workspace (Right) */}
              <g transform="translate(338, 24)">
                <rect width="160" height="102" rx="4" fill="#181c1a" stroke="#48514d" />
                <rect width="160" height="16" rx="4" fill="#222724" />
                <text x="8" y="11" fill="#eeeade" fontFamily="monospace" fontSize="7.5" fontWeight="bold">INVENTORY LEDGER</text>

                <g transform="translate(10, 24)">
                  <text x="0" y="10" fill="#d2ba85" fontFamily="monospace" fontSize="7.5" fontWeight="bold">BOUTIQUE INVENTORY</text>
                  <text x="0" y="20" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">CATEGORY: BOUTIQUE WEAR</text>

                  {/* Stock level bar */}
                  <rect y="26" width="138" height="7" rx="2" fill="#121513" stroke="#2d3430" />
                  <rect y="26" width="92" height="7" rx="2" fill="#83b9b4" />
                  <text x="0" y="44" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">Stock + restock planning</text>

                  <line x1="0" y1="50" x2="138" y2="50" stroke="#2d3330" />
                  <text x="0" y="62" fill="#f24b3e" fontFamily="monospace" fontSize="7">EOQ RESTOCK PLANNING</text>
                  <text x="0" y="72" fill="#aba9a1" fontFamily="monospace" fontSize="6.5">FLUTTER + RIVERPOD STATE</text>
                </g>
              </g>

              <line x1="6" y1="138" x2="498" y2="138" stroke="#2e3532" strokeWidth="1" />
              <text x="6" y="150" fill="#aba9a1" fontFamily="monospace" fontSize="7.5">INVENTORY & POS  ·  EOQ RESTOCK PLANNING  ·  SALES REPORTS</text>
            </g>
          )}
        </g>
      </svg>
      {/* Dynamic Project Sequence Number */}
      <span className="mp-art-index">{String(index + 1).padStart(2, "0")}</span>
    </div>
  );
}
