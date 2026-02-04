# Distribution Guide

This document explains which files and folders are required for different distribution scenarios of the Design OS application.

## Table of Contents

- [Production Distribution (Deployment)](#production-distribution-deployment)
- [Development Distribution (Full Source)](#development-distribution-full-source)
- [File Size Reference](#file-size-reference)
- [Deployment Examples](#deployment-examples)

---

## Production Distribution (Deployment)

### Minimum Required Files

After running `npm run build`, **ONLY the `dist/` folder is needed** for production deployment.

```
dist/                           # Everything needed to run the app
├── index.html                  # Main HTML file (processed and optimized)
├── vite.svg                    # Favicon (copied from public/)
└── assets/                     # Bundled and optimized assets
    ├── index-[hash].js         # Bundled JavaScript (minified)
    ├── index-[hash].css        # Bundled CSS (minified, includes Tailwind)
    └── [other-assets-hash].ext # Any images, fonts, etc.
```

**That's it!** The entire application is self-contained in the `dist/` folder.

### What Gets Bundled

The build process bundles everything into the `dist/` folder:

✅ **Included in the bundle:**
- All React components from `src/`
- All product planning data from `product/` (bundled into JS)
- All CSS including Tailwind styles
- All dependencies from `node_modules/`
- All icons from lucide-react
- All Radix UI components
- Google Fonts (loaded from CDN via HTML)
- Static files from `public/` folder

### What You DON'T Need for Production

❌ **NOT needed for deployment:**
- `src/` folder (source code - already bundled)
- `node_modules/` folder (dependencies - already bundled)
- `product/` folder (planning data - already bundled)
- `package.json` (only needed for development)
- `package-lock.json` (only needed for development)
- `tsconfig*.json` (TypeScript configs - not needed at runtime)
- `vite.config.ts` (build config - not needed at runtime)
- `eslint.config.js` (linting config - not needed at runtime)
- `.claude/` folder (AI agent configs)
- `*.bat` files (Windows helper scripts)
- `WINDOWS-SETUP.md`, `DISTRIBUTION.md`, etc. (documentation)
- `.git/` folder (version control)
- `.gitignore` (version control)

### Production Deployment Steps

1. **Build the application**
   ```bash
   npm run build
   ```
   or double-click `build.bat` on Windows

2. **Verify the build**
   ```bash
   npm run preview
   ```
   or double-click `preview.bat` on Windows
   - Opens at http://localhost:4173
   - Test all functionality

3. **Deploy the `dist/` folder**
   - Upload ONLY the contents of the `dist/` folder to your web server
   - The folder typically contains 3-5 files (1 HTML, 1-2 JS, 1-2 CSS, plus assets)

4. **Configure your web server**
   - Serve `dist/index.html` for all routes (SPA routing)
   - Set proper cache headers for hashed assets
   - Enable gzip/brotli compression

### Typical Production File Sizes

After build (approximate sizes):

```
dist/
├── index.html              ~1-2 KB
├── vite.svg               ~1.5 KB
└── assets/
    ├── index-[hash].js    ~500-800 KB (includes React, all dependencies)
    ├── index-[hash].css   ~50-100 KB (includes Tailwind CSS)
    └── [other assets]     varies
```

**Total production bundle:** Approximately 500-900 KB (before gzip)
- After gzip compression: ~150-250 KB

---

## Development Distribution (Full Source)

If you need to distribute the full source code for development purposes, include:

### Required Files and Folders

```
project-root/
├── src/                        # REQUIRED - Source code
│   ├── components/             # React components
│   ├── sections/               # Product section designs
│   ├── shell/                  # Application shell
│   ├── lib/                    # Utilities and loaders
│   ├── types/                  # TypeScript types
│   ├── assets/                 # Static assets
│   ├── main.tsx                # App entry point
│   └── index.css               # Global styles (Tailwind)
│
├── product/                    # REQUIRED - Product planning data
│   ├── product-overview.md
│   ├── product-roadmap.md
│   ├── design-system/          # Colors, typography
│   ├── data-model/             # Data model definitions
│   ├── shell/                  # Shell specifications
│   └── sections/               # Section specs, data, types
│       ├── programs/
│       ├── okr-hierarchy/
│       └── okr-rituals/
│
├── public/                     # REQUIRED - Static files
│   └── vite.svg                # Favicon
│
├── .claude/                    # OPTIONAL - AI agent configs
│   ├── skills/                 # Custom skills
│   └── settings.local.json     # Settings
│
├── docs/                       # OPTIONAL - Additional documentation
│
├── package.json                # REQUIRED - Dependencies and scripts
├── package-lock.json           # REQUIRED - Locked dependency versions
├── index.html                  # REQUIRED - HTML entry point
├── vite.config.ts              # REQUIRED - Vite configuration
├── tsconfig.json               # REQUIRED - TypeScript config (root)
├── tsconfig.app.json           # REQUIRED - TypeScript app config
├── tsconfig.node.json          # REQUIRED - TypeScript node config
├── eslint.config.js            # OPTIONAL - Code quality config
├── components.json             # OPTIONAL - Shadcn UI config
│
├── *.bat                       # OPTIONAL - Windows helper scripts
├── *.md                        # OPTIONAL - Documentation files
│
├── .gitignore                  # RECOMMENDED - Git ignore rules
└── README.md                   # RECOMMENDED - Project documentation
```

### NOT Needed for Development Distribution

❌ **Exclude these when sharing source:**
- `node_modules/` - Recipients run `npm install` to recreate
- `dist/` - Recipients run `npm run build` to recreate
- `.git/` - Version control history (unless sharing repo)
- `.DS_Store` - macOS system files
- `*.log` - Log files

### Development Distribution Steps

1. **Clean the project**
   ```bash
   # Delete build artifacts
   rm -rf dist/
   rm -rf node_modules/
   ```

2. **Create archive** (zip/tar)
   Include all files listed in "Required Files and Folders" above

3. **Recipient setup**
   ```bash
   # Extract archive
   # Navigate to project folder
   npm install        # Install dependencies
   npm run dev        # Start development server
   ```

---

## File Size Reference

### Development (Before `npm install`)

Compressed source distribution: ~2-5 MB
- src/ folder: ~500 KB - 1 MB
- product/ folder: ~200-500 KB
- Configuration files: ~50 KB
- Documentation: ~100 KB

### Development (After `npm install`)

Full development environment: ~300-500 MB
- node_modules/: ~300-450 MB (thousands of files)
- Source code: ~2-5 MB
- Total: ~300-500 MB

### Production (After `npm run build`)

Production-ready distribution: ~600 KB - 1 MB
- dist/ folder: ~600 KB - 1 MB (3-5 files)
- After gzip: ~150-250 KB

---

## Deployment Examples

### Static Hosting (Netlify, Vercel, GitHub Pages)

**What to deploy:** `dist/` folder contents

**Deploy command:**
```bash
npm run build
```

**Publish directory:** `dist`

**Routing:** Configure for SPA (serve index.html for all routes)

Example `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Traditional Web Server (Apache, Nginx)

**What to upload:** Contents of `dist/` folder

**Apache `.htaccess` (for SPA routing):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Nginx config (for SPA routing):**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Windows IIS

**What to upload:** Contents of `dist/` folder

**web.config (for SPA routing):**
```xml
<?xml version="1.0"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

### CDN Distribution (CloudFlare, AWS CloudFront)

**What to upload:** Contents of `dist/` folder

**Cache strategy:**
- `index.html`: No cache or short TTL (5 minutes)
- `assets/*`: Long cache (1 year) - files have hash in name

---

## Production Checklist

Before deploying to production:

- [ ] Run `npm run build` successfully
- [ ] Test with `npm run preview` (or `preview.bat`)
- [ ] Verify all routes work
- [ ] Test in both light and dark mode
- [ ] Check browser console for errors
- [ ] Test on mobile viewport
- [ ] Verify favicon appears
- [ ] Check Google Fonts load correctly
- [ ] Test all interactive features
- [ ] Measure bundle size (should be under 1 MB)
- [ ] Configure server for SPA routing
- [ ] Set up proper cache headers
- [ ] Enable compression (gzip/brotli)
- [ ] Test production URL after deployment

---

## Troubleshooting

### "404 Not Found" on page refresh

**Problem:** Server returns 404 when refreshing on any route except `/`

**Solution:** Configure your web server to serve `index.html` for all routes (see deployment examples above)

### Assets not loading

**Problem:** CSS/JS files return 404

**Solution:**
- Ensure you uploaded ALL files from `dist/` folder
- Check that file paths are preserved
- Verify server allows access to `assets/` folder

### Blank page after deployment

**Problem:** App loads but shows blank page

**Solution:**
- Check browser console for errors (F12)
- Verify Google Fonts CDN is accessible
- Check for CORS issues if hosted on subdomain
- Ensure base URL is configured correctly in build

---

## Summary

**For Production Deployment:**
- ✅ Use: `dist/` folder only
- ✅ Size: ~600 KB - 1 MB (before compression)
- ✅ Files: 3-5 files total
- ❌ Don't include: src/, node_modules/, package.json, configs

**For Development Distribution:**
- ✅ Use: Full source (src/, product/, configs, package.json)
- ✅ Exclude: node_modules/, dist/, .git/
- ✅ Size: ~2-5 MB compressed
- 📦 Recipients run: `npm install` then `npm run dev`

**For Sharing Components Only:**
- ✅ Use: `src/sections/*/components/` folders
- ✅ Include: `product/sections/*/types.ts`
- ✅ Include: `product/sections/*/data.json` (for reference)
- ℹ️ These are the exportable, props-based components
