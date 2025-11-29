# CyberSim: Visual Threat Learning Platform

![CyberSim Banner](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Built%20With-React%20%7C%20Tailwind%20%7C%20Gemini%20AI-blueviolet?style=for-the-badge)

**CyberSim** is an interactive, animated web application designed to simplify cybersecurity concepts. It provides visual simulations of common cyber attacks, helping students, developers, and security enthusiasts understand vulnerabilities and defense mechanisms through a "gamified" learning experience.

## 🚀 Features

### 🛡️ Interactive Attack Simulations
Visualize complex attack vectors with step-by-step animations. Watch how data packets travel, how actors are compromised, and how systems react.
- **Network Attacks**: Man-in-the-Middle (MitM), Denial of Service (DoS), DNS Spoofing.
- **Web Vulnerabilities**: SQL Injection, XSS, CSRF, SSRF, Broken Authentication, IDOR, Command Injection.
- **Malware & Exploits**: Ransomware, Phishing, Zero-Day Exploits, Buffer Overflow, Drive-by Downloads.
- **Brute Force**: Dictionary Attacks.

### 🧠 AI-Powered Knowledge Checks
Integrated with **Google Gemini 2.5 Flash**, the app generates dynamic, context-aware multiple-choice quizzes for every attack scenario to test your understanding in real-time.

### 🎨 Immersive "Cyber" Aesthetic
- **Visual Flow**: Animated SVG connection lines showing data streams (solid for established, dashed for virtual/hidden).
- **Packet Inspection**: Hovering "inspector" cards reveal payload details (e.g., specific malware signatures or stolen credentials).
- **Interactive Actors**: Click on actors (Hackers, Servers, Users) to manually trigger attack steps and see immediate visual feedback with ripple effects.
- **Responsive Design**: A sleek, dark-mode interface built with Tailwind CSS, fully responsive for desktop and tablet.

### 📊 Threat Intelligence & Stats
- **Deep Dive Facts**: AI-generated quick facts about each threat.
- **Defense Strategies**: Clear, actionable prevention tips listed for every scenario.
- **Risk Visualization**: Interactive charts displaying the commonality and risk impact of various attacks.

## 🛠️ Technology Stack

- **Frontend**: React 19 (TypeScript)
- **Styling**: Tailwind CSS (custom animations, glass-morphism effects)
- **AI Integration**: Google GenAI SDK (`@google/genai`) using Gemini 2.5 Flash
- **Visualization**: Recharts (statistics), Lucide React (iconography)
- **Animation**: Native CSS Keyframes & SVG manipulation

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cybersim.git
   cd cybersim
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   Create a `.env` file in the root directory and add your Google Gemini API key:
   ```env
   API_KEY=your_google_genai_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

## 🎮 How to Use

1. **Explore the Dashboard**: Start at the Home Dashboard to get an overview of available categories (Network, Web, Malware, etc.).
2. **Select a Simulation**: Click on an attack type (e.g., "Phishing") from the sidebar.
3. **Control the Flow**:
   - Use the **Play/Pause** buttons to watch the scenario unfold automatically.
   - Use **Next/Prev** steps to analyze specific moments in the attack chain.
   - **Click** on glowing actors to manually trigger specific packet events.
4. **Learn Defenses**: Review the "Defense Strategies" section below the canvas.
5. **Test Yourself**: Use the "Knowledge Check" section to generate an AI quiz and verify your learning.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ✍️ Author

**Purushotham Muktha**
Built with ❤️ to share knowledge with the global cybersecurity community.

---
*Disclaimer: This tool is for educational purposes only. Always practice ethical hacking and security research in authorized environments.*
