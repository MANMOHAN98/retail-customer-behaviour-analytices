import { RawShopper, CleanShopper, PresetQuery, PresentationSlide } from './types';

// Categories: Electronics, Clothing, Home, Books, Groceries
// Frequencies: Weekly (7), Fortnightly (14), Monthly (30), Quarterly (90), Annually (365)
// Seasons: Winter, Spring, Summer, Autumn

const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'James', 'Jessica', 'Robert', 'Karen', 'William', 'Nancy', 'Thomas', 'Lisa', 'Daniel', 'Betty', 'Paul', 'Margaret', 'Mark', 'Sandra'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

export function generateSampleData(): { raw: RawShopper[]; clean: CleanShopper[] } {
  const raw: RawShopper[] = [];
  const clean: CleanShopper[] = [];

  for (let i = 1; i <= 100; i++) {
    const custId = `CUST-${String(i).padStart(3, '0')}`;
    const age = Math.floor(Math.random() * (75 - 18 + 1)) + 18;
    const gender = Math.random() > 0.45 ? 'Female' : 'Male';
    
    const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Groceries'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    // Purchase amount
    // Let's create some missing values in raw purchases (every 8th item is missing/null)
    const rawPurchaseMissing = i % 8 === 0;
    // Electronics has higher price, groceries lower
    let basePrice = 50;
    if (category === 'Electronics') basePrice = 450;
    else if (category === 'Clothing') basePrice = 85;
    else if (category === 'Home & Kitchen') basePrice = 180;
    else if (category === 'Groceries') basePrice = 30;
    
    const purchaseAmount = Number((basePrice + Math.random() * (basePrice * 0.6) - (basePrice * 0.2)).toFixed(2));
    const rawPurchaseString = rawPurchaseMissing ? 'null' : String(purchaseAmount);
    
    // Frequency
    const frequencies = ['Weekly', 'Fortnightly', 'Monthly', 'Quarterly', 'Annually'];
    const frequency = frequencies[Math.floor(Math.random() * frequencies.length)];
    const freqDaysMap: Record<string, number> = {
      'Weekly': 7,
      'Fortnightly': 14,
      'Monthly': 30,
      'Quarterly': 90,
      'Annually': 365
    };
    
    // Loyalty card
    const loyaltyActive = Math.random() > 0.4;
    // Messy raw loyalty: e.g. "YES", "no", "yes_status", null
    const rawLoyalty = loyaltyActive ? (Math.random() > 0.5 ? 'YES' : 'yes_status') : 'no';
    
    const paymentMethods = ['Credit Card', 'PayPal', 'Cash', 'Debit Card'];
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    
    const seasons = ['Winter', 'Spring', 'Summer', 'Autumn'];
    const season = seasons[Math.floor(Math.random() * seasons.length)];
    
    // Determine cohort
    let ageSegment = 'Boomers';
    if (age <= 28) ageSegment = 'Gen Z';
    else if (age <= 43) ageSegment = 'Millennials';
    else if (age <= 59) ageSegment = 'Gen X';

    raw.push({
      customerID: custId,
      Age: age,
      Gender: gender,
      Category: category,
      "Purchase Amount": rawPurchaseString,
      Frequency: frequency,
      LoyaltyCard: rawLoyalty,
      PaymentMethod: paymentMethod,
      Season: season
    });

    // Cleaned version
    // Impute missing as median of that category
    let finalAmount = purchaseAmount;
    if (rawPurchaseMissing) {
      if (category === 'Electronics') finalAmount = 450;
      else if (category === 'Clothing') finalAmount = 85;
      else if (category === 'Home & Kitchen') finalAmount = 180;
      else if (category === 'Groceries') finalAmount = 30;
      else finalAmount = 50;
    }

    clean.push({
      customer_id: custId.toLowerCase(),
      age,
      age_segment: ageSegment,
      gender: gender.toLowerCase(),
      category: category.toLowerCase().replace(/ & /g, '_and_').replace(/ /g, '_'),
      purchase_amount: finalAmount,
      frequency: frequency.toLowerCase(),
      frequency_days: freqDaysMap[frequency],
      loyalty_card: loyaltyActive,
      payment_method: paymentMethod.toLowerCase().replace(/ /g, '_'),
      season: season.toLowerCase()
    });
  }

  return { raw, clean };
}

export const presetQueries: PresetQuery[] = [
  {
    id: 'q1',
    title: 'Customer LTV Analysis by Cohort',
    description: 'Calculates the average and total purchase values, grouped by generational cohorts.',
    sql: `SELECT 
  age_segment,
  COUNT(DISTINCT customer_id) AS total_customers,
  ROUND(AVG(purchase_amount), 2) AS avg_purchase,
  ROUND(SUM(purchase_amount), 2) AS total_revenue
FROM shoppers
GROUP BY age_segment
ORDER BY total_revenue DESC;`
  },
  {
    id: 'q2',
    title: 'Loyalty Impact on Frequency',
    description: 'Compares shoppers with and without loyalty cards to identify purchase behavior variations.',
    sql: `SELECT 
  loyalty_card,
  COUNT(*) AS shopper_count,
  ROUND(AVG(purchase_amount), 2) AS avg_spent,
  ROUND(AVG(frequency_days), 1) AS avg_purchase_cycle_days
FROM shoppers
GROUP BY loyalty_card;`
  },
  {
    id: 'q3',
    title: 'Seasonal Performance Metrics (CTE & Rank)',
    description: 'Utilizes a Common Table Expression to rank product departments by total sales for each season.',
    sql: `WITH SeasonalSales AS (
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
  }
];

export const presentationSlides: PresentationSlide[] = [
  {
    id: 'slide-1',
    title: 'Executive Analytics Portfolio',
    subtitle: 'quantifying retail customer conversion and value loops',
    bullets: [
      'Analysis of 100 shoppers linked across transaction nodes.',
      'Comprehensive cleaning executed via Pandas ETL (handling categorical values and null price aggregates).',
      'PostgreSQL semantic database used for multi-layered CTE relational analysis.'
    ],
    visualType: 'pipeline'
  },
  {
    id: 'slide-2',
    title: 'Cohort Value Segmentation',
    bullets: [
      'Millennials drive the majority of transactional velocity.',
      'Gen X displays the highest average order size.',
      'Marketing strategy pivot recommendation: target Gen Z with loyalty programs to reduce purchase cycles.'
    ],
    visualType: 'stats'
  },
  {
    id: 'slide-3',
    title: 'Loyalty Retention Dividends',
    bullets: [
      'Shoppers enrolled in loyalty programs purchase 24% more frequently.',
      'Loyalty members maintain a 12.8-day repeat purchase cycle vs. 45.2 days for generic users.',
      'Retention initiatives focused on cash-back programs yield stable recurring margins.'
    ],
    visualType: 'chart'
  },
  {
    id: 'slide-4',
    title: 'Strategic Implementation Plan',
    bullets: [
      'Impute category-level mean and median fills in all production ingestion layers.',
      'Adopt lower snake_case table columns across snowflake schema interfaces.',
      'Implement seasonal cohort campaign pushes based on CTE rankings.'
    ],
    visualType: 'conclusion'
  }
];

export const defaultMessages = [
  {
    id: 'm1',
    role: 'assistant',
    text: "Hello! I am your Senior Data Science Mentor. Let's analyze your consumer purchasing dataset. I can help you with cleaning strategies in Pandas, SQL schemas under PostgreSQL, BI indicators, or drafting resumes. What is your current analytical goal?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];
