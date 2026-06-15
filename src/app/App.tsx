import { useState } from "react";
import { DayCard } from "./components/DayCard";
import { DayDetailModal, type DayData } from "./components/DayDetailModal";
import { Progress } from "./components/ui/progress";
import { Button } from "./components/ui/button";
import { Sparkles, Trophy, Heart, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";

const TOTAL_DAYS = 30;

const emptyDay = (): DayData => ({ journal: "", todos: [] });

const defaultDays = (): Record<number, DayData> => {
  const days: Record<number, DayData> = {};
  for (let i = 1; i <= TOTAL_DAYS; i++) days[i] = emptyDay();
  return days;
};

export default function App() {
  const [daysData, setDaysData] = useState<Record<number, DayData>>(defaultDays);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const getDayProgress = (data: DayData) => {
    const { todos } = data;
    if (todos.length === 0) return 0;
    return todos.filter((t) => t.completed).length / todos.length;
  };

  const isComplete = (data: DayData) =>
    data.todos.length > 0 && data.todos.every((t) => t.completed);

  const completedDaysCount = Object.values(daysData).filter(isComplete).length;

  // Overall progress: average of per-day task completion
  const overallProgress = (() => {
    const daysWithTodos = Object.values(daysData).filter((d) => d.todos.length > 0);
    if (daysWithTodos.length === 0) return 0;
    const sum = daysWithTodos.reduce((acc, d) => acc + getDayProgress(d), 0);
    return (sum / TOTAL_DAYS) * 100;
  })();

  const handleSaveDay = (day: number, data: DayData) => {
    const wasComplete = isComplete(daysData[day]);
    const nowComplete = isComplete(data);
    if (!wasComplete && nowComplete) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#e879b9", "#ddc7f0", "#fbb8d4", "#f9d5e8"],
      });
    }
    setDaysData((prev) => ({ ...prev, [day]: data }));
  };

  const handleReset = () => {
    setDaysData(defaultDays());
  };

  const motivationalMessages = [
    "You're doing amazing! ✨",
    "Keep going, beautiful! 💕",
    "One day at a time! 🌸",
    "So proud of you! 🎀",
  ];

  const getMessage = () => {
    if (completedDaysCount === 0) return "Start your journey today! 🌟";
    if (completedDaysCount === TOTAL_DAYS) return "You did it! All 30 days complete! 🎉";
    return motivationalMessages[completedDaysCount % motivationalMessages.length];
  };

  const currentDayData = selectedDay ? daysData[selectedDay] : emptyDay();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5" />
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1582794543462-0d7922e50cf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080')`,
          }}
        />

        <div className="container mx-auto px-4 py-12 relative">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              <h1 className="text-5xl bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                30 Day Challenge
              </h1>
              <Sparkles className="w-8 h-8 text-accent animate-pulse" />
            </div>

            <p className="text-muted-foreground text-lg mb-2">
              Transform yourself, one day at a time
            </p>

            <div className="inline-flex items-center gap-2 text-primary">
              <Heart className="w-5 h-5 fill-current" />
              <span className="text-sm">{getMessage()}</span>
            </div>
          </div>

          {/* Progress Section */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Overall Progress</span>
                </div>
                <span className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {completedDaysCount} / {TOTAL_DAYS} days done
                </span>
              </div>

              <Progress value={overallProgress} className="h-3 mb-4" />

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{overallProgress.toFixed(0)}% task completion</span>
                <span>{TOTAL_DAYS - completedDaysCount} days remaining</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Days Grid */}
      <div className="container mx-auto px-4 pb-12">
        <p className="text-center text-sm text-muted-foreground mb-6">
          Tap any day to log your journal entry and manage your to-do list 📝
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 mb-8">
          {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((day) => (
            <DayCard
              key={day}
              day={day}
              data={daysData[day]}
              onClick={() => setSelectedDay(day)}
            />
          ))}
        </div>

        {/* Reset Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleReset}
            variant="outline"
            className="gap-2 border-primary/30 hover:border-primary/60 hover:bg-primary/5"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Challenge
          </Button>
        </div>
      </div>

      {/* Day Detail Modal */}
      <DayDetailModal
        day={selectedDay}
        data={currentDayData}
        onClose={() => setSelectedDay(null)}
        onSave={(data) => {
          if (selectedDay) handleSaveDay(selectedDay, data);
        }}
      />

      {/* Decorative gradient footer */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none">
        <div className="h-32 bg-gradient-to-t from-accent/10 to-transparent" />
      </div>
    </div>
  );
}
