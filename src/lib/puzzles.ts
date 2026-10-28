export interface JournalLine {
  account: string;
  type: "debit" | "credit";
  amount: number;
}

export interface Puzzle {
  id: number;
  date: string; // YYYY-MM-DD
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  standard: "US GAAP" | "IFRS";
  cpaExamSection: string;
  cpaTopicBlueprint: string;
  solution: JournalLine[];
  explanation: string;
}

export const ACCOUNT_GROUPS = [
  {
    category: "Assets",
    accounts: [
      "Cash",
      "Accounts Receivable",
      "Allowance for Doubtful Accounts",
      "Inventory",
      "Prepaid Insurance",
      "Prepaid Rent",
      "Equipment",
      "Accumulated Depreciation - Equipment",
      "Building",
      "Accumulated Depreciation - Building",
      "Right-of-Use Asset",
    ],
  },
  {
    category: "Liabilities",
    accounts: [
      "Accounts Payable",
      "Salaries Payable",
      "Dividends Payable",
      "Interest Payable",
      "Unearned Revenue",
      "Notes Payable (Short-Term)",
      "Discount on Notes Payable",
      "Bonds Payable",
      "Discount on Bonds Payable",
      "Lease Liability",
    ],
  },
  {
    category: "Equity",
    accounts: [
      "Common Stock ($1 Par)",
      "Common Stock Dividend Distributable",
      "Additional Paid-in Capital - Common",
      "Retained Earnings",
      "Dividends Declared",
      "Treasury Stock",
    ],
  },
  {
    category: "Revenues & Gains",
    accounts: [
      "Service Revenue",
      "Sales Revenue",
      "Gain on Sale of Equipment",
      "Interest Revenue",
    ],
  },
  {
    category: "Expenses & Losses",
    accounts: [
      "Cost of Goods Sold",
      "Sales Discounts",
      "Salaries Expense",
      "Rent Expense",
      "Insurance Expense",
      "Depreciation Expense",
      "Interest Expense",
      "Bad Debt Expense",
      "Loss on Sale of Equipment",
    ],
  },
];

export const PUZZLES: Puzzle[] = [
  {
    id: 1,
    date: "2026-10-25",
    title: "Subscription Deferred Revenue Recognition",
    description:
      "CloudMetrics Inc. previously collected $24,000 upfront for an annual enterprise software license on July 1. Record the monthly adjusting entry for October 31 to recognize one month of satisfied performance obligations under ASC 606.",
    difficulty: "Beginner",
    standard: "US GAAP",
    cpaExamSection: "FAR (Financial Accounting and Reporting)",
    cpaTopicBlueprint: "Area II: Revenue Recognition (ASC 606 - Contract Liabilities)",
    solution: [
      { account: "Unearned Revenue", type: "debit", amount: 2000 },
      { account: "Service Revenue", type: "credit", amount: 2000 },
    ],
    explanation:
      "As software access is continuously rendered over time, the performance obligation is satisfied pro-rata ($24,000 / 12 = $2,000/mo). The contract liability Unearned Revenue is debited and Service Revenue is credited for $2,000.",
  },
  {
    id: 2,
    date: "2026-10-26",
    title: "Allowance for Doubtful Accounts (CECL Aging)",
    description:
      "At year-end, aging analysis dictates that an Allowance for Doubtful Accounts ending balance of $6,800 is required. Prior to adjustment, the allowance holds an unadjusted credit balance of $1,400. Record the necessary adjusting journal entry.",
    difficulty: "Intermediate",
    standard: "US GAAP",
    cpaExamSection: "FAR (Financial Accounting and Reporting)",
    cpaTopicBlueprint: "Area II: Receivables & Credit Losses (ASC 326 - CECL Model)",
    solution: [
      { account: "Bad Debt Expense", type: "debit", amount: 5400 },
      { account: "Allowance for Doubtful Accounts", type: "credit", amount: 5400 },
    ],
    explanation:
      "Under the balance sheet approach, the required credit balance is $6,800. Since an existing credit of $1,400 is already present, the adjusting credit needed is $5,400 ($6,800 - $1,400). Debit Bad Debt Expense, credit Allowance for Doubtful Accounts.",
  },
  {
    id: 3,
    date: "2026-10-27",
    title: "Common Stock Issuance Above Par",
    description:
      "Foundry Corp. issued 5,000 shares of $1 par value common stock to investors for $14 per share in cash. Record the equity issuance.",
    difficulty: "Beginner",
    standard: "US GAAP",
    cpaExamSection: "FAR (Financial Accounting and Reporting)",
    cpaTopicBlueprint: "Area II: Stockholders' Equity (ASC 505 - Equity Capitalization)",
    solution: [
      { account: "Cash", type: "debit", amount: 70000 },
      { account: "Common Stock ($1 Par)", type: "credit", amount: 5000 },
      { account: "Additional Paid-in Capital - Common", type: "credit", amount: 65000 },
    ],
    explanation:
      "Cash is debited for gross proceeds of $70,000 (5,000 × $14). Common stock is credited for legal par value of $5,000 (5,000 × $1), and the excess consideration of $65,000 is credited to Additional Paid-in Capital.",
  },
  {
    id: 4,
    date: "2026-10-28",
    title: "Disposal of Long-Lived Depreciable Asset",
    description:
      "Meridian Corp. retired manufacturing equipment originally acquired for $45,000, against which $32,000 in accumulated depreciation had been recorded. Meridian accepted $18,000 in cash from a commercial salvager. Construct the journal entry to derecognize the asset and recognize any gain or loss.",
    difficulty: "Intermediate",
    standard: "US GAAP",
    cpaExamSection: "FAR (Financial Accounting and Reporting)",
    cpaTopicBlueprint: "Area II: Asset Recognition, Measurement & Derecognition (ASC 360 - PP&E)",
    solution: [
      { account: "Cash", type: "debit", amount: 18000 },
      { account: "Accumulated Depreciation - Equipment", type: "debit", amount: 32000 },
      { account: "Equipment", type: "credit", amount: 45000 },
      { account: "Gain on Sale of Equipment", type: "credit", amount: 5000 },
    ],
    explanation:
      "Derecognition removes cost ($45,000 CR) and accumulated depreciation ($32,000 DR). The net carrying value was $13,000. Cash proceeds of $18,000 (DR) exceed carrying value by $5,000, resulting in a credit to Gain on Sale.",
  },
  {
    id: 5,
    date: "2026-10-29",
    title: "Accrual of Compensated Absence / Unpaid Payroll",
    description:
      "At period-end, Apex Logistics calculates that employee hours worked through the final day of the period total $12,000 in gross wages. Disbursement will occur next month. Record the required period-end adjusting journal entry.",
    difficulty: "Beginner",
    standard: "US GAAP",
    cpaExamSection: "FAR (Financial Accounting and Reporting)",
    cpaTopicBlueprint: "Area II: Current Liabilities & Accruals (ASC 710 - Compensation)",
    solution: [
      { account: "Salaries Expense", type: "debit", amount: 12000 },
      { account: "Salaries Payable", type: "credit", amount: 12000 },
    ],
    explanation:
      "Under accrual accounting principles, wages must be matched to the accounting period in which employee services were rendered. Salaries Expense is debited, and Salaries Payable is recognized as a short-term liability.",
  },
  {
    id: 6,
    date: "2026-10-30",
    title: "Bond Issued at a Discount (Gross Method)",
    description:
      "Stratton Industrial issued $100,000 face value bonds for $96,000 in cash. Formulate the general journal entry to record the bond liability issuance at inception under the gross method.",
    difficulty: "Advanced",
    standard: "US GAAP",
    cpaExamSection: "FAR (Financial Accounting and Reporting)",
    cpaTopicBlueprint: "Area II: Long-Term Liabilities & Debt Securities (ASC 470 - Debt)",
    solution: [
      { account: "Cash", type: "debit", amount: 96000 },
      { account: "Discount on Bonds Payable", type: "debit", amount: 4000 },
      { account: "Bonds Payable", type: "credit", amount: 100000 },
    ],
    explanation:
      "Cash is debited for net proceeds ($96,000). Bonds Payable is credited at nominal face value of $100,000. The $4,000 contractual discount is recognized as a contra-liability via Discount on Bonds Payable (debit).",
  },
  {
    id: 7,
    date: "2026-10-31",
    title: "Operating Lease Inception (Lessee Accounting)",
    description:
      "Vanguard Logistics executes a 3-year operating lease for fleet facility space with fixed annual lease payments of $50,000 paid at period-end. The present value of lease payments discounted at Vanguard's incremental borrowing rate is $136,162. Record initial lease inception under ASC 842.",
    difficulty: "Intermediate",
    standard: "US GAAP",
    cpaExamSection: "FAR (Financial Accounting and Reporting)",
    cpaTopicBlueprint: "Area II: Leases (ASC 842 - Right-of-Use Asset Recognition)",
    solution: [
      { account: "Right-of-Use Asset", type: "debit", amount: 136162 },
      { account: "Lease Liability", type: "credit", amount: 136162 },
    ],
    explanation:
      "Per ASC 842, lessees must recognize a Right-of-Use (ROU) asset and a corresponding Lease Liability on the balance sheet for all non-short-term leases, measured at the present value of future lease payments.",
  },
  {
    id: 8,
    date: "2026-11-01",
    title: "Treasury Stock Repurchase (Cost Method)",
    description:
      "Pinnacle Holdings repurchased 1,000 shares of its own $1 par common stock in the open market for $22 per share in cash. Record the treasury stock acquisition under the cost method.",
    difficulty: "Beginner",
    standard: "US GAAP",
    cpaExamSection: "FAR (Financial Accounting and Reporting)",
    cpaTopicBlueprint: "Area II: Stockholders' Equity (ASC 505 - Treasury Stock Transactions)",
    solution: [
      { account: "Treasury Stock", type: "debit", amount: 22000 },
      { account: "Cash", type: "credit", amount: 22000 },
    ],
    explanation:
      "Under the cost method, the Treasury Stock contra-equity account is debited for the full acquisition cost ($22 × 1,000 = $22,000) regardless of the original par value. Cash is credited.",
  },
  {
    id: 9,
    date: "2026-11-02",
    title: "Inventory Write-Down to Lower of Cost and NRV",
    description:
      "Under FIFO, ending inventory has a balance sheet cost basis of $85,000. Technological obsolescence has reduced its estimated selling price less costs to sell (Net Realizable Value) to $76,000. Formulate the lower of cost and NRV adjustment.",
    difficulty: "Intermediate",
    standard: "US GAAP",
    cpaExamSection: "FAR (Financial Accounting and Reporting)",
    cpaTopicBlueprint: "Area II: Inventory Valuation (ASC 330 - Lower of Cost and NRV)",
    solution: [
      { account: "Cost of Goods Sold", type: "debit", amount: 9000 },
      { account: "Inventory", type: "credit", amount: 9000 },
    ],
    explanation:
      "Per ASC 330, inventory accounted for via FIFO is evaluated at lower of cost or NRV. The $9,000 impairment ($85,000 - $76,000) is recognized by debiting Cost of Goods Sold and crediting Inventory.",
  },
  {
    id: 10,
    date: "2026-11-03",
    title: "Cash Dividend Declaration",
    description:
      "The Board of Directors of Altair Energy declared a cash dividend of $1.50 per share on 20,000 shares of outstanding common stock, payable next month to stockholders of record.",
    difficulty: "Beginner",
    standard: "US GAAP",
    cpaExamSection: "FAR (Financial Accounting and Reporting)",
    cpaTopicBlueprint: "Area II: Stockholders' Equity (ASC 505 - Dividends Declared)",
    solution: [
      { account: "Dividends Declared", type: "debit", amount: 30000 },
      { account: "Dividends Payable", type: "credit", amount: 30000 },
    ],
    explanation:
      "On the declaration date, a formal legal obligation is created. Dividends Declared contra-equity is debited for $30,000 ($1.50 × 20,000) and Dividends Payable is recognized as a current liability.",
  },
  {
    id: 11,
    date: "2026-11-04",
    title: "Prepaid Insurance Amortization",
    description:
      "On January 1, a two-year commercial casualty insurance policy was purchased for $24,000 cash and recorded to Prepaid Insurance. Record the monthly adjusting entry for November 30.",
    difficulty: "Beginner",
    standard: "US GAAP",
    cpaExamSection: "FAR (Financial Accounting and Reporting)",
    cpaTopicBlueprint: "Area II: Prepaid Assets & Expense Recognition (ASC 340)",
    solution: [
      { account: "Insurance Expense", type: "debit", amount: 1000 },
      { account: "Prepaid Insurance", type: "credit", amount: 1000 },
    ],
    explanation:
      "A 24-month policy costing $24,000 expires at $1,000 per month. Under the accrual concept, Insurance Expense is debited $1,000 and the asset Prepaid Insurance is reduced (credited).",
  },
  {
    id: 12,
    date: "2026-11-05",
    title: "Straight-Line Depreciation Allocation",
    description:
      "Equipment acquired for $60,000 has an estimated useful life of 5 years and an estimated salvage value of $6,000. Record the monthly straight-line depreciation entry for November.",
    difficulty: "Beginner",
    standard: "US GAAP",
    cpaExamSection: "FAR (Financial Accounting and Reporting)",
    cpaTopicBlueprint: "Area II: Property, Plant & Equipment (ASC 360 - Depreciation)",
    solution: [
      { account: "Depreciation Expense", type: "debit", amount: 900 },
      { account: "Accumulated Depreciation - Equipment", type: "credit", amount: 900 },
    ],
    explanation:
      "Depreciable base is $54,000 ($60,000 - $6,000). Annual depreciation is $10,800 ($54,000 / 5), which yields $900 per month ($10,800 / 12). Debit Depreciation Expense and credit Accumulated Depreciation.",
  },
  {
    id: 13,
    date: "2026-11-06",
    title: "Accrual of Short-Term Note Interest",
    description:
      "On October 1, Trident Systems borrowed $50,000 by issuing a 6-month, 6% promissory note. Both principal and interest are payable at maturity. Record the adjusting entry for interest accrued through November 30 (two months total).",
    difficulty: "Intermediate",
    standard: "US GAAP",
    cpaExamSection: "FAR (Financial Accounting and Reporting)",
    cpaTopicBlueprint: "Area II: Current Liabilities (ASC 405 - Interest Accruals)",
    solution: [
      { account: "Interest Expense", type: "debit", amount: 500 },
      { account: "Interest Payable", type: "credit", amount: 500 },
    ],
    explanation:
      "Annual interest is $3,000 ($50,000 × 6%), or $250 per month. Accruing 2 months yields $500 ($250 × 2). Debit Interest Expense and credit Interest Payable.",
  },
  {
    id: 14,
    date: "2026-11-07",
    title: "Accounts Receivable Specific Recovery",
    description:
      "A customer whose $3,200 account receivable was previously written off unexpectedly pays the balance in full by check. Record the reinstatement of the receivable balance prior to recording the cash collection.",
    difficulty: "Intermediate",
    standard: "US GAAP",
    cpaExamSection: "FAR (Financial Accounting and Reporting)",
    cpaTopicBlueprint: "Area II: Accounts Receivable Recovery (ASC 326)",
    solution: [
      { account: "Accounts Receivable", type: "debit", amount: 3200 },
      { account: "Allowance for Doubtful Accounts", type: "credit", amount: 3200 },
    ],
    explanation:
      "To accurately reflect customer credit performance, the written-off account must first be reinstated by reversing the write-off (debit Accounts Receivable, credit Allowance for Doubtful Accounts) before applying the cash receipt.",
  },
  {
    id: 15,
    date: "2026-11-08",
    title: "Sale of Equipment at a Loss",
    description:
      "Nexis Industrial sold testing hardware originally costing $30,000 with accumulated depreciation of $18,000 for $9,000 cash. Formulate the general journal entry to record the disposal.",
    difficulty: "Intermediate",
    standard: "US GAAP",
    cpaExamSection: "FAR (Financial Accounting and Reporting)",
    cpaTopicBlueprint: "Area II: Fixed Assets (ASC 360 - Loss on Disposal)",
    solution: [
      { account: "Cash", type: "debit", amount: 9000 },
      { account: "Accumulated Depreciation - Equipment", type: "debit", amount: 18000 },
      { account: "Loss on Sale of Equipment", type: "debit", amount: 3000 },
      { account: "Equipment", type: "credit", amount: 30000 },
    ],
    explanation:
      "Net book value was $12,000 ($30,000 - $18,000). Cash received was $9,000, creating a loss of $3,000 ($12,000 - $9,000). Debit Cash ($9,000), Accumulated Depreciation ($18,000), and Loss on Sale ($3,000); credit Equipment ($30,000).",
  },
  {
    id: 16,
    date: "2026-11-09",
    title: "Zero-Interest Bearing Promissory Note Issued for Cash",
    description:
      "A firm issued a 1-year non-interest-bearing note with a face value of $20,000 to a commercial lender, receiving $18,400 in net cash proceeds. Record the financing entry under the gross presentation method.",
    difficulty: "Advanced",
    standard: "US GAAP",
    cpaExamSection: "FAR (Financial Accounting and Reporting)",
    cpaTopicBlueprint: "Area II: Debt Securities (ASC 470 - Imputed Interest & Discounts)",
    solution: [
      { account: "Cash", type: "debit", amount: 18400 },
      { account: "Discount on Notes Payable", type: "debit", amount: 1600 },
      { account: "Notes Payable (Short-Term)", type: "credit", amount: 20000 },
    ],
    explanation:
      "Cash is debited for proceeds ($18,400), Notes Payable credited for face ($20,000), and the $1,600 implicit interest discount is recorded as a contra-liability in Discount on Notes Payable.",
  },
  {
    id: 17,
    date: "2026-11-10",
    title: "Cash Collection with Early Settlement Sales Discount",
    description:
      "A customer settles an outstanding $10,000 invoice within the discount window under credit terms 2/10, net 30. Record the collection under the gross revenue method.",
    difficulty: "Intermediate",
    standard: "US GAAP",
    cpaExamSection: "FAR (Financial Accounting and Reporting)",
    cpaTopicBlueprint: "Area II: Revenue Transactions & Receivables (ASC 606)",
    solution: [
      { account: "Cash", type: "debit", amount: 9800 },
      { account: "Sales Discounts", type: "debit", amount: 200 },
      { account: "Accounts Receivable", type: "credit", amount: 10000 },
    ],
    explanation:
      "The 2% discount on $10,000 is $200. The customer pays $9,800 in cash. Debit Cash ($9,800), debit Sales Discounts ($200 contra-revenue), and credit Accounts Receivable for the full $10,000 balance.",
  },
  {
    id: 18,
    date: "2026-11-11",
    title: "Stock Dividend Declaration (Small Stock Dividend)",
    description:
      "Clearview Tech declares a 5% common stock dividend on 100,000 outstanding shares ($1 par). The current market price per share on declaration date is $15. Record the declaration entry.",
    difficulty: "Advanced",
    standard: "US GAAP",
    cpaExamSection: "FAR (Financial Accounting and Reporting)",
    cpaTopicBlueprint: "Area II: Stockholders' Equity (ASC 505 - Stock Dividends < 25%)",
    solution: [
      { account: "Retained Earnings", type: "debit", amount: 75000 },
      { account: "Common Stock Dividend Distributable", type: "credit", amount: 5000 },
      { account: "Additional Paid-in Capital - Common", type: "credit", amount: 70000 },
    ],
    explanation:
      "Per ASC 505, small stock dividends (< 25%) must be capitalized at fair market value. 5,000 shares × $15 = $75,000 debit to Retained Earnings. Par value of $5,000 (5,000 × $1) is credited to Distributable, and excess over par ($70,000) is credited to APIC.",
  },
];

export function getTodayPuzzle(): Puzzle {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const localDateStr = `${year}-${month}-${day}`;

  const match = PUZZLES.find((p) => p.date === localDateStr);
  if (match) return match;

  // Fallback: pick the latest available historical puzzle if date exceeds array
  const historical = PUZZLES.filter((p) => p.date <= localDateStr);
  if (historical.length > 0) {
    return historical[historical.length - 1];
  }

  return PUZZLES[0];
}