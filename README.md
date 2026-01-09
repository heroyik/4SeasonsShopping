# 4SEASONS - Premium 3D Concept Store

![Deploy to GitHub Pages](https://github.com/heroyik/4SeasonsShop/actions/workflows/nextjs_deploy.yml/badge.svg)

A high-end shopping experience built with modern web technologies, featuring interactive 3D product visualization and seasonal themes.

## 🚀 Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI & Transitions**: [React 19](https://reactjs.org/), [Framer Motion](https://www.framer.com/motion/)
- **3D Engine**: [Three.js](https://threejs.org/) (r182)
- **React 3D Bridge**: [@react-three/fiber](https://r3f.docs.pmnd.rs/) (v9) & [@react-three/drei](https://github.com/pmndrs/drei) (v10)
- **AR Viewer**: [@google/model-viewer](https://modelviewer.dev/) (v4.1.0)
- **Icons**: [Lucide React](https://lucide.dev/)

## ✨ Key Features

- **Interactive 3D Scene**: Real-time rendering of high-quality seasonal products.
- **Components Snapshot & Video**: Capture high-resolution images and record videos of the 3D models directly from the viewer.
- **Seamless Seasonal Transitions**: Dynamic environment and lighting shifts based on selected styles (Spring, Summer, Autumn, Winter).
- **Augmented Reality (AR)**: View products in your real-world space via mobile AR.
- **Optimized for Performance**: Utilizes React 19 stability improvements and Three.js low-power optimizations for smooth delivery across devices.

## 🛠 Project Structure

- `.github/workflows/`: CI/CD configurations.
- `src/app/`: Next.js 16 Page/Layout components.
- `src/components/canvas/`: Three.js and React Three Fiber scene components.
- `src/components/dom/`: React DOM components for UI and AR viewing.
- `public/`: Static assets including `.glb` models and brand icons.
- `assets/`: Project assets.

## 🏁 Getting Started

1. **Install dependencies**:

   ```bash
   npm install --legacy-peer-deps
   ```

2. **Run the development server**:

   ```bash
   npm run dev
   ```

3. **Build for production**:

   ```bash
   npm run build
   ```

4. **Start the production server**:

   ```bash
   npm run start
   ```

5. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design Philosophy

"4SEASONS" focuses on **Visual Excellence** and **Interactive Depth**. The store uses smooth gradients, glassmorphism UI elements, and subtle micro-animations to create a premium, state-of-the-art feel that wows the user at first glance.

<heroyik@gmail.com> 티염둥이
