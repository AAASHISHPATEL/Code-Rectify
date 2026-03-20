<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
  <img src="https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</div>

<br/>

<div align="center">
  <h1>🧠 Rectify — AI-Powered Code Reviewer</h1>
  <p>Paste your code, get instant AI-driven reviews, bug detection, and fixes — powered by Google Gemini.</p>
</div>

---

## ✨ Features

- 🔍 **Instant Code Review** — Get detailed analysis including quality rating, suggestions, and bug detection
- 🛠️ **Auto Fix Code** — Automatically rewrites and fixes your code with proper error handling
- 🌐 **20+ Languages Supported** — JavaScript, Python, Java, C++, Go, Rust, and more
- 🤖 **Multi-Model Fallback** — Automatically tries multiple Gemini models if rate limits are hit
- 🔄 **Smart Retry Logic** — Exponential backoff retries on API rate limits
- 📱 **Fully Responsive** — Works on mobile, tablet, and desktop
- 🎨 **Dark Mode UI** — Sleek dark-themed Monaco editor + response panel

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- A [Google Gemini API Key](https://aistudio.google.com/apikey) (free)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/AAASHISHPATEL/Code-Rectify.git
cd Code-Rectify

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Then add your Gemini API key to .env:
# VITE_GOOGLE_GEMINI_KEY=your_api_key_here

# 4. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Environment Setup

Create a `.env` file in the project root:

```env
VITE_GOOGLE_GEMINI_KEY=your_gemini_api_key_here
```

> **Get your free API key** from [Google AI Studio](https://aistudio.google.com/apikey).  
> The free tier gives you **1,500 requests/day** and **15 requests/minute**.

---

## 🧠 How It Works

1. **Select** your programming language from the dropdown
2. **Paste or type** your code in the Monaco editor
3. Click **Review** to get a detailed AI analysis:
   - Quality rating (Better / Good / Normal / Bad)
   - Step-by-step explanation
   - Bug and error detection
   - Improvement suggestions
4. Or click **Fix Code** to get an automatically corrected version

### Rate Limit Handling

The app intelligently handles Gemini API rate limits by:
- **Retrying** with exponential backoff (2s → 4s → 8s)
- **Falling back** through multiple models in order:
  1. `gemini-2.0-flash`
  2. `gemini-2.0-flash-lite`
  3. `gemini-2.5-flash`
  4. `gemini-2.5-flash-lite`

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React](https://react.dev/) | UI framework |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [Monaco Editor](https://microsoft.github.io/monaco-editor/) | Code editor (same as VS Code) |
| [Google Gemini API](https://ai.google.dev/) | AI code review & fixing |
| [Tailwind CSS](https://tailwindcss.com/) | Styling & responsive layout |
| [react-markdown](https://github.com/remarkjs/react-markdown) | Render AI responses as Markdown |
| [react-select](https://react-select.com/) | Language dropdown |
| [Lucide React](https://lucide.dev/) | Icons |

---

## 📁 Project Structure

```
Code-Rectify/
├── src/
│   ├── components/
│   │   └── Navbar.jsx       # Top navigation bar
│   ├── App.jsx              # Main app (editor, review, fix logic)
│   ├── App.css              # Global styles & responsive breakpoints
│   ├── index.css            # Tailwind imports
│   └── main.jsx             # React entry point
├── index.html
├── .env                     # API key (not committed)
├── .gitignore
└── vite.config.js
```

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/AAASHISHPATEL">Ashish Patel</a>
</div>