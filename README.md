# ♾️ SyncBoard | Multiplayer Spatial Canvas


[![React 18](https://img.shields.io/badge/React-18-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4.svg?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-black.svg?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![Zustand](https://img.shields.io/badge/Zustand-4-bear.svg?style=for-the-badge)](https://github.com/pmndrs/zustand)

SyncBoard is an elite frontend engineering showcase demonstrating spatial mathematics, hybrid DOM rendering, and serverless cross-tab synchronization. It serves as a foundational architecture for building infinite canvas applications like Miro, FigJam, or Milanote.

## 🚀 Architectural Masterpieces

### 1. Serverless "Multiplayer" Engine
* **BroadcastChannel API:** Real-time state synchronization across multiple browser tabs without requiring websockets, databases, or a backend. Open two tabs to see instant bidirectional updates.
* **Optimistic Updates:** Local state updates instantly while broadcasting delta changes to peers, ensuring a frictionless 60fps interaction model.

### 2. Hybrid Spatial Canvas
* **Infinite Pan & Zoom Engine:** Custom mathematical transformation matrix applied via CSS `transform` for hardware-accelerated navigation of the viewport.
* **DOM-Node Integration:** Sticky notes and text blocks are rendered as standard DOM elements within the spatial matrix, allowing for native text selection and Framer Motion spring physics.

### 3. Advanced UI/UX
* **Glassmorphic Tooling:** Floating toolbars with backdrop-blur and staggered entrance animations.
* **Physics-Based Interactions:** Dragging sticky notes utilizes `framer-motion`'s physical spring equations for weight and momentum.

## 💻 Local Setup & Testing the "Multiplayer"

```bash
# Install dependencies
npm install

# Start the Vite dev server
npm run dev
