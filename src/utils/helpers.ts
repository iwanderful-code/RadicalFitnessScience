import React from "react";
import { WorkoutLog, UserProfile } from "../types";

export function get7DayRangeLabel(): string {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 6);
  
  const formatDate = (d: Date) => {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  return `${formatDate(start)} - ${formatDate(end)}, ${end.getFullYear()}`;
}

export function getWeeklyPerformanceMetrics(
  workoutLogs: WorkoutLog[],
  stepsHistory: number[],
  habitsHistory: number[]
) {
  const completed = workoutLogs.filter(w => w.completed).length;
  const scheduled = Math.max(1, workoutLogs.length);
  const workoutRate = Math.round((completed / scheduled) * 100);

  const totalSteps = stepsHistory.reduce((acc, val) => acc + val, 0);
  const avgSteps = Math.round(totalSteps / Math.max(1, stepsHistory.length));

  const totalHabits = habitsHistory.reduce((acc, val) => acc + val, 0);
  const avgHabits = Math.round((totalHabits / Math.max(1, habitsHistory.length)) * 10) / 10;

  return {
    workoutRate,
    avgSteps,
    totalSteps,
    avgHabits
  };
}

// Custom parser to format report text with bold spans
export function renderBoldSpans(text: string): React.ReactNode[] {
  if (!text) return [];
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return React.createElement("strong", { key: idx, className: "text-[#FF5F15] font-extrabold" }, part.slice(2, -2));
    }
    return part;
  });
}

// Direct custom markdown summary renderer for UI blocks
export function renderReportText(rawMarkdown: string): React.ReactNode {
  if (!rawMarkdown) return null;
  const lines = rawMarkdown.split("\n");
  
  return React.createElement("div", { className: "space-y-4 font-sans text-xs text-zinc-350" }, 
    lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return null;

      // Handle custom headings
      if (trimmed.startsWith("###")) {
        return React.createElement("h3", { key: idx, className: "text-sm font-black text-white uppercase mt-6 tracking-wide font-mono border-b border-white/10 pb-1" }, renderBoldSpans(trimmed.replace("###", "").trim()));
      }
      if (trimmed.startsWith("####")) {
        return React.createElement("h4", { key: idx, className: "text-xs font-black text-white uppercase mt-4 tracking-wide font-mono text-[#FF5F15]" }, renderBoldSpans(trimmed.replace("####", "").trim()));
      }
      
      // Horizontal dividers
      if (trimmed === "---") {
        return React.createElement("hr", { key: idx, className: "border-white/10 my-4" });
      }

      // Check bullet lists
      if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
        const content = trimmed.substring(1).trim();
        return React.createElement("li", { key: idx, className: "list-disc ml-5 pl-1" }, renderBoldSpans(content));
      }

      return React.createElement("p", { key: idx, className: "leading-relaxed" }, renderBoldSpans(line));
    })
  );
}

// Standalone Sparkline generator
export function renderSparkline(data: number[], color: string = "#FF5F15") {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const width = 80;
  const height = 24;
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height + 1; // 1px margin
    return `${x},${y}`;
  }).join(" ");

  return React.createElement(
    "svg",
    { width: width, height: height, className: "overflow-visible" },
    React.createElement("polyline", {
      fill: "none",
      stroke: color,
      strokeWidth: "2",
      points: points,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    })
  );
}
