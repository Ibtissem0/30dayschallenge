import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Progress } from "./ui/progress";
import { Plus, Trash2, BookOpen, ListChecks, Sparkles } from "lucide-react";
import { cn } from "./ui/utils";

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface DayData {
  journal: string;
  todos: TodoItem[];
}

interface DayDetailModalProps {
  day: number | null;
  data: DayData;
  onClose: () => void;
  onSave: (data: DayData) => void;
}

export function DayDetailModal({ day, data, onClose, onSave }: DayDetailModalProps) {
  const [journal, setJournal] = useState(data.journal);
  const [todos, setTodos] = useState<TodoItem[]>(data.todos);
  const [newTodo, setNewTodo] = useState("");

  const completedCount = todos.filter((t) => t.completed).length;
  const progress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    setTodos([...todos, { id: crypto.randomUUID(), text: newTodo.trim(), completed: false }]);
    setNewTodo("");
  };

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const handleSave = () => {
    onSave({ journal, todos });
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAddTodo();
  };

  return (
    <Dialog open={day !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-b from-background to-muted/30 border-primary/20 rounded-3xl shadow-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold shadow-md">
              {day}
            </div>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Day {day}
            </span>
            {completedCount > 0 && completedCount === todos.length && todos.length > 0 && (
              <Sparkles className="w-5 h-5 text-primary animate-pulse ml-1" />
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Progress bar */}
        {todos.length > 0 && (
          <div className="mb-4 px-1">
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span className="flex items-center gap-1">
                <ListChecks className="w-3.5 h-3.5" /> Tasks
              </span>
              <span>{completedCount} / {todos.length} done</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Journal Section */}
        <div className="mb-5">
          <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <BookOpen className="w-4 h-4 text-primary" />
            My journal entry
          </label>
          <Textarea
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            placeholder="How did today go? What did you do? How are you feeling? ✨"
            className="min-h-[120px] resize-none rounded-2xl border-primary/20 bg-white/70 focus:border-primary/50 placeholder:text-muted-foreground/50 text-sm leading-relaxed"
          />
        </div>

        {/* To-Do Section */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <ListChecks className="w-4 h-4 text-accent-foreground/70" />
            To-do list
          </label>

          <div className="space-y-2 mb-3">
            {todos.length === 0 && (
              <p className="text-xs text-muted-foreground/60 italic text-center py-3">
                No tasks yet — add something to accomplish today 🌸
              </p>
            )}
            {todos.map((todo) => (
              <div
                key={todo.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200 group",
                  todo.completed
                    ? "bg-primary/8 border-primary/20"
                    : "bg-white/60 border-border/60 hover:border-primary/20"
                )}
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => handleToggleTodo(todo.id)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary flex-shrink-0"
                />
                <span
                  className={cn(
                    "flex-1 text-sm leading-snug transition-all duration-200",
                    todo.completed ? "line-through text-muted-foreground/60" : "text-foreground"
                  )}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground/50 hover:text-destructive p-1 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add new todo */}
          <div className="flex gap-2">
            <Input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a task..."
              className="rounded-2xl border-primary/20 bg-white/70 focus:border-primary/50 placeholder:text-muted-foreground/50 text-sm"
            />
            <Button
              onClick={handleAddTodo}
              size="icon"
              className="rounded-2xl bg-gradient-to-br from-primary to-accent hover:opacity-90 shadow-md flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-2xl border-primary/20 hover:bg-primary/5"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 rounded-2xl bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-md"
          >
            Save Day ✨
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
