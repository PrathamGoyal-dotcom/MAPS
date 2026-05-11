# MAPS Gym — Premium Landing Page

Welcome to the MAPS Gym frontend project! This is a highly polished, interactive, and modern web application built for a premium fitness center. It features a sophisticated dark-slate color palette and dynamic UI elements designed to provide a "wow factor."

## 🚀 Features

### 1. Premium Dark Theme
A carefully crafted aesthetic using deep dark blues (`#020617`, `#0f172a`), electric blue accents (`#38bdf8`), and high-energy neon orange (`#f97316`) to create a professional and engaging atmosphere.

### 2. Interactive "Wow Factor" 
- **Custom Trailing Cursor:** The standard pointer is replaced with a sleek, vibrant orange dot that perfectly tracks movement, followed by a trailing outline ring with smooth physics.
- **Dynamic 3D Spotlight Glow:** Hovering over pricing, program, or feature cards reveals a subtle, glowing radial spotlight that tracks your mouse cursor *inside* the card, bringing the interface to life.

### 3. Member Portal (Frontend Simulation)
A mock dashboard experience showcasing how a real backend integration would feel:
- **Secure Login Simulation:** Clicking "Member Login" from the navbar presents a login screen. Entering any credentials triggers an "Authenticating" state before securely sliding the dashboard into view.
- **Class Schedule Tab:** A sleek timetable for members to browse and book upcoming classes.
- **Community Chat Tab:** A live chat interface that simulates real-time conversations. Typing a message will trigger an automated reply from a "Coach" after a 2-second delay.

### 4. AI FAQ Chatbot
A floating Action Button in the bottom right opens the **MAPS AI Assistant**. You can ask questions about pricing, hours, and location, and the bot will simulate "typing..." before returning automated responses based on keyword logic.

### 5. Fully Responsive Layout
Built with modern CSS Grid and Flexbox, ensuring the 10-section landing page looks perfectly balanced and symmetrical on all devices from ultra-wide monitors to smartphones. 

---

## 🛠️ Technology Stack
- **HTML5:** Clean, semantic structure.
- **CSS3:** Advanced flex/grid layouts, CSS variables, and extensive use of pseudo-elements and transitions.
- **Vanilla JavaScript:** Powers the custom cursor, interactive glow effects, simulated dashboard logic, IntersectionObserver scroll reveals, and the AI chatbot.

## 🏃 Running the Project
Because this project uses vanilla web technologies without a build step, it's extremely easy to run locally:

1. Clone the repository.
2. Open `index.html` in your web browser.
3. *Alternatively*, for the best experience (to ensure all assets load securely), spin up a local server:
   ```bash
   # If you have Python installed:
   python -m http.server 3000
   ```
   Then navigate to `http://localhost:3000` in your browser.

---

*Designed and developed as a showcase for premium, interactive web design.*
