import { Check, Sparkles, BookOpen } from "lucide-react";
import { Card } from "./ui/card";
import { cn } from "./ui/utils";
import type { DayData } from "./DayDetailModal";

interface DayCardProps {
  day: number;
  data: DayData;
  onClick: () => void;
}

export function DayCard({ day, data, onClick }: DayCardProps) {
  const { journal, todos } = data;
  const completedCount = todos.filter((t) => t.completed).length;
  const totalTodos = todos.length;
  const allDone = totalTodos > 0 && completedCount === totalTodos;
  const hasContent = journal.trim().length > 0 || totalTodos > 0;
  const progress = totalTodos > 0 ? completedCount / totalTodos : 0;

  return (
    <Card
      onClick={onClick}
      className={cn(
        "relative overflow-hidden transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg border-2 select-none",
        allDone
          ? "bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/30 border-primary/40 shadow-md"
          : hasContent
          ? "bg-gradient-to-br from-secondary/30 to-accent/10 border-accent/40"
          : "bg-card border-border/60 hover:border-primary/30"
      )}
    >
      <div className="p-4 flex flex-col items-center justify-center min-h-[110px] relative gap-1.5">
        {/* Top badge */}
        {allDone && (
          <div className="absolute top-2 right-2">
            <div className="bg-primary rounded-full p-1">
              <Check className="w-3 h-3 text-white" />
            </div>
          </div>
        )}
        {hasContent && !allDone && (
          <div className="absolute top-2 right-2">
            <BookOpen className="w-3.5 h-3.5 text-accent-foreground/50" />
          </div>
        )}
        {allDone && (
          <Sparkles className="absolute top-2 left-2 w-3.5 h-3.5 text-primary animate-pulse" />
        )}

        {/* Day number */}
        <div className={cn(
          "text-2xl font-semibold transition-all duration-300 leading-none",
          allDone ? "text-primary" : hasContent ? "text-foreground" : "text-muted-foreground"
        )}>
          {day}
        </div>

        <div className="text-xs text-muted-foreground/70">Day {day}</div>

        {/* Mini progress ring / bar */}
        {totalTodos > 0 && (
          <div className="w-full mt-1">
            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  allDone
                    ? "bg-gradient-to-r from-primary to-accent"
                    : "bg-gradient-to-r from-accent to-primary/60"
                )}
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <div className="text-[10px] text-muted-foreground/60 text-center mt-0.5">
              {completedCount}/{totalTodos}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
