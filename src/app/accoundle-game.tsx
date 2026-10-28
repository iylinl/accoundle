"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Plus, Trash2, CheckCircle2, XCircle, Share2, Award, Info, RefreshCw } from "lucide-react";
import { getTodayPuzzle, CHART_OF_ACCOUNTS, Puzzle, JournalLine } from "@/lib/puzzles";

interface UserLine {
  id: string;
  account: string;
  type: "debit" | "credit";
  amount: string;
}

export function AccoundleGame() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [lines, setLines] = useState<UserLine[]>([
    { id: "1", account: "", type: "debit", amount: "" },
    { id: "2", account: "", type: "credit", amount: "" },
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ played: 0, streak: 0, maxStreak: 0 });

  useEffect(() => {
    const today = getTodayPuzzle();
    setPuzzle(today);

    // Load streak stats
    const saved = localStorage.getItem("accoundle_stats");
    if (saved) {
      try {
        setStats(JSON.parse(saved));
      } catch {
        // ignore fallback
      }
    }

    // Check if already completed today
    const completedToday = localStorage.getItem(`accoundle_completed_${today.date}`);
    if (completedToday) {
      setSubmitted(true);
      setIsCorrect(true);
    }
  }, []);

  const addLine = () => {
    setLines((prev) => [
      ...prev,
      { id: Math.random().toString(), account: "", type: "debit", amount: "" },
    ]);
  };

  const removeLine = (id: string) => {
    if (lines.length <= 2) return;
    setLines((prev) => prev.filter((line) => line.id !== id));
  };

  const updateLine = (id: string, field: keyof UserLine, value: string) => {
    setLines((prev) =>
      prev.map((line) => (line.id === id ? { ...line, [field]: value } : line))
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
    if (!puzzle) return;

    if (!isBalanced) {
      alert("Debits must equal credits before submitting.");
      return;
    }

    const sol = puzzle.solution;
    const errors: string[] = [];

    // Format user submissions
    const cleanUser = lines.map((l) => ({
      account: l.account.trim(),
      type: l.type,
      amount: parseFloat(l.amount) || 0,
    }));

    // Verify lengths match
    if (cleanUser.length !== sol.length) {
      errors.push(`Expected ${sol.length} journal lines, but got ${cleanUser.length}.`);
    }

    // Verify solution lines while consuming each matching user line exactly once
    const unmatchedUserLines = [...cleanUser];
    sol.forEach((expected) => {
      const matchIndex = unmatchedUserLines.findIndex(
        (u) =>
          u.account.toLowerCase() === expected.account.toLowerCase() &&
          u.type === expected.type &&
          u.amount === expected.amount
      );

      if (matchIndex === -1) {
        errors.push(`Missing or incorrect: ${expected.type.toUpperCase()} ${expected.account} for $${expected.amount.toLocaleString()}`);
      } else {
        unmatchedUserLines.splice(matchIndex, 1);
      }
    });

    setSubmitted(true);
    setFeedback(errors);

    if (errors.length === 0) {
      setIsCorrect(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

      const newStats = {
        played: stats.played + 1,
        streak: stats.streak + 1,
        maxStreak: Math.max(stats.maxStreak, stats.streak + 1),
      };
      setStats(newStats);
      localStorage.setItem("accoundle_stats", JSON.stringify(newStats));
      localStorage.setItem(`accoundle_completed_${puzzle.date}`, "true");
    }
  };

  const handleShare = () => {
    if (!puzzle) return;
    const shareText = `Accoundle #${puzzle.id} - ${puzzle.date}\nStatus: ${isCorrect ? "BALANCED ⚖️" : "OUT OF BALANCE ⚠️"}\nStreak: ${stats.streak}\nhttps://accoundle.com`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!puzzle) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-stone-200 pb-5 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 flex items-center gap-2">
            ACCOUNDLE <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">DAILY</span>
          </h1>
          <p className="text-stone-500 text-sm mt-1">The Daily Accounting Journal Puzzle</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-lg text-center">
            <span className="block text-stone-400">Streak</span>
            <span className="text-base font-bold text-stone-800">{stats.streak}🔥</span>
          </div>
          <div className="bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-lg text-center">
            <span className="block text-stone-400">Played</span>
            <span className="text-base font-bold text-stone-800">{stats.played}</span>
          </div>
        </div>
      </header>

      {/* Daily Scenario Card */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">
            {puzzle.difficulty} • {puzzle.standard}
          </span>
          <span className="text-xs text-stone-400 font-mono">{puzzle.date}</span>
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">{puzzle.title}</h2>
        <p className="text-stone-700 leading-relaxed text-sm md:text-base">{puzzle.description}</p>
      </div>

      {/* Journal Entry Table */}
      <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">General Journal Entry</h3>
          <button
            type="button"
            onClick={addLine}
            disabled={submitted && isCorrect}
            className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-md transition"
          >
            <Plus className="w-3.5 h-3.5" /> Add Line
          </button>
        </div>

        <div className="space-y-3">
          {lines.map((line, idx) => (
            <div key={line.id} className="grid grid-cols-12 gap-2 items-center">
              {/* Debit/Credit Toggle */}
              <div className="col-span-3 md:col-span-2">
                <select
                  value={line.type}
                  disabled={submitted && isCorrect}
                  onChange={(e) => updateLine(line.id, "type", e.target.value as "debit" | "credit")}
                  className="w-full text-xs md:text-sm font-semibold rounded-lg border border-stone-300 p-2 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="debit">DR (Debit)</option>
                  <option value="credit">CR (Credit)</option>
                </select>
              </div>

              {/* Account Dropdown */}
              <div className="col-span-5 md:col-span-6">
                <select
                  value={line.account}
                  disabled={submitted && isCorrect}
                  required
                  onChange={(e) => updateLine(line.id, "account", e.target.value)}
                  className="w-full text-xs md:text-sm rounded-lg border border-stone-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select Account...</option>
                  {CHART_OF_ACCOUNTS.map((acc: string) => (
                    <option key={acc} value={acc}>
                      {acc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div className="col-span-3">
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Amount ($)"
                  value={line.amount}
                  disabled={submitted && isCorrect}
                  required
                  onChange={(e) => updateLine(line.id, "amount", e.target.value)}
                  className="w-full text-xs md:text-sm rounded-lg border border-stone-300 p-2 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Delete line button */}
              <div className="col-span-1 text-center">
                {lines.length > 2 && !(submitted && isCorrect) && (
                  <button
                    type="button"
                    onClick={() => removeLine(line.id)}
                    className="text-stone-400 hover:text-rose-600 transition p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Balance Verification Footer */}
        <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap justify-between items-center text-xs md:text-sm">
          <div className="flex items-center gap-6 font-mono">
            <div>
              <span className="text-stone-400 mr-1">Total DR:</span>
              <span className="font-bold">${totalDebits.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-stone-400 mr-1">Total CR:</span>
              <span className="font-bold">${totalCredits.toLocaleString()}</span>
            </div>
            <div>
              {isBalanced ? (
                <span className="text-emerald-600 font-medium">✓ Balanced</span>
              ) : (
                <span className="text-rose-600 font-medium">✕ Out of balance (${Math.abs(totalDebits - totalCredits).toLocaleString()})</span>
              )}
            </div>
          </div>

          <div className="mt-4 md:mt-0">
            {!(submitted && isCorrect) && (
              <button
                type="submit"
                disabled={!isBalanced}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-medium text-xs md:text-sm px-6 py-2.5 rounded-lg transition shadow-sm"
              >
                Post Entry
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Result & Feedback Modal */}
      {submitted && (
        <div className={`rounded-xl p-6 border ${isCorrect ? "bg-emerald-50/70 border-emerald-200" : "bg-rose-50/70 border-rose-200"}`}>
          <div className="flex items-center gap-3 mb-3">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <h3 className="text-lg font-bold text-emerald-900">Entry Correct & Reconciled!</h3>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-rose-600" />
                <h3 className="text-lg font-bold text-rose-900">Adjusting Entry Required</h3>
              </>
            )}
          </div>

          {feedback.length > 0 && (
            <ul className="text-xs md:text-sm text-rose-700 space-y-1 mb-4 list-disc pl-5">
              {feedback.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}

          {isCorrect && (
            <>
              <div className="bg-white border border-emerald-100 rounded-lg p-4 text-xs md:text-sm text-stone-700 leading-relaxed mb-4">
                <span className="font-semibold text-stone-900 block mb-1">GAAP Treatment:</span>
                {puzzle.explanation}
              </div>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-xs md:text-sm px-5 py-2.5 rounded-lg transition font-medium"
              >
                <Share2 className="w-4 h-4" />
                {copied ? "Copied to Clipboard!" : "Share Result"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}