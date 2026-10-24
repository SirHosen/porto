# Hosea / Midnight Panel

A cinematic portfolio with original anime artwork, manga panel composition, a WebGL capability core, and a consistent ink / paper / vermilion palette.

## Preview

```sh
cd /home/hosea/Projects/001/porto
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://localhost:4173. A local HTTP server is required for ES modules; opening `index.html` directly with `file://` will not work. No build step or npm installation is needed to view or deploy the site. Upload `index.html` and `assets/` to any static host, including a subdirectory.

## Edit

- `assets/js/data.js`: all original project records, Aqila Atelier, skills, domain summaries, and project detail copy. Public links and archive statuses are explicit.
- `assets/css/midnight.css`: theme tokens, responsive layouts, and motion preferences.
- `assets/js/midnight.js`: project dialogs, filters, keyboard tabs, audio/motion controls, and scene orchestration.
- `assets/js/core.js`: original WebGL mesh geometry, perspective projection, cel lighting, and pointer orbit controls.
- `assets/images/midnight-city.webp`: original generated hero artwork, optimized to roughly 223 KB.
- `docs/art-direction.md`: artwork provenance and generation prompt.

The previous `app.js`, `graph.js`, `background.js`, `icons.js`, `logos.js`, and `system.css` are retained as legacy source references; the new entry point does not load them. `sfx.js` is reused for opt-in audio.

## Content provenance

All eight existing portfolio entries are retained. Aqila Atelier is added from the public [butik_aqila README](https://github.com/SirHosen/butik_aqila), reviewed on 14 September 2026. Its remaining device/cloud verification is reflected in the detail dialog. Flutter, Dart, and Riverpod are added to the skill index.

The public GitHub inventory was checked through `https://api.github.com/users/SirHosen/repos?per_page=100&sort=updated`. NESTfetch, GameNest, and Spinwheel's former repositories were absent. GameNest's old Vercel deployment returned 404. These projects remain visible as archives without dead source/demo links. Private project details stay at the technical summary level already present in the original portfolio.

Linux-native daily use and interest in anime/comics come from the owner's request. MTCNA and all prior technical skills come from the original portfolio. No unseen chat history, extra project names, work experience, contact addresses, or numerical proficiency claims were invented. The Aqila thumbnail is labeled an interface study, and the other two covers are concept visuals rather than actual screenshots.

## Behavior and accessibility

- Motion can be paused, respects `prefers-reduced-motion`, and avoids rendering inactive scenes. OS reduced-motion preference takes priority.
- Ambient audio starts only after pressing Sound, and suspends while the page is hidden.
- Skills remain accessible when WebGL is unavailable; a static symbol replaces the canvas.
- Project dialogs support Escape, focus trapping via native `dialog`, and focus restoration. Skill tabs support arrows and Home/End.
- Touch devices retain native vertical scrolling. Pointer orbit is available with a mouse; domain selection and Reset also work by keyboard.
- Fonts are local. Their SIL Open Font License files are bundled alongside them. There are no analytics or runtime third-party requests.

## Verification

Optional browser tooling:

```sh
npm ci
npx playwright install chromium
# Keep the preview server running in another terminal.
npm test
npm run test:a11y
```

To use an installed Chrome instead of downloading Chromium, set `PORTFOLIO_CHROME_PATH` to its executable. `PORTFOLIO_URL` can override the default `http://127.0.0.1:4173/`.

The browser checks cover all nine project records, archive filters, source link states, dialog focus, skill tab keyboard behavior, WebGL availability, pointer orbit, responsive widths from 320 to 1440 px, mobile navigation, reduced motion, and WebGL fallback. The accessibility check audits desktop, the project dialog, and mobile against WCAG A/AA rules supported by axe. Automated checks do not replace testing on physical devices or a screen reader.
