import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

function App() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Dummy data for chart example — you can improve this by parsing actual data from AI or your DB
  const sampleChartData = [
    { region: "East", revenue: 120000 },
    { region: "West", revenue: 90000 },
    { region: "North", revenue: 75000 },
    { region: "South", revenue: 60000 },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) throw new Error("Failed to fetch answer");
      const data = await res.json();

      // Expecting data.answer, data.sqlQuery, data.chartSuggestion
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Ask Your AI Data Analyst</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
        <input
          type="text"
          placeholder="Type your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{ width: "80%", padding: "0.5rem", fontSize: "1rem" }}
          required
        />
        <button type="submit" disabled={loading} style={{ padding: "0.5rem 1rem", marginLeft: 10 }}>
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {result && (
        <>
          <h2>Answer</h2>
          <p style={{ whiteSpace: "pre-line", backgroundColor: "#f9f9f9", padding: "1rem", borderRadius: 6 }}>
            {result.answer}
          </p>

          <h3>SQL Query</h3>
          <pre
            style={{
              backgroundColor: "#222",
              color: "#0f0",
              padding: "1rem",
              borderRadius: 6,
              overflowX: "auto",
            }}
          >
            {result.sqlQuery}
          </pre>

          <h3>Chart Suggestion</h3>
          <p>{result.chartSuggestion}</p>

          <h3>Sample Revenue Chart (Static Data)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sampleChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <p style={{ fontStyle: "italic", fontSize: "0.9rem" }}>
            * This chart uses static sample data. You can extend your backend to send real chart data!
          </p>
        </>
      )}
    </div>
  );
}

export default App;
