"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
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
  BookOpen,
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

// Brand Header with Enlarged Logo, Tight Kerning, and Soft Green Text Shadow
function ATLogo() {
  return (
    <div className="bg-[#fcfbf9] border border-[#cbd5e1] rounded-2xl sm:rounded-[32px] px-3.5 py-2 sm:px-6 sm:py-3.5 flex items-center gap-2.5 sm:gap-4 select-none shadow-[0_6px_20px_rgba(28,29,34,0.08),0_2px_6px_rgba(28,29,34,0.04)] max-w-fit transition-transform">
      {/* Mobile: 44px, Desktop: 80px */}
      <div className="relative w-11 h-11 sm:w-20 sm:h-20 flex-shrink-0 drop-shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <Image
          src="/logo.png"
          alt="accoundle logo"
          width={80}
          height={80}
          priority
          className="object-contain"
        />
        <Image
  src="/logo.png?v=2"
  alt="accoundle logo"
  width={96}
  height={96}
  priority
  className="object-contain"
/>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight drop-shadow-[0_2px_4px_rgba(13,148,136,0.18)]">
            <span className="text-[#10b981]">acc</span>
            <span className="text-[#0d9488]">oun</span>
            <span className="text-[#10b981]">dle</span>
          </h1>
        </div>
        <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest text-[#78716c] mt-1 opacity-80">
          YOUR DAILY ENTRY
        </p>
      </div>

      {/* Side Badge */}
      <div className="pl-0.5 sm:pl-1 flex items-center">
        <span className="text-[8px] sm:text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0] shadow-[0_1px_2px_rgba(16,185,129,0.12)] whitespace-nowrap">
          daily
        </span>
      </div>
    </div>
  );
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
      <div className="bg-[#fbfaf7] border border-[#ded8cb] rounded-2xl p-5 w-72 shadow-[0_16px_40px_rgba(28,29,34,0.16)]">
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

        <div className="bg-white border border-[#ded8cb] rounded-xl p-3 mb-4 text-right shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]">
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
            className="p-3 rounded-xl bg-[#eeeae0] hover:bg-[#e4ded2] text-rose-600 border border-[#ded8cb] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors active:scale-95"
          >
            C
          </button>
          <button
            type="button"
            onClick={handleSign}
            className="p-3 rounded-xl bg-[#eeeae0] hover:bg-[#e4ded2] text-[#4a5568] border border-[#ded8cb] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors active:scale-95"
          >
            ±
          </button>
          <button
            type="button"
            onClick={handlePercent}
            className="p-3 rounded-xl bg-[#eeeae0] hover:bg-[#e4ded2] text-[#4a5568] border border-[#ded8cb] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors active:scale-95"
          >
            %
          </button>
          <button
            type="button"
            onClick={() => handleOp("÷")}
            className="p-3 rounded-xl bg-[#dcfce7] hover:bg-[#bbf7d0] text-[#15803d] border border-[#86efac] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors active:scale-95"
          >
            ÷
          </button>

          {["7", "8", "9"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigit(num)}
              className="p-3 rounded-xl bg-white hover:bg-stone-50 text-[#1c1d22] border border-[#ded8cb] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors active:scale-95"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleOp("×")}
            className="p-3 rounded-xl bg-[#dcfce7] hover:bg-[#bbf7d0] text-[#15803d] border border-[#86efac] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors active:scale-95"
          >
            ×
          </button>

          {["4", "5", "6"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigit(num)}
              className="p-3 rounded-xl bg-white hover:bg-stone-50 text-[#1c1d22] border border-[#ded8cb] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors active:scale-95"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleOp("−")}
            className="p-3 rounded-xl bg-[#dcfce7] hover:bg-[#bbf7d0] text-[#15803d] border border-[#86efac] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors active:scale-95"
          >
            −
          </button>

          {["1", "2", "3"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigit(num)}
              className="p-3 rounded-xl bg-white hover:bg-stone-50 text-[#1c1d22] border border-[#ded8cb] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors active:scale-95"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleOp("+")}
            className="p-3 rounded-xl bg-[#dcfce7] hover:bg-[#bbf7d0] text-[#15803d] border border-[#86efac] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors active:scale-95"
          >
            +
          </button>

          <button
            type="button"
            onClick={() => handleDigit("0")}
            className="col-span-2 p-3 rounded-xl bg-white hover:bg-stone-50 text-[#1c1d22] border border-[#ded8cb] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors active:scale-95 text-center"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDot}
            className="p-3 rounded-xl bg-white hover:bg-stone-50 text-[#1c1d22] border border-[#ded8cb] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors active:scale-95"
          >
            .
          </button>
          <button
            type="button"
            onClick={handleEquals}
            className="p-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-extrabold shadow-[0_2px_6px_rgba(5,150,105,0.25)] transition-colors active:scale-95"
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
}

// Searchable Account Dropdown
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
        className={`w-full flex items-center justify-between text-left px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
          disabled
            ? "bg-[#f5f2eb] border-[#e2dcd2] text-stone-400 cursor-not-allowed shadow-none"
            : isOpen
            ? "bg-white border-[#4a5568] ring-1 ring-[#4a5568]/20 shadow-[0_2px_6px_rgba(0,0,0,0.05)] text-[#1c1d22]"
            : "bg-white border-[#ded8cb] hover:border-[#b8b0a0] text-[#1c1d22] shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
        }`}
      >
        <span className={value ? "text-[#1c1d22] font-medium truncate" : "text-stone-400 font-normal"}>
          {value || "Select Account..."}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-stone-400 transition-transform ${
            isOpen ? "rotate-180 text-stone-700" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-xl border border-[#ded8cb] shadow-[0_10px_30px_rgba(0,0,0,0.12)] overflow-hidden">
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

// Clean DR / CR Selector
// Clean DR / CR Selector with dark highlight on DR
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
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${
          value === "debit"
            ? "bg-[#1c1d22] text-white border-[#1c1d22] shadow-[0_2px_6px_rgba(28,29,34,0.18)]"
            : "bg-white text-stone-700 border-[#ded8cb] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        } ${
          disabled
            ? "opacity-50 cursor-not-allowed shadow-none"
            : "hover:opacity-90 active:scale-95"
        }`}
      >
        <span>{value === "debit" ? "DR" : "CR"}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${
            value === "debit" ? "text-stone-300" : "text-stone-400"
          } ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 left-0 mt-1 w-28 bg-white rounded-xl border border-[#ded8cb] shadow-[0_10px_25px_rgba(0,0,0,0.12)] p-1 animate-in fade-in duration-100">
          <button
            type="button"
            onClick={() => {
              onChange("debit");
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors text-left ${
              value === "debit"
                ? "bg-[#1c1d22] text-white"
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
                ? "bg-[#1c1d22] text-white"
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
          colors: ["#10b981", "#0d9488", "#34d399", "#d1fae5"],
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
    <div className="min-h-screen accounting-grid-bg text-[#1c1d22] selection:bg-emerald-100 selection:text-emerald-900 font-sans pb-16">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {/* Top Header */}
        {/* Top Header Block in AccoundleGame */}
<header className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3.5 sm:gap-6 pb-5 sm:pb-6 mb-5 sm:mb-7">
  {/* Capsule Branding */}
  <ATLogo />

  {/* Header Utility Controls */}
<div className="flex items-center justify-center gap-1.5 sm:gap-2.5 w-full sm:w-auto">
  {/* Calculator Button */}
  <button
    type="button"
    onClick={() => setCalcOpen(true)}
    className="bg-[#fbfaf7] hover:bg-white border border-[#ded8cb] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-[#b8b0a0] px-2.5 sm:px-3 py-1 rounded-xl text-center min-w-[50px] sm:min-w-[58px] transition-all active:scale-95 flex flex-col items-center justify-center cursor-pointer"
    title="Calculator"
  >
    <span className="block text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-stone-400">
      Calc
    </span>
    <span className="h-4 sm:h-5 flex items-center justify-center text-stone-600 hover:text-[#1c1d22]">
      <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
    </span>
  </button>

  {/* Archive Button */}
  <button
    type="button"
    onClick={() => setArchiveOpen(true)}
    className="bg-[#fbfaf7] hover:bg-white border border-[#ded8cb] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-[#b8b0a0] px-2.5 sm:px-3 py-1 rounded-xl text-center min-w-[50px] sm:min-w-[58px] transition-all active:scale-95 flex flex-col items-center justify-center cursor-pointer"
    title="Problem Archive"
  >
    <span className="block text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-stone-400">
      Past
    </span>
    <span className="h-4 sm:h-5 flex items-center justify-center text-stone-600 hover:text-[#1c1d22]">
      <Archive className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
    </span>
  </button>

  {/* Streak Counter */}
  <div className="bg-[#fbfaf7] border border-[#ded8cb] shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-2.5 sm:px-3 py-1 rounded-xl text-center min-w-[50px] sm:min-w-[58px]">
    <span className="block text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-stone-400">
      Streak
    </span>
    <span className="h-4 sm:h-5 flex items-center justify-center text-xs sm:text-sm font-extrabold text-[#1c1d22] leading-tight">
      {stats.streak}
    </span>
  </div>

  {/* Solved Counter */}
  <div className="bg-[#fbfaf7] border border-[#ded8cb] shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-2.5 sm:px-3 py-1 rounded-xl text-center min-w-[50px] sm:min-w-[58px]">
    <span className="block text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-stone-400">
      Solved
    </span>
    <span className="h-4 sm:h-5 flex items-center justify-center text-xs sm:text-sm font-extrabold text-[#1c1d22] leading-tight">
      {stats.played}
    </span>
  </div>
</div>
</header>

        {/* Daily Scenario Card */}
        <div className="bg-[#fcfbf9] border border-[#ded8cb] rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_-2px_rgba(28,29,34,0.08),0_2px_6px_-1px_rgba(28,29,34,0.04)] mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#15803d] bg-[#dcfce7] border border-[#bbf7d0] px-2 py-0.5 rounded-md shadow-[0_1px_2px_rgba(16,185,129,0.1)]">
                {puzzle.difficulty}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 bg-[#eeeae0] border border-[#ded8cb] px-2 py-0.5 rounded-md">
                {puzzle.standard}
              </span>
            </div>
            <span className="text-xs font-mono text-stone-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-400" /> {puzzle.date}
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-[#1c1d22] tracking-tight mb-2">
            {puzzle.title}
          </h2>
          <p className="text-stone-600 leading-relaxed text-xs sm:text-sm font-normal">
            {puzzle.description}
          </p>

          <div className="mt-4 pt-3.5 border-t border-[#ede9df] flex items-center gap-2 text-xs text-stone-500">
            <GraduationCap className="w-4 h-4 text-[#0d9488] shrink-0" />
            <span className="text-stone-500">CPA Blueprint Alignment:</span>
            <span className="text-stone-800 font-semibold">{puzzle.cpaExamSection}</span>
          </div>
        </div>

        {/* Interactive Journal Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#fcfbf9] border border-[#ded8cb] rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_-2px_rgba(28,29,34,0.08),0_2px_6px_-1px_rgba(28,29,34,0.04)] mb-7"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-stone-400" />
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
                General Journal
              </h3>
            </div>
            <button
              type="button"
              onClick={addLine}
              disabled={submitted && isCorrect}
              className="flex items-center gap-1 text-xs font-semibold text-stone-700 hover:text-black bg-[#eeeae0] hover:bg-[#e4ded2] shadow-[0_1px_2px_rgba(0,0,0,0.04)] active:scale-95 px-3 py-1.5 rounded-lg transition-all disabled:opacity-40"
            >
              <Plus className="w-3.5 h-3.5 text-stone-500" /> Add Row
            </button>
          </div>

          {/* Column Header Bar */}
          <div className="grid grid-cols-12 gap-2 sm:gap-3 px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-400">
            <div className="col-span-3 sm:col-span-2">[DR / CR]</div>
            <div className="col-span-5 sm:col-span-6">[Account Name / Description]</div>
            <div className="col-span-3 sm:col-span-3">Amount ($)</div>
            <div className="col-span-1"></div>
          </div>

          <div className="space-y-2.5">
            {lines.map((line) => {
              const isSuccess = line.validationStatus === "success";
              const isError = line.validationStatus === "error";

              return (
                <div
                  key={line.id}
                  className={`grid grid-cols-12 gap-2 sm:gap-3 items-center p-2 rounded-xl transition-all duration-150 ${
                    isSuccess
                      ? "bg-[#ecfdf5] border border-[#a7f3d0] shadow-[0_2px_8px_rgba(16,185,129,0.12)]"
                      : isError
                      ? "bg-[#fff1f2] border border-[#fecdd3] shadow-[0_2px_8px_rgba(244,63,94,0.12)]"
                      : "bg-[#f5f2eb] border border-[#ded8cb] shadow-[0_1px_3px_rgba(28,29,34,0.05)]"
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
                        className="w-full text-xs sm:text-sm rounded-xl border border-[#ded8cb] pl-6 pr-3 py-2 font-mono text-[#1c1d22] placeholder-stone-300 bg-white focus:outline-none focus:border-[#4a5568] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all"
                      />
                    </div>
                  </div>

                  <div className="col-span-1 text-center">
                    {lines.length > 2 && !(submitted && isCorrect) && (
                      <button
                        type="button"
                        onClick={() => removeLine(line.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1 rounded-md"
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
          <div className="mt-7 pt-4 border-t border-[#ede9df] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs font-mono w-full sm:w-auto justify-between sm:justify-start">
              <div className="bg-[#eeeae0] border border-[#ded8cb] px-3 py-1.5 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                <span className="text-stone-500 mr-1.5 text-[10px] uppercase font-bold">DR</span>
                <span className="font-bold text-[#1c1d22]">${totalDebits.toLocaleString()}</span>
              </div>
              <div className="bg-[#eeeae0] border border-[#ded8cb] px-3 py-1.5 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                <span className="text-stone-500 mr-1.5 text-[10px] uppercase font-bold">CR</span>
                <span className="font-bold text-[#1c1d22]">${totalCredits.toLocaleString()}</span>
              </div>
              <div>
                {isBalanced ? (
                  <span className="inline-flex items-center gap-1 text-[#15803d] font-semibold bg-[#dcfce7] border border-[#bbf7d0] px-2.5 py-1 rounded-md text-xs shadow-[0_1px_2px_rgba(16,185,129,0.12)]">
                    <Check className="w-3.5 h-3.5" /> In Balance
                  </span>
                ) : (
                  <span className="text-rose-600 font-semibold text-xs bg-rose-50 border border-rose-200 px-2 py-1 rounded-md shadow-[0_1px_2px_rgba(244,63,94,0.08)]">
                    Δ ${(Math.abs(totalDebits - totalCredits)).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {!(submitted && isCorrect) && (
              <button
                type="submit"
                disabled={!isBalanced}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#1c1d22] hover:bg-[#2e313b] active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(28,29,34,0.18)] disabled:opacity-30 disabled:pointer-events-none"
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
            className={`rounded-2xl p-6 sm:p-7 border mb-8 transition-all ${
              isCorrect
                ? "bg-[#ecfdf5] border-[#a7f3d0] shadow-[0_6px_20px_rgba(16,185,129,0.12)]"
                : "bg-[#fff1f2] border-[#fecdd3] shadow-[0_6px_20px_rgba(244,63,94,0.12)]"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#059669]" />
                  <h3 className="text-sm sm:text-base font-bold text-[#064e3b]">
                    Journal Entry Reconciled
                  </h3>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  <h3 className="text-sm sm:text-base font-bold text-rose-950">
                    Adjusting Entry Required
                  </h3>
                </>
              )}
            </div>

            {feedback.length > 0 && (
              <ul className="text-xs text-rose-700 space-y-1 mb-4 pl-5 list-disc">
                {feedback.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}

            {isCorrect && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 border border-[#a7f3d0] text-xs text-stone-700 leading-relaxed shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                  <span className="font-bold text-[#1c1d22] block mb-1">GAAP Analysis:</span>
                  {puzzle.explanation}
                </div>

                <div className="bg-[#e6f4ea] rounded-xl p-3.5 border border-[#b7dfc4] flex items-start gap-2.5 text-xs text-[#064e3b] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                  <GraduationCap className="w-4 h-4 text-[#059669] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold">CPA Exam Blueprint ({puzzle.cpaExamSection}): </span>
                    <span className="text-[#064e3b]/90">{puzzle.cpaTopicBlueprint}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 bg-[#1c1d22] hover:bg-[#2e313b] text-white text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-xl transition-all shadow-[0_4px_12px_rgba(28,29,34,0.15)] active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#34d399]" />
                  {copied ? "Copied to Clipboard!" : "Share Result"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 3-Column Footer */}
        <footer className="pt-6 border-t border-[#ded8cb] grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-stone-500 leading-relaxed">
          <div>
            <p>
              Accoundle is designed for educational practice and CPA exam review.
              Reference US GAAP (FASB ASC) / IFRS.
            </p>
          </div>
          <div className="md:text-center">
            <span className="block font-semibold text-stone-700">Feedback & Bug Reports:</span>
            <a
              href="mailto:hello@accoundle.com"
              className="text-[#0d9488] hover:underline"
            >
              hello@accoundle.com
            </a>
            <div className="mt-0.5">
              <span className="text-stone-400">Report an Error</span>
            </div>
          </div>
          <div className="md:text-right">
            <p>2026 Accoundle</p>
            
            
          </div>
        </footer>

        {/* Problem Archive Modal */}
        {archiveOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1c1d22]/40 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-[#fbfaf7] rounded-2xl border border-[#ded8cb] max-w-lg w-full max-h-[80vh] flex flex-col shadow-[0_16px_40px_rgba(28,29,34,0.18)] overflow-hidden">
              <div className="p-5 border-b border-[#ece7dc] flex items-center justify-between bg-white">
                <div>
                  <h3 className="text-base font-bold text-[#1c1d22] flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-stone-600" /> Problem Archive
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
                        className={`p-3.5 rounded-xl cursor-pointer transition-all border flex items-center justify-between ${
                          isSelected
                            ? "bg-[#4a5568] text-white border-[#4a5568] shadow-[0_2px_8px_rgba(74,85,104,0.25)]"
                            : "bg-white border-[#ded8cb] hover:border-[#b8b0a0] text-[#1c1d22] hover:bg-[#fcfbf9] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                                isSelected
                                  ? "bg-[#333c4a] text-stone-200"
                                  : "bg-[#eeeae0] text-stone-600"
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
                                  : "bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0]"
                              }`}
                            >
                              <Check className="w-3 h-3 text-[#15803d]" /> Solved
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