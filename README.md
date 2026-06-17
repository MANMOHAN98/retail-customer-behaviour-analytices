 📊 Retail Customer Behavior Analytics Workspace

An interactive, end-to-end data analytics and engineering portfolio platform simulating modern enterprise data workflows. This application acts as a sandbox for modeling shopper transactions, cleaning dirty schemas with Python/Pandas, performing relational query analysis with PostgreSQL CTEs & window functions, viewing live spreadsheet matrices, and examining dashboards in a Power BI styled container.

🔗 **Production Live App:** [https://ai.studio/build](https://ai.studio/build)  
👤 **Author Portfolio Showcase**  

---

## 🚀 Key Modules & System Architecture

This application consolidates standard enterprise analytical stages into a single reactive workspace:

```
[Phase 1: Pandas ETL] ➔ [Phase 2: PostgreSQL Sandbox] ➔ [Phase 3: Excel Viewer] ➔ [Phase 4: Power BI Slicers]
              ▲                                                                        ▲
              └──────────────────────── (Continuous AI Mentor Guidance) ────────────────┘
```

### 1. 🐍 Phase 1: Python/Pandas ETL Kernel
* Processes raw, inconsistent sales streams containing un-imputed category transaction sizes (`NaN`/`null` values).
* Executes a high-performance **class-group median fill** using Pandas vector transformations to resolve missing data without warping standard department distributions.
* Standardizes all table columns and text fields into compliant lower `snake_case` formats.
* Automates boolean mapping for membership loyalty flags and discretizes cliente demographic ages into structural cohort categories (`Gen Z`, `Millennials`, `Gen X`, `Boomers`) using `pd.cut()`.

### 2. 🐘 Phase 2: PostgreSQL Relational Sandbox
* Simulates an active relational database instance loaded with your compiled customer transactions table (`shoppers`).
* Features an interactive SQL editor allowing you to craft queries on live indices.
* **Pre-configured Complex Query Templates Include:**
  * **Cohort LTV Analysis:** Aggregates and ranks lifetime value and order volume across age generations.
  * **Loyalty-Retention Uplift:** Compares average basket metrics and repeat cycle days for enrolled versus un-enrolled members.
  * **Seasonal CTE Rankings:** Utilizes double-layered Common Table Expressions and PostgreSQL `ROW_NUMBER() OVER (PARTITION BY season ORDER BY SUM(purchase_amount) DESC)` partitioned filters to discover top-revenue categories per quarter.

### 3. 🟢 Phase 3: Live Excel Online Sheet Simulation
* Modeled in a real-time Microsoft Excel Web App look-and-feel.
* Simulates dual worksheet tabs (`Sheet1: Messy Raw CSV` & `Sheet2: Pandas Cleaned`) to visualize the before-and-after structural delta.
* Supports active column-level filtration (sorting values alphabetically/numerically), unified global cell searching, and quick CSV data export.

### 4. 📊 Phase 4: Power BI Slicing Dashboard
* A high-fidelity BI container tracking key financial performance indicators: **Total Revenue**, **Audited Shoppers**, **Average Basket Sizes**, and **Loyalty Retention Ratios**.
* Interactive slicer dropdowns instantly filter aggregate visuals by *Department*, *Season*, and *Loyalty program status*.
* Responsive data visualizations (built with **Recharts**) mapping department sales percentages, cohort volume curves, and payment settlement methods.

### 🤖 Senior Data Science AI Mentor
* Equipped with a server-side **Google Gemini 1.5/2.0 API** proxy that acts as an interactive DS Career Advisor.
* Answers technical interview questions, explains complex architectural scripts, suggests optimized PostgreSQL CTE syntax, and outputs bulleted portfolio copy.

---

## 📂 Database Schema

```sql
CREATE TABLE shoppers (
    customer_id VARCHAR(12) PRIMARY KEY,     -- Normalized client key
    age INT,                                  -- Shopper age limit (18 - 75)
    age_segment VARCHAR(20),                 -- Demographic Cohort (e.g., Boomers, Gen Z)
    gender VARCHAR(10),                       -- Clean lowercase string
    category VARCHAR(40),                     -- Product department (e.g., home_and_kitchen)
    purchase_amount DECIMAL(10,2),            -- Imputed transaction price
    frequency VARCHAR(20),                   -- Interval label (e.g., weekly)
    frequency_days INT,                       -- Days elapsed between orders
    loyalty_card BOOLEAN,                     -- Program status flag
    payment_method VARCHAR(20),               -- Transaction channel
    season VARCHAR(10)                        -- Temporal variable values
);
```

---

## 🛠️ Stack & Technologies

* **Frontend Engine:** React 18 with TypeScript, Tailwind CSS, Lucide Icons, and Framer Motion.
* **Graphical Charts:** Recharts (Responsive SVG Canvas).
* **Backend Web Server:** Node.js Express Server.
* **AI Core:** Google GenAI TypeScript SDK (Gemini REST Proxy).
* **Build tool:** Vite, Esbuild (Bundler compiling backend TypeScript to CommonJS `dist/server.cjs`).

---

## ⚡ Setup & Local Installation

Follow these steps to run this analytics platform on your local machine:

### 1. Clone the repository
```bash
git clone https://github.com/your-username/retail-customer-behavior-analytics.git
cd retail-customer-behavior-analytics
```

### 2. Install dependencies
```bash
npm install
```

### 3. Add Environment Variables
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```
*(Note: If no API Key is provided, the platform automatically degrades gracefully to localized, pre-scripted mentor responses so the app remains fully interactive).*

### 4. Launch in Development Mode
```bash
npm run dev
```
The server will boot locally on **`http://localhost:3000`** with live hot-reloading configurations.

### 5. Compile for Production Deployments
To bundle server-side files and build optimized client assets:
```bash
npm run build
npm start
```

---
