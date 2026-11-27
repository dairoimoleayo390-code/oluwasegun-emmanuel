# Oluwasegun Emmanuel — AI Web Developer Portfolio

Personal portfolio website for **Oluwasegun Emmanuel (AI Web Developer)**.
> *"I Don't Just Build Websites. I Build Digital Experiences."*

## Overview

This is a full-stack TypeScript web application built with React, Vite, Tailwind CSS, Express, and SQLite (`better-sqlite3`).

- **Portfolio Frontend**: Responsive sections covering Hero, About, Skills, Projects, Services, Development Tools, Why Work With Me, Testimonials, Contact Form, and Footer.
- **Built-in Content Management**: Add, edit, or delete projects, inspect submitted inquiries, and update your email, WhatsApp, and LinkedIn details from the **Manage Projects** / **Edit Email & Links** dialog.
- **Persistent SQLite Database**: Stores portfolio projects, contact settings, and client inquiries in `portfolio.db` (configurable via `DATA_DIR`).
- **Optional Email Forwarding**: Automatically forwards contact form submissions via SMTP when `SMTP_*` environment variables are configured.

## Requirements

- **Node.js 22.14+** (supports running `server.ts` natively with `node server.ts` in production)
- **npm 10+**

## Exporting & Local Setup

1. **Export the project**
   - Download the project archive or push this repository directly to your own GitHub / GitLab repository.
   - Make sure local `.env` or `data/*.db` files are never committed (already configured in `.gitignore`).

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` to match your domain and optional Gmail SMTP credentials.

4. **Run locally in development**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000`.

## Production Build & Start

```bash
npm run build
NODE_ENV=production npm start
```

The Express server serves the compiled frontend from `dist/` and handles all `/api/*` endpoints on port `3000` (or `process.env.PORT`).

## Independent Hosting Options

### Option 1: Publish Free on GitHub Pages (Public Link for Anyone)

Your portfolio includes a ready-to-run GitHub Actions workflow (`.github/workflows/deploy.yml`) and automatically falls back to built-in project data and direct email links when hosted statically on GitHub Pages.

1. Create a **public** repository on your GitHub account (`https://github.com/dairoimoleayo390-code`), for example `portfolio` (or `dairoimoleayo390-code.github.io`).
2. Push this exported project to the `main` branch of that repository.
3. In your GitHub repository, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
4. Once the workflow finishes, your live portfolio will be accessible to anyone at:
   - `https://dairoimoleayo390-code.github.io/<your-repo-name>/` (or `https://dairoimoleayo390-code.github.io/` if you name the repository `dairoimoleayo390-code.github.io`).

### Option 2: Docker (Any Cloud or VPS)

```bash
docker build -t oluwasegun-portfolio .
docker run -d \
  --name portfolio \
  -p 3000:3000 \
  -v portfolio_data:/app/data \
  --env-file .env \
  oluwasegun-portfolio
```

Mounting `/app/data` to a Docker volume ensures your projects, contact settings, and submitted inquiries persist across container updates.

### Option 2: Render / Railway / Fly.io

1. Push the exported codebase to a private or public Git repository.
2. Connect the repository to your hosting provider:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server.ts`
3. Set environment variables:
   - `NODE_ENV=production`
   - `DATA_DIR=/var/data` (or the mount path of your host's persistent disk/volume)
   - `CONTACT_TO_EMAIL=emmaoluwasegun100@gmail.com`
   - Optional `SMTP_*` variables for email notifications
4. Attach a **Persistent Disk / Volume** mounted at the same path as `DATA_DIR` so SQLite data survives redeploys.

### Option 3: VPS (Ubuntu / Nginx / PM2)

1. Install Node.js 22+ on your server and clone your repository.
2. Run `npm ci && npm run build`.
3. Start with PM2:
   ```bash
   NODE_ENV=production pm2 start server.ts --name oluwasegun-portfolio --interpreter node
   pm2 save
   ```
4. Proxy port `80`/`443` to `http://127.0.0.1:3000` with Nginx and enable HTTPS using Certbot (`certbot --nginx`).

## Enabling Gmail SMTP Notifications (Optional)

To forward contact form messages directly to `emmaoluwasegun100@gmail.com`:

1. Enable 2-Step Verification on your Google Account and generate a **Google App Password**.
2. Set these variables in `.env` or your host's dashboard:
   ```env
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_SECURE="false"
   SMTP_USER="emmaoluwasegun100@gmail.com"
   SMTP_PASS="your-16-char-app-password"
   CONTACT_TO_EMAIL="emmaoluwasegun100@gmail.com"
   ```
   All inquiries are also saved in the SQLite database regardless of whether SMTP is configured.
