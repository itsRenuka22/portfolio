# Renuka Prasad Patwari - Portfolio Website

A modern, responsive portfolio website showcasing my work as a Software Engineer & ML Enthusiast.

## Quick Start

### View Locally
Simply open `index.html` in your browser:
```bash
open index.html
```

Or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```
Then visit `http://localhost:8000`

---

## Deploy & Share (Free Options)

### Option 1: GitHub Pages (Recommended)

1. **Create a GitHub repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   ```

2. **Push to GitHub:**
   ```bash
   gh repo create renuka-portfolio --public
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / `root`
   - Save

4. **Your site will be live at:**
   `https://itsrenuka22.github.io/renuka-portfolio`

### Option 2: Netlify (Drag & Drop)

1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login
3. Drag your `Portfolio` folder to the deployment area
4. Get your instant URL like `amazing-name-123.netlify.app`
5. Customize to `renuka-portfolio.netlify.app` in Site settings

### Option 3: Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   cd /Users/renuka/Documents/Portfolio
   vercel
   ```

3. Get your URL like `portfolio-renuka.vercel.app`

---

## Project Structure

```
Portfolio/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── script.js           # Interactive features
└── README.md           # This file
```

## Features

- **Responsive Design** - Works on all devices
- **Dark Theme** - Modern, professional look
- **Smooth Animations** - Scroll reveal effects
- **Mobile Navigation** - Hamburger menu
- **SEO Optimized** - Meta tags included
- **Social Sharing** - Open Graph support

## Customization

### Update Links
Replace placeholder links in `index.html`:
- LinkedIn: Update to your actual LinkedIn URL
- GitHub: Already set to `itsRenuka22`
- Project links: Add actual GitHub repo URLs

### Add Profile Photo
1. Add your photo to the Portfolio folder
2. In the hero section, add an image tag

### Add More Projects
Copy a `project-card` div in the projects section and update the content.

## Contact

- **Email:** renukaprasad.patwari@sjsu.edu
- **Phone:** 408-591-0850
- **LinkedIn:** [Renuka Patwari](https://linkedin.com/in/renuka-patwari)
- **GitHub:** [itsRenuka22](https://github.com/itsRenuka22)
