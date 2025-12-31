#  AI-powered Content Automation System

A full-stack AI-powered content automation system built for the BeyondChats internship assignment. This project scrapes technical blogs, enhances them using GenAI (Gemini) with real-time web research, and presents them in a futuristic React dashboard.

## 🌟 Features

*   **🕵️ Smart Scraper:** Automatically finds and scrapes the oldest articles from *BeyondChats* blogs using reverse-pagination logic.
*   **🧠 AI Researcher:** Searches Google for related, up-to-date sources and "reads" them to gather context.
*   **✍️ Content Generator:** Uses **Google Gemini 2.0 Flash** to rewrite and enhance articles with new insights and citations.
*   **🎨 Modern Dashboard:** A "Cyberpunk/Glassmorphism" styled React UI to compare original vs. AI-enhanced versions side-by-side.

---

## 🏗️ Architecture

<img width="4200" height="3000" alt="architecture" src="https://github.com/user-attachments/assets/11b6e49b-1f45-4aa8-9ce2-7d2f684f8f84" />

## 🛠️ Tech Stack

*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB 
*   **AI & Search:** Google Gemini 2.0 Flash, Google Custom Search JSON API
*   **Scraping:** Puppeteer
*   **Frontend:** React (Vite), Tailwind CSS, Framer Motion

---

## 🚀 Setup & Installation

### Prerequisites
*   Node.js (v16+)
*   MongoDB 
*   Google Cloud API Key (with Custom Search enabled)
*   Google AI Studio Key (for Gemini)
*   Google Gemini API Key

### 1. Backend Setup

#### Clone the repository

    git clone https://github.com/AmruthKV17/BeyondChats-assignment.git

    cd beyondchats-assignment/backend

#### Install dependencies
    npm install

#### Configure Environment Variables
Create a .env file and add your keys:

    MONGO_URI=mongodb+srv://...
    GOOGLE_API_KEY=...
    GOOGLE_CX=...
    GEMINI_API_KEY=...

### 2. Frontend Setup

Open a new terminal

    cd ../frontend

Install dependencies

    npm install


---

## 🏃‍♂️ Running the Project

Follow this sequence to see the magic happen:

### Step 1: Seed the Database (Phase 1)
Run the scraper to fetch the initial articles.
In /backend directory

    node scraper.js

*Output: You should see logs confirming 5 articles were scraped and saved.*

### Step 2: Run the AI Agent (Phase 2)
Run the processor to research and enhance the articles.
In /backend directory

    node ai-processor.js

*Output: The script will search Google, scrape sources, and generate new content for each pending article.*

### Step 3: Launch the Application (Phase 3)
Start the backend API server and the frontend interface.

**Backend:**
In /backend directory

    node server.js

Server runs on http://localhost:5000

**Frontend:**
In /frontend directory

    npm run dev

App runs on http://localhost:5173
