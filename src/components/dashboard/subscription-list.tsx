"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Calendar, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  billing_cycle: "monthly" | "yearly";
  next_payment_date: string | null;
}

interface SubscriptionListProps {
  initialSubscriptions: Subscription[];
  userId: string;
}

export function SubscriptionList({
  initialSubscriptions,
  userId,
}: SubscriptionListProps) {
  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>(initialSubscriptions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newSub, setNewSub] = useState({
    name: "",
    amount: "",
    billing_cycle: "monthly",
    next_payment_date: "",
  });

  const supabase = createClient();
  const router = useRouter();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .insert([
          {
            user_id: userId,
            name: newSub.name,
            amount: parseFloat(newSub.amount),
            billing_cycle: newSub.billing_cycle,
            next_payment_date: newSub.next_payment_date || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setSubscriptions([data, ...subscriptions]);
      setIsDialogOpen(false);
      setNewSub({
        name: "",
        amount: "",
        billing_cycle: "monthly",
        next_payment_date: "",
      });
      router.refresh();
    } catch (error) {
      console.error("Error adding subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this subscription tracking?"))
      return;

    try {
      const { error } = await supabase
        .from("subscriptions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
      router.refresh();
    } catch (error) {
      console.error("Error deleting subscription:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 retro-shadow">
              <Plus className="h-4 w-4" /> Add Subscription
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card border-2 border-border retro-shadow">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                Add Subscription
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  placeholder="Netflix, Spotify..."
                  value={newSub.name}
                  onChange={(e) =>
                    setNewSub({ ...newSub, name: e.target.value })
                  }
                  required
                  className="bg-background"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newSub.amount}
                    onChange={(e) =>
                      setNewSub({ ...newSub, amount: e.target.value })
                    }
                    required
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cycle">Cycle</Label>
                  <select
                    id="cycle"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newSub.billing_cycle}
                    onChange={(e) =>
                      setNewSub({ ...newSub, billing_cycle: e.target.value })
                    }
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Next Payment</Label>
                <Input
                  id="date"
                  type="date"
                  value={newSub.next_payment_date}
                  onChange={(e) =>
                    setNewSub({ ...newSub, next_payment_date: e.target.value })
                  }
                  className="bg-background"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Subscription"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-2 border-border retro-shadow bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b-2 border-border">
                <TableHead>Service</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Cycle</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center h-32 text-muted-foreground"
                  >
                    No subscriptions tracked yet. Add one above!
                  </TableCell>
                </TableRow>
              ) : (
                subscriptions.map((sub) => (
                  <TableRow
                    key={sub.id}
                    className="hover:bg-accent/50 transition-colors border-border"
                  >
                    <TableCell className="font-medium flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary" /> {sub.name}
                    </TableCell>
                    <TableCell className="font-mono text-primary font-bold">
                      ${sub.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="capitalize text-muted-foreground text-xs">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {sub.billing_cycle}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(sub.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
