import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini API client safely with lazy loading / check
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (apiKey) {
    try {
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      console.log("Gemini API Client initialized successfully.");
    } catch (err) {
      console.error("Failed to initialize Gemini API Client:", err);
    }
  } else {
    console.warn("GEMINI_API_KEY environment variable is not defined. Falling back to local simulated mentor responses.");
  }

  // Mentor Chat Endpoint
  app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message payload is required.' });
    }

    // Fallback simulated mentor model responses
    const simulatedAnswers = [
      {
        keywords: ['blank', 'nan', 'impute', 'clean', 'pandas', 'fill'],
        answer: "Excellent cleansing strategy question! Group-wise median imputation is standard because price scales are heavily skewed per department. In Pandas, you execute this via:\n```python\ndf['purchase_amount'] = df.groupby('category')['purchase_amount'].transform(lambda x: x.fillna(x.median()))\n```\nThis fills missing cells without distorting average price norms."
      },
      {
        keywords: ['cte', 'row_number', 'partition', 'sql', 'window'],
        answer: "Conceptually, row partition ranks organize data into small regional buckets. Conceptually `ROW_NUMBER() OVER(PARTITION BY season ORDER BY SUM(purchase_amount) DESC)` executes sequentially:\n1. It slices shoppers records into autumn, summer, spring, and winter cohorts.\n2. Compiles sum sales per category.\n3. Numbers categories 1 to N inside that season. Filtering where rank = 1 gives top categories instantly!",
        suggestedSql: `WITH SeasonalSales AS (
  SELECT 
    season,
    category,
    ROUND(SUM(purchase_amount), 2) as sales,
    ROW_NUMBER() OVER(PARTITION BY season ORDER BY SUM(purchase_amount) DESC) as sales_rank
  FROM shoppers
  GROUP BY season, category
)
SELECT season, category, sales, sales_rank
FROM SeasonalSales
WHERE sales_rank = 1
ORDER BY season;`
      },
      {
        keywords: ['resume', 'recruiter', 'story', 'post', 'bullet'],
        answer: "Here is an impactful resume achievements bullet point to copy:\n\n*\"Built an interactive customer conversion analytics dashboard. Engineered a Python Pandas ETL pipeline cleaning 100 shopper transact records (imputing NaN metrics via class median fills), mounted a relational PostgreSQL database running window functions, and resolved conversion insights showing loyalty players purchase 24% more frequently.\"*"
      }
    ];

    if (!ai) {
      // Find matching simulated answer or use default
      let matched = simulatedAnswers.find(sa => 
        sa.keywords.some(kw => message.toLowerCase().includes(kw))
      );

      const responseText = matched 
        ? matched.answer 
        : `Developing that analytical workflow is a great track! In retail quantitative settings, we link customer nodes across dimensions like season or loyalty membership to predict conversion intervals. Try clicking "Explain SQL Window CTE ranking" or "Exposing NaN fills in Pandas" above to inspect specific structural operations. Let me know what you want to implement next!`;
      
      const suggestedSql = matched?.suggestedSql || "";

      return res.json({ text: responseText, suggestedSql });
    }

    try {
      // Format chat history for Gemini API
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Previous Conversation History:\n${JSON.stringify(history || [])}\nLatest Message: "${message}"`,
        config: {
          systemInstruction: `You are a Senior Data Science Mentor. Let's analyze a 100-row retail shopper behavior dataset 'shoppers'.
Columns: customer_id, age, age_segment, gender, category, purchase_amount, frequency, frequency_days, loyalty_card, payment_method, season.

Provide your mentoring response in markdown.
If the context calls for running or suggest a SQL query on the 'shoppers' table, write the query and provide it in 'suggestedSql'. Otherwise leave 'suggestedSql' blank.
Always return your reply in the exact JSON schema requested. Keep answers friendly, professional, and within 2-3 paragraphs.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              text: { 
                type: Type.STRING, 
                description: 'The mentoring explanation or feedback, formatted in Markdown.' 
              },
              suggestedSql: { 
                type: Type.STRING, 
                description: 'Full valid SQL SELECT query that matches the table columns if requested. If not relevant, leave blank.' 
              }
            },
            required: ['text']
          }
        }
      });

      const dataStr = response.text?.trim() || "{}";
      const resultObj = JSON.parse(dataStr);
      
      res.json({
        text: resultObj.text || "I am analyzing the query parameters. What analytical step are we executing next?",
        suggestedSql: resultObj.suggestedSql || ""
      });
    } catch (error) {
      console.error("Gemini API request failed:", error);
      res.status(500).json({ error: "Failed to compile AI insights. Falling back to local mentor logs." });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Retail Analytics Server booting on http://localhost:${PORT}`);
  });
}

startServer();
