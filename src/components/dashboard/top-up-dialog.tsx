"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TopUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryName: string;
  currencySymbol: string;
  onConfirm: (amount: number, note: string) => Promise<void>;
}

export function TopUpDialog({
  open,
  onOpenChange,
  categoryName,
  currencySymbol,
  onConfirm,
}: TopUpDialogProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;

    setIsSubmitting(true);
    try {
      await onConfirm(val, note);
      onOpenChange(false);
      setAmount("");
      setNote("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="retro-shadow border-2 border-border bg-card">
        <DialogHeader>
          <DialogTitle className="font-display font-bold uppercase">
            Add Funds to {categoryName}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topup-amount">Amount ({currencySymbol})</Label>
            <Input
              id="topup-amount"
              type="number"
              min="1"
              step="any"
              placeholder="e.g. 500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-none border-border font-mono"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="topup-note">Source / Note</Label>
            <Input
              id="topup-note"
              type="text"
              placeholder="e.g. Received Salary, Bonus, Gift"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="rounded-none border-border"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-2 border-border"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="font-bold"
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Add Funds
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
