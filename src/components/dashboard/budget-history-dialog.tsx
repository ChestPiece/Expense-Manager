"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface BudgetAdjustment {
  id: string;
  amount: number;
  note: string;
  created_at: string;
}

interface BudgetHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string;
  categoryName: string;
  currencySymbol: string;
}

export function BudgetHistoryDialog({
  open,
  onOpenChange,
  categoryId,
  categoryName,
  currencySymbol,
}: BudgetHistoryDialogProps) {
  const [history, setHistory] = useState<BudgetAdjustment[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (open && categoryId) {
      setLoading(true);
      const fetchHistory = async () => {
        const { data } = await supabase
          .from("budget_adjustments")
          .select("*")
          .eq("category_id", categoryId)
          .order("created_at", { ascending: false });

        if (data) {
          setHistory(data);
        }
        setLoading(false);
      };
      fetchHistory();
    }
  }, [open, categoryId, supabase]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="retro-shadow border-2 border-border bg-card max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display font-bold uppercase">
            History: {categoryName}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-4">
          {loading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : history.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4 font-mono">
              No adjustments recorded.
            </p>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="flex flex-col border-b border-border pb-2 last:border-0 last:pb-0"
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-sm">
                    {item.amount > 0 ? "+" : ""}
                    {currencySymbol}
                    {item.amount}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {format(new Date(item.created_at), "MMM d, yyyy")}
                  </span>
                </div>
                {item.note && (
                  <p className="text-xs text-muted-foreground italic mt-0.5">
                    &quot;{item.note}&quot;
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
