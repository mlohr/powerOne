# Windows Setup Guide (No Admin Rights Required)

This guide explains how to set up and run the Design OS React application on Windows **without requiring administrator privileges**.

## Prerequisites

You need Node.js and npm installed on your Windows machine. Since you don't have admin rights, here are two approaches:

### Option A: Portable Node.js (Recommended)

1. **Download Portable Node.js**
   - Go to https://nodejs.org/dist/
   - Navigate to the latest LTS version folder (e.g., `v20.18.2/`)
   - Download the Windows binary zip file: `node-v20.18.2-win-x64.zip`

2. **Extract to Your User Folder**
   - Extract the zip file to a folder you have access to
   - Example: `C:\Users\YourName\nodejs-portable\`
   - The folder should contain `node.exe` and `npm` files

3. **Add to PATH (User-Level)**
   - Open Windows Settings (Win + I)
   - Search for "Environment Variables"
   - Click "Edit environment variables for your account" (no admin needed)
   - Under "User variables", find or create "Path"
   - Click "Edit" → "New"
   - Add the path to your Node.js folder: `C:\Users\YourName\nodejs-portable`
   - Click "OK" to save

4. **Verify Installation**
   - Open a **new** Command Prompt (Win + R, type `cmd`, press Enter)
   - Run: `node --version`
   - Run: `npm --version`
   - If you see version numbers, you're good to go!

### Option B: Node Version Manager (fnm or volta)

**Using fnm (Fast Node Manager):**

1. Download fnm installer from: https://github.com/Schniz/fnm/releases
2. Run the installer (works without admin)
3. Open a new Command Prompt
4. Install Node.js: `fnm install 20`
5. Use it: `fnm use 20`

**Using volta:**

1. Download volta installer from: https://volta.sh/
2. Run the installer (works without admin in user mode)
3. Open a new Command Prompt
4. Install Node.js: `volta install node@20`

## Quick Start

Once Node.js is installed:

1. **Get the Project Files**
   - Clone the repository or copy the project folder to your computer

2. **Open Command Prompt in Project Folder**
   - Navigate to the project folder
   - Or: Hold Shift, right-click in the folder, select "Open PowerShell window here" or "Open Command Prompt here"

3. **Install Dependencies** (First time only)
   - Double-click `install.bat`
   - OR run in command prompt: `npm install`
   - This downloads all required packages (may take 2-5 minutes)

4. **Start Development Server**
   - Double-click `dev.bat`
   - OR run in command prompt: `npm run dev`
   - The app will start at http://localhost:3000
   - Your browser should open automatically

5. **Start Using the App**
   - Open your browser to http://localhost:3000
   - You should see the Design OS interface

## Available Scripts

We've created convenient batch files for common tasks. Just double-click them:

### `install.bat`
- **What it does:** Installs all project dependencies
- **When to use:** First time setup, or after pulling new code changes
- **Command equivalent:** `npm install`

### `dev.bat`
- **What it does:** Starts the development server with hot-reload
- **When to use:** During development - changes auto-refresh
- **Opens at:** http://localhost:3000
- **Command equivalent:** `npm run dev`
- **Stop it:** Press Ctrl+C in the command window

### `build.bat`
- **What it does:** Creates an optimized production build
- **When to use:** When you want to deploy or share the app
- **Output folder:** `dist/` (contains all files needed to run the app)
- **Command equivalent:** `npm run build`

### `preview.bat`
- **What it does:** Preview the production build locally
- **When to use:** After running `build.bat` to test the production version
- **Opens at:** http://localhost:4173
- **Command equivalent:** `npm run preview`

### `lint.bat`
- **What it does:** Checks code quality and finds issues
- **When to use:** Before committing code changes
- **Command equivalent:** `npm run lint`

## Troubleshooting

### "node is not recognized as an internal or external command"

**Problem:** Node.js is not in your PATH

**Solution:**
1. Close all Command Prompt windows
2. Open a new Command Prompt
3. If still not working, verify the PATH setup in Environment Variables
4. Make sure you added the correct folder path
5. Restart your computer if necessary

### "Port 3000 is already in use"

**Problem:** Another app is using port 3000

**Solutions:**
- Stop the other app using port 3000
- OR kill the process:
  1. Open Command Prompt
  2. Run: `netstat -ano | findstr :3000`
  3. Note the PID (last number)
  4. Run: `taskkill /PID <number> /F`

### "npm ERR! code EACCES" or Permission Errors

**Problem:** Trying to write to a protected folder

**Solutions:**
- Make sure you're running from a folder you own (like `C:\Users\YourName\...`)
- Don't run from `C:\Program Files\` or system directories
- Copy the project to your user folder

### "Cannot find module" Errors

**Problem:** Dependencies not installed correctly

**Solution:**
1. Delete the `node_modules` folder
2. Delete `package-lock.json` file
3. Run `install.bat` again

### Dev Server Doesn't Open Browser

**Problem:** Browser doesn't open automatically

**Solution:**
- Manually open your browser
- Go to http://localhost:3000
- Check the command window for the correct URL

### Build Fails with TypeScript Errors

**Problem:** TypeScript compilation errors

**Solution:**
- Check the error messages in the command window
- Fix the reported errors in the code
- Run `lint.bat` to identify issues

## Building for Production

When you're ready to deploy or share your app:

1. **Run the Build**
   - Double-click `build.bat`
   - OR run: `npm run build`
   - Wait for the build to complete

2. **Find Your Built App**
   - Open the `dist` folder in your project
   - This contains all files needed to run the app

3. **Test the Production Build**
   - Double-click `preview.bat`
   - OR run: `npm run preview`
   - Visit http://localhost:4173 to test

4. **Deploy the Built App**
   - The `dist` folder can be:
     - Uploaded to any web hosting service
     - Deployed to GitHub Pages, Netlify, Vercel, etc.
     - Served by any static file server (Apache, Nginx, IIS)

## Distribution Files

### For Production Deployment

**ONLY the `dist/` folder is needed!**

After running `build.bat`, the `dist/` folder contains everything:
- `index.html` - Main HTML file
- `vite.svg` - Favicon
- `assets/` folder - Bundled JavaScript and CSS (minified)

**Total size:** ~600 KB - 1 MB (before compression)

**What's bundled inside:**
- All React components
- All product data
- All CSS (including Tailwind)
- All dependencies
- All icons and UI components

**What you DON'T need to upload:**
- ❌ `src/` folder
- ❌ `node_modules/` folder
- ❌ `product/` folder
- ❌ `package.json`
- ❌ Configuration files (vite.config.ts, tsconfig.json, etc.)
- ❌ `.bat` files
- ❌ Documentation files

**Upload ONLY:** The contents of the `dist/` folder

### For Sharing Source Code

If someone else needs to run the development version:

**Include:**
- ✅ `src/` folder (source code)
- ✅ `product/` folder (planning data)
- ✅ `public/` folder (static files)
- ✅ `package.json` and `package-lock.json`
- ✅ `index.html`
- ✅ `vite.config.ts`
- ✅ `tsconfig*.json` files
- ✅ `.bat` files (helpful for Windows users)
- ✅ Documentation files

**Exclude:**
- ❌ `node_modules/` - They run `install.bat` to recreate
- ❌ `dist/` - They run `build.bat` to recreate

**Share as:** Zip file (approximately 2-5 MB)

**For complete distribution details**, see [DISTRIBUTION.md](DISTRIBUTION.md)

## Project Structure

```
powerOne/
├── src/                  # Source code
│   ├── components/       # React components
│   ├── sections/         # Product section designs
│   ├── shell/           # Application shell
│   └── main.tsx         # App entry point
├── product/             # Product planning files
├── dist/                # Production build (created by build.bat)
├── node_modules/        # Dependencies (created by install.bat)
├── package.json         # Project configuration
├── vite.config.ts       # Vite build configuration
├── install.bat          # Install dependencies
├── dev.bat              # Start development server
├── build.bat            # Build for production
├── preview.bat          # Preview production build
└── lint.bat             # Check code quality
```

## Tips

- **Save Often:** The dev server auto-reloads when you save files
- **Check the Console:** Errors appear in the command window and browser console (F12)
- **Use the Scripts:** The .bat files make common tasks easier
- **No Admin Needed:** Everything runs in your user folder - no system changes required

## Getting Help

If you encounter issues:

1. Check the error message in the command window
2. Look for the specific error in this troubleshooting section
3. Search for the error message online
4. Check Node.js and npm are properly installed: `node --version` and `npm --version`

## Next Steps

- Start the dev server: `dev.bat`
- Open http://localhost:3000
- Explore the Design OS interface
- Make changes and see them live!
