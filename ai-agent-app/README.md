A full-stack AI-powered data analyst that takes your questions about sales data and returns smart, SQL-backed insights — including charts, SQL queries, and natural language answers.

Live Demo (Local)
Ask stuff like:

“Which region generated the highest total revenue in 2023?”

“Which product had the lowest total revenue per unit sold?”

“Who was the most consistent sales_rep by monthly performance?”

Tech Stack-
Layer	Tech
Frontend	React (Vite)
Backend	Node.js, Express
Database	PostgreSQL
AI Model	OpenAI (via OpenRouter API)
Visualization	Dynamic JSON output (charts soon)
Auth (soon)	Firebase / Clerk (optional)

Setup Instructions-
1. Clone the repo
bash
Copy
Edit
git clone https://github.com/yourusername/ai-agent-app.git
cd ai-agent-app
2. Install dependencies
bash
Copy
Edit
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
3. Set up PostgreSQL
Make sure PostgreSQL is running and you have a sales_data table.

Sample schema:

sql
Copy
Edit
CREATE TABLE sales_data (
  id SERIAL PRIMARY KEY,
  region TEXT,
  product TEXT,
  sales_rep TEXT,
  units_sold INT,
  unit_price NUMERIC,
  discount_applied NUMERIC,
  sale_date DATE,
  total_revenue NUMERIC
);
Populate it with some mock data.

4. Configure .env files
Backend (server/.env):
env
Copy
Edit
OPENAI_API_KEY=your_openrouter_api_key
DATABASE_URL=postgresql://username:password@localhost:5432/your_db_name
5. Start the app
Run backend
bash
Copy
Edit
cd server
node index.js
# Server running at http://localhost:5000
Run frontend
bash
Copy
Edit
cd ../client
npm run dev
# App running at http://localhost:3000

Features:
-Natural language to SQL conversion

-Real-time PostgreSQL querying

-GPT-backed analytics explanations

-Chart type suggestions for data viz

-Error handling & API key security

Sample Questions- 
Try these in the frontend UI:

"Which region generated the highest total revenue in 2023?"

"Which product had the lowest average revenue per unit sold?"

"Show the monthly revenue trend for the West region."

"Which sales_rep had the highest revenue-to-discount ratio?"

AI Model-
We use OpenAI’s gpt-3.5-turbo (via OpenRouter) to:

Understand your question

Analyze sample database rows

Write SQL + human answer + chart idea

