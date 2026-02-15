## 2025-02-23 - Static Export Security Headers Constraint

**Vulnerability:** Missing critical security headers (CSP, HSTS, etc.) in a statically exported Next.js application.

**Learning:** This project uses `output: 'export'` in `next.config.ts`, which means any headers defined in `next.config.ts` are ignored by the build process for the static assets. Security headers must be configured at the deployment platform level (in this case, `netlify.toml`). This is a common pitfall for static exports where developers assume `next.config.ts` headers work universally.

**Prevention:** When using `output: 'export'`, always verify where security headers are being applied. Use platform-specific configuration files (`netlify.toml`, `vercel.json`, `firebase.json`) to enforce security headers.
