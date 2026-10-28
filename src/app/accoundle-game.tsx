"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import confetti from "canvas-confetti";
import {
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Share2,
  ChevronDown,
  Search,
  Scale,
  GraduationCap,
  Sparkles,
  Archive,
  X,
  Calendar,
  Check,
  Calculator,
} from "lucide-react";
import {
  getTodayPuzzle,
  PUZZLES,
  ACCOUNT_GROUPS,
  Puzzle,
} from "@/lib/puzzles";

interface UserLine {
  id: string;
  account: string;
  type: "debit" | "credit";
  amount: string;
  validationStatus?: "idle" | "success" | "error";
}

// 4-Function Slate Calculator Modal
function CalculatorModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [display, setDisplay] = useState("0");
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [overwrite, setOverwrite] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key >= "0" && e.key <= "9") handleDigit(e.key);
      else if (e.key === ".") handleDot();
      else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
        const opMap: Record<string, string> = { "+": "+", "-": "−", "*": "×", "/": "÷" };
        handleOp(opMap[e.key]);
      } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        handleEquals();
      } else if (e.key === "Backspace") {
        setDisplay((curr) => (curr.length > 1 ? curr.slice(0, -1) : "0"));
      } else if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, display, prevValue, operation, overwrite]);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (overwrite || display === "0") {
      setDisplay(digit);
      setOverwrite(false);
    } else {
      if (display.length < 12) setDisplay(display + digit);
    }
  };

  const handleDot = () => {
    if (overwrite) {
      setDisplay("0.");
      setOverwrite(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleOp = (nextOp: string) => {
    const current = parseFloat(display);
    if (prevValue !== null && operation && !overwrite) {
      const result = compute(prevValue, current, operation);
      setDisplay(String(result));
      setPrevValue(result);
    } else {
      setPrevValue(current);
    }
    setOperation(nextOp);
    setOverwrite(true);
  };

  const compute = (a: number, b: number, op: string): number => {
    switch (op) {
      case "+": return a + b;
      case "−": return a - b;
      case "×": return a * b;
      case "÷": return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (prevValue === null || !operation) return;
    const current = parseFloat(display);
    const result = compute(prevValue, current, operation);
    setDisplay(String(result));
    setPrevValue(null);
    setOperation(null);
    setOverwrite(true);
  };

  const handleClear = () => {
    setDisplay("0");
    setPrevValue(null);
    setOperation(null);
    setOverwrite(false);
  };

  const handleSign = () => {
    setDisplay((curr) => String(parseFloat(curr) * -1));
  };

  const handlePercent = () => {
    setDisplay((curr) => String(parseFloat(curr) / 100));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1c1d22]/40 backdrop-blur-sm">
      <div className="bg-[#fbfaf7] border border-[#e2dcd2] rounded-2xl p-5 w-72 shadow-2xl">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#ece7dc]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#636874]">Calculator</span>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-800 p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white border border-[#e5e0d5] rounded-xl p-3 mb-4 text-right shadow-inner">
          <div className="text-[10px] font-mono text-[#059669] h-4">
            {prevValue !== null && operation ? `${prevValue} ${operation}` : ""}
          </div>
          <div className="text-2xl font-mono font-bold text-[#1c1d22] tracking-tight truncate">
            {display}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={handleClear}
            className="p-3 rounded-xl bg-[#eeeae0] hover:bg-[#e4ded2] text-rose-600 border border-[#ded8cb] transition-colors"
          >
            C
          </button>
          <button
            type="button"
            onClick={handleSign}
            className="p-3 rounded-xl bg-[#eeeae0] hover:bg-[#e4ded2] text-[#4a5568] border border-[#ded8cb] transition-colors"
          >
            ±
          </button>
          <button
            type="button"
            onClick={handlePercent}
            className="p-3 rounded-xl bg-[#eeeae0] hover:bg-[#e4ded2] text-[#4a5568] border border-[#ded8cb] transition-colors"
          >
            %
          </button>
          <button
            type="button"
            onClick={() => handleOp("÷")}
            className="p-3 rounded-xl bg-[#dcfce7] hover:bg-[#bbf7d0] text-[#15803d] border border-[#86efac] transition-colors"
          >
            ÷
          </button>

          {["7", "8", "9"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigit(num)}
              className="p-3 rounded-xl bg-white hover:bg-stone-50 text-[#1c1d22] border border-[#e2dcd2] transition-colors shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleOp("×")}
            className="p-3 rounded-xl bg-[#dcfce7] hover:bg-[#bbf7d0] text-[#15803d] border border-[#86efac] transition-colors"
          >
            ×
          </button>

          {["4", "5", "6"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigit(num)}
              className="p-3 rounded-xl bg-white hover:bg-stone-50 text-[#1c1d22] border border-[#e2dcd2] transition-colors shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleOp("−")}
            className="p-3 rounded-xl bg-[#dcfce7] hover:bg-[#bbf7d0] text-[#15803d] border border-[#86efac] transition-colors"
          >
            −
          </button>

          {["1", "2", "3"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigit(num)}
              className="p-3 rounded-xl bg-white hover:bg-stone-50 text-[#1c1d22] border border-[#e2dcd2] transition-colors shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleOp("+")}
            className="p-3 rounded-xl bg-[#dcfce7] hover:bg-[#bbf7d0] text-[#15803d] border border-[#86efac] transition-colors"
          >
            +
          </button>

          <button
            type="button"
            onClick={() => handleDigit("0")}
            className="col-span-2 p-3 rounded-xl bg-white hover:bg-stone-50 text-[#1c1d22] border border-[#e2dcd2] transition-colors shadow-sm text-center"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDot}
            className="p-3 rounded-xl bg-white hover:bg-stone-50 text-[#1c1d22] border border-[#e2dcd2] transition-colors shadow-sm"
          >
            .
          </button>
          <button
            type="button"
            onClick={handleEquals}
            className="p-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-extrabold shadow-sm transition-colors"
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
}

// Custom Searchable Dropdown
function AccountSelect({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return ACCOUNT_GROUPS;
    const lower = search.toLowerCase();
    return ACCOUNT_GROUPS.map((group) => ({
      ...group,
      accounts: group.accounts.filter((acc) =>
        acc.toLowerCase().includes(lower)
      ),
    })).filter((group) => group.accounts.length > 0);
  }, [search]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between text-left px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors ${
          disabled
            ? "bg-[#f5f2eb] border-[#e2dcd2] text-stone-400 cursor-not-allowed"
            : isOpen
            ? "bg-white border-[#4a5568] ring-1 ring-[#4a5568]/20 shadow-sm text-[#1c1d22]"
            : "bg-white border-[#ded8cb] hover:border-[#b8b0a0] text-[#1c1d22] shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        }`}
      >
        <span className={value ? "text-[#1c1d22] font-medium truncate" : "text-stone-400 font-normal"}>
          {value || "Select account..."}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-stone-400 transition-transform ${
            isOpen ? "rotate-180 text-stone-700" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-xl border border-[#ded8cb] shadow-xl overflow-hidden">
          <div className="p-2 border-b border-[#ece7dc] flex items-center gap-2 bg-[#fcfbf9]">
            <Search className="w-3.5 h-3.5 text-stone-400 ml-1.5" />
            <input
              type="text"
              autoFocus
              value={search}
              placeholder="Search ledger..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs bg-transparent py-1 text-[#1c1d22] placeholder-stone-400 focus:outline-none"
            />
          </div>

          <div className="max-h-60 overflow-y-auto p-1.5 divide-y divide-[#f3efe6]">
            {filteredGroups.length === 0 ? (
              <div className="p-4 text-center text-xs text-stone-400 font-normal">
                No matching accounts
              </div>
            ) : (
              filteredGroups.map((grp) => (
                <div key={grp.category} className="py-1">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    {grp.category}
                  </div>
                  {grp.accounts.map((acc) => (
                    <button
                      key={acc}
                      type="button"
                      onClick={() => {
                        onChange(acc);
                        setIsOpen(false);
                        setSearch("");
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                        value === acc
                          ? "bg-[#4a5568] text-white font-medium"
                          : "text-[#2d3748] hover:bg-[#f5f2eb]"
                      }`}
                    >
                      <span>{acc}</span>
                      {value === acc && <Check className="w-3.5 h-3.5 text-[#34d399]" />}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Custom Slate DR / CR Selector
function TypeSelect({
  value,
  onChange,
  disabled,
}: {
  value: "debit" | "credit";
  onChange: (val: "debit" | "credit") => void;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-bold transition-colors ${
          value === "debit"
            ? "bg-[#4a5568] text-white border-[#4a5568] shadow-sm"
            : "bg-white text-[#4a5568] border-[#ded8cb] hover:bg-[#fbfaf7]"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span>{value === "debit" ? "DR" : "CR"}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${
            isOpen ? "rotate-180" : ""
          } ${value === "debit" ? "text-stone-300" : "text-stone-400"}`}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 left-0 mt-1 w-28 bg-white rounded-xl border border-[#ded8cb] shadow-xl p-1 animate-in fade-in duration-100">
          <button
            type="button"
            onClick={() => {
              onChange("debit");
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors text-left ${
              value === "debit"
                ? "bg-[#4a5568] text-white"
                : "text-stone-700 hover:bg-[#f5f2eb]"
            }`}
          >
            <span>DR (Debit)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onChange("credit");
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors text-left ${
              value === "credit"
                ? "bg-[#4a5568] text-white"
                : "text-stone-700 hover:bg-[#f5f2eb]"
            }`}
          >
            <span>CR (Credit)</span>
          </button>
        </div>
      )}
    </div>
  );
}

export function AccoundleGame() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [todayDate, setTodayDate] = useState<string>("");
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [lines, setLines] = useState<UserLine[]>([
    { id: "1", account: "", type: "debit", amount: "", validationStatus: "idle" },
    { id: "2", account: "", type: "credit", amount: "", validationStatus: "idle" },
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ played: 0, streak: 0, maxStreak: 0 });

  const loadPuzzle = (selected: Puzzle) => {
    setPuzzle(selected);
    setSubmitted(false);
    setIsCorrect(false);
    setFeedback([]);

    const completed = localStorage.getItem(`accoundle_completed_${selected.date}`);
    if (completed) {
      setSubmitted(true);
      setIsCorrect(true);
      setLines(
        selected.solution.map((sol, index) => ({
          id: String(index),
          account: sol.account,
          type: sol.type,
          amount: String(sol.amount),
          validationStatus: "success",
        }))
      );
    } else {
      setLines([
        { id: "1", account: "", type: "debit", amount: "", validationStatus: "idle" },
        { id: "2", account: "", type: "credit", amount: "", validationStatus: "idle" },
      ]);
    }
  };

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const localToday = `${year}-${month}-${day}`;
    setTodayDate(localToday);

    const today = getTodayPuzzle();
    loadPuzzle(today);

    const saved = localStorage.getItem("accoundle_stats");
    if (saved) {
      try {
        setStats(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  const addLine = () => {
    setLines((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        account: "",
        type: prev.length % 2 === 0 ? "debit" : "credit",
        amount: "",
        validationStatus: "idle",
      },
    ]);
  };

  const removeLine = (id: string) => {
    if (lines.length <= 2) return;
    setLines((prev) => prev.filter((l) => l.id !== id));
  };

  const updateLine = (id: string, field: keyof UserLine, val: string) => {
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: val, validationStatus: "idle" } : l))
    );
  };

  const totalDebits = lines
    .filter((l) => l.type === "debit")
    .reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0);

  const totalCredits = lines
    .filter((l) => l.type === "credit")
    .reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0);

  const isBalanced = totalDebits > 0 && totalDebits === totalCredits;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!puzzle || !isBalanced) return;

    const sol = puzzle.solution;
    const errors: string[] = [];

    const verified = lines.map((line) => {
      const match = sol.find(
        (s) =>
          s.account.toLowerCase() === line.account.trim().toLowerCase() &&
          s.type === line.type &&
          s.amount === parseFloat(line.amount)
      );
      return {
        ...line,
        validationStatus: match ? ("success" as const) : ("error" as const),
      };
    });

    if (lines.length !== sol.length) {
      errors.push(`Expected exactly ${sol.length} lines for reconciliation.`);
    }

    sol.forEach((expected) => {
      const matched = lines.some(
        (u) =>
          u.account.toLowerCase() === expected.account.toLowerCase() &&
          u.type === expected.type &&
          parseFloat(u.amount) === expected.amount
      );
      if (!matched) {
        errors.push(
          `Unreconciled line: ${expected.type.toUpperCase()} ${expected.account} ($${expected.amount.toLocaleString()})`
        );
      }
    });

    setSubmitted(true);
    setFeedback(errors);

    verified.forEach((_, idx) => {
      setTimeout(() => {
        setLines((curr) =>
          curr.map((item, i) =>
            i === idx ? { ...item, validationStatus: verified[idx].validationStatus } : item
          )
        );
      }, (idx + 1) * 200);
    });

    if (errors.length === 0) {
      setTimeout(() => {
        setIsCorrect(true);
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.65 },
          colors: ["#10b981", "#059669", "#34d399", "#d1fae5"],
        });

        const newStats = {
          played: stats.played + 1,
          streak: stats.streak + 1,
          maxStreak: Math.max(stats.maxStreak, stats.streak + 1),
        };
        setStats(newStats);
        localStorage.setItem("accoundle_stats", JSON.stringify(newStats));
        localStorage.setItem(`accoundle_completed_${puzzle.date}`, "true");
      }, lines.length * 200 + 80);
    }
  };

  const handleShare = () => {
    if (!puzzle) return;
    const shareText = `accoundle #${puzzle.id} • ${puzzle.date}\n⚖️ ${
      isCorrect ? "BALANCED & RECONCILED" : "OUT OF BALANCE"
    }\nStreak: ${stats.streak}\nhttps://accoundle.com`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!puzzle) return null;

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#1c1d22] selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
        {/* Top Header */}
        <header className="flex items-center justify-between pb-6 mb-8 border-b border-[#e5e0d5]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                <span className="text-[#059669]">accou</span>
                <span className="text-[#1c1d22]">ndle</span>
              </h1>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#e8f5e9] text-[#166534] border border-[#c8e6c9]">
                daily
              </span>
            </div>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              the daily general journal entry puzzle
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Calculator Button */}
            <button
              type="button"
              onClick={() => setCalcOpen(true)}
              className="flex items-center gap-1.5 bg-white hover:bg-stone-50 border border-[#ded8cb] shadow-[0_1px_2px_rgba(0,0,0,0.03)] px-3.5 py-2 rounded-xl text-xs font-semibold text-[#4a5568] transition-colors"
            >
              <Calculator className="w-3.5 h-3.5 text-stone-500" />
              <span>+ Calc</span>
            </button>

            {/* Archive Button */}
            <button
              type="button"
              onClick={() => setArchiveOpen(true)}
              className="flex items-center gap-1.5 bg-white hover:bg-stone-50 border border-[#ded8cb] shadow-[0_1px_2px_rgba(0,0,0,0.03)] px-3.5 py-2 rounded-xl text-xs font-semibold text-[#4a5568] transition-colors"
            >
              <Archive className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Archive</span>
            </button>

            {/* Streak & Solved Counters */}
            <div className="bg-white border border-[#ded8cb] shadow-[0_1px_2px_rgba(0,0,0,0.03)] px-3.5 py-1.5 rounded-xl text-center">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Streak
              </span>
              <span className="text-sm sm:text-base font-extrabold text-[#1c1d22]">
                {stats.streak}
              </span>
            </div>

            <div className="bg-white border border-[#ded8cb] shadow-[0_1px_2px_rgba(0,0,0,0.03)] px-3.5 py-1.5 rounded-xl text-center">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Solved
              </span>
              <span className="text-sm sm:text-base font-extrabold text-[#1c1d22]">
                {stats.played}
              </span>
            </div>
          </div>
        </header>

        {/* Daily Scenario Card */}
        <div className="bg-white border border-[#e5e0d5] rounded-2xl p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.03)] mb-7">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#166534] bg-[#e8f5e9] border border-[#c8e6c9] px-2.5 py-0.5 rounded-md">
                {puzzle.difficulty}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#4a5568] bg-[#f0eee6] border border-[#ded8cb] px-2.5 py-0.5 rounded-md">
                {puzzle.standard}
              </span>
            </div>
            <span className="text-xs font-mono text-stone-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-400" /> {puzzle.date}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-[#1c1d22] tracking-tight mb-2">
            {puzzle.title}
          </h2>
          <p className="text-stone-600 leading-relaxed text-sm sm:text-base font-normal">
            {puzzle.description}
          </p>

          <div className="mt-5 pt-4 border-t border-[#f0ede6] flex items-center gap-2 text-xs font-medium text-stone-500">
            <GraduationCap className="w-4 h-4 text-[#059669] shrink-0" />
            <span>CPA Blueprint Alignment:</span>
            <span className="text-stone-800 font-semibold">{puzzle.cpaExamSection}</span>
          </div>
        </div>

        {/* Interactive Journal Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#e5e0d5] rounded-2xl p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.03)] mb-7"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-stone-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                General Journal
              </h3>
            </div>
            <button
              type="button"
              onClick={addLine}
              disabled={submitted && isCorrect}
              className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-black bg-[#f4f1ea] hover:bg-[#eae6dc] active:scale-95 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
            >
              <Plus className="w-3.5 h-3.5 text-stone-500" /> Add Row
            </button>
          </div>

          <div className="space-y-3">
            {lines.map((line) => {
              const isSuccess = line.validationStatus === "success";
              const isError = line.validationStatus === "error";

              return (
                <div
                  key={line.id}
                  className={`grid grid-cols-12 gap-2 sm:gap-3 items-center p-2 rounded-xl transition-colors duration-200 ${
                    isSuccess
                      ? "bg-[#ecfdf5] border border-[#a7f3d0] ring-1 ring-[#10b981]/30"
                      : isError
                      ? "bg-[#fff1f2] border border-[#fecdd3]"
                      : "bg-[#fbfaf7] border border-[#ece7dc]"
                  }`}
                >
                  <div className="col-span-3 sm:col-span-2">
                    <TypeSelect
                      value={line.type}
                      disabled={submitted && isCorrect}
                      onChange={(val) => updateLine(line.id, "type", val)}
                    />
                  </div>

                  <div className="col-span-5 sm:col-span-6">
                    <AccountSelect
                      value={line.account}
                      disabled={submitted && isCorrect}
                      onChange={(val) => updateLine(line.id, "account", val)}
                    />
                  </div>

                  <div className="col-span-3 sm:col-span-3">
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-stone-400 font-mono">$</span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0.00"
                        value={line.amount}
                        disabled={submitted && isCorrect}
                        required
                        onChange={(e) => updateLine(line.id, "amount", e.target.value)}
                        className="w-full text-xs sm:text-sm rounded-xl border border-[#ded8cb] pl-6 pr-3 py-2.5 font-mono text-[#1c1d22] placeholder-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#4a5568] focus:border-[#4a5568] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="col-span-1 text-center">
                    {lines.length > 2 && !(submitted && isCorrect) && (
                      <button
                        type="button"
                        onClick={() => removeLine(line.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1.5 rounded-md hover:bg-stone-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Balance Bar & Action */}
          <div className="mt-8 pt-5 border-t border-[#f0ede6] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs sm:text-sm font-mono w-full sm:w-auto justify-between sm:justify-start">
              <div className="bg-[#f7f5ef] border border-[#e2dcd2] px-3 py-1.5 rounded-lg">
                <span className="text-stone-400 mr-1.5 text-[11px] uppercase tracking-wider">DR</span>
                <span className="font-bold text-[#1c1d22]">${totalDebits.toLocaleString()}</span>
              </div>
              <div className="bg-[#f7f5ef] border border-[#e2dcd2] px-3 py-1.5 rounded-lg">
                <span className="text-stone-400 mr-1.5 text-[11px] uppercase tracking-wider">CR</span>
                <span className="font-bold text-[#1c1d22]">${totalCredits.toLocaleString()}</span>
              </div>
              <div>
                {isBalanced ? (
                  <span className="inline-flex items-center gap-1 text-[#15803d] font-semibold bg-[#e8f5e9] border border-[#c8e6c9] px-2.5 py-1 rounded-md text-xs">
                    <Check className="w-3.5 h-3.5" /> In Balance
                  </span>
                ) : (
                  <span className="text-rose-600 font-semibold text-xs bg-rose-50 border border-rose-200 px-2 py-1 rounded-md">
                    Δ ${(Math.abs(totalDebits - totalCredits)).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {!(submitted && isCorrect) && (
              <button
                type="submit"
                disabled={!isBalanced}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#1c1d22] hover:bg-[#2e313b] active:scale-[0.98] transition-colors shadow-sm disabled:opacity-30 disabled:pointer-events-none"
              >
                <span>Post Entry</span>
                <Sparkles className="w-3.5 h-3.5 text-[#34d399]" />
              </button>
            )}
          </div>
        </form>

        {/* Results Drawer */}
        {submitted && (
          <div
            className={`rounded-2xl p-6 sm:p-7 border transition-colors ${
              isCorrect
                ? "bg-[#ecfdf5] border-[#a7f3d0] shadow-sm"
                : "bg-[#fff1f2] border-[#fecdd3] shadow-sm"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#059669]" />
                  <h3 className="text-base sm:text-lg font-bold text-[#064e3b]">
                    Journal Entry Reconciled
                  </h3>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  <h3 className="text-base sm:text-lg font-bold text-rose-950">
                    Adjusting Entry Required
                  </h3>
                </>
              )}
            </div>

            {feedback.length > 0 && (
              <ul className="text-xs sm:text-sm text-rose-700 space-y-1 mb-4 pl-5 list-disc">
                {feedback.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}

            {isCorrect && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 border border-[#a7f3d0] text-xs sm:text-sm text-stone-700 leading-relaxed shadow-sm">
                  <span className="font-bold text-[#1c1d22] block mb-1">GAAP Analysis:</span>
                  {puzzle.explanation}
                </div>

                <div className="bg-[#e6f4ea] rounded-xl p-3.5 border border-[#b7dfc4] flex items-start gap-2.5 text-xs text-[#064e3b]">
                  <GraduationCap className="w-4 h-4 text-[#059669] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold">CPA Exam Relevance ({puzzle.cpaExamSection}): </span>
                    <span className="text-[#064e3b]/90">{puzzle.cpaTopicBlueprint}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 bg-[#1c1d22] hover:bg-[#2e313b] text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-colors shadow-sm active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#34d399]" />
                  {copied ? "Copied to Clipboard!" : "Share Result"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Slate Archive Modal */}
        {archiveOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1c1d22]/40 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-[#fbfaf7] rounded-2xl border border-[#ded8cb] max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="p-5 border-b border-[#ece7dc] flex items-center justify-between bg-white">
                <div>
                  <h3 className="text-base font-bold text-[#1c1d22] flex items-center gap-2">
                    <Archive className="w-4 h-4 text-stone-600" /> Problem Archive
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Practice historical daily journal entries
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setArchiveOpen(false)}
                  className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-4 space-y-2.5 divide-y divide-[#ece7dc]">
                {PUZZLES
                  .filter((p) => {
                    const now = new Date();
                    const localToday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
                    const cutoff = todayDate || localToday;
                    return p.date <= cutoff;
                  })
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((p) => {
                    const isSelected = puzzle.date === p.date;
                    const isSolved =
                      typeof window !== "undefined" &&
                      Boolean(localStorage.getItem(`accoundle_completed_${p.date}`));

                    return (
                      <div
                        key={p.date}
                        onClick={() => {
                          loadPuzzle(p);
                          setArchiveOpen(false);
                        }}
                        className={`p-3.5 rounded-xl cursor-pointer transition-colors border flex items-center justify-between ${
                          isSelected
                            ? "bg-[#4a5568] text-white border-[#4a5568] shadow-sm"
                            : "bg-white border-[#ded8cb] hover:border-[#b8b0a0] text-[#1c1d22] hover:bg-[#fcfbf9]"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                                isSelected
                                  ? "bg-[#333c4a] text-stone-200"
                                  : "bg-[#f4f1ea] text-stone-600"
                              }`}
                            >
                              {p.date}
                            </span>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider ${
                                isSelected ? "text-[#86efac]" : "text-[#15803d]"
                              }`}
                            >
                              {p.difficulty}
                            </span>
                          </div>
                          <h4
                            className={`text-sm font-semibold truncate max-w-[280px] sm:max-w-sm ${
                              isSelected ? "text-white" : "text-[#1c1d22]"
                            }`}
                          >
                            {p.title}
                          </h4>
                          <p
                            className={`text-xs truncate max-w-[280px] sm:max-w-sm mt-0.5 ${
                              isSelected ? "text-stone-300" : "text-stone-400"
                            }`}
                          >
                            {p.cpaExamSection}
                          </p>
                        </div>

                        <div className="shrink-0 ml-3">
                          {isSolved && (
                            <span
                              className={`text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 ${
                                isSelected
                                  ? "bg-[#333c4a] text-[#86efac]"
                                  : "bg-[#e8f5e9] text-[#166534] border border-[#c8e6c9]"
                              }`}
                            >
                              <Check className="w-3 h-3 text-[#166534]" /> Solved
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* Calculator Modal */}
        <CalculatorModal isOpen={calcOpen} onClose={() => setCalcOpen(false)} />
      </div>
    </div>
  );
}