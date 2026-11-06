# FAIZ KHAN — Retro Developer Portfolio

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=VT323&size=35&duration=2500&pause=800&color=00FF9C&center=true&vCenter=true&width=650&lines=HELLO%2C+WORLD!;I'M+FAIZ+KHAN;SOFTWARE+ENGINEER+%7C+CREATIVE+DEVELOPER;ENGINEERING+WHAT'S+NEXT..." alt="Typing SVG" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/STATUS-ONLINE-00ff9c?style=for-the-badge&labelColor=101010" />
  <img src="https://img.shields.io/badge/BUILD-PASSING-00ff9c?style=for-the-badge&labelColor=101010" />
  <img src="https://img.shields.io/badge/STYLE-RETRO_FUTURE-ff4ecd?style=for-the-badge&labelColor=101010" />
  <img src="https://img.shields.io/badge/DEPLOY-AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white&labelColor=101010" />
</p>

<p align="center">
  <i>A digital playground where engineering meets creativity.</i>
</p>

---

## 01. SYSTEM OVERVIEW

Welcome to my personal portfolio repository.

This isn't just another developer portfolio. It's an interactive, retro-inspired digital experience built to showcase my engineering journey, projects, experiments, and creativity.

Inspired by vintage computer interfaces, arcade aesthetics, CRT displays, and futuristic operating systems, the portfolio combines nostalgic visuals with modern frontend engineering.

**The mission:** Build things that look different, work beautifully, and push boundaries.

<p align="center">
  <img src="public/images/portfolio-preview.gif" alt="Portfolio animated preview" width="90%" />
</p>

> Replace the preview above with an actual screen recording GIF of the deployed portfolio.

## 02. TECH STACK

| Technology | Purpose |
|---|---|
| React | Component-based UI |
| TypeScript | Type safety |
| Vite | Development and build tooling |
| GSAP | Advanced animations |
| ScrollTrigger | Scroll-based interactions |
| Lenis | Smooth scrolling |
| React Three Fiber | 3D experiences |
| Lucide React | Interface icons |
| React Bits | Creative UI components |
| CSS | Retro-inspired visual styling |
| AWS Amplify | Cloud hosting and deployment |

## 03. EXPERIENCE FEATURES

- **Retro-Futuristic UI:** Vintage computer-inspired interface with modern design principles.
- **GSAP Animations:** Smooth transitions, motion effects, and scroll-triggered animations.
- **Interactive Typography:** Animated text, scrambling effects, and futuristic headings.
- **3D Experiences:** Immersive visual elements powered by React Three Fiber.
- **Smooth Scrolling:** Lenis-powered scrolling experience.
- **Project Showcase:** Interactive project gallery with a circular carousel.
- **Responsive Layout:** Designed for desktop, tablet, and mobile screens.
- **Performance Focused:** Vite-powered production builds.

## 04. PROJECT STRUCTURE

```text
faiz-portfolio/
│
├── public/
│   ├── images/
│   │   ├── projects/
│   │   └── faiz-cutout.png
│   └── favicon.ico
│
├── src/
│   ├── components/
│   │   ├── Scramble.tsx
│   │   ├── ParticleText.jsx
│   │   ├── WarpText.jsx
│   │   ├── TextLoop.jsx
│   │   ├── CircularCarousel.jsx
│   │   └── CircularCarousel.css
│   │
│   ├── data.ts
│   ├── App.tsx
│   └── main.tsx
│
├── scripts/
│   └── fetch-reactbits.mjs
│
├── cutout.py
├── package.json
└── README.md
```

*The structure above is representative. Existing project files may contain additional components and directories.*

## 05. GETTING STARTED

Ready to run the portfolio locally?

### Prerequisites

- Node.js (LTS recommended)
- npm
- Git

### Step 1 — Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Start development server

```bash
npm run dev
```

Open your browser:

```text
http://localhost:5173
```

### Step 4 — Production build

```bash
npm run build
```

### Step 5 — Preview production build

```bash
npm run preview
```

Your production-ready static files will be generated inside:

```text
dist/
```

## 06. CUSTOMIZATION

### Personal information and projects

Most portfolio content is managed through:

```text
src/data.ts
```

Update the relevant information, including:

- Personal introduction
- Skills and technologies
- Experience
- Projects
- Social links
- Project images
- Live demos and GitHub repositories

**Important:** Set the `live` and `source` properties for each project.

Example:

```ts
{
  name: "VoiceUp",
  live: "YOUR_RENDER_URL",
  source: "YOUR_GITHUB_REPOSITORY"
}
```

Empty links are intentionally hidden from the interface.

### Profile image

The profile cutout is located at:

```text
public/images/faiz-cutout.png
```

It was initially generated using OpenCV GrabCut.

For cleaner hair edges and more accurate background removal, install:

```bash
pip install rembg
```

Then execute:

```bash
npm run cutout
```

The script automatically uses `rembg` when available. Alternatively, replace the existing PNG with an exported transparent image from remove.bg or Photoroom.

## 07. REACT BITS — MOTION LAB

This portfolio uses React Bits to introduce expressive animations and interactive components.

React Bits components are not bundled directly into the initial project.

The setup includes an automatic component-fetching script:

```text
scripts/fetch-reactbits.mjs
```

Running `npm run dev` or `npm run build` attempts to download missing components.

| Component | Experience |
|---|---|
| ParticleText | Animated particle-based typography |
| WarpText | Distorted futuristic typography |
| TextLoop | Animated text ribbon |
| CircularCarousel | Interactive circular project gallery |

### Manual installation

If automatic downloading fails, install components using the official React Bits CLI.

Example:

```bash
npx jsrepo add https://reactbits.dev/ts/tailwind/TextAnimations/DecryptedText
```

Check the official documentation for the latest CLI syntax and the appropriate JavaScript, TypeScript, CSS, or Tailwind variant.

Official resource:

https://reactbits.dev/

### Circular Project Gallery

To enable the circular carousel:

1. Add the official component source to:

```text
src/components/CircularCarousel.jsx
src/components/CircularCarousel.css
```

2. Add at least three project gallery images to `src/data.ts`.

3. The Project Gallery section will automatically become available when the required images are configured.

The default project images are stored in:

```text
public/images/projects/
```

Missing optional component files trigger plain fallback elements, so the production build can still succeed.

## 08. AWS DEPLOYMENT

The portfolio is a frontend-only static application. It can be hosted using AWS Amplify Hosting without provisioning an EC2 instance or managing a backend server.

### Recommended: AWS Amplify Hosting

**Deployment architecture**

```text
       GITHUB REPOSITORY
                |
                v
          AWS AMPLIFY
                |
                v
        BUILD ENVIRONMENT
                |
                v
           VITE BUILD
                |
                v
          DIST FOLDER
                |
                v
         AMPLIFY HOSTING
                |
                v
          LIVE PORTFOLIO
```

### Deployment steps

**1. Push your project to GitHub**

```bash
git add .
git commit -m "Initial portfolio release"
git push origin main
```

**2. Open AWS Amplify**

https://console.aws.amazon.com/amplify/

**3. Create a new application**

- Select Deploy your app.
- Choose GitHub as your source provider.
- Authorize GitHub if requested.
- Select your portfolio repository.
- Select the `main` branch.

**4. Configure the build settings**

Create an `amplify.yml` file in the repository root:

```yaml
version: 1

frontend:
  phases:
    preBuild:
      commands:
        - npm ci

    build:
      commands:
        - npm run build

  artifacts:
    baseDirectory: dist
    files:
      - '**/*'

  cache:
    paths:
      - node_modules/**/*
```

**5. Deploy**

Review the build configuration and select Save and deploy.

AWS Amplify will install dependencies, build the application, and publish the generated static files.

**6. Access your portfolio**

Once deployment succeeds, Amplify provides a hosted URL.

You can also connect a custom domain through Amplify's domain management settings.

### Continuous deployment

```text
GitHub Push
    |
    v
Amplify detects changes
    |
    v
Automatic build
    |
    v
Production deployment
    |
    v
Portfolio updated
```

Every successful push to the connected production branch can trigger a new deployment.

**AWS Documentation:**

https://docs.aws.amazon.com/amplify/latest/userguide/getting-started.html

## 09. ALTERNATIVE DEPLOYMENT

The portfolio can also be hosted on other static hosting platforms.

| Platform | Build command | Output directory |
|---|---|---|
| AWS Amplify | `npm run build` | `dist` |
| Vercel | `npm run build` | `dist` |
| Netlify | `npm run build` | `dist` |
| GitHub Pages | GitHub Actions | `dist` |

For GitHub Pages, push to `main` and configure:

```text
Repository Settings
       |
       v
Pages
       |
       v
Source: GitHub Actions
```

The included workflow configures the base path for GitHub Pages.

## 10. CONFIGURATION CHECKLIST

Before deploying, make sure:

- [ ] Personal information is updated.
- [ ] Profile cutout is configured.
- [ ] Project descriptions are accurate.
- [ ] GitHub repository links are configured.
- [ ] Live project URLs are configured.
- [ ] Social media links are updated.
- [ ] Project gallery images are available.
- [ ] Optional React Bits components are installed.
- [ ] Production build completes successfully.
- [ ] AWS Amplify deployment succeeds.
- [ ] Mobile responsiveness is verified.

## 11. CONNECT WITH ME

<p align="center">
  <a href="https://github.com/YOUR_GITHUB_USERNAME">
    <img src="https://img.shields.io/badge/GitHub-101010?style=for-the-badge&logo=github&logoColor=00ff9c" />
  </a>
  <a href="https://www.linkedin.com/in/YOUR_LINKEDIN_USERNAME/">
    <img src="https://img.shields.io/badge/LinkedIn-101010?style=for-the-badge&logo=linkedin&logoColor=00ff9c" />
  </a>
  <a href="https://YOUR_PORTFOLIO_URL">
    <img src="https://img.shields.io/badge/Portfolio-101010?style=for-the-badge&logo=vercel&logoColor=ff4ecd" />
  </a>
</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:101010,50:172c31,100:00ff9c&height=120&section=footer" width="100%" />
</p>

<p align="center">
  <code>END OF TRANSMISSION_</code>
  <br/>
  <i>Designed with curiosity. Built with code. Powered by creativity.</i>
  <br/><br/>
  <b>FAIZ KHAN © 2026</b>
</p>
