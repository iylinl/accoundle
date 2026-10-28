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
  solution: JournalLine[];
  explanation: string;
}

export const CHART_OF_ACCOUNTS = [
  // Assets
  "Cash",
  "Accounts Receivable",
  "Allowance for Doubtful Accounts",
  "Inventory",
  "Prepaid Expenses",
  "Equipment",
  "Accumulated Depreciation - Equipment",
  // Liabilities
  "Accounts Payable",
  "Unearned Revenue",
  "Notes Payable",
  "Salaries Payable",
  "Interest Payable",
  // Equity
  "Common Stock",
  "Additional Paid-in Capital",
  "Retained Earnings",
  "Dividends",
  // Revenues & Gains
  "Service Revenue",
  "Sales Revenue",
  "Gain on Sale of Equipment",
  // Expenses & Losses
  "Cost of Goods Sold",
  "Salaries Expense",
  "Rent Expense",
  "Depreciation Expense",
  "Interest Expense",
  "Bad Debt Expense",
  "Loss on Sale of Equipment",
];

export const PUZZLES: Puzzle[] = [
  {
    id: 1,
    date: "2026-10-28",
    title: "Sale of Equipment with Trade-In & Gain",
    description:
      "Meridian Corp. retired old manufacturing equipment originally costing $45,000 with accumulated depreciation of $32,000. The buyer paid $18,000 in cash. Record the journal entry for the equipment disposal.",
    difficulty: "Intermediate",
    standard: "US GAAP",
    solution: [
      { account: "Cash", type: "debit", amount: 18000 },
      { account: "Accumulated Depreciation - Equipment", type: "debit", amount: 32000 },
      { account: "Equipment", type: "credit", amount: 45000 },
      { account: "Gain on Sale of Equipment", type: "credit", amount: 5000 },
    ],
    explanation:
      "Book value of equipment was $13,000 ($45,000 cost - $32,000 acc. dep.). Receiving $18,000 cash creates a $5,000 gain ($18,000 - $13,000). Cash and Accumulated Depreciation are debited, Equipment is credited for original historical cost, and Gain on Sale is credited.",
  },
  {
    id: 2,
    date: "2026-10-29",
    title: "Accrued Payroll with Withholdings",
    description:
      "At month-end, Apex Logistics calculates gross payroll of $12,000 earned by employees but unpaid. Employees will be paid on the 5th of next month.",
    difficulty: "Beginner",
    standard: "US GAAP",
    solution: [
      { account: "Salaries Expense", type: "debit", amount: 12000 },
      { account: "Salaries Payable", type: "credit", amount: 12000 },
    ],
    explanation:
      "Under accrual accounting, the expense must be recognized in the period the labor occurred. Salaries Expense is debited, and Salaries Payable is credited.",
  },
  {
    id: 3,
    date: "2026-10-30",
    title: "Unearned Revenue Delivery",
    description:
      "A client had previously paid $8,000 in cash in advance for consulting services. During this period, the consulting engagement was fully completed and delivered.",
    difficulty: "Beginner",
    standard: "US GAAP",
    solution: [
      { account: "Unearned Revenue", type: "debit", amount: 8000 },
      { account: "Service Revenue", type: "credit", amount: 8000 },
    ],
    explanation:
      "Because the service obligations were completed, the unearned revenue liability is satisfied (debited) and earned service revenue is recognized (credited).",
  },
];

export function getTodayPuzzle(): Puzzle {
  // Use today's local date or fallback to cycle through puzzles
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const found = PUZZLES.find((p) => p.date === dateStr);
  if (found) return found;

  // Fallback round-robin based on epoch days
  const dayIndex = Math.floor(now.getTime() / (1000 * 60 * 60 * 24)) % PUZZLES.length;
  return PUZZLES[dayIndex];
}