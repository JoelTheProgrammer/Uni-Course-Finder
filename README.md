# Course Finder

This project is a simple web app for browsing and filtering university programs.  
It supports multiple languages (EN/SR) and integrates with OpenAI to generate personalized  
“Why this course is a good fit” explanations.

---

## Setup

### 1. Clone and install dependencies
```bash
git clone https://github.com/your/repo.git
cd repo
npm install
```

### 2. Create an `.env` file
At the project root, create a file named `.env` with the following structure:

```dotenv
# OpenAI
OPENAI_API_KEY=sk-xxxx-your-real-key

# Local server config
PORT=3000

# Allowed origin for your frontend (Live Server often uses this URL)
ALLOWED_ORIGIN=http://127.0.0.1:5500
```

⚠️ **Important**: Never commit your real API key. `.env` is already in `.gitignore`.

---

### 3. Run the backend server
Start the Node.js server that proxies OpenAI requests:

```bash
npm start
```

This will launch an Express server at:
```
http://localhost:3000
```

The server exposes one endpoint:
- `POST /explain`
  - Body:
    ```json
    {
      "studentInput": "string",
      "courseDescription": "string"
    }
    ```
  - Response:
    ```json
    {
      "explanation": "Why this course is a good fit…"
    }
    ```

---

### 4. Run the frontend
You can serve the static site with VS Code’s **Live Server** plugin (or any static server).
- Open `index.html` with Live Server → it’ll run at `http://127.0.0.1:5500`.
- The frontend makes `fetch` calls to your backend (`http://localhost:3000/explain`).

---
